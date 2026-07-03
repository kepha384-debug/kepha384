import { useState } from "react";
import { X, Play } from "lucide-react";

const documentairesData = [
  {
    id: 1,
    title: "Les Racines de la Foi",
    year: "2024",
    description: "Une enquête historique captivante sur les premiers pas de l'Église primitive et la préservation des manuscrits bibliques.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://iframe.mediadelivery.net/embed/599132/3be2741a-b05a-423d-8034-183a5bef7d7e",
  },
  {
    id: 2,
    title: "Le Pouvoir du Témoignage",
    year: "2025",
    description: "Des récits bouleversants de vies transformées et guéries par la puissance de l'Évangile aux quatre coins du globe.",
    image: "https://images.unsplash.com/photo-1515569067071-ec3b51335dd0?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://iframe.mediadelivery.net/embed/599132/9e2a4c24-8166-4325-a554-cb383f107d3b",
  },
  {
    id: 3,
    title: "La Bible à travers les Âges",
    year: "2024",
    description: "Un voyage archéologique et théologique pour comprendre comment les Écritures ont traversé les siècles et influencé l'humanité.",
    image: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=800&q=80",
    videoUrl: "https://iframe.mediadelivery.net/embed/599132/4fe7a48d-1458-4d35-a7f3-89513ad74c08",
  },
];

const Documentaires = () => {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  return (
    /* Modification : Fond sombre #020917 et texte blanc */
    <div className="bg-[#020917] text-white min-h-screen animate-page-fade">
      
      {/* Bannière de style AEBC */}
      <div className="relative w-full overflow-hidden bg-slate-900 py-16 md:py-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://kepha384.b-cdn.net/Images/denise-jans-tV80374iytg-unsplash.jpg"
            alt="Documentaires"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/65" />
        </div>

        <div className="relative z-10 max-w-[1380px] mx-auto px-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Documentaires
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-200 max-w-2xl leading-relaxed">
            Des contenus chrétiens pour comprendre, méditer et grandir
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <section className="max-w-[1380px] mx-auto px-6 py-12">
        <p className="text-slate-300 mb-8 max-w-2xl leading-relaxed">
          Retrouvez notre sélection de documentaires et reportages thématiques chrétiens, explorant l’histoire biblique, la foi vécue et les témoignages de vies relevées par la Parole de Dieu.
        </p>

        {/* Grille de cartes de documentaires */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-slate-800">
          {documentairesData.map((doc) => (
            <div 
              key={doc.id}
              onClick={() => setActiveVideoUrl(doc.videoUrl)}
              /* Ajout de text-slate-800 pour préserver la lisibilité interne de la carte claire */
              className="group relative bg-[#FAFAFA] border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-slate-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full text-slate-800"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img
                  src={doc.image}
                  alt={doc.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-3 rounded-full bg-white text-slate-900 shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 border border-slate-200 rounded-md bg-slate-50 text-slate-600">
                      Documentaire
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {doc.year}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-amber-600 transition-colors">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal de Lecture de Vidéo */}
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

export default Documentaires;