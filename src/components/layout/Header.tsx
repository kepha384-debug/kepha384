import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "À propos", href: "/about" },
  { name: "Films & Animations", href: "/films" },
  { name: "Documentaires", href: "/documentaires" },
  { name: "Audio", href: "/audio" },
  { name: "Livres", href: "/livres" },
  { name: "Galerie", href: "/galerie" },
  { name: "Prière", href: "/priere" },
  { name: "Témoignages", href: "/temoignages" },
  { name: "Contact", href: "/contact" },
];

const languages = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  { code: 'sw', label: 'Kiswahili', flag: '🇹🇿' },
  { code: 'zh-CN', label: '中文 (CN)', flag: '🇨🇳' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'el', label: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'la', label: 'Latina', flag: '🏛️' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'iw', label: 'עברית', flag: '🇮🇱' },
  { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'kg', label: 'Kikongo', flag: '🇨🇬' },
  { code: 'ktu', label: 'Kituba', flag: '🇨🇩' },
  { code: 'ln', label: 'Lingala', flag: '🇨🇩' },
  { code: 'wo', label: 'Wolof', flag: '🇸🇳' },
  { code: 'bm', label: 'Bambara', flag: '🇲🇱' },
  { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' }
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const location = useLocation();

  // Gère et mémorise la langue active via le cookie de traduction
  const [currentLang, setCurrentLang] = useState(() => {
    if (typeof window !== "undefined") {
      const match = document.cookie.match(/googtrans=\/fr\/([^;]+)/);
      return match ? match[1] : "fr";
    }
    return "fr";
  });

  // Ferme les menus lors du changement de page
  useEffect(() => {
    setIsOpen(false);
    setLangDropdownOpen(false);
  }, [location]);

  // Injection asynchrone du script de traduction Google Translate
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (document.getElementById("google-translate-script")) return;

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'fr',
          includedLanguages: 'en,es,pt,ar,de,it,nl,sw,zh-CN,ru,el,la,ja,ko,iw,am,hi,kg,ktu,ln,wo,bm,rw',
          autoDisplay: false,
        }, 'google_translate_element');
      };
    };

    addGoogleTranslateScript();
  }, []);

  // Déclenche le changement de langue par écriture de cookie
  const changeLanguage = (langCode: string) => {
    document.cookie = `googtrans=/fr/${langCode}; path=/`;
    document.cookie = `googtrans=/fr/${langCode}; path=/; domain=${window.location.hostname}`;

    // Si l'utilisateur choisit le Français (langue d'origine), on efface le cookie
    if (langCode === "fr") {
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    }

    window.location.reload();
  };

  const activeLangObj = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <header
      className="sticky top-0 left-0 w-full z-50 bg-[#0b1329]/95 backdrop-blur-md py-4 shadow-lg border-none"
    >
      <div className="max-w-[1380px] mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="https://kepha384.b-cdn.net/Logos%20%26%20Banni%C3%A8res/icon-kepha384.png"
            alt="MGTS Logo"
            className="h-10 w-auto rounded-md shadow-lg transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-white text-lg font-bold tracking-wider">
            MGTS
          </span>
        </Link>

        {/* Navigation Desktop - Activée à partir de xl (1280px) */}
        <div className="hidden xl:flex items-center gap-4 2xl:gap-6">
          <nav className="flex items-center gap-4 2xl:gap-6 text-xs 2xl:text-sm font-medium">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`transition-colors duration-200 py-1 border-b-2 ${
                    isActive
                      ? "text-amber-400 border-amber-500"
                      : "text-slate-300 hover:text-white border-transparent hover:border-slate-500"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bouton de don en Header pour Bureau */}
          <Link
            to="/don"
            className="ml-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-full text-xs transition-all duration-300 shadow-md hover:scale-105"
          >
            Faire un don
          </Link>

          {/* SÉLECTEUR DE LANGUE (Version Bureau) - À l'extrémité droite */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-2 p-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 transition-all duration-200"
              aria-label="Sélecteur de langue"
              title="Traduire le site"
            >
              <Globe size={16} />
              <span className="text-[11px] font-black uppercase tracking-wider">
                {activeLangObj.code === "iw" ? "he" : activeLangObj.code === "zh-CN" ? "zh" : activeLangObj.code}
              </span>
            </button>

            {/* Menu déroulant des langues */}
            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 max-h-80 overflow-y-auto bg-[#0b1329] border border-slate-800 rounded-xl shadow-2xl z-50 py-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                      currentLang === lang.code
                        ? "bg-amber-500/10 text-amber-400"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Menu Mobile - Hamburger affiché en dessous de xl (<1280px) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="xl:hidden text-slate-300 hover:text-white p-2"
          aria-label="Menu principal"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Navigation Mobile - Déroulée en dessous de xl */}
      {isOpen && (
        <div className="xl:hidden absolute top-full left-0 w-full bg-[#0b1329]/95 backdrop-blur-lg py-4 px-6 shadow-xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`py-2 text-base font-medium transition-colors ${
                    isActive ? "text-amber-400 pl-2 border-l-2 border-amber-500" : "text-slate-300 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* SÉLECTEUR DE LANGUE (Version Mobile) */}
          <div className="pt-3 border-t border-slate-800">
            <p className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-widest">Traduire le site</p>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold uppercase transition duration-200 ${
                    currentLang === lang.code
                      ? "bg-amber-500 text-slate-950 shadow-sm"
                      : "bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white"
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Bouton de don inséré dans le menu mobile */}
          <Link
            to="/don"
            className="mt-2 text-center py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm transition-all duration-300 shadow-md"
          >
            Faire un don
          </Link>
        </div>
      )}

      {/* Élément technique invisible obligatoire requis par Google Translate */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
    </header>
  );
};

export default Header;