
import React from 'react';
import { motion } from 'motion/react';
import { XIcon } from './icons/MenuIcons';
import { CrucifixIcon } from './icons/CrucifixIcon';
import { useLanguage } from '../LanguageContext';

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] border border-slate-200"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <div className="md:w-2/5 relative bg-yellow-500 flex flex-col items-center justify-center p-12 text-black text-center">
          <div className="bg-black/10 p-6 rounded-3xl backdrop-blur-md mb-6">
            <CrucifixIcon className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4">{t('about.mission_title')}</h2>
          <p className="text-black/70 text-sm leading-relaxed">
            {t('about.verse').split('—')[0]}
            <br />
            <span className="font-bold mt-2 block text-black">— {t('about.verse').split('—')[1]}</span>
          </p>
        </div>

        <div className="md:w-3/5 p-8 md:p-12 overflow-y-auto bg-white">
          <div className="space-y-8">
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-yellow-500 mb-4">{t('about.who_title')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('about.who_desc')}
              </p>
            </section>

            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-yellow-500 mb-4">{t('about.vision_title')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('about.vision_desc_full')}
              </p>
            </section>

            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-yellow-500 mb-4">{t('about.free_title')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {t('about.free_desc')}
              </p>
            </section>

            <div className="pt-8 border-t border-slate-200 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {t('about.community_join')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutModal;
