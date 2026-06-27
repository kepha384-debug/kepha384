
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { XIcon } from './icons/MenuIcons';
import { EnvelopeIcon } from './icons/EnvelopeIcon';
import { useLanguage } from '../LanguageContext';

interface ContactModalProps {
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl p-8 border border-slate-200"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="bg-yellow-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-black">
            <EnvelopeIcon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{t('contact.modal_title')}</h2>
          <p className="text-slate-600 text-sm mt-2">{t('contact.modal_desc')}</p>
        </div>

        {isSubmitted ? (
          <div className="text-center py-12">
            <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">{t('contact.success_title_short')}</h3>
            <p className="text-slate-600 mt-2">{t('contact.success_desc_short')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('contact.label_name_full')}</label>
                <input
                  required
                  type="text"
                  placeholder={t('contact.placeholder_name_full')}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:border-yellow-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('contact.label_email_full')}</label>
                <input
                  required
                  type="email"
                  placeholder={t('contact.placeholder_email_full')}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:border-yellow-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('contact.label_subject_full')}</label>
                <select className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 focus:border-yellow-500 outline-none transition-all text-sm">
                  <option className="bg-white">{t('contact.subject_general')}</option>
                  <option className="bg-white">{t('contact.subject_prayer')}</option>
                  <option className="bg-white">{t('contact.subject_suggestion')}</option>
                  <option className="bg-white">{t('contact.subject_technical')}</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('contact.label_message_full')}</label>
                <textarea
                  required
                  placeholder={t('contact.placeholder_message_full')}
                  rows={6}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:border-yellow-500 outline-none transition-all"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-yellow-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition-all transform active:scale-95"
              >
                {t('contact.send_btn')}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ContactModal;
