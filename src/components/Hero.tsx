
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UploadIcon } from './icons/UploadIcon';
import { useLanguage } from '../LanguageContext';

interface HeroProps {
  bannerImageUrl: string;
  bannerLocalImage?: string | null;
  onBannerChange: (url: string) => void;
  onLocalBannerChange: (base64: string | null) => void;
  isAdmin: boolean;
}

const Hero: React.FC<HeroProps> = ({ 
  bannerImageUrl, 
  bannerLocalImage, 
  onBannerChange, 
  onLocalBannerChange,
  isAdmin 
}) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [newUrl, setNewUrl] = useState(bannerImageUrl);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpdate = () => {
    onBannerChange(newUrl);
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onLocalBannerChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentBanner = bannerLocalImage || bannerImageUrl;

  return (
    <section className="relative w-full h-[calc(90vh-20px)] min-h-[730px] flex items-center overflow-hidden mt-7">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentBanner}
          alt="Banner"
          className="w-full h-full object-cover object-left"
          referrerPolicy="no-referrer"
          onError={(e) => {
            if (bannerLocalImage && e.currentTarget.src === bannerLocalImage) {
              e.currentTarget.src = bannerImageUrl;
            }
          }}
        />
        {/* No overlay to show the background banner clearly */}
      </div>

      {/* Content - Empty as requested because the background image contains the design */}
      <div className="relative z-10 w-full h-full pointer-events-none" />

      {/* Admin Controls */}
      {isAdmin && (
        <div className="absolute bottom-8 right-8 z-20 flex flex-col gap-3 items-end">
          {isEditing ? (
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 flex gap-2 items-center shadow-2xl">
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder={t('hero.placeholder.url')}
                className="bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm w-64 text-white placeholder-slate-500 outline-none"
              />
              <button 
                onClick={handleUpdate}
                className="bg-yellow-500 text-black px-4 py-1.5 rounded text-sm font-bold hover:bg-yellow-400 transition-all"
              >
                OK
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-900/80 backdrop-blur-md text-white p-3 rounded-full hover:bg-yellow-500 hover:text-black transition-all border border-white/10 flex items-center gap-2 group cursor-pointer"
                title={t('hero.tooltip.upload_pc')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="text-xs font-bold hidden group-hover:block">{t('hero.button.pc')}</span>
              </button>
              
              <button
                onClick={() => setIsEditing(true)}
                className="bg-slate-900/80 backdrop-blur-md text-white p-3 rounded-full hover:bg-yellow-500 hover:text-black transition-all border border-white/10 flex items-center gap-2 group cursor-pointer"
                title={t('hero.tooltip.change_link')}
              >
                <UploadIcon className="w-5 h-5" />
                <span className="text-xs font-bold hidden group-hover:block">{t('hero.button.link')}</span>
              </button>

              {bannerLocalImage && (
                <button
                  onClick={() => onLocalBannerChange(null)}
                  className="bg-red-500/20 backdrop-blur-md text-red-500 p-3 rounded-full hover:bg-red-500 hover:text-white transition-all border border-red-500/20 cursor-pointer"
                  title={t('hero.tooltip.delete_local')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Hero;
