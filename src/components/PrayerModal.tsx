
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XIcon } from './icons/MenuIcons';
import { Send } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface PrayerModalProps {
  onClose: () => void;
}

const PrayerModal: React.FC<PrayerModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    request: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('sent');
      setFormData({ name: '', email: '', request: '' });
      setTimeout(() => {
        onClose();
      }, 3000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-[#0A192F] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500 rounded-lg text-black">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8c0 4.5-4.5 9-4.5 9s-4.5-4.5-4.5-9a4.5 4.5 0 1 1 9 0z"/><path d="M12 2v2"/><path d="M12 18v4"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/></svg>
            </div>
            <h2 className="text-xl font-bold text-white">{t('prayer.title') || 'Demande de Prière'}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-white">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {status === 'sent' ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{t('prayer.success_title') || 'Demande Envoyée'}</h3>
                <p className="text-slate-400">{t('prayer.success_msg') || 'Nous prions pour vous. Que Dieu vous bénisse.'}</p>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t('prayer.intro') || 'Confiez-nous vos intentions. Notre communauté de prière se joindra à vous dans la foi.'}
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-yellow-500 uppercase tracking-widest mb-2">{t('contact.name')}</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500/50 outline-none transition-all"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-yellow-500 uppercase tracking-widest mb-2">{t('contact.email')}</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500/50 outline-none transition-all"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-yellow-500 uppercase tracking-widest mb-2">{t('prayer.request_label') || 'Votre Intention'}</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.request}
                      onChange={(e) => setFormData({...formData, request: e.target.value})}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-yellow-500/50 outline-none transition-all resize-none"
                      placeholder={t('prayer.placeholder') || 'Décrivez votre besoin de prière...'}
                    />
                  </div>
                </div>

                <button 
                  disabled={status === 'sending'}
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 disabled:opacity-50"
                >
                  {status === 'sending' ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {t('comments.submit')}
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default PrayerModal;
