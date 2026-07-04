import { useState, useEffect, FormEvent, MouseEvent } from "react";
import { Send, MessageSquare, ThumbsUp } from "lucide-react";

// 1. Définition stricte de l'interface pour un témoignage
interface Testimony {
  id: number;
  name: string;
  location: string;
  service: string;
  text: string;
  date: string;
  likes: number;
}

// Données par défaut typées
const initialTemoignages: Testimony[] = [
  {
    id: 1,
    name: "Marie L.",
    location: "Nancy, France",
    service: "Demande de Prière",
    text: "J'ai déposé une requête de prière pour ma santé sur la plateforme lors d'une période de grand doute. J'ai ressenti une paix surnaturelle et aujourd'hui, les examens médicaux confirment ma guérison complète. Gloire à Dieu et merci à l'équipe MGTS pour l'intercession !",
    date: "Il y a 3 jours",
    likes: 14,
  },
  {
    id: 2,
    name: "Anonyme",
    location: "Brazzaville, Congo",
    service: "Films & Animations",
    text: "Le film sur le pardon que j'ai regardé ici a brisé les chaînes de l'amertume dans mon cœur. Il m'a donné la force d'appeler mon frère après des années de silence pour lui pardonner. MGTS est une véritable bénédiction dans ma vie quotidienne.",
    date: "Il y a 1 semaine",
    likes: 27,
  },
  {
    id: 3,
    name: "Jean-Pierre K.",
    location: "Bruxelles, Belgique",
    service: "Bibliothèque numérique",
    text: "La lecture de la Bible Darby avec l'historique associé m'a permis d'approfondir mes études bibliques personnelles d'une manière que je n'aurais pas imaginée. L'accès direct et fluide aux PDF sur cette plateforme est un outil précieux pour tous les croyants.",
    date: "Il y a 2 semaines",
    likes: 8,
  },
];

const getInitials = (name: string): string => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

const getAvatarBg = (name: string): string => {
  const colors = [
    "bg-blue-600 text-white",
    "bg-emerald-600 text-white",
    "bg-indigo-600 text-white",
    "bg-purple-600 text-white",
    "bg-rose-600 text-white",
    "bg-amber-500 text-slate-950",
  ];
  if (name === "Anonyme") return "bg-slate-500 text-white";
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const Temoignages = () => {
  // Chargement initial sécurisé avec typage explicite <Testimony[]>
  const [temoignages, setTemoignages] = useState<Testimony[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mgts_temoignages");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return initialTemoignages;
        }
      }
    }
    return initialTemoignages;
  });

  // Typage explicite de la liste des likes <number[]>
  const [likedIds, setLikedIds] = useState<number[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mgts_liked_ids");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    service: "Film / Animation",
    text: "",
    isAnonymous: false,
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [submitted]);

  // Synchronisation des témoignages avec le localStorage
  useEffect(() => {
    localStorage.setItem("mgts_temoignages", JSON.stringify(temoignages));
  }, [temoignages]);

  // Synchronisation des likes avec le localStorage
  useEffect(() => {
    localStorage.setItem("mgts_liked_ids", JSON.stringify(likedIds));
  }, [likedIds]);

  // Typage précis du formulaire
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const displayName = formData.isAnonymous ? "Anonyme" : formData.name || "Visiteur";
    
    const newTestimony: Testimony = {
      id: Date.now(),
      name: displayName,
      location: formData.location || "Monde",
      service: formData.service,
      text: formData.text,
      date: "À l'instant",
      likes: 0,
    };

    setTemoignages([newTestimony, ...temoignages]);
    setSubmitted(true);
    setFormData({ name: "", location: "", service: "Film / Animation", text: "", isAnonymous: false });
    setTimeout(() => setSubmitted(false), 5000);
  };

  // Typage précis du clic pour le bouton d'encouragement
  const handleLike = (e: MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    e.stopPropagation();

    const alreadyLiked = likedIds.includes(id);

    if (alreadyLiked) {
      setTemoignages((prev) =>
        prev.map((t) => (t.id === id ? { ...t, likes: Math.max(0, (t.likes ?? 0) - 1) } : t))
      );
      setLikedIds((prev) => prev.filter((likedId) => likedId !== id));
    } else {
      setTemoignages((prev) =>
        prev.map((t) => (t.id === id ? { ...t, likes: (t.likes ?? 0) + 1 } : t))
      );
      setLikedIds((prev) => [...prev, id]);
    }
  };

  // Typage précis du clic pour le bouton de suppression
  const handleDelete = (e: MouseEvent<HTMLButtonElement>, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setTemoignages((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="bg-[#020917] text-white min-h-screen animate-page-fade">
      
      {/* Bannière */}
      <div className="relative w-full overflow-hidden bg-slate-900 py-16 md:py-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://kepha384.b-cdn.net/Images/jametlene-reskp-yD67eTgzX20-unsplash.jpg"
            alt="Témoignages"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-[1380px] mx-auto px-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Témoignages
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-200 max-w-2xl leading-relaxed">
            Racontez comment Dieu a transformé votre cœur et fortifié votre foi à travers MGTS
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <section className="max-w-[1380px] mx-auto px-6 py-12">
        <div className="space-y-12">
          
          {/* Formulaire de dépôt */}
          <div className="max-w-3xl mx-auto bg-[#FAFAFA] text-slate-800 p-8 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Partagez votre histoire
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Votre parcours peut encourager, consoler et fortifier la foi d'un autre frère ou d'une autre sœur. N'hésitez pas à témoigner de la grâce reçue.
            </p>

            {submitted && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-medium">
                Merci ! Votre témoignage a été publié avec succès et inspirera de nombreux visiteurs.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Nom ou Prénom
                  </label>
                  <input
                    type="text"
                    disabled={formData.isAnonymous}
                    value={formData.isAnonymous ? "Anonyme" : formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500 disabled:bg-slate-100 disabled:text-slate-400"
                    placeholder="Votre nom"
                    required={!formData.isAnonymous}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Ville, Pays
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500 text-slate-800"
                    placeholder="Ex: Paris, France"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked, name: "" })}
                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-xs font-medium text-slate-600 select-none">
                    Je souhaite publier ce témoignage anonymement
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Quel service MGTS a touché votre cœur ?
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500 text-slate-800"
                >
                  <option value="Film / Animation">Film / Animation</option>
                  <option value="Documentaire">Documentaire</option>
                  <option value="Louange / Prédication Audio">Louange / Prédication Audio</option>
                  <option value="Bibliothèque numérique (Livre)">Bibliothèque numérique (Livre)</option>
                  <option value="Demande de Prière">Demande de Prière</option>
                  <option value="Autre service">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Votre témoignage
                </label>
                <textarea
                  rows={6}
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500 text-slate-800"
                  placeholder="Racontez comment votre cœur a été visité ou transformé..."
                  required
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-2 justify-center w-full sm:w-auto shadow-sm"
              >
                <Send size={14} />
                Soumettre mon témoignage
              </button>
            </form>
          </div>

          {/* Témoignages de la communauté */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare size={20} className="text-amber-500" />
              Témoignages de la communauté
            </h3>
            <div className="h-1 w-12 bg-amber-500 rounded-full mb-6" />

            <div className="space-y-4">
              {temoignages.map((t) => {
                const initials = getInitials(t.name);
                const bgClass = getAvatarBg(t.name);
                const isLiked = likedIds.includes(t.id);

                return (
                  <div 
                    key={t.id}
                    className="bg-[#FAFAFA] text-slate-800 p-5 md:p-6 rounded-xl border border-slate-200 shadow-sm flex gap-4 hover:border-slate-300 transition-all duration-200"
                  >
                    {/* Badge automatique à initiales */}
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-sm md:text-base flex-shrink-0 shadow-sm border border-slate-300/10 ${bgClass}`}>
                      {initials}
                    </div>
                    
                    {/* Bloc contenu */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm md:text-base">
                            {t.name}
                          </span>
                          <span className="text-[10px] md:text-xs bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full font-semibold">
                            {t.service}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 whitespace-nowrap">
                          {t.date}
                        </span>
                      </div>

                      <p className="text-xs md:text-sm text-slate-600 leading-relaxed mt-2 italic">
                        « {t.text} »
                      </p>

                      {/* Footer de la carte */}
                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/50 text-[10px] md:text-xs text-slate-400">
                        <span>{t.location}</span>
                        
                        <div className="flex items-center gap-4">
                          {/* Bouton d'action interactif */}
                          <button 
                            type="button"
                            onClick={(e) => handleLike(e, t.id)}
                            className="flex items-center gap-1.5 hover:text-amber-500 text-slate-500 font-medium transition-colors group"
                          >
                            <ThumbsUp 
                              size={12} 
                              className={`transition-all duration-200 ${
                                isLiked 
                                  ? "fill-amber-500 text-amber-500 scale-110" 
                                  : "group-hover:scale-110 text-slate-400"
                              }`} 
                            />
                            <span className={isLiked ? "text-amber-500" : ""}>
                              {t.likes > 0 ? `${t.likes} ` : ""}Encourageant{t.likes > 1 ? "s" : ""}
                            </span>
                          </button>

                          {/* Bouton supprimer */}
                          <button 
                            type="button"
                            onClick={(e) => handleDelete(e, t.id)}
                            className="text-red-500 hover:text-red-700 font-semibold transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Temoignages;