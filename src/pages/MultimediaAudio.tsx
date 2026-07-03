import MediaCard from "../components/ui/MediaCard";

const MultimediaAudio = () => {
  return (
    <div className="bg-[#020917] text-white min-h-screen animate-page-fade">
      
      {/* Bannière de style AEBC */}
      <div className="relative w-full overflow-hidden bg-slate-900 py-16 md:py-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://kepha384.b-cdn.net/Images/keagan-henman-mU85sCiU_08-unsplash.jpg"
            alt="Audio & Podcasts"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-[1380px] mx-auto px-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Audio & Podcasts
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-200 max-w-2xl leading-relaxed">
            Louanges, prédications et partages audios inspirants
          </p>
        </div>
      </div>

      <section className="max-w-[1380px] mx-auto px-6 py-12">
        <p className="text-slate-300 mb-8 max-w-2xl leading-relaxed">
          Écoutez notre sélection d'enseignements, de musiques inspirées et de podcasts spirituels pour vous accompagner au quotidien.
        </p>

        {/* Grille de cartes d'écoute sur fond sombre (les cartes tranchent en #FAFAFA) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <MediaCard
            title="Louanges d'Adoration"
            category="Louange"
            type="audio"
            image="https://kepha384.b-cdn.net/Images/matt-botsford-bBNabN9R_ac-unsplash.jpg"
            description="Une compilation de chants inspirés pour guider vos temps de prière et d'adoration personnelle."
          />
          <MediaCard
            title="La Grâce selon l'Évangile"
            category="Prédication"
            type="audio"
            image="https://kepha384.b-cdn.net/Images/pexels-matthardy-32595985.jpg"
            description="Un enseignement biblique profond sur la puissance de la grâce divine dans la vie du croyant."
          />
          <MediaCard
            title="Méditation Quotidienne"
            category="Podcast"
            type="audio"
            image="https://kepha384.b-cdn.net/Images/pexels-ivan-s-8955513.jpg"
            description="Quelques minutes de réflexion et de prière basées sur la Parole pour bien commencer votre journée."
          />
        </div>
      </section>
    </div>
  );
};

export default MultimediaAudio;