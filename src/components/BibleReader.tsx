
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XIcon } from './icons/MenuIcons';
import { ChevronDown, ChevronUp, Search, BookOpen, Volume2, ArrowLeft, RefreshCw, Loader2, Copy, Check, Share2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { bibleService } from '../services/bibleService';
import { ttsService } from '../services/ttsService';

// Utility to strip HTML tags and Strong's numbers from verse text
const stripHtml = (html: string) => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, 'text/html');
  let text = doc.body.textContent || "";
  
  // 1. Remove Strong's numbers and references: [123], <123>, (123), {123}, G1234, H1234
  // Also remove numbers attached to words (e.g., heaviness85, HebrewWord123)
  // Using \p{L} to match any Unicode letter from any script
  text = text.replace(/(\p{L})\d+/gu, '$1')
             .replace(/\d+(\p{L})/gu, '$1')
             .replace(/\[\d+\]/g, '')
             .replace(/<\d+>/g, '')
             .replace(/\(\d+\)/g, '')
             .replace(/\{.*?\}/g, '')
             .replace(/\b[GH]\d+\b/gu, '')
             .replace(/\b\d{1,5}\b/g, ''); // Standalone 1-5 digits

  // 2. Remove leading verse numbers if they are embedded in the text (e.g., "1 In the beginning")
  text = text.replace(/^\d+\s+/, '');

  return text.replace(/\s+/g, ' ').trim();
};

interface BibleReaderProps {
  onClose: () => void;
}

const BIBLE_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
  "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon",
  "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];

// --- CONFIGURATION & STORAGE ---
const STORAGE_VERSION = 'v138'; 

const getInitialState = <T,>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue) return JSON.parse(storedValue);
  } catch (error) {
    console.error(`Erreur de lecture localStorage pour ${key}:`, error);
  }
  return defaultValue;
};

const safeSave = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Erreur de sauvegarde localStorage:", error);
  }
};

const BibleReader: React.FC<BibleReaderProps> = ({ onClose }) => {
  const { t, translateDynamic, language } = useLanguage();
  const [selectedBook, setSelectedBook] = useState(() => getInitialState(`mgts_bible_book_${STORAGE_VERSION}`, "Genesis"));
  const [selectedChapter, setSelectedChapter] = useState(() => getInitialState(`mgts_bible_chapter_${STORAGE_VERSION}`, 1));
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookList, setShowBookList] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentReadingVerse, setCurrentReadingVerse] = useState<number | null>(null);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);
  const [currentTranslationName, setCurrentTranslationName] = useState("");
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isReadingRef = useRef(false);
  const prefetchBufferRef = useRef<{ index: number, buffer: AudioBuffer | null } | null>(null);

  const [translatedBookNames, setTranslatedBookNames] = useState<Record<string, string>>({});
  const [translatedBookName, setTranslatedBookName] = useState("");
  const [translatedChapterWord, setTranslatedChapterWord] = useState("");

  const filteredBooks = BIBLE_BOOKS.filter(book => {
    const translatedName = t(`bible.book.${book.toLowerCase()}`).toLowerCase();
    return book.toLowerCase().includes(searchQuery.toLowerCase()) || 
           translatedName.includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    return () => {
      ttsService.stop();
      isReadingRef.current = false;
      prefetchBufferRef.current = null;
    };
  }, []);

  const prefetchNextVerse = async (index: number) => {
    if (index >= verses.length || !isReadingRef.current) return;
    
    try {
      // Prefetch current index
      await ttsService.generateAudio(stripHtml(verses[index].text), language);
      
      // Also prefetch the one after that if possible
      if (index + 1 < verses.length && isReadingRef.current) {
        ttsService.generateAudio(stripHtml(verses[index + 1].text), language);
      }
    } catch (err) {
      console.warn("Prefetch error:", err);
    }
  };

  const readVerse = async (index: number) => {
    if (!isReadingRef.current || index >= verses.length) {
      if (index >= verses.length) {
        setIsReading(false);
        isReadingRef.current = false;
        setCurrentReadingVerse(null);
        setCurrentVerseIndex(0);
        prefetchBufferRef.current = null;
      }
      return;
    }

    setCurrentVerseIndex(index);
    const verse = verses[index];
    setCurrentReadingVerse(verse.verse);
    
    const element = document.getElementById(`verse-${verse.verse}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    try {
      // Start prefetching the next two verses while this one is playing
      prefetchNextVerse(index + 1);
      
      await ttsService.speak(stripHtml(verse.text), language);

      if (isReadingRef.current) {
        readVerse(index + 1);
      }
    } catch (error) {
      console.error("TTS Playback Error:", error);
      setIsReading(false);
      isReadingRef.current = false;
      setCurrentReadingVerse(null);
    }
  };

  const startReading = async () => {
    if (isReading && !isPaused) return;

    try {
      // Only reset preference if we are starting from the very beginning of a chapter
      if (currentVerseIndex === 0 && !isPaused) {
        ttsService.resetPreference();
      }
      
      setIsReading(true);
      setIsPaused(false);
      isReadingRef.current = true;
      
      // If we are at the beginning, read the title
      if (currentVerseIndex === 0) {
        const titleText = `${translatedBookName || selectedBook}, ${translatedChapterWord || t('bible.chapter')} ${selectedChapter}`;
        await ttsService.speak(titleText, language);
      }
      
      // Start reading verses from the current index
      if (isReadingRef.current) {
        await readVerse(currentVerseIndex);
      }
    } catch (err) {
      console.error("Start Reading Error:", err);
      setIsReading(false);
      isReadingRef.current = false;
    }
  };

  const pauseReading = () => {
    ttsService.stop();
    setIsPaused(true);
    isReadingRef.current = false;
    // We don't reset currentVerseIndex so we can resume
  };

  const stopReading = () => {
    ttsService.stop();
    setIsReading(false);
    setIsPaused(false);
    isReadingRef.current = false;
    setCurrentReadingVerse(null);
    setCurrentVerseIndex(0);
    prefetchBufferRef.current = null;
  };

  const handleCopyVerse = (verse: number, text: string) => {
    const cleanText = stripHtml(text);
    const fullText = `"${cleanText}" — ${translatedBookName || selectedBook} ${selectedChapter}:${verse}`;
    navigator.clipboard.writeText(fullText);
    setCopiedVerse(verse);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  const handleShareVerse = (verse: number, text: string) => {
    const cleanText = stripHtml(text);
    const fullText = `"${cleanText}" — ${translatedBookName || selectedBook} ${selectedChapter}:${verse}`;
    if (navigator.share) {
      navigator.share({
        title: 'Ma Grâce Te Suffit - Bible',
        text: fullText,
        url: window.location.href
      }).catch(console.error);
    } else {
      handleCopyVerse(verse, text);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setShowScrollTop(scrollContainerRef.current.scrollTop > 300);
      }
    };
    const ref = scrollContainerRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
    }
    return () => ref?.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    safeSave(`mgts_bible_book_${STORAGE_VERSION}`, selectedBook);
  }, [selectedBook]);

  useEffect(() => {
    safeSave(`mgts_bible_chapter_${STORAGE_VERSION}`, selectedChapter);
  }, [selectedChapter]);

  const [retryCount, setRetryCount] = useState(0);

  const fetchChapter = async (book: string, chapter: number, force: boolean = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch the native translation for the current language
      const data = await bibleService.getChapter(book, chapter, language, force);
      setVerses(data.verses);
      setCurrentTranslationName(data.translation_name);
    } catch (err: any) {
      console.error("Bible Fetch Error:", err);
      setError(err.message || t('bible.error_msg') || 'Impossible de charger le chapitre.');
    } finally {
      setLoading(false);
    }
  };

  // Main effect to load chapter on book/chapter/language change
  useEffect(() => {
    fetchChapter(selectedBook, selectedChapter, retryCount > 0);
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    
    stopReading();
  }, [selectedBook, selectedChapter, retryCount, language]);

  // Prefetch the first 5 verses and the title as soon as verses are loaded
  useEffect(() => {
    if (verses.length > 0 && !isReading) {
      let isMounted = true;
      const prefetchInitial = async () => {
        try {
          // 1. Prefetch Title
          const titleText = `${translatedBookName || selectedBook}, ${t('bible.chapter')} ${selectedChapter}`;
          await ttsService.generateAudio(titleText, language);
          if (!isMounted) return;

          // 2. Prefetch first 3 verses SEQUENTIALLY with a significant delay to avoid 429
          // Reduced from 5 to 3 for safer initial load
          const toPrefetch = verses.slice(0, 3);
          for (const v of toPrefetch) {
            if (!isMounted) break;
            
            // Check if we hit a rate limit globally in bibleService (which we can assume affects TTS too)
            if (bibleService.checkRateLimit?.()) break;

            await ttsService.generateAudio(stripHtml(v.text), language);
            // Wait 1.5s between requests to be VERY safe with rate limits
            await new Promise(resolve => setTimeout(resolve, 1500));
          }
        } catch (e) {
          console.warn("Initial prefetch error:", e);
        }
      };
      prefetchInitial();
      return () => { isMounted = false; };
    }
  }, [verses, language, selectedBook, selectedChapter, translatedBookName, t, isReading]);

  // Prefetch the NEXT chapter in the background
  useEffect(() => {
    if (verses.length > 0) {
      const prefetchNext = async () => {
        try {
          // We don't await this, just trigger it to fill the cache
          bibleService.getChapter(selectedBook, selectedChapter + 1, language);
        } catch (e) {}
      };
      // Delay prefetch slightly to prioritize current chapter rendering
      const timer = setTimeout(prefetchNext, 2000);
      return () => clearTimeout(timer);
    }
  }, [selectedBook, selectedChapter, verses, language]);

  const nextChapter = () => {
    setSelectedChapter(prev => prev + 1);
  };

  const prevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(prev => prev - 1);
    }
  };

  useEffect(() => {
    const translateAllBooks = async () => {
      const booksToTranslate = BIBLE_BOOKS.filter(book => {
        const staticT = t(`bible.book.${book.toLowerCase()}`);
        return staticT === `bible.book.${book.toLowerCase()}`;
      });

      if (booksToTranslate.length > 0) {
        try {
          const translated = await translateDynamic(booksToTranslate, 'en') as string[];
          const newMap: Record<string, string> = {};
          booksToTranslate.forEach((book, i) => {
            newMap[book.toLowerCase()] = translated[i];
          });
          setTranslatedBookNames(prev => ({ ...prev, ...newMap }));
        } catch (err) {
          console.error("Error translating book list:", err);
        }
      }
    };
    translateAllBooks();
  }, [language, translateDynamic, t]);

  useEffect(() => {
    const updateChapterWord = async () => {
      const staticTranslation = t('bible.chapter');
      if (staticTranslation === 'bible.chapter') {
        const dynamic = await translateDynamic('Chapter', 'en') as string;
        setTranslatedChapterWord(dynamic);
      } else {
        setTranslatedChapterWord(staticTranslation);
      }
    };
    updateChapterWord();
  }, [language, translateDynamic, t]);

  useEffect(() => {
    const updateBookName = async () => {
      const staticTranslation = t(`bible.book.${selectedBook.toLowerCase()}`);
      // If t() returns the key, it means it's not translated
      if (staticTranslation === `bible.book.${selectedBook.toLowerCase()}`) {
        // Check if we already translated it in the list
        if (translatedBookNames[selectedBook.toLowerCase()]) {
          setTranslatedBookName(translatedBookNames[selectedBook.toLowerCase()]);
        } else {
          const dynamic = await translateDynamic(selectedBook, 'en') as string;
          setTranslatedBookName(dynamic);
        }
      } else {
        setTranslatedBookName(staticTranslation);
      }
    };
    updateBookName();
  }, [selectedBook, language, translateDynamic, t, translatedBookNames]);

  return (
    <div className="h-full bg-[#0A192F] flex flex-col relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-6xl mx-auto flex-1 flex flex-col h-full"
      >
        {/* Bible Controls Header */}
        <div className="z-40 p-4 border-b border-white/10 bg-[#0A192F]/95 backdrop-blur-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 text-slate-400 hover:text-yellow-500 rounded-lg transition-all mr-2"
              title={t('nav.home')}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowBookList(!showBookList)}
                className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-white/10 hover:bg-slate-700 transition-all flex items-center gap-2 text-sm font-bold min-w-[160px] justify-between"
              >
                <span className="truncate">{translatedBookName || t(`bible.book.${selectedBook.toLowerCase()}`)}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showBookList ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showBookList && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-2 border-b border-white/5">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text"
                          placeholder={t('bible.search_book')}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-slate-900 text-white pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                          autoFocus
                        />
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto p-1 custom-scrollbar">
                      {filteredBooks.length > 0 ? (
                        filteredBooks.map(book => (
                          <button 
                            key={book}
                            onClick={() => {
                              setSelectedBook(book);
                              setSelectedChapter(1);
                              setShowBookList(false);
                              setSearchQuery("");
                            }}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                              selectedBook === book ? 'bg-yellow-500 text-black font-bold' : 'text-slate-300 hover:bg-white/5'
                            }`}
                          >
                            {translatedBookNames[book.toLowerCase()] || t(`bible.book.${book.toLowerCase()}`)}
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-slate-500 text-sm italic">
                          {t('bible.no_book_found')}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden sm:flex flex-col border-l border-white/10 pl-4">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{t('bible.version')}</span>
              <span className="text-xs text-yellow-500 font-bold">{currentTranslationName}</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-800 rounded-lg border border-white/10 p-1">
              <button 
                onClick={prevChapter}
                disabled={selectedChapter <= 1}
                className="p-1.5 hover:bg-white/10 rounded-md disabled:opacity-30 transition-colors"
              >
                <ChevronUp className="w-4 h-4 -rotate-90" />
              </button>
              <span className="text-white font-bold text-sm px-2 min-w-[50px] text-center">
                {selectedChapter}
              </span>
              <button 
                onClick={nextChapter}
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
              >
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            </div>
            
            <button 
              onClick={() => setRetryCount(prev => prev + 1)}
              className="p-2 hover:bg-white/5 text-slate-400 hover:text-yellow-500 rounded-lg transition-all"
              title={t('bible.refresh') || 'Rafraîchir'}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-800 rounded-lg border border-white/10 p-1">
              <button 
                onClick={startReading}
                className={`p-2 rounded-md transition-all active:scale-95 ${isReading && !isPaused ? 'bg-yellow-500 text-black' : 'hover:bg-white/10 text-slate-400 hover:text-white'}`}
                title={t('bible.read_aloud') || 'Lire'}
                disabled={isReading && !isPaused}
              >
                <Volume2 className={`w-5 h-5 ${(isReading && !isPaused) ? 'animate-pulse' : ''}`} />
              </button>
              <button 
                onClick={pauseReading}
                className={`p-2 rounded-md transition-all active:scale-95 ${isPaused ? 'bg-yellow-500 text-black' : 'hover:bg-white/10 text-slate-400 hover:text-white'}`}
                title={t('bible.pause') || 'Pause'}
                disabled={!isReading || isPaused}
              >
                <div className="flex gap-1">
                  <div className="w-1.5 h-4 bg-current rounded-full" />
                  <div className="w-1.5 h-4 bg-current rounded-full" />
                </div>
              </button>
              {(isReading || isPaused) && (
                <button 
                  onClick={stopReading}
                  className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-md transition-all"
                  title={t('bible.stop_reading') || 'Arrêter'}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-lg transition-all"
              title={t('nav.home')}
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scroll to Top */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="fixed bottom-10 right-10 z-50 bg-yellow-500 text-black p-4 rounded-full shadow-2xl hover:bg-yellow-400 transition-all"
            >
              <ChevronUp className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar pt-16 pb-24 px-6 sm:px-12 space-y-8"
        >
          <div className="max-w-4xl mx-auto">
            <div className="mb-16 text-center">
              <h1 className="text-5xl sm:text-7xl font-serif font-bold text-white mb-6 tracking-tight">
                {translatedBookName || t(`bible.book.${selectedBook.toLowerCase()}`)}
              </h1>
              <div className="flex items-center justify-center gap-6">
                <div className="h-px w-16 bg-yellow-500/30" />
                <span className="text-yellow-500 font-serif italic text-2xl tracking-widest uppercase">{translatedChapterWord || t('bible.chapter')} {selectedChapter}</span>
                <div className="h-px w-16 bg-yellow-500/30" />
              </div>
            </div>

            {loading ? (
              <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
                <p className="animate-pulse">{t('bible.loading_msg')}</p>
              </div>
            ) : error ? (
              <div className="h-[40vh] flex flex-col items-center justify-center gap-4 text-center">
                <div className="p-4 bg-red-500/10 rounded-full text-red-500">
                  <XIcon className="w-12 h-12" />
                </div>
                <p className="text-red-400 max-w-xs">{error}</p>
                <button 
                  onClick={() => setRetryCount(prev => prev + 1)}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl transition-all"
                >
                  {t('bible.retry')}
                </button>
              </div>
            ) : (
              <div className="space-y-8 text-xl sm:text-2xl leading-relaxed font-serif text-slate-300">
                {verses.map((v) => (
                  <motion.div 
                    key={v.verse}
                    id={`verse-${v.verse}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: v.verse * 0.01 }}
                    className={`group relative p-6 rounded-2xl transition-all duration-500 ${
                      currentReadingVerse === v.verse
                        ? 'bg-yellow-500/20 border-l-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.1)] scale-[1.02]'
                        : 'hover:bg-white/5 border-l-4 border-transparent'
                    }`}
                  >
                    <span className={`absolute -left-10 top-7 text-sm font-bold transition-colors ${currentReadingVerse === v.verse ? 'text-yellow-500' : 'text-yellow-500/30 group-hover:text-yellow-500'}`}>
                      {v.verse}
                    </span>
                    <p className={`${currentReadingVerse === v.verse ? 'text-white' : ''}`}>
                      {stripHtml(v.text)}
                    </p>

                    <div className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleCopyVerse(v.verse, v.text)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-yellow-500 rounded-lg transition-all shadow-xl border border-white/5"
                        title={t('bible.copy')}
                      >
                        {copiedVerse === v.verse ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleShareVerse(v.verse, v.text)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-yellow-500 rounded-lg transition-all shadow-xl border border-white/5"
                        title={t('nav.share')}
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BibleReader;
