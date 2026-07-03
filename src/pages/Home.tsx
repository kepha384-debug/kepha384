import { Link } from "react-router-dom";
import Hero from "../components/layout/Hero";

const Home = () => {
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen animate-page-fade">
      {/* Bannière Hero Principale */}
      <Hero />

      {/* Zone de contenu bordeaux sombre (#020917) */}
      <div className="bg-[#020917] py-16 text-white">
        <div className="max-w-[1380px] mx-auto px-6 space-y-24">

          {/* 1. Présentation MGTS (Texte Gauche, Image Droite) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Découvrez MGTS
              </h2>
              <p className="text-slate-200 leading-relaxed text-base">
                <strong>MGTS (Ma Grâce Te Suffit)</strong> est une plateforme multimédia chrétienne dédiée à l’édification, l’enseignement et l’inspiration.
              </p>
              <p className="text-slate-200 leading-relaxed text-base">
                Explorez nos contenus variés : films, documentaires, audios, livres et images chrétiennes sélectionnés pour nourrir la foi et encourager la méditation de la Parole.
              </p>
              <Link 
                to="/about" 
                className="inline-flex items-center px-6 py-3 bg-white text-[#020917] hover:bg-amber-400 hover:text-slate-900 font-bold rounded-lg transition-colors text-sm"
              >
                En savoir plus sur nous
              </Link>
            </div>
            <div className="h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img 
                src="https://kepha384.b-cdn.net/Images/neom-yx7TJle8LhM-unsplash.jpg" 
                alt="Présentation MGTS" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 2. Films & Animations (Image Gauche, Texte Droit) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-white/10 pt-16">
            <div className="h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/10 lg:order-1 order-2">
              <img 
                src="https://kepha384.b-cdn.net/Images/Dix-commandements-photo-poster%20(3).jpg" 
                alt="Cinéma chrétien" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6 lg:order-2 order-1">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Cinéma – Vidéo</span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Films & Animations
              </h2>
              <p className="text-slate-200 leading-relaxed">
                Des films et animations inspirés par la foi et la Parole, pour découvrir des récits bibliques, des témoignages et des œuvres qui touchent le cœur.
              </p>
              <Link 
                to="/films" 
                className="inline-flex items-center px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors text-sm shadow-md"
              >
                Regarder nos productions
              </Link>
            </div>
          </div>

          {/* 3. Documentaires (Texte Gauche, Image Droite) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-white/10 pt-16">
            <div className="space-y-6">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Enseignement – Vidéo</span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Documentaires
              </h2>
              <p className="text-slate-200 leading-relaxed">
                Des documentaires chrétiens pour comprendre, approfondir et méditer des thèmes spirituels essentiels. Un contenu pédagogique conçu pour grandir dans la connaissance de Dieu.
              </p>
              <Link 
                to="/documentaires" 
                className="inline-flex items-center px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors text-sm shadow-md"
              >
                Découvrir l'enseignement
              </Link>
            </div>
            <div className="h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img 
                src="https://kepha384.b-cdn.net/Images/St-Malachie_2642x1476.png" 
                alt="Documentaires chrétiens" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 4. Audio & Podcasts (Image Gauche, Texte Droit) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-white/10 pt-16">
            <div className="h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/10 lg:order-1 order-2">
              <img 
                src="https://kepha384.b-cdn.net/Images/audio-podcast(2).jpg" 
                alt="Audio et podcasts" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6 lg:order-2 order-1">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Multimédia – Audio</span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Audio & Podcasts
              </h2>
              <p className="text-slate-200 leading-relaxed">
                Des enseignements, méditations, louanges et témoignages audio pour nourrir la foi au quotidien. Idéal pour écouter, réfléchir et se ressourcer.
              </p>
              <Link 
                to="/audio" 
                className="inline-flex items-center px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors text-sm shadow-md"
              >
                Écouter maintenant
              </Link>
            </div>
          </div>

          {/* 5. Livres & Bibliothèque (Texte Gauche, Image Droite) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-white/10 pt-16">
            <div className="space-y-6">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Lecture – Book</span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Livres & Bibliothèque
              </h2>
              <p className="text-slate-200 leading-relaxed">
                Des ouvrages spirituels pour approfondir la connaissance biblique, méditer la Parole et enrichir sa vie chrétienne. Une bibliothèque pensée pour accompagner chaque croyant.
              </p>
              <Link 
                to="/livres" 
                className="inline-flex items-center px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors text-sm shadow-md"
              >
                Accéder à la bibliothèque
              </Link>
            </div>
            <div className="h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img 
                src="https://kepha384.b-cdn.net/Images/pexels-matthardy-32595985.jpg" 
                alt="Bibliothèque chrétienne" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 6. Galerie (Image Gauche, Texte Droit) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-white/10 pt-16">
            <div className="h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/10 lg:order-1 order-2">
              <img 
                src="https://kepha384.b-cdn.net/Images/pexels-ekrulila-18919519.jpg" 
                alt="Galerie visuelle" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6 lg:order-2 order-1">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Images – Image</span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Galerie
              </h2>
              <p className="text-slate-200 leading-relaxed">
                Des images et œuvres chrétiennes pour inspirer, édifier et contempler la beauté de la foi. Une galerie visuelle qui parle directement au cœur.
              </p>
              <Link 
                to="/galerie" 
                className="inline-flex items-center px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors text-sm shadow-md"
              >
                Ouvrir la galerie
              </Link>
            </div>
          </div>

          {/* 7. Prière (Texte Gauche, Image Droite) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-white/10 pt-16">
            <div className="space-y-6">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">MGTS – Prière</span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Prière
              </h2>
              <p className="text-slate-200 leading-relaxed">
                Confiez-nous vos fardeaux et requêtes. Rejoignez un espace d'intercession et de recueillement basé sur les promesses divines d'écoute et d'exaucement.
              </p>
              <Link 
                to="/priere" 
                className="inline-flex items-center px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors text-sm shadow-md"
              >
                Accéder à l'espace prière
              </Link>
            </div>
            <div className="h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img 
                src="https://kepha384.b-cdn.net/Images/priere-img(3).jpg" 
                alt="Espace Prière" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 8. Témoignages (Image Gauche, Texte Droit - Nouvelle section) [3] */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-white/10 pt-16">
            <div className="h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/10 lg:order-1 order-2">
              <img 
                src="https://kepha384.b-cdn.net/Images/Temoignage-restauration.jpg" 
                alt="Témoignages de la communauté" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6 lg:order-2 order-1">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">MGTS – Témoignages</span>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Témoignages
              </h2>
              <p className="text-slate-200 leading-relaxed">
                Découvrez les récits inspirants de personnes dont les vies et les cœurs ont été touchés, édifiés ou transformés par les films, les lectures, les temps de prière et les différents partages sur notre plateforme.
              </p>
              <Link 
                to="/temoignages" 
                className="inline-flex items-center px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors text-sm shadow-md"
              >
                Lire et partager un témoignage
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;