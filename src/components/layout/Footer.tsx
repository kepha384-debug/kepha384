import { Link } from "react-router-dom";
import {
  BookOpen,
  Film,
  Disc,
  Mail,
  FileText,
  Compass,
  Instagram,
  Facebook,
  Youtube,
  Heart,
  Image,
  MessageSquare,
  Handshake,
  ExternalLink
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-12 pb-6 mt-auto">
      {/* Grille adaptative : 1 colonne (mobile), 2 colonnes (tablette), 5 colonnes (desktop) */}
      <div className="max-w-[1380px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">

        {/* Identité (prend 2 colonnes) */}
        <div className="md:col-span-2 space-y-5">
          <div className="flex items-center gap-3">
            <img
              src="https://kepha384.b-cdn.net/Logos%20%26%20Banni%C3%A8res/icon-kepha384.png"
              alt="MGTS"
              className="h-10 w-auto rounded-md shadow-md"
            />
            <span className="text-white text-lg font-bold tracking-wider">
              MGTS
            </span>
          </div>

          <p className="text-sm leading-relaxed max-w-sm">
            Plateforme multimédia chrétienne dédiée à l’édification de la foi
            à travers des films, documentaires, audios, livres et galeries d’art chrétien.
          </p>

          {/* Réseaux sociaux */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/40 hover:bg-slate-900/80 transition-all duration-200"
              title="Chaîne YouTube"
            >
              <Youtube size={18} />
            </a>

            <a
              href="https://www.instagram.com/kepha384/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-slate-900/80 transition-all duration-200"
              title="Instagram"
            >
              <Instagram size={18} />
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=61579384665628"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/40 hover:bg-slate-900/80 transition-all duration-200"
              title="Facebook"
            >
              <Facebook size={18} />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
            Découvrir
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/films" className="hover:text-amber-400 transition flex items-center gap-2">
                <Film size={14} /> Films & Animations
              </Link>
            </li>
            <li>
              <Link to="/documentaires" className="hover:text-amber-400 transition flex items-center gap-2">
                <Compass size={14} /> Documentaires
              </Link>
            </li>
            <li>
              <Link to="/audio" className="hover:text-amber-400 transition flex items-center gap-2">
                <Disc size={14} /> Audio
              </Link>
            </li>
            <li>
              <Link to="/livres" className="hover:text-amber-400 transition flex items-center gap-2">
                <BookOpen size={14} /> Livres
              </Link>
            </li>
            <li>
              <Link to="/galerie" className="hover:text-amber-400 transition flex items-center gap-2">
                <Image size={14} /> Galerie
              </Link>
            </li>
            <li>
              <Link to="/priere" className="hover:text-amber-400 transition flex items-center gap-2">
                <Heart size={14} /> Prière
              </Link>
            </li>
            <li>
              <Link to="/temoignages" className="hover:text-amber-400 transition flex items-center gap-2">
                <MessageSquare size={14} /> Témoignages
              </Link>
            </li>
          </ul>
        </div>

        {/* Informations */}
        <div>
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
            Informations
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/about" className="hover:text-amber-400 transition">
                À propos
              </Link>
            </li>
            <li>
              <Link to="/don" className="hover:text-amber-400 transition flex items-center gap-2">
                <Heart size={14} className="text-amber-500" /> Faire un don
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-amber-400 transition flex items-center gap-2">
                <Mail size={14} /> Contact
              </Link>
            </li>
            <li>
              <Link to="/legal" className="hover:text-amber-400 transition flex items-center gap-2">
                <FileText size={14} /> Mentions légales
              </Link>
            </li>
          </ul>
        </div>

        {/* Partenaires (Nouvelle colonne ajoutée) */}
        <div>
          <h3 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
            <Handshake size={14} className="text-amber-500" /> Partenaires
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a
                href="https://www.maria-valtorta.org/index.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition flex items-center gap-2"
              >
                <ExternalLink size={14} className="flex-shrink-0" />
                Maria Valtorta (FR)
              </a>
            </li>
            <li>
              <a
                href="https://mariavaltorta.com/fr/home-francais/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition flex items-center gap-2"
              >
                <ExternalLink size={14} className="flex-shrink-0" />
                Fondation Maria Valtorta
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bas de page */}
      <div className="max-w-[1380px] mx-auto px-6 pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} MGTS — Tous droits réservés.
        </p>
        <p className="text-xs text-slate-500 italic">
          Inspirer · Enseigner · Édifier
        </p>
      </div>
    </footer>
  );
};

export default Footer;