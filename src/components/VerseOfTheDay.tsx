
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';

const VerseOfTheDay: React.FC = () => {
  const { t, translateDynamic, language } = useLanguage();
  const [verseIndex, setVerseIndex] = useState(1);
  const [translatedContent, setTranslatedContent] = useState({
    text: '',
    ref: '',
    reflection: ''
  });

  useEffect(() => {
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setVerseIndex((dayOfYear % 7) + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const updateTranslations = async () => {
      const rawText = t(`verse.${verseIndex}.text`);
      const rawRef = t(`verse.${verseIndex}.ref`);
      const rawReflection = t(`verse.${verseIndex}.reflection`);

      if (language === 'fr') {
        if (isMounted) {
          setTranslatedContent({ text: rawText, ref: rawRef, reflection: rawReflection });
        }
        return;
      }

      try {
        const translations = await translateDynamic([rawText, rawRef, rawReflection]) as string[];

        if (isMounted && translations && Array.isArray(translations)) {
          setTranslatedContent({ 
            text: translations[0] || rawText, 
            ref: translations[1] || rawRef, 
            reflection: translations[2] || rawReflection
          });
        }
      } catch (error) {
        console.error("Verse translation error:", error);
      }
    };

    updateTranslations();
    return () => { isMounted = false; };
  }, [verseIndex, language, t, translateDynamic]);

  return (
    <section id="verset-du-jour" className="py-12 bg-black text-white mt-16">
      <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center"
        >
          {/* Title */}
          <h3 className="text-yellow-500 font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-4">
            {t('verse.day_title')}
          </h3>

          {/* Verse Text */}
          <div className="mb-4">
            <h2 className="text-2xl sm:text-3xl font-serif italic leading-tight text-white max-w-3xl">
              "{translatedContent.text || t(`verse.${verseIndex}.text`)}"
            </h2>
          </div>

          {/* Reference */}
          <p className="text-yellow-500 font-bold text-base sm:text-lg tracking-wide mb-8">
            — {translatedContent.ref || t(`verse.${verseIndex}.ref`)}
          </p>

          {/* Separator */}
          <div className="w-full max-w-xs h-[1px] bg-white/10 mb-8" />

          {/* Reflection */}
          <div className="max-w-2xl">
            <p className="text-white/90 text-sm sm:text-base italic leading-relaxed">
              <span className="text-yellow-500 font-bold not-italic mr-2">{t('verse.reflection_label')}</span>
              {translatedContent.reflection || t(`verse.${verseIndex}.reflection`)}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VerseOfTheDay;
