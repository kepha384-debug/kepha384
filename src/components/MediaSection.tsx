
import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MediaCard from './MediaCard';
import type { MediaItem } from '../types';
import { useLanguage } from '../LanguageContext';

interface MediaSectionProps {
  id: string;
  title: string;
  items: MediaItem[];
  isAdmin: boolean;
  onItemClick: (item: MediaItem) => void;
  onEditItem: (item: MediaItem) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: () => void;
  onMoveItem?: (id: string, direction: 'left' | 'right') => void;
  fillImage?: boolean;
  isLarge?: boolean;
  aspectRatio?: string;
}

const MediaSection: React.FC<MediaSectionProps> = ({ 
  id,
  title, 
  items, 
  isAdmin,
  onItemClick,
  onEditItem,
  onDeleteItem,
  onAddItem,
  onMoveItem,
  fillImage = true,
  isLarge = false,
  aspectRatio = "3/4"
}) => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (items.length === 0 && !isAdmin) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleMove = (id: string, direction: 'left' | 'right') => {
    if (!onMoveItem) return;
    onMoveItem(id, direction);
  };

  return (
    <section id={id} className="py-12 max-w-none mx-auto">
      <div className="flex justify-between items-center mb-6 px-4 sm:px-6 lg:px-8">
        <h2 className={`font-bold text-white tracking-tight ${isLarge ? 'text-3xl' : 'text-2xl'}`}>{title}</h2>
        {isAdmin && (
          <button 
            onClick={onAddItem}
            className="text-sm font-bold text-yellow-500 hover:text-yellow-400 transition-colors cursor-pointer"
          >
            {t('button.add')}
          </button>
        )}
      </div>

      <div className="relative group px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/70 text-white hover:bg-yellow-500 hover:text-black transition-all opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center cursor-pointer shadow-xl border border-white/10"
          aria-label="Scroll left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/70 text-white hover:bg-yellow-500 hover:text-black transition-all opacity-0 group-hover:opacity-100 hidden sm:flex items-center justify-center cursor-pointer shadow-xl border border-white/10"
          aria-label="Scroll right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                viewport={{ once: true }}
                transition={{ 
                  opacity: { duration: 0.2 },
                  layout: { type: "spring", stiffness: 300, damping: 30 }
                }}
                className={`flex-shrink-0 ${isLarge ? 'w-[320px] sm:w-[420px]' : 'w-[290px] sm:w-[330px]'}`}
              >
                <MediaCard 
                  item={item} 
                  aspectRatio={aspectRatio}
                  onClick={onItemClick} 
                  onEdit={onEditItem}
                  onDelete={onDeleteItem}
                  onMove={onMoveItem ? handleMove : undefined}
                  isAdmin={isAdmin} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default MediaSection;
