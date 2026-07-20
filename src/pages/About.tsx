const About = () => {
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen animate-page-fade">
      
      {/* Bannière de style AEBC (Le bandeau du haut reste sombre pour épouser la navbar) */}
      <div className="relative w-full overflow-hidden bg-slate-900 py-16 md:py-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://kepha384.b-cdn.net/Logos%20%26%20Banni%C3%A8res/alessandro-bellone-rvJBpwEX-1Y-unsplash.jpg"
            alt="À propos de MGTS"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-[1380px] mx-auto px-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            À propos de nous
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-200 max-w-2xl leading-relaxed">
            Découvrez la mission, la vision et l’engagement de Ma Grâce Te Suffit : une plateforme chrétienne dédiée à inspirer, enseigner et édifier à travers des contenus centrés sur Jésus-Christ. Notre vocation est de rendre accessible des ressources spirituelles de qualité pour accompagner chaque croyant dans sa croissance et sa vie de foi.
          </p>
        </div>
      </div>

      {/* Contenu principal en Grille Alternée Claire */}
      <section className="max-w-[1380px] mx-auto px-6 py-16 space-y-24">

        {/* Bloc 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              À propos de MGTS
            </h2>
            <div className="h-1 w-12 bg-amber-500 rounded-full" />
            <p className="text-slate-600 leading-relaxed">
              <strong>MGTS – Ma Grâce Te Suffit –</strong> est une plateforme multimédia chrétienne dédiée à l’édification spirituelle, à l’enseignement biblique et à la diffusion de contenus inspirants centrés sur Jésus-Christ.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Notre mission est de rendre accessible, à tous, des ressources de qualité qui nourrissent la foi, encouragent la méditation de la Parole et accompagnent chaque croyant dans sa croissance spirituelle.
            </p>
            <p className="text-slate-600 leading-relaxed">
              MGTS rassemble des films, documentaires, audios, livres, images et enseignements chrétiens soigneusement sélectionnés pour offrir un espace sûr, édifiant et profondément ancré dans la vérité de l’Évangile.
            </p>
          </div>
          <div className="h-96 md:h-[450px] rounded-2xl overflow-hidden shadow-xl border border-slate-200/60">
            {/* Retrait de l'effet de zoom au survol */}
            <img 
              src="https://kepha384.b-cdn.net/Images/pexels-ivan-s-8955513.jpg" 
              alt="Méditation biblique" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bloc 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-slate-200/60 pt-16">
          {/* Retrait de l'effet de zoom au survol */}
          <div className="h-96 md:h-[450px] rounded-2xl overflow-hidden shadow-xl border border-slate-200/60 lg:order-1 order-2">
            <img 
              src="https://kepha384.b-cdn.net/Images/pexels-ivan-s-8957583.jpg" 
              alt="Partage spirituel" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6 lg:order-2 order-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Mission de MGTS
            </h2>
            <div className="h-1 w-12 bg-amber-500 rounded-full" />
            <p className="text-slate-600 leading-relaxed">
              La mission de Ma Grâce Te Suffit repose sur trois piliers fondamentaux :
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-[#FAFAFA] rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-1">1. Inspirer</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Diffuser des œuvres chrétiennes qui témoignent de la puissance de Dieu, de Sa grâce et de Son amour. Encourager les croyants à contempler la beauté de la foi à travers des contenus visuels et artistiques.
                </p>
              </div>

              <div className="p-4 bg-[#FAFAFA] rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-1">2. Enseigner</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Proposer des ressources bibliques, pédagogiques et documentaires qui éclairent, instruisent et approfondissent la compréhension de la Parole pour grandir dans la connaissance de Dieu.
                </p>
              </div>

              <div className="p-4 bg-[#FAFAFA] rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-800 mb-1">3. Édifier</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Offrir un espace spirituel où les croyants peuvent se ressourcer, se fortifier, trouver des réponses à leurs besoins spirituels et encourager une foi vivante et authentique.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bloc 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-slate-200/60 pt-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Vision de MGTS
            </h2>
            <div className="h-1 w-12 bg-amber-500 rounded-full" />
            <p className="text-slate-600 leading-relaxed">
              La vision de Ma Grâce Te Suffit est de devenir une référence internationale dans la diffusion de contenus multimédias chrétiens en créant :
            </p>
            <ul className="space-y-2 text-sm text-slate-600 leading-relaxed list-disc list-inside">
              <li>Une bibliothèque complète de ressources chrétiennes accessibles à tous.</li>
              <li>Une plateforme moderne, intuitive et agréable à utiliser.</li>
              <li>Un écosystème spirituel où la créativité chrétienne est valorisée.</li>
              <li>Un lieu de croissance, de transformation et d’encouragement pour les croyants.</li>
              <li>Un pont entre la foi et les médias, afin de toucher le plus grand nombre avec l’Évangile.</li>
            </ul>
          </div>
          <div className="h-96 md:h-[450px] rounded-2xl overflow-hidden shadow-xl border border-slate-200/60">
            {/* Retrait de l'effet de zoom au survol */}
            <img 
              src="https://kepha384.b-cdn.net/Images/pexels-pamanjoe-28785829.jpg" 
              alt="Lumière spirituelle" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bloc 4 : Engagement de MGTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-slate-200/60 pt-16">
          <div className="h-96 md:h-[450px] rounded-2xl overflow-hidden shadow-xl border border-slate-200/60 lg:order-1 order-2">
            {/* Image d'illustration sur l'unité et la communauté */}
            <img 
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80" 
              alt="Engagement et unité chrétienne" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6 lg:order-2 order-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Engagement de MGTS
            </h2>
            <div className="h-1 w-12 bg-amber-500 rounded-full" />
            <p className="text-slate-600 leading-relaxed">
              <strong>MGTS s’engage</strong> à offrir un espace spirituel ouvert à tous les chrétiens, quelles que soient leurs traditions : catholiques, orthodoxes, protestants, évangéliques et autres communautés de foi. Notre plateforme rassemble des contenus qui mettent en lumière l’essentiel de l’Évangile et souhaite réunir les croyants de tous horizons autour de la Parole, afin que chacun puisse s’y retrouver, se ressourcer et grandir dans sa relation avec Jésus-Christ.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Nous veillons à diffuser des ressources authentiques, respectueuses de la Parole de Dieu, centrées sur Christ et porteuses d’édification. Notre engagement repose sur la fidélité biblique, l’excellence des contenus, la sécurité spirituelle et le désir de servir l’unité du Corps de Christ.
            </p>
          </div>
        </div>

      </section>
    </div>
  );
};

export default About;