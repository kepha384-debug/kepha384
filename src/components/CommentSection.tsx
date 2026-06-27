
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
  avatar: string;
}

const CommentSection: React.FC = () => {
  const { t, translateDynamic, language } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [translatedComments, setTranslatedComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('mgts_comments');
    if (stored) {
      setComments(JSON.parse(stored));
    } else {
      const initial = [
        { id: '1', author: t('comments.default1_author'), text: t('comments.default1_text'), date: t('comments.default1_date'), avatar: 'https://i.pravatar.cc/150?u=marie' },
        { id: '2', author: t('comments.default2_author'), text: t('comments.default2_text'), date: t('comments.default2_date'), avatar: 'https://i.pravatar.cc/150?u=jp' },
      ];
      setComments(initial);
      localStorage.setItem('mgts_comments', JSON.stringify(initial));
    }
  }, [t]);

  useEffect(() => {
    let isMounted = true;
    const translateAllComments = async () => {
      if (comments.length === 0) return;
      
      // If language is French, we show original comments (which are assumed to be in French or the language they were posted in)
      // Actually, we should always try to translate if the language is not French, 
      // because we assume the "source of truth" for the site is French.
      if (language === 'fr') {
        if (isMounted) {
          setTranslatedComments(comments);
        }
        return;
      }

      setTranslating(true);
      try {
        const textsToTranslate = comments.map(c => c.text);
        // We use translateDynamic which handles caching and Gemini calls
        const translatedTexts = await translateDynamic(textsToTranslate) as string[];
        
        if (isMounted) {
          const newTranslated = comments.map((c, i) => {
            const translatedText = Array.isArray(translatedTexts) ? translatedTexts[i] : translatedTexts;
            return {
              ...c,
              text: translatedText || c.text
            };
          });
          setTranslatedComments(newTranslated);
        }
      } catch (err) {
        console.error("Comment Translation Error:", err);
        if (isMounted) {
          setTranslatedComments(comments);
        }
      } finally {
        if (isMounted) {
          setTranslating(false);
        }
      }
    };

    translateAllComments();
    return () => { isMounted = false; };
  }, [comments, language, translateDynamic]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: authorName,
      text: newComment,
      date: t('comments.just_now'),
      avatar: `https://i.pravatar.cc/150?u=${authorName}`
    };

    const updated = [comment, ...comments];
    setComments(updated);
    localStorage.setItem('mgts_comments', JSON.stringify(updated));
    setNewComment('');
  };

  return (
    <section id="temoignages" className="py-20 bg-white">
      <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{t('comments.title')}</h2>
          <span className="bg-yellow-500 text-black px-4 py-1 rounded-full text-xs font-bold shadow-sm">{comments.length} {t('comments.messages_count')}</span>
        </div>

        {/* Form */}
        <div className="bg-white p-10 rounded-[2rem] mb-16 border border-slate-100 shadow-xl shadow-slate-200/40">
          <h3 className="text-lg font-bold text-slate-800 mb-8">{t('comments.leave_message')}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="max-w-md">
              <input
                required
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder={t('comments.placeholder_name')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all"
              />
            </div>
            <textarea
              required
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t('comments.placeholder_text')}
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all resize-none"
            />
            <button 
              type="submit"
              className="bg-yellow-500 text-black px-10 py-4 rounded-xl font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20 active:scale-95 cursor-pointer"
            >
              {t('comments.publish_btn')}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {translatedComments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex gap-6 p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-all group"
              >
                <div className="flex-shrink-0">
                  <img 
                    src={comment.avatar} 
                    alt={comment.author} 
                    className="w-16 h-16 rounded-2xl object-cover shadow-md" 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-slate-800 text-lg">{comment.author}</h4>
                    <span className="text-xs text-slate-400 font-medium">{comment.date}</span>
                  </div>
                  <p className={`text-slate-600 leading-relaxed text-base ${translating ? 'opacity-50' : ''}`}>
                    {comment.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
