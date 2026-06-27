
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { XIcon } from './icons/MenuIcons';
import { DonationIcon } from './icons/DonationIcon';
import { CCIcon } from './icons/CCIcon';
import { useLanguage } from '../LanguageContext';

interface DonationModalProps {
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(10);
  const [customAmount, setCustomAmount] = useState('');

  const amounts = [5, 10, 20, 50, 100];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-8 border border-white/10"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <XIcon className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="bg-yellow-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-black">
            <DonationIcon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">{t('donation.modal_title')}</h2>
          <p className="text-slate-400 text-sm mt-2">{t('donation.modal_desc')}</p>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t('donation.label_amount')}</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {amounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${
                    selectedAmount === amount 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {amount}€
                </button>
              ))}
              <button
                onClick={() => setSelectedAmount('custom')}
                className={`py-3 rounded-xl font-bold text-sm transition-all ${
                  selectedAmount === 'custom' 
                    ? 'bg-yellow-500 text-black' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {t('donation.other_amount')}
              </button>
            </div>
            {selectedAmount === 'custom' && (
              <div className="mt-4">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder={t('donation.placeholder_amount')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:border-yellow-500 outline-none transition-all"
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-3">
              <CCIcon className="w-6 h-6" />
              {t('donation.pay_card')}
            </button>
            <button className="w-full bg-[#0070ba] text-white py-4 rounded-xl font-bold hover:bg-[#003087] transition-all flex items-center justify-center gap-3">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.723a.641.641 0 0 1 .633-.54h7.19c3.429 0 5.122 1.56 5.122 4.156 0 3.059-1.97 4.838-5.169 4.838h-1.582a.641.641 0 0 0-.633.54l-.892 5.676a.641.641 0 0 1-.633.544h-.004zM12.467 12.177c2.265 0 3.108-1.081 3.108-2.834 0-1.466-.855-2.214-2.845-2.214h-4.86L6.536 12.177h5.931z" />
              </svg>
              {t('donation.pay_paypal')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DonationModal;
