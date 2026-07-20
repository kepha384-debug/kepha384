import { useState } from "react";
import { Play, ChevronLeft } from "lucide-react";

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
  const [activeDoc, setActiveDoc] = useState<typeof documentairesData[0] | null>(null);

  // Vue Cinéma Plein Écran (si un documentaire est sélectionné)
  if (activeDoc) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col animate-page-fade">
        {/* En-tête de retour style Angel Studios */}
        <div className="bg-[#020917] border-b border-white/5 py-4 px-6 md:px-12 flex items-center">
          <button
            onClick={() => setActiveDoc(null)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white font-medium transition duration-200"
          >
            <ChevronLeft size={16} className="stroke-[2.5px]" />
            <span>Regarder</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300 font-semibold">{activeDoc.title}</span>
          </button>
        </div>

        {/* Zone de lecture vidéo */}
        <div className="flex-grow flex flex-col justify-center bg-black py-4 md:py-8">
          <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-950 shadow-2xl border border-white/5">
              <iframe
                src={activeDoc.videoUrl.replace("/play/", "/embed/")}
                loading="lazy"
                className="w-full h-full border-none"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
              />
            </div>

            {/* Fiche technique sous la vidéo */}
            <div className="mt-8 max-w-4xl mx-auto space-y-3 px-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 border border-amber-500/30 rounded-md bg-amber-500/10 text-amber-500">
                  Documentaire
                </span>
                <span className="text-sm text-slate-400 font-semibold">
                  {activeDoc.year}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {activeDoc.title}
              </h2>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-3xl pt-2">
                {activeDoc.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vue Grille Standard (par défaut)
  return (
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
              onClick={() => setActiveDoc(doc)}
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
    </div>
  );
};

export default Documentaires;