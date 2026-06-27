
import { GoogleGenAI, Modality } from "@google/genai";
import { withRetry } from "../lib/geminiRetry";

class TTSService {
  private ai: any;
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private audioCache = new Map<string, AudioBuffer>();
  private preferredEngine: 'gemini' | 'browser' | null = null;
  private preferredVoicesByLang = new Map<string, SpeechSynthesisVoice>();

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
    
    // Pre-warm voices on some browsers
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }

  private normalizeLang(lang: string): string {
    const map: Record<string, string> = {
      'iw': 'he',
      'ar': 'ar',
      'zh-CN': 'zh-CN',
      'in': 'id',
      'nb': 'no', // Norwegian
      'nn': 'no'
    };
    return map[lang] || lang;
  }

  private getAudioContext() {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  async speak(text: string, language: string): Promise<void> {
    try {
      this.stop();
      const cacheKey = `${language}:${text}`;
      const normalizedLang = this.normalizeLang(language);

      // 1. Try Gemini if it's the preferred engine or if no preference yet
      if (this.preferredEngine !== 'browser') {
        try {
          let audioData = this.audioCache.get(cacheKey);
          if (!audioData) {
            audioData = await this.generateAudio(text, language);
          }
          
          if (audioData) {
            this.preferredEngine = 'gemini';
            await this.playAudioBuffer(audioData);
            return;
          } else {
            // If no audio data is returned (even without error), stick to browser to be consistent
            this.preferredEngine = 'browser';
          }
        } catch (geminiError) {
          console.warn("Gemini TTS failed, falling back to browser TTS:", geminiError);
          // If Gemini fails once, we switch to browser mode to maintain voice consistency for the current session
          this.preferredEngine = 'browser';
        }
      }

      // 2. Fallback to browser native TTS
      return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = normalizedLang;
        
        let voice = this.preferredVoicesByLang.get(normalizedLang);
        
        if (!voice) {
          const voices = window.speechSynthesis.getVoices();
          
          const getBestVoice = (lang: string) => {
            const searchLang = lang.toLowerCase().replace('_', '-');
            const searchRoot = searchLang.split('-')[0];

            // Find all voices for this language
            let langVoices = voices.filter(v => {
              const vLang = v.lang.toLowerCase().replace('_', '-');
              return vLang === searchLang || vLang.startsWith(searchRoot);
            });
            
            if (langVoices.length === 0) return null;

            // Priority 1: High quality "Neural" or "Google" voices
            const neural = langVoices.find(v => v.name.toLowerCase().includes('neural'));
            if (neural) return neural;

            const google = langVoices.find(v => v.name.toLowerCase().includes('google'));
            if (google) return google;

            const natural = langVoices.find(v => v.name.toLowerCase().includes('natural'));
            if (natural) return natural;

            // Special handling for French to avoid bad voices
            if (searchRoot === 'fr') {
              const preferredFrench = langVoices.find(v => 
                v.name.includes('Thomas') || v.name.includes('Julie') || v.name.includes('Paul')
              ) || langVoices.find(v => !v.name.includes('Hortense'));
              if (preferredFrench) return preferredFrench;
            }

            // Default to first available for language
            return langVoices[0];
          };

          voice = getBestVoice(normalizedLang);
          if (voice) {
            this.preferredVoicesByLang.set(normalizedLang, voice);
          }
        }

        if (voice) {
          utterance.voice = voice;
          // Ensure utterance lang matches voice lang if possible
          utterance.lang = voice.lang;
        }

        utterance.onend = () => resolve();
        utterance.onerror = (e) => reject(e);
        window.speechSynthesis.speak(utterance);
      });

    } catch (error) {
      console.error("TTS Error:", error);
      throw error;
    }
  }

  /**
   * Generates audio data without playing it. Useful for prefetching.
   */
  async generateAudio(text: string, language: string): Promise<AudioBuffer | null> {
    const cacheKey = `${language}:${text}`;
    if (this.audioCache.has(cacheKey)) {
      return this.audioCache.get(cacheKey)!;
    }

    // If we are in a "cooldown" period for Gemini due to 429, don't even try
    if (this.preferredEngine === 'browser') {
      return null;
    }

    const languageNames: Record<string, string> = {
      'en': 'English', 'fr': 'French', 'es': 'Spanish', 'pt': 'Portuguese',
      'de': 'German', 'it': 'Italian', 'zh-CN': 'Chinese', 'ja': 'Japanese',
      'ko': 'Korean', 'ar': 'Arabic', 'ru': 'Russian', 'hi': 'Hindi',
      'sw': 'Swahili', 'rw': 'Kinyarwanda', 'am': 'Amharic', 'iw': 'Hebrew',
      'la': 'Latin', 'el': 'Greek', 'ln': 'Lingala', 'kg': 'Kikongo', 'wo': 'Wolof'
    };

    const langName = languageNames[language] || 'the appropriate language';
    const prompt = language === 'zh-CN' 
      ? `Read this Chinese text naturally and fluently: ${text}`
      : `Read this text in ${langName}: ${text}`;
    
    try {
      const response: any = await withRetry(() => this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      }));

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const buffer = await this.decodeBase64ToBuffer(base64Audio);
        this.audioCache.set(cacheKey, buffer);
        // Keep cache small
        if (this.audioCache.size > 50) {
          const firstKey = this.audioCache.keys().next().value;
          if (firstKey) this.audioCache.delete(firstKey);
        }
        return buffer;
      }
    } catch (error: any) {
      if (error.message?.includes('429') || error.status === 'RESOURCE_EXHAUSTED') {
        console.warn("Gemini TTS Rate Limit hit, switching to browser TTS.");
        this.preferredEngine = 'browser';
      }
      throw error;
    }
    return null;
  }

  private async decodeBase64ToBuffer(base64: string): Promise<AudioBuffer> {
    const ctx = this.getAudioContext();
    const binaryString = atob(base64);
    const len = binaryString.length;
    
    const pcmData = new Int16Array(len / 2);
    for (let i = 0; i < len; i += 2) {
      const low = binaryString.charCodeAt(i);
      const high = binaryString.charCodeAt(i + 1);
      pcmData[i / 2] = (high << 8) | low;
    }

    const float32Data = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      float32Data[i] = pcmData[i] / 32768.0;
    }

    const audioBuffer = ctx.createBuffer(1, float32Data.length, 24000);
    audioBuffer.getChannelData(0).set(float32Data);
    return audioBuffer;
  }

  async playAudioBuffer(buffer: AudioBuffer): Promise<void> {
    const ctx = this.getAudioContext();
    if (this.currentSource) {
      try { this.currentSource.stop(); } catch(e) {}
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    this.currentSource = source;
    
    return new Promise((resolve) => {
      source.onended = () => {
        if (this.currentSource === source) this.currentSource = null;
        resolve();
      };
      source.start(0);
    });
  }

  resetPreference() {
    this.preferredEngine = null;
    this.preferredVoicesByLang.clear();
  }

  stop() {
    // 1. Stop Gemini TTS (AudioBufferSourceNode)
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch (e) {}
      this.currentSource = null;
    }

    // 2. Stop Browser Native TTS
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

export const ttsService = new TTSService();
