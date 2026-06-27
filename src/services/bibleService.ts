
import { get, set } from 'idb-keyval';
import { GoogleGenAI } from "@google/genai";
import { withRetry } from '../lib/geminiRetry';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Verse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleChapter {
  book_name: string;
  chapter: number;
  verses: Verse[];
  translation_id: string;
  translation_name: string;
}

const CACHE_PREFIX = 'mgts_bible_cache_v10_';

const languageNames: Record<string, string> = {
  'fr': 'French', 'en': 'English', 'pt': 'Portuguese', 'es': 'Spanish',
  'de': 'German', 'it': 'Italian', 'la': 'Latin', 'el': 'Greek',
  'ln': 'Lingala', 'kg': 'Kikongo', 'wo': 'Wolof', 'hi': 'Hindi',
  'ja': 'Japanese', 'ko': 'Korean', 'sw': 'Swahili', 'rw': 'Kinyarwanda',
  'am': 'Amharic', 'iw': 'Hebrew', 'ar': 'Arabic', 'ru': 'Russian', 'zh-CN': 'Chinese (Simplified)'
};

const BOOK_TO_ID: Record<string, number> = {
  "Genesis": 1, "Exodus": 2, "Leviticus": 3, "Numbers": 4, "Deuteronomy": 5,
  "Joshua": 6, "Judges": 7, "Ruth": 8, "1 Samuel": 9, "2 Samuel": 10,
  "1 Kings": 11, "2 Kings": 12, "1 Chronicles": 13, "2 Chronicles": 14,
  "Ezra": 15, "Nehemiah": 16, "Esther": 17, "Job": 18, "Psalms": 19, "Proverbs": 20,
  "Ecclesiastes": 21, "Song of Solomon": 22, "Isaiah": 23, "Jeremiah": 24, "Lamentations": 25,
  "Ezekiel": 26, "Daniel": 27, "Hosea": 28, "Joel": 29, "Amos": 30,
  "Obadiah": 31, "Jonah": 32, "Micah": 33, "Nahum": 34, "Habakkuk": 35,
  "Zephaniah": 36, "Haggai": 37, "Zechariah": 38, "Malachi": 39,
  "Matthew": 40, "Mark": 41, "Luke": 42, "John": 43, "Acts": 44, "Romans": 45,
  "1 Corinthians": 46, "2 Corinthians": 47, "Galatians": 48, "Ephesians": 49,
  "Philippians": 50, "Colossians": 51, "1 Thessalonians": 52, "2 Thessalonians": 53,
  "1 Timothy": 54, "2 Timothy": 55, "Titus": 56, "Philemon": 57,
  "Hebrews": 58, "James": 59, "1 Peter": 60, "2 Peter": 61, "1 John": 62,
  "2 John": 63, "3 John": 64, "Jude": 65, "Revelation": 66
};

// Rate limiting state for Gemini Bible translations
let isGeminiRateLimited = false;
let rateLimitResetTime = 0;
const RATE_LIMIT_COOLDOWN = 90000; // 1.5 minutes

/**
 * Bible Service
 * Handles fetching and caching of Bible data using bolls.life API.
 * Optimized for speed and offline usage via IndexedDB.
 */
export const bibleService = {
  /**
   * Checks if Gemini is currently rate limited
   */
  checkRateLimit(): boolean {
    if (isGeminiRateLimited && Date.now() > rateLimitResetTime) {
      isGeminiRateLimited = false;
    }
    return isGeminiRateLimited;
  },

  /**
   * Fetches a chapter from the Bible.
   * Priority: 1. IndexedDB Cache (unless forceFetch is true), 2. Network Fetch
   */
  async getChapter(book: string, chapter: number, language: string = 'en', forceFetch: boolean = false): Promise<BibleChapter> {
    // Map app language to native translation IDs supported by bolls.life
    const translationMap: Record<string, { id: string, name: string }> = {
      'fr': { id: 'KJF', name: 'King James Française' },
      'en': { id: 'KJV', name: 'King James Version' },
      'es': { id: 'RVR1960', name: 'Reina Valera 1960' },
      'pt': { id: 'ARA', name: 'Almeida Revista e Atualizada' },
      'de': { id: 'SCH2000', name: 'Schlachter 2000' },
      'it': { id: 'NR06', name: 'Nuova Riveduta 2006' },
      'ru': { id: 'SYNOD', name: 'Russian Synodal Version' },
      'zh-CN': { id: 'CUV', name: 'Chinese Union Version' },
      'ar': { id: 'SVD', name: 'Smith & Van Dyke' },
      'iw': { id: 'WLC', name: 'Westminster Leningrad Codex' },
      'la': { id: 'VULG', name: 'Biblia Sacra Vulgata' },
      'el': { id: 'TR', name: 'Textus Receptus' },
      'hi': { id: 'IRV_HIN', name: 'Hindi IRV' },
      'ja': { id: 'JC', name: 'Japanese Colloquial' },
      'ko': { id: 'KRV', name: 'Korean Revised Version' },
    };

    const translationInfo = translationMap[language] || translationMap['fr']; // Default to French as requested
    const translation = translationInfo.id;
    // Include language in the cache key to prevent mixing when multiple languages use the same translation ID (like KJV_FR)
    const cacheKey = `${CACHE_PREFIX}${language}_${translation}_${book.toLowerCase().replace(/ /g, '_')}_${chapter}`;
    
    // 1. Try to get from cache (if not forcing fetch)
    if (!forceFetch) {
      try {
        const cachedData = await get(cacheKey);
        if (cachedData && Array.isArray(cachedData.verses) && cachedData.verses.length > 0) {
          return cachedData as BibleChapter;
        }
      } catch (e) {
        console.warn('[BibleService] Cache read error:', e);
      }
    }

    // 2. Fetch from network (bolls.life API)
    const bookId = BOOK_TO_ID[book] || 1;
    const url = `https://bolls.life/get-chapter/${translation}/${bookId}/${chapter}/`;

    // Add a 4s timeout for the fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[BibleService] bolls.life failed for ${translation}, trying Gemini fallback`);
        if (this.checkRateLimit()) {
           throw new Error('LIMIT');
        }
        return this.getGeminiChapter(book, chapter, language, translationInfo.name);
      }

      const data = await response.json();
      
      // If bolls.life returns empty data, try the Gemini fallback
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn(`[BibleService] bolls.life returned empty data for ${translation}, trying Gemini fallback`);
        if (this.checkRateLimit()) {
           throw new Error('LIMIT');
        }
        return this.getGeminiChapter(book, chapter, language, translationInfo.name);
      }
      
      const bibleChapter: BibleChapter = {
        book_name: book,
        chapter: chapter,
        verses: data.map((v: any) => ({
          book_id: book,
          book_name: book,
          chapter: chapter,
          verse: v.verse,
          text: this.cleanVerseText(v.text)
        })),
        translation_id: translation,
        translation_name: translationInfo.name
      };

      // 3. Store in cache for future offline use
      try {
        await set(cacheKey, bibleChapter);
      } catch (e) {
        console.warn('[BibleService] Cache write error:', e);
      }

      return bibleChapter;
    } catch (err: any) {
      clearTimeout(timeoutId);
      
      // Try Gemini fallback on network error
      console.warn(`[BibleService] Error for ${translation}, trying Gemini fallback`, err);
      try {
        if (err.message === 'LIMIT') throw err;
        if (this.checkRateLimit()) throw new Error('LIMIT');
        return await this.getGeminiChapter(book, chapter, language, translationInfo.name);
      } catch (fallbackErr: any) {
        // Last resort: try English KJV which is the most stable
        if (language !== 'en') {
          console.warn(`[BibleService] All fallbacks failed for ${language}, trying English KJV`);
          return this.getChapter(book, chapter, 'en', forceFetch);
        }
        
        if (fallbackErr.message === 'LIMIT') {
          throw new Error('Limite de traduction atteinte. Veuillez réessayer dans quelques minutes ou utiliser la version anglaise.');
        }
        throw err;
      }
    }
  },

  /**
   * Fallback method using Gemini AI directly from frontend
   */
  async getGeminiChapter(book: string, chapter: number, language: string, translationName: string): Promise<BibleChapter> {
    try {
      const targetLangName = languageNames[language] || language;
      const prompt = `Provide the full text of the Bible chapter: ${book} chapter ${chapter}. 
      Use the translation: ${translationName || 'Louis Segond'} (Language: ${targetLangName}).
      Return ONLY a JSON array of objects with the following structure:
      [{"verse": 1, "text": "..."}, {"verse": 2, "text": "..."}]
      Do not include any other text, markdown formatting, or explanations. Just the JSON array.`;

      const response = await withRetry(() => ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      }), 3, 4000);

      let text = response.text || "[]";
      
      // Clean up the response in case Gemini adds markdown code blocks
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const verses = JSON.parse(text);
      
      if (!Array.isArray(verses) || verses.length === 0) {
        throw new Error('Gemini returned invalid or empty verses.');
      }

      const bibleChapter: BibleChapter = {
        book_name: book,
        chapter: chapter,
        verses: verses.map((v: any) => ({
          book_id: book,
          book_name: book,
          chapter: chapter,
          verse: v.verse,
          text: this.cleanVerseText(v.text)
        })),
        translation_id: 'GEMINI',
        translation_name: translationName || "Traduction assistée par IA"
      };

      // Cache the result
      const cacheKey = `${CACHE_PREFIX}${language}_GEMINI_${book.toLowerCase().replace(/ /g, '_')}_${chapter}`;
      await set(cacheKey, bibleChapter);

      return bibleChapter;
    } catch (err: any) {
      console.error('[BibleService] Gemini fallback critical error:', err);
      
      // If it's a quota or permission error, we should probably inform the user or try another fallback
      if (err.message?.includes('429') || err.status === 'RESOURCE_EXHAUSTED') {
        isGeminiRateLimited = true;
        rateLimitResetTime = Date.now() + RATE_LIMIT_COOLDOWN;
        throw new Error('LIMIT');
      }
      
      if (err.message?.includes('403') || err.status === 'PERMISSION_DENIED') {
        throw new Error('Accès au service de traduction refusé (Gemini).');
      }

      throw new Error('Impossible de charger la Bible (toutes les sources ont échoué).');
    }
  },

  /**
   * Cleans Strong's numbers and other metadata from the text.
   * Example: "Paul3972" -> "Paul", "heaviness85" -> "heaviness"
   */
  cleanVerseText(text: string): string {
    if (!text) return '';
    
    return text
      // 1. Remove Strong's numbers attached to words (e.g., Paul3972, HebrewWord123)
      // Using \p{L} to match any Unicode letter
      .replace(/(\p{L})\d+/gu, '$1')
      // 2. Remove Strong's numbers before words (e.g., 3972Paul)
      .replace(/\d+(\p{L})/gu, '$1')
      // 3. Remove standalone numbers that are likely Strong's or footnotes (1-5 digits)
      .replace(/\b\d{1,5}\b/g, '')
      // 4. Remove common bracketed/tagged metadata
      .replace(/\[\d+\]/g, '')
      .replace(/<\d+>/g, '')
      .replace(/\(\d+\)/g, '')
      .replace(/\{.*?\}/g, '')
      .replace(/\b[GH]\d+\b/gu, '')
      // 5. Clean up punctuation and spaces
      .replace(/\s+/g, ' ')
      .trim();
  }
};
