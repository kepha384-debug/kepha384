import { useState } from "react";
import { X, Play } from "lucide-react";

// Liste des 8 films avec vos liens Bunny Stream officiels, des visuels cinématiques et descriptions
const filmsData = [
  {
    id: 1,
    title: "Le Chemin de la Grâce",
    year: "2024",
    description: "Un voyage spirituel à travers les épreuves de la foi, illustrant la force du pardon et de la rédemption.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://player.mediadelivery.net/play/585951/1a5f944b-33db-4ae2-a4b0-3dee0ac5880e",
  },
  {
    id: 2,
    title: "La Vérité Qui Libère",
    year: "2023",
    description: "L'histoire inspirante d'un croyant confronté à la vérité évangélique au cœur de ses plus sombres secrets.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://player.mediadelivery.net/play/585951/d1b129a7-afd0-493a-959c-4f2a7ed4a163",
  },
  {
    id: 3,
    title: "Parole de Vie",
    year: "2025",
    description: "Une exploration profonde des Écritures à travers les époques, démontrant l'actualité immuable de l'Évangile.",
    image: "https://images.unsplash.com/photo-1515569067071-ec3b51335dd0?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://player.mediadelivery.net/play/585951/c04a25fc-431a-4ce0-a746-ecec7b28d305",
  },
  {
    id: 4,
    title: "L'Alliance Sacrée",
    year: "2024",
    description: "Un récit puissant sur la fidélité de Dieu au travers des générations et l'accomplissement de Ses promesses.",
    image: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://player.mediadelivery.net/play/585951/dfa30366-2a2f-49a0-bf68-0385d7c60577",
  },
  {
    id: 5,
    title: "La Voix dans le Désert",
    year: "2023",
    description: "Un témoignage saisissant de conversion et de persévérance face aux défis complexes du monde moderne.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://player.mediadelivery.net/play/585951/2c3a957a-695d-4dcf-b324-cba5da6dd57d",
  },
  {
    id: 6,
    title: "Flambeau de Rédemption",
    year: "2026",
    description: "Quand la lumière de Christ pénètre les ténèbres d'une communauté oubliée, la transformation opère.",
    image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://player.mediadelivery.net/play/585951/515b73c4-6ee4-4790-ac83-519521319647",
  },
  {
    id: 7,
    title: "L'Étoile du Matin",
    year: "2025",
    description: "Une œuvre contemplative et poétique rappelant l'espérance éternelle promise à ceux qui persévèrent.",
    image: "https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://player.mediadelivery.net/play/585951/a919a8cd-b5f3-4b4e-bb82-7b4f4b1632a7",
  },
  {
    id: 8,
    title: "Le Rocher des Âges",
    year: "2024",
    description: "Un ancrage solide dans la tempête. Ce film retrace des parcours de vies rebâties sur le fondement du Christ.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://player.mediadelivery.net/play/585951/87046b24-c700-437c-b7ac-f1c417107b28",
  },
];

const FilmsAnimations = () => {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  return (
    /* Modification : Fond sombre #020917 et texte blanc */
    <div className="bg-[#020917] text-white min-h-screen animate-page-fade">
      
      {/* Bannière de style AEBC */}
      <div className="relative w-full overflow-hidden bg-slate-900 py-16 md:py-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://kepha384.b-cdn.net/Images/cinemas-mgts3-1.jpg"
            alt="Films & Animations"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-[1380px] mx-auto px-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Films & Animations
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-200 max-w-2xl leading-relaxed">
            Des productions inspirées par la foi et la Parole
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <section className="max-w-[1380px] mx-auto px-6 py-12">
        <p className="text-slate-300 mb-8 max-w-2xl leading-relaxed">
          Explorez notre sélection de films et d'animations chrétiennes, soigneusement choisis pour édifier la famille, enseigner la sainte doctrine et inspirer vos cœurs.
        </p>

        {/* Grille de cartes de films */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filmsData.map((film) => (
            <div 
              key={film.id}
              onClick={() => setActiveVideoUrl(film.videoUrl)}
              /* Ajout de text-slate-800 pour préserver la lisibilité interne de la carte claire */
              className="group relative bg-[#FAFAFA] border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full text-slate-800"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={film.image}
                  alt={film.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-3 rounded-full bg-white text-slate-900 shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>
              </div>

              <div className="p-4 flex flex-col flex-grow justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border border-slate-200 rounded-md bg-slate-50 text-slate-600">
                      Vidéo
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {film.year}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-amber-600 transition-colors">
                    {film.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {film.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal de Lecture de Vidéo interactif */}
      {activeVideoUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={() => setActiveVideoUrl(null)}
        >
          <div 
            className="relative bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden aspect-video shadow-2xl animate-page-fade"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
              aria-label="Fermer le lecteur"
            >
              <X size={20} />
            </button>
            
            {/* Correction : Sécurité de conversion .replace() ajoutée pour correspondre au format d'intégration complet */}
            <iframe
              src={activeVideoUrl.replace("/play/", "/embed/")}
              loading="lazy"
              className="w-full h-full border-none"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default FilmsAnimations;