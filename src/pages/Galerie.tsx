import MediaCard from "../components/ui/MediaCard";

const Galerie = () => {
  return (
    <div className="bg-[#020917] text-white min-h-screen animate-page-fade">
      
      {/* Bannière de style AEBC */}
      <div className="relative w-full overflow-hidden bg-slate-900 py-16 md:py-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://kepha384.b-cdn.net/Images/YHSWH-777.png"
            alt="Galerie"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-[1380px] mx-auto px-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Galerie d'images
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-200 max-w-2xl leading-relaxed">
            Inspirations et créations chrétiennes pour nourrir la contemplation de la foi
          </p>
        </div>
      </div>

      {/* Sections de présentation en grille alternée sombre */}
      <section className="max-w-[1380px] mx-auto px-6 py-16 space-y-24">

        {/* Section Alternée 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Beauté de la Création
            </h2>
            <div className="h-1 w-12 bg-amber-500 rounded-full" />
            <p className="text-slate-300 leading-relaxed">
              La création témoigne silencieusement mais puissamment de la souveraineté, de la sagesse et de la bonté de notre Créateur. 
            </p>
            <p className="text-slate-300 leading-relaxed">
              À travers notre sélection visuelle, nous vous invitons à contempler les paysages, la lumière et les détails de la nature qui révèlent la grâce divine et inspirent un profond sentiment d'adoration.
            </p>
          </div>
          <div className="h-96 md:h-[420px] rounded-2xl overflow-hidden shadow-xl border border-white/10">
            <img 
              src="https://kepha384.b-cdn.net/Images/pexels-su-casa-panama-56317556-14530768.jpg" 
              alt="Nature divine" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Section Alternée 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-white/10 pt-16">
          <div className="h-96 md:h-[420px] rounded-2xl overflow-hidden shadow-xl border border-white/10 lg:order-1 order-2">
            <img 
              src="https://kepha384.b-cdn.net/Images/pexels-ange-sista-164970041-11482258.jpg" 
              alt="Communion et foi" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="space-y-6 lg:order-2 order-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Expression de la Foi
            </h2>
            <div className="h-1 w-12 bg-amber-500 rounded-full" />
            <p className="text-slate-300 leading-relaxed">
              La foi s'exprime par le partage, la communion fraternelle, la prière et la méditation personnelle.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Chaque photographie de cette collection capture des instants de vérité, de recueillement et d'espoir pour témoigner de l'œuvre invisible du Saint-Esprit au sein du quotidien des croyants.
            </p>
          </div>
        </div>

        {/* Grille classique sous les sections */}
        <div className="border-t border-white/10 pt-16">
          <h2 className="text-2xl font-bold text-white mb-2">Tous nos visuels chrétiens</h2>
          <p className="text-slate-300 mb-8 max-w-2xl leading-relaxed">
            Consultez notre répertoire d’illustrations soignées, parfaites pour la réflexion personnelle, l’illustration d’enseignements ou l’édification spirituelle.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <MediaCard
              title="Croix dorée"
              category="Galerie"
              type="image"
              image="https://kepha384.b-cdn.net/Logos%20%26%20Banni%C3%A8res/icon-kepha384.png"
              description="Symbole de la victoire du Christ sur la mort."
            />
            <MediaCard
              title="Main de foi"
              category="Galerie"
              type="image"
              image="https://kepha384.b-cdn.net/Logos%20%26%20Banni%C3%A8res/icon-kepha384.png"
              description="La main qui porte la croix, signe de confiance et de salut."
            />
            <MediaCard
              title="Lumière de grâce"
              category="Galerie"
              type="image"
              image="https://kepha384.b-cdn.net/Logos%20%26%20Banni%C3%A8res/icon-kepha384.png"
              description="La lumière divine qui éclaire le chemin du croyant."
            />
          </div>
        </div>

      </section>
    </div>
  );
};

export default Galerie;