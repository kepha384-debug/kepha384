
import React from 'react';
import { CrucifixIcon } from './icons/CrucifixIcon';
import { FacebookIcon, TwitterIcon, InstagramIcon } from './icons/SocialIcons';
import { useLanguage } from '../LanguageContext';

interface FooterProps {
  isAdmin: boolean;
  onOpenAuth: () => void;
  onLogoutAdmin: () => void;
  onOpenContact: () => void;
  onOpenDonation: () => void;
  onOpenAbout: () => void;
  onOpenLegal: () => void;
  onOpenPrivacy: () => void;
  onReset: () => void;
}

const Footer: React.FC<FooterProps> = ({ 
  isAdmin, 
  onOpenAuth, 
  onLogoutAdmin, 
  onOpenContact, 
  onOpenDonation, 
  onOpenAbout,
  onOpenLegal,
  onOpenPrivacy,
  onReset
}) => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const [email, setEmail] = React.useState('');
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer id="footer" className="bg-[#0A192F] text-slate-400 py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & Social */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="bg-yellow-500 p-1.5 rounded-lg flex items-center justify-center text-black shadow-lg">
                <CrucifixIcon className="w-6 h-6" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-xl tracking-tight text-white">
                  MGTS
                </span>
                <span className="text-[10px] text-yellow-400 font-medium -mt-1">
                  Ma Grâce Te Suffit
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-8 text-slate-400">
              {t('footer.description')}
            </p>
            <div className="flex gap-5">
              <a href="#" className="text-slate-400 hover:text-yellow-500 transition-all transform hover:scale-110">
                <FacebookIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-yellow-500 transition-all transform hover:scale-110">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-yellow-500 transition-all transform hover:scale-110">
                <InstagramIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-yellow-500 font-bold uppercase tracking-widest text-xs mb-8">{t('footer.nav_title')}</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors cursor-pointer">{t('nav.home')}</button>
              </li>
              <li>
                <button onClick={onOpenAbout} className="hover:text-white transition-colors cursor-pointer">{t('nav.about')}</button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-white transition-colors cursor-pointer">{t('nav.contact')}</button>
              </li>
              <li>
                <button onClick={onOpenDonation} className="hover:text-white transition-colors cursor-pointer text-left">{t('nav.donate')}</button>
              </li>
            </ul>
          </div>

          {/* Column 3: Ressources */}
          <div>
            <h4 className="text-yellow-500 font-bold uppercase tracking-widest text-xs mb-8">{t('footer.resources_title')}</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <button onClick={() => scrollToSection('histoires-bibliques')} className="hover:text-white transition-colors cursor-pointer">{t('footer.resources_movies')}</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('livres')} className="hover:text-white transition-colors cursor-pointer">{t('footer.resources_books')}</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('vie-chretienne')} className="hover:text-white transition-colors cursor-pointer">{t('footer.resources_docs')}</button>
              </li>
              <li>
                <button onClick={() => scrollToSection('dessins-animes')} className="hover:text-white transition-colors cursor-pointer">{t('footer.resources_kids')}</button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-yellow-500 font-bold uppercase tracking-widest text-xs mb-8">{t('footer.newsletter_title')}</h4>
            <p className="text-sm mb-6 text-slate-400">{t('footer.newsletter_desc')}</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input 
                type="email" 
                placeholder={t('footer.newsletter_placeholder')} 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-yellow-500 outline-none text-white"
              />
              <button 
                type="submit"
                className={`bg-yellow-500 text-black p-2 rounded-lg hover:bg-yellow-400 transition-all cursor-pointer shadow-lg flex-shrink-0 flex items-center justify-center w-10 h-10 ${isSubscribed ? 'bg-green-500 hover:bg-green-400' : ''}`}
              >
                {isSubscribed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
              </button>
            </form>
            {isSubscribed && (
              <p className="text-[10px] text-green-400 mt-2 animate-fade-in">Merci de votre inscription !</p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 md:pr-24">
          <div className="flex items-center gap-3">
            <p className="text-xs text-slate-500">
              © {currentYear} Ma Grâce Te Suffit. {t('footer.copyright')}
            </p>
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button onClick={onLogoutAdmin} className="text-[10px] uppercase font-bold text-red-500 hover:text-red-400 cursor-pointer">{t('footer.admin_logout')}</button>
                <button onClick={onReset} className="text-[10px] uppercase font-bold text-slate-600 hover:text-slate-400 cursor-pointer">{t('footer.admin_reset')}</button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="text-slate-600 hover:text-yellow-500 transition-colors cursor-pointer"
                title="Connexion Admin"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="flex gap-8">
            <button onClick={onOpenLegal} className="text-xs text-slate-500 hover:text-white transition-colors cursor-pointer">{t('footer.legal')}</button>
            <button onClick={onOpenPrivacy} className="text-xs text-slate-500 hover:text-white transition-colors cursor-pointer">{t('footer.privacy')}</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
