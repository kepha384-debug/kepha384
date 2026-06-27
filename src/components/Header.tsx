
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CrucifixIcon } from './icons/CrucifixIcon';
import { MenuIcon, XIcon } from './icons/MenuIcons';
import { ChurchIcon } from './icons/ChurchIcon';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import LanguageBar from './LanguageBar';

interface HeaderProps {
  onSearch: (query: string) => void;
  onOpenDonation: () => void;
  onOpenPrayer: () => void;
  onOpenContact: () => void;
  onOpenAbout: () => void;
  onOpenAuth: () => void;
  onCloseBible?: (targetId?: string) => void;
  isBibleOpen?: boolean;
  isAdmin: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  onOpenDonation, 
  onOpenPrayer,
  onOpenContact, 
  onOpenAbout, 
  onOpenAuth,
  onCloseBible,
  isBibleOpen,
  isAdmin 
}) => {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [activeItem, setActiveItem] = useState('home');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
    if (onCloseBible && e.target.value.length > 0) onCloseBible();
  };

  const handleLogoClick = () => {
    if (onCloseBible) onCloseBible();
    setSearchValue('');
    onSearch('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveItem('home');
  };

  const navItems = [
    { 
      id: 'home',
      label: t('nav.home'), 
      icon: <ChurchIcon className="w-5 h-5" />,
      onClick: () => { 
        handleLogoClick();
        setIsMenuOpen(false); 
      } 
    },
    { 
      id: 'sections',
      label: t('nav.sections'), 
      isDropdown: true,
      subItems: [
        { label: t('section.biblical_movies'), id: 'histoires-bibliques' },
        { label: t('section.other_movies'), id: 'vie-chretienne' },
        { label: t('section.animated_movies'), id: 'dessins-animes' },
        { label: t('section.multimedia'), id: 'multimedia' },
        { label: t('section.books'), id: 'livres' },
        { label: t('section.images'), id: 'images' },
        { label: t('nav.testimonials'), id: 'temoignages' },
        { label: t('nav.footer'), id: 'footer' },
      ]
    },
    { id: 'about', label: t('nav.about'), onClick: () => { onOpenAbout(); setIsMenuOpen(false); setActiveItem('about'); } },
    { id: 'contact', label: t('nav.contact'), onClick: () => { onOpenContact(); setIsMenuOpen(false); setActiveItem('contact'); } },
    { id: 'prayer', label: t('nav.prayer') || 'Prière', onClick: () => { onOpenPrayer(); setIsMenuOpen(false); setActiveItem('prayer'); } },
    { id: 'donate', label: t('nav.donate'), onClick: () => { onOpenDonation(); setIsMenuOpen(false); setActiveItem('donate'); }, highlight: true },
  ];

  const scrollToSection = (id: string) => {
    if (onCloseBible) onCloseBible(id);
    
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const offset = 120; // Adjusted for taller header
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
    
    setIsMenuOpen(false);
    setActiveItem('sections');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A192F]/90 backdrop-blur-md border-b border-white/10">
      <LanguageBar />
      {!isBibleOpen && (
        <div className="max-w-none mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
              <div className="bg-yellow-500 p-1.5 rounded-lg text-black">
                <CrucifixIcon className="w-6 h-6" />
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-bold text-xl tracking-tight text-white">
                  {t('logo.title')}
                </span>
                <span className="text-[10px] text-yellow-400 font-medium -mt-1">
                  {t('logo.subtitle')}
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('search.placeholder')}
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-full py-1.5 px-4 pl-10 text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all outline-none"
                />
                <div className="absolute left-3 top-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                <div key={item.id} className="relative group">
                  {item.isDropdown ? (
                    <>
                      <button className={`flex items-center gap-1 text-sm font-bold uppercase tracking-wider transition-all py-2 px-3 rounded-lg border cursor-pointer max-w-[150px] ${
                        activeItem === 'sections' 
                          ? 'border-yellow-500/50 text-yellow-500' 
                          : 'border-transparent text-gray-300 hover:text-yellow-500'
                      }`}>
                        <span className="truncate">{item.label}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div className="absolute top-full left-0 w-56 bg-[#0A192F] border border-white/10 rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                        {item.subItems?.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => scrollToSection(sub.id)}
                            className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-300 hover:text-yellow-500 hover:bg-slate-800/30 transition-colors cursor-pointer"
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={item.onClick}
                      className={`text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer max-w-[180px] ${
                        item.highlight 
                          ? 'bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 shadow-lg shadow-yellow-500/20' 
                          : item.icon 
                            ? `p-2 rounded-lg transition-all ${
                                activeItem === item.id 
                                  ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' 
                                  : 'text-gray-300 hover:text-yellow-500 hover:bg-slate-800/30'
                              }`
                            : `py-2 px-3 rounded-lg border ${
                                activeItem === item.id 
                                  ? 'border-yellow-500/50 text-yellow-500' 
                                  : 'border-transparent text-gray-300 hover:text-yellow-500'
                              }`
                      }`}
                    >
                      {item.icon && item.icon}
                      {!item.icon && <span className="truncate">{item.label}</span>}
                    </button>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-4">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 p-2 cursor-pointer"
              >
                {isMenuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {!isBibleOpen && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0A192F] border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <div className="py-2">
                <input
                  type="text"
                  placeholder={t('search.placeholder')}
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4 text-slate-100 focus:ring-1 focus:ring-yellow-500/50 focus:border-yellow-500/50 outline-none"
                />
              </div>
              {navItems.map((item) => (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={item.onClick}
                    className={`block w-full text-left px-4 py-3 text-base font-bold uppercase tracking-wider transition-all rounded-lg flex items-center gap-3 cursor-pointer ${
                      item.highlight
                        ? 'bg-yellow-500 text-black'
                        : activeItem === item.id || (item.isDropdown && activeItem === 'sections')
                          ? 'bg-yellow-500 text-black shadow-lg'
                          : 'text-gray-300 hover:text-yellow-500 hover:bg-slate-800/30'
                    }`}
                  >
                    {item.icon && item.icon}
                    {item.label}
                    {item.isDropdown && (
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    )}
                  </button>
                  
                  {item.isDropdown && item.subItems && (
                    <div className="pl-8 space-y-1">
                      {item.subItems.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => scrollToSection(sub.id)}
                          className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-400 hover:text-yellow-500 transition-colors cursor-pointer"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
