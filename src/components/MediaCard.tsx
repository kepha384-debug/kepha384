
import React, { useState } from 'react';
import { motion } from 'motion/react';
import type { MediaItem } from '../types';
import { MediaType } from '../types';
import { useLanguage } from '../LanguageContext';

interface MediaCardProps {
  item: MediaItem;
  onClick: (item: MediaItem) => void;
  onEdit: (item: MediaItem) => void;
  onDelete?: (id: string) => void;
  onMove?: (id: string, direction: 'left' | 'right') => void;
  isAdmin: boolean;
  aspectRatio?: string;
}

const MediaCard: React.FC<MediaCardProps> = ({ 
  item, 
  onClick, 
  onEdit, 
  onDelete,
  onMove,
  isAdmin, 
  aspectRatio = "2.8/4" 
}) => {
  const { t, translateDynamic, language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState(item);
  const [translatedContent, setTranslatedContent] = useState({
    title: '',
    subtitle: '',
    description: ''
  });

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(editItem);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditItem(prev => ({ ...prev, [name]: value }));
  };

  // Helper to bold number + title in description
  const formatDescription = (text: string) => {
    if (!text) return '';
    const parts = text.split(/(\d+\.\s*[^:\n\-]+[:\-]?)/g);
    return parts.map((part, i) => {
      if (/^\d+\./.test(part)) {
        return <strong key={i} className="font-bold text-slate-900 not-italic">{part}</strong>;
      }
      return part;
    });
  };

  React.useEffect(() => {
    const updateTranslations = async () => {
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
  }, [item.title, item.subtitle, item.description, language, t, translateDynamic]);

  return (
    <div 
      onClick={() => onClick(item)}
      className="group/card relative bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio }}>
        <img
          src={item.imageUrl || 'https://picsum.photos/seed/placeholder/800/600'}
          alt={translatedContent.title || t(item.title)}
          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
            {t(`type.${item.type.toLowerCase()}`)}
          </span>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => { e.stopPropagation(); onClick(item); }}
            className="bg-yellow-500/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow-xl transform scale-90 group-hover/card:scale-100 transition-all duration-300 flex items-center gap-2 font-bold uppercase tracking-wider text-xs border border-white/20 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
            <span>
              {item.type === MediaType.MOVIE || item.type === MediaType.VIDEO ? t('media.watch') : 
               item.type === MediaType.AUDIO ? t('media.listen') :
               item.type === MediaType.BOOK ? t('media.read') : t('media.view')}
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-xl text-slate-800 leading-tight line-clamp-1 group-hover/card:text-yellow-600 transition-colors">
            {translatedContent.title || t(item.title)}
          </h3>
          {isAdmin && (
            <div className="flex items-center gap-1">
              {onMove && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onMove(item.id, 'left'); }}
                    className="text-gray-400 hover:text-yellow-600 p-1 transition-colors cursor-pointer"
                    title={t('admin.move_left')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onMove(item.id, 'right'); }}
                    className="text-gray-400 hover:text-yellow-600 p-1 transition-colors cursor-pointer"
                    title={t('admin.move_right')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); setIsEditing(!isEditing); }}
                className="text-gray-400 hover:text-yellow-600 p-1 transition-colors cursor-pointer"
                title={t('admin.edit')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              {onDelete && (
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onDelete(item.id); 
                  }}
                  className="text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                  title={t('admin.delete')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              )}
            </div>
          )}
        </div>
        
        {/* Subtitle area with fixed height to ensure alignment even if empty */}
        <div className="h-4 mb-2">
          {(translatedContent.subtitle || (item.subtitle && t(item.subtitle))) && (
            <p className="text-xs font-bold text-yellow-600 tracking-wide line-clamp-1">
              {translatedContent.subtitle || (item.subtitle && t(item.subtitle))}
            </p>
          )}
        </div>

        <div 
          className="h-28 overflow-y-auto custom-scrollbar pr-2 mt-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-sm text-slate-500 leading-relaxed italic whitespace-pre-wrap">
            {formatDescription(translatedContent.description || t(item.description))}
          </p>
        </div>
      </div>

      {/* Admin Edit Modal Overlay */}
      {isEditing && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 z-20 bg-slate-50 p-4 overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400">{t('admin.edit')}</h4>
            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-3">
            <input
              name="title"
              value={editItem.title}
              onChange={handleChange}
              placeholder={t('admin.placeholder_title')}
              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500/50 outline-none transition-all"
            />
            <input
              name="subtitle"
              value={editItem.subtitle || ''}
              onChange={handleChange}
              placeholder={t('admin.placeholder_subtitle')}
              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500/50 outline-none transition-all"
            />
            <textarea
              name="description"
              value={editItem.description}
              onChange={handleChange}
              placeholder={t('admin.placeholder_desc')}
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500/50 outline-none transition-all"
            />
            <input
              name="imageUrl"
              value={editItem.imageUrl || ''}
              onChange={handleChange}
              placeholder={t('admin.placeholder_image')}
              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500/50 outline-none transition-all"
            />
            <input
              name="contentUrl"
              value={editItem.contentUrl || ''}
              onChange={handleChange}
              placeholder={t('admin.placeholder_content')}
              className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-900 placeholder-slate-400 focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500/50 outline-none transition-all"
            />
            <button 
              onClick={handleSave}
              className="w-full bg-yellow-500 text-black py-2 rounded-lg font-bold hover:bg-yellow-400 transition-all cursor-pointer"
            >
              {t('admin.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaCard;
