
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '../LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Globe } from 'lucide-react';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'zh-CN', label: '中文', flag: '🇨🇳' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'sw', label: 'Kiswahili', flag: '🇰🇪' },
  { code: 'ln', label: 'Lingala', flag: '🇨🇩' },
  { code: 'kg', label: 'Kikongo', flag: '🇨🇩' },
  { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
  { code: 'iw', label: 'עברית', flag: '🇮🇱' },
  { code: 'la', label: 'Latina', flag: '🇻🇦' },
];

const LanguageBar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-black/95 border-b border-white/5 h-[40px] flex items-center relative z-[60]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-end">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
          >
            <Globe className="w-3.5 h-3.5 text-yellow-500/80 group-hover:text-yellow-500" />
            <span className="text-xs font-bold text-gray-300 group-hover:text-white flex items-center gap-2 overflow-hidden">
              <span className="text-sm flex-shrink-0">{currentLang.flag}</span>
              <span className="uppercase tracking-widest truncate">{currentLang.code}</span>
            </span>
            <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-48 max-h-[70vh] overflow-y-auto bg-slate-900 border border-white/10 rounded-xl shadow-2xl no-scrollbar py-2"
              >
                <div className="px-3 py-1.5 mb-1 border-b border-white/5">
                  <span className="text-[10px] font-bold text-yellow-500/60 uppercase tracking-widest">
                    {t('nav.translate')}
                  </span>
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-white/5 ${
                      language === lang.code ? 'text-yellow-500 bg-yellow-500/5' : 'text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.label}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">
                      {lang.code}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LanguageBar;
