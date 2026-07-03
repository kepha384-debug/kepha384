import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

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

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

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

        {/* Navigation Desktop */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <nav className="flex items-center gap-6 xl:gap-8 text-sm font-medium">
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
        </div>

        {/* Menu Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-slate-300 hover:text-white p-2"
          aria-label="Menu principal"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Navigation Mobile */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#0b1329]/95 backdrop-blur-lg py-4 px-6 shadow-xl flex flex-col gap-4">
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
          
          {/* Bouton de don inséré dans le menu mobile */}
          <Link
            to="/don"
            className="mt-2 text-center py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm transition-all duration-300 shadow-md"
          >
            Faire un don
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;