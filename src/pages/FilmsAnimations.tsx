import { useState } from "react";
import { Play, ChevronLeft } from "lucide-react";

// Liste des 8 films triés du plus nouveau au plus ancien
const filmsData = [
  {
    id: 1,
    title: "LA BIBLE - Jérémie",
    year: "2018",
    description: `Le jeune Jérémie, né vers –650 av. J.-C., grandit dans un village proche de Jérusalem.
Dieu lui apparaît à plusieurs reprises et lui confie une mission : avertir le peuple de Juda qu’un puissant souverain, Nabuchodonosor II, roi de Babylone, attaquera le royaume si ses habitants persistent dans l’idolâtrie.

Malgré ses avertissements, personne ne le croit. Le destin tragique de Jérusalem se met alors en marche : en –587/–586 av. J.-C., Babylone détruit le premier Temple, met fin au royaume de Juda et déporte la population en exil à Babylone.`,
    image: "https://kepha384.b-cdn.net/Images/Miniatures/J%C3%A9r%C3%A9mie.jpg",
    videoUrl: "https://player.mediadelivery.net/play/585951/1a5f944b-33db-4ae2-a4b0-3dee0ac5880e",
  },
  {
    id: 2,
    title: "Et si le Ciel Existait ?",
    year: "2016",
    description: `Après une opération d’urgence, le jeune Colton Burpo affirme avoir vécu une expérience au Ciel. Il décrit des personnes et des événements qu’il ne pouvait pas connaître, bouleversant ses parents, Todd et Sonja. Confrontée aux doutes, aux réactions de leur communauté et à l’inexplicable, la famille tente de comprendre ce que leur fils a réellement vécu, entre foi, peur et espérance.`,
    image: "https://kepha384.b-cdn.net/Images/Miniatures/Heaven.jpg",
    videoUrl: "https://player.mediadelivery.net/play/585951/87046b24-c700-437c-b7ac-f1c417107b28",
  },
  {
    id: 3,
    title: "La Passion du Christ",
    year: "2004",
    description: `Le film retrace les douze dernières heures de la vie de Jésus de Nazareth, depuis son arrestation au jardin de Gethsémani jusqu’à sa crucifixion sur le Golgotha.
Trahi par Judas, Jésus est conduit devant les autorités juives puis livré à Ponce Pilate, gouverneur romain, qui finit par céder à la pression de la foule et ordonne son supplice.

Le récit montre avec intensité la souffrance physique et spirituelle du Christ : flagellation, chemin de croix, chutes répétées, rencontre avec Marie, Simon de Cyrène et les femmes de Jérusalem.
Le film s’achève sur la crucifixion, la mort de Jésus et un bref plan de la résurrection, soulignant le sens spirituel de son sacrifice.`,
    image: "https://kepha384.b-cdn.net/Images/Miniatures/laPassionduChrist.jpg",
    videoUrl: "https://player.mediadelivery.net/play/585951/515b73c4-6ee4-4790-ac83-519521319647",
  },
  {
    id: 4,
    title: "LA BIBLE - Esther",
    year: "1999",
    description: `L’histoire se déroule vers –486 à –465 avant Jésus-Christ, durant le règne du roi perse Assuérus, identifié historiquement comme Xerxès Ier.
À cette époque, une jeune juive nommée Hadassah, connue sous le nom d’Esther, est choisie pour devenir reine, probablement autour de –480 à –478 av. J.-C..

Lorsque le ministre Haman prépare l’extermination du peuple juif, Esther décide de révéler son identité au roi pour sauver les siens.
Les événements du complot et de la délivrance du peuple juif se situent vers –474 av. J.-C., date à laquelle naît la fête de Pourim.`,
    image: "https://kepha384.b-cdn.net/Images/Miniatures/Esther.jpg",
    videoUrl: "https://player.mediadelivery.net/play/585951/d1b129a7-afd0-493a-959c-4f2a7ed4a163",
  },
  {
    id: 5,
    title: "LA BIBLE - La Genèse",
    year: "1994",
    description: `Le film retrace les origines du monde et de l’humanité, telles que décrites dans le Livre de la Genèse.
Il évoque la Création, Adam et Ève, Caïn et Abel, Noé et le Déluge, la tour de Babel, puis Abraham et l’alliance avec Dieu.

À travers une mise en scène symbolique et poétique, le film illustre la naissance du monde, la chute de l’homme et les premières alliances divines qui marquent le destin de l’humanité.
Chaque épisode explore la lutte entre la foi et la désobéissance, la justice et la miséricorde, dans un univers encore jeune et fragile.`,
    image: "https://kepha384.b-cdn.net/Images/Miniatures/la-bible-la-genese-1995-film.jpg",
    videoUrl: "https://player.mediadelivery.net/play/585951/c04a25fc-431a-4ce0-a746-ecec7b28d305",
  },
  {
    id: 6,
    title: "François et le chemin du soleil",
    year: "1972",
    description: `Le film, réalisé par Franco Zeffirelli, retrace les jeunes années de François d’Assise, avant qu’il ne devienne le saint que l’histoire a retenu.
On y suit François, fils d’un riche marchand, dans son passage d’une vie insouciante et tournée vers les plaisirs à une profonde conversion spirituelle.

Après avoir connu la guerre, la maladie et une crise intérieure, François découvre un appel radical à la simplicité, à la pauvreté et à l’amour universel. Il renonce à ses privilèges, se détache des biens matériels et se met au service des plus pauvres, trouvant dans la nature un reflet de la présence divine.

Le film met en scène cette transformation intérieure avec une esthétique lumineuse et poétique, soulignant la douceur, la paix et la force spirituelle qui marqueront toute la vie de François.`,
    image: "https://cdn.kepha384.online/Images/Miniatures/fran%C3%A7ois-Clara.jpg",
    videoUrl: "https://player.mediadelivery.net/play/585951/a919a8cd-b5f3-4b4e-bb82-7b4f4b1632a7",
  },
  {
    id: 7,
    title: "LA BIBLE - Genèse (Partie 1)",
    year: "1966",
    description: `La première partie du film couvre les premiers chapitres de la Genèse, en suivant une progression narrative qui va de la Création du monde jusqu’au Déluge.

Elle commence par la Création, où Dieu façonne l’univers, la lumière, la terre, les animaux, puis l’homme et la femme.
Le récit se poursuit avec Adam et Ève, leur vie au Jardin d’Éden, puis leur expulsion du Paradis après la désobéissance.
Vient ensuite l’histoire dramatique de Caïn et Abel, marquant la première violence humaine.
La population de la terre s’étend, mais la corruption et la méchanceté des hommes augmentent, menant à la décision divine de purifier le monde par le Déluge.
La partie se conclut avec Noé, choisi pour construire l’arche et préserver la vie avant la catastrophe.

Cette première moitié du film met en scène les fondations de l’humanité : la naissance du monde, la chute, la violence, puis la justice divine à travers le Déluge.`,
    image: "https://kepha384.b-cdn.net/Images/Miniatures/la-genese-1966.jpg",
    videoUrl: "https://player.mediadelivery.net/play/585951/dfa30366-2a2f-49a0-bf68-0385d7c60577",
  },
  {
    id: 8,
    title: "LA BIBLE - Genèse (Partie 2)",
    year: "1966",
    description: `La deuxième partie du film continue l'histoire de la Genèse, explorant les alliances divines et les tribulations des patriarches.

Elle présente les récits d'Abraham, Isaac et Jacob, mettant en lumière la fidélité de Dieu envers Ses élus malgré les épreuves.
Le film aborde également les thèmes de la justice, de la miséricorde et de la grâce divine à travers les actions et les décisions des personnages.

Cette suite narrative enrichit le récit biblique, offrant une perspective profonde sur la relation entre Dieu et l'humanité.`,
    image: "https://kepha384.b-cdn.net/Images/Miniatures/Abraham-Isaac.png",
    videoUrl: "https://player.mediadelivery.net/play/585951/dfa30366-2a2f-49a0-bf68-0385d7c60577",
  },
];

const FilmsAnimations = () => {
  const [activeFilm, setActiveFilm] = useState<typeof filmsData[0] | null>(null);

  // Vue Cinéma Plein Écran (si un film est sélectionné)
  if (activeFilm) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col animate-page-fade">
        {/* En-tête de retour style Angel Studios */}
        <div className="bg-[#020917] border-b border-white/5 py-4 px-6 md:px-12 flex items-center">
          <button
            onClick={() => setActiveFilm(null)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white font-medium transition duration-200"
          >
            <ChevronLeft size={16} className="stroke-[2.5px]" />
            <span>Regarder</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300 font-semibold">{activeFilm.title}</span>
          </button>
        </div>

        {/* Zone de lecture vidéo */}
        <div className="flex-grow flex flex-col justify-center bg-black py-4 md:py-8">
          <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-950 shadow-2xl border border-white/5">
              <iframe
                src={activeFilm.videoUrl.replace("/play/", "/embed/")}
                loading="lazy"
                className="w-full h-full border-none"
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
              />
            </div>

            {/* Fiche technique de l'œuvre sous la vidéo */}
            <div className="mt-8 max-w-4xl mx-auto space-y-3 px-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 border border-amber-500/30 rounded-md bg-amber-500/10 text-amber-500">
                  Film
                </span>
                <span className="text-sm text-slate-400 font-semibold">
                  {activeFilm.year}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {activeFilm.title}
              </h2>
              {/* white-space-pre-line permet de respecter les sauts de lignes de la description */}
              <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-3xl pt-2 whitespace-pre-line">
                {activeFilm.description}
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
            Des œuvres cinématographiques et des animations chrétiennes qui invitent à contempler la foi, à méditer la Parole et à grandir spirituellement.
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
              onClick={() => setActiveFilm(film)}
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
    </div>
  );
};

export default FilmsAnimations;