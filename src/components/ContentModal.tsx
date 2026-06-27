
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XIcon } from './icons/MenuIcons';
import { DownloadIcon } from './icons/DownloadIcon';
import { AudioIcon } from './icons/AudioIcons';
import type { MediaItem } from '../types';
import { MediaType } from '../types';
import { useLanguage } from '../LanguageContext';

interface ContentModalProps {
  item: MediaItem | null;
  onClose: () => void;
  onPlayVideo: (url: string, item: MediaItem) => void;
}

const ContentModal: React.FC<ContentModalProps> = ({ item, onClose, onPlayVideo }) => {
  const { t, translateDynamic, language } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState({
    title: '',
    subtitle: '',
    description: ''
  });

  // Helper to bold number + title in description AND render tables
  const formatDescription = (text: string, isImageMode: boolean) => {
    if (!text) return '';
    
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentTable: string[][] = [];

    const flushTable = (key: number) => {
      if (currentTable.length === 0) return null;
      
      const table = (
        <div key={`table-${key}`} className="overflow-x-auto my-4 no-scrollbar">
          <table className={isImageMode ? 'modal-table-light font-sans' : 'modal-table font-sans'}>
            <thead>
              <tr>
                {currentTable[0].map((cell, i) => (
                  <th key={i}>{cell.trim()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTable.slice(1).map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => {
                    // Handling bolding within cells
                    const parts = cell.split(/(\*\*.*?\*\*)/g);
                    return (
                      <td key={ci}>
                        {parts.map((part, pi) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            const boldColor = isImageMode ? 'text-slate-950' : 'text-yellow-500';
                            return <strong key={pi} className={`font-bold ${boldColor}`}>{part.slice(2, -2)}</strong>;
                          }
                          return part;
                        })}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTable = [];
      return table;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.includes('|')) {
        currentTable.push(line.split('|'));
        // If it's the last line, flush the table
        if (i === lines.length - 1) {
          const table = flushTable(i);
          if (table) elements.push(table);
        }
        continue;
      }

      // If we were in a table and this line is NOT a table line, flush it
      if (currentTable.length > 0) {
        const table = flushTable(i);
        if (table) elements.push(table);
        // Don't continue, process the current line too
      }

      if (!line.trim()) {
        elements.push(<div key={i} className="h-4" />);
        continue;
      }

      const boldColor = isImageMode ? 'text-slate-900' : 'text-white';
      
      // Bold the very first line if it's a general title
      if (i === 0 && (line.includes('titres') || line.includes('properties'))) {
        elements.push(
          <div key={i} className="mb-4">
            <strong className={`font-bold ${boldColor} not-italic block text-lg`}>{line}</strong>
          </div>
        );
        continue;
      }

      // Standard formatting for non-table lines
      const parts = line.split(/(\d+\.\s*[^:\n\-]+[:\-]?|Tableau récapitulatif[^:]+)/g);
      const renderedLine = parts.map((part, idx) => {
        if (/^\d+\./.test(part) || part.includes('Tableau récapitulatif')) {
          return <strong key={idx} className={`font-bold ${boldColor} not-italic`}>{part}</strong>;
        }
        return part;
      });

      elements.push(
        <div key={i} className="mb-1">
          {renderedLine}
        </div>
      );
    }

    return elements;
  };

  useEffect(() => {
    const updateTranslations = async () => {
      if (!item) return;

      const rawTitle = t(item.title);
      const rawSubtitle = item.subtitle ? t(item.subtitle) : '';
      const rawDesc = t(item.description);

      if (language === 'fr') {
        setTranslatedContent({ title: rawTitle, subtitle: rawSubtitle, description: rawDesc });
        return;
      }

      const textsToTranslate = [rawTitle];
      if (rawSubtitle) textsToTranslate.push(rawSubtitle);
      textsToTranslate.push(rawDesc);

      const translations = await translateDynamic(textsToTranslate) as string[];

      if (translations && Array.isArray(translations)) {
        let idx = 0;
        const title = translations[idx++];
        const subtitle = rawSubtitle ? translations[idx++] : '';
        const description = translations[idx++];

        setTranslatedContent({ 
          title: title || rawTitle, 
          subtitle: subtitle || rawSubtitle, 
          description: description || rawDesc 
        });
      }
    };

    updateTranslations();
  }, [item, language, t, translateDynamic]);

  if (!item) return null;

  const isBook = item.type === MediaType.BOOK;
  const isAudio = item.type === MediaType.AUDIO;
  const isImage = item.type === MediaType.IMAGE;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl p-0 flex flex-col md:flex-row max-h-[92vh] border ${isImage ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/10'}`}
      >
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 backdrop-blur-md p-2 rounded-full transition-colors ${isImage ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-black/40 text-white hover:bg-black/60'}`}
        >
          <XIcon className="w-6 h-6" />
        </button>

        <div className={`md:w-[40%] relative ${isImage ? 'bg-white' : 'bg-slate-800'}`}>
          <img
            src={item.imageUrl || 'https://picsum.photos/seed/placeholder/800/600'}
            alt={translatedContent.title || t(item.title)}
            className={`w-full h-full ${isImage ? 'object-contain p-8' : 'object-cover'}`}
            referrerPolicy="no-referrer"
          />
          {!isImage && <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />}
        </div>

        <div className={`md:w-[60%] p-8 sm:p-12 overflow-y-auto custom-scrollbar ${isImage ? 'bg-white' : 'bg-slate-900'}`}>
          <div className="mb-6">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded mb-4 inline-block ${isImage ? 'bg-slate-100 text-slate-600' : 'bg-yellow-500 text-black'}`}>
              {t(`type.${item.type.toLowerCase()}`)}
            </span>
            <h2 className={`text-3xl font-bold mb-2 ${isImage ? 'text-slate-900' : 'text-white'}`}>{translatedContent.title || t(item.title)}</h2>
            {(translatedContent.subtitle || (item.subtitle && t(item.subtitle))) && (
              <p className="text-yellow-600 font-bold text-sm tracking-wide mb-4">
                {translatedContent.subtitle || (item.subtitle && t(item.subtitle))}
              </p>
            )}
          </div>

          <div className={`prose prose-sm mb-8 whitespace-pre-wrap ${isImage ? 'text-slate-700 prose-slate' : 'prose-invert text-slate-300'}`}>
            {formatDescription(translatedContent.description || t(item.description), isImage)}
          </div>

          <div className={`flex flex-wrap gap-4 pt-6 border-t ${isImage ? 'border-slate-100' : 'border-white/10'}`}>
            {item.contentUrl && (
              <button 
                onClick={() => onPlayVideo(item.contentUrl!, item)}
                className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-all transform active:scale-95 flex items-center gap-2"
              >
                {isBook ? t('content.button.read') : isAudio ? t('content.button.listen') : t('content.button.watch')}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              </button>
            )}
            {item.subtitleUrl && (
              <button 
                onClick={() => window.open(item.subtitleUrl!, '_blank')}
                className="flex items-center gap-2 bg-white/5 text-slate-300 px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/10 transition-all"
              >
                <DownloadIcon className="w-4 h-4" />
                {t('content.button.subtitles')}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContentModal;
