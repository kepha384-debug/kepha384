import { useState, useEffect } from "react"; // Ajout de useEffect
import { ArrowLeft, BookOpen } from "lucide-react";

// Liste de vos 4 documents PDF officiels
const livresData = [
  {
    id: 1,
    title: "La Bible - Traduction Chouraqui",
    author: "André Chouraqui",
    year: "1987",
    description: "Une traduction poétique qui s'attache à restituer le rythme et le sens originel de la langue hébraïque.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    pdfUrl: "https://kepha384.b-cdn.net/Bibliotheque/bible%20chouraqui.pdf",
  },
  {
    id: 2,
    title: "La Sainte Bible - Version Darby",
    author: "John Nelson Darby",
    year: "1885",
    description: "Traduction littérale et rigoureuse réputée pour sa fidélité aux textes originaux hébreu et grec.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    pdfUrl: "https://kepha384.b-cdn.net/Bibliotheque/Bible-Darby.pdf",
  },
  {
    id: 3,
    title: "La Bible Darby et son Histoire",
    author: "Étude Historique",
    year: "1994",
    description: "Un ouvrage explicatif retraçant le travail minutieux de traduction de J.N. Darby et le contexte historique de cette œuvre sainte.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    pdfUrl: "https://kepha384.b-cdn.net/Bibliotheque/fb200bibledarbyetsonhistoire-37441.pdf",
  },
  {
    id: 4,
    title: "La Bible - Version Darby Édition Complète",
    author: "John Nelson Darby",
    year: "1885",
    description: "Édition française complète de la traduction de Darby, contenant l'Ancien et le Nouveau Testament avec notes d'études.",
    image: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=800&q=80",
    pdfUrl: "https://kepha384.b-cdn.net/Bibliotheque/French-Bible-Darby-Version.pdf",
  },
];

const BibliothequeNumerique = () => {
  const [activeLivre, setActiveLivre] = useState<typeof livresData[0] | null>(null);

  // Remet automatiquement l'écran à (0,0) lorsque le livre actif change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeLivre]);

  // ÉTAT 1 : MODE LECTEUR DE DOCUMENT PDF
  if (activeLivre) {
    return (
      <div className="bg-slate-50 text-slate-800 min-h-screen animate-page-fade pb-12">
        {/* Barre d'outils du lecteur de livre */}
        <div className="bg-[#0b1329] text-white py-4 shadow-md">
          <div className="max-w-[1380px] mx-auto px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button 
              onClick={() => setActiveLivre(null)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm font-semibold rounded-lg transition-colors w-fit"
            >
              <ArrowLeft size={16} />
              Retour à la bibliothèque
            </button>
            <div className="text-left sm:text-right">
              <h2 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                {activeLivre.title}
              </h2>
              <p className="text-xs text-slate-300">
                Auteur : {activeLivre.author} • Version PDF ({activeLivre.year})
              </p>
            </div>
          </div>
        </div>

        {/* Intégration du lecteur PDF natif */}
        <section className="max-w-[1380px] mx-auto px-6 mt-8">
          <div className="w-full h-[80vh] rounded-2xl border border-slate-200 shadow-lg overflow-hidden bg-slate-200">
            <iframe
              src={activeLivre.pdfUrl}
              className="w-full h-full border-none"
              title={`Lecteur PDF - ${activeLivre.title}`}
            />
          </div>
        </section>
      </div>
    );
  }

  // ÉTAT 2 : MODE CATALOGUE DE LA BIBLIOTHÈQUE
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen animate-page-fade">
      
      {/* Bannière de style AEBC */}
      <div className="relative w-full overflow-hidden bg-slate-900 py-16 md:py-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://kepha384.b-cdn.net/Logos%20%26%20Banni%C3%A8res/aaron-burden-535Npq1wFG8-unsplash.jpg"
            alt="Bibliothèque Numérique"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-[1380px] mx-auto px-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Bibliothèque numérique
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-200 max-w-2xl leading-relaxed">
            Des ouvrages spirituels pour approfondir la connaissance biblique
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <section className="max-w-[1380px] mx-auto px-6 py-12">
        <p className="text-slate-600 mb-8 max-w-2xl leading-relaxed">
          Accédez directement à nos ressources littéraires chrétiennes. Cliquez sur "Lire le document" pour ouvrir l'ouvrage de votre choix directement sur cette page de lecture interactive.
        </p>

        {/* Grille de livres */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {livresData.map((livre) => (
            <div 
              key={livre.id}
              className="group relative bg-[#FAFAFA] border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full"
            >
              {/* Image de couverture en format vertical (aspect-[3/4]) */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
                <img
                  src={livre.image}
                  alt={livre.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Détails du document */}
              <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span>{livre.author}</span>
                    <span>{livre.year}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 line-clamp-2">
                    {livre.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {livre.description}
                  </p>
                </div>

                {/* Bouton de lecture interactive */}
                <button
                  onClick={() => setActiveLivre(livre)}
                  className="w-full py-2.5 bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <BookOpen size={14} />
                  Lire le document
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default BibliothequeNumerique;