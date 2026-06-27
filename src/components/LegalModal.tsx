
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'mentions' | 'privacy';
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  const { t } = useLanguage();

  const content = {
    mentions: {
      title: t('legal.mentions_title'),
      sections: [
        {
          title: t('legal.editor_title'),
          text: t('legal.editor_text')
        },
        {
          title: t('legal.hosting_title'),
          text: t('legal.hosting_text')
        },
        {
          title: t('legal.intellectual_title'),
          text: t('legal.intellectual_text')
        }
      ]
    },
    privacy: {
      title: t('legal.privacy_title'),
      sections: [
        {
          title: t('legal.data_collection_title'),
          text: t('legal.data_collection_text')
        },
        {
          title: t('legal.data_usage_title'),
          text: t('legal.data_usage_text')
        },
        {
          title: t('legal.rights_title'),
          text: t('legal.rights_text')
        }
      ]
    }
  };

  const activeContent = content[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">{activeContent.title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="space-y-8">
                {activeContent.sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{section.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{section.text}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t('modal.close')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LegalModal;
