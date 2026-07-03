import { useState, useEffect } from "react";
import { Send, MessageSquare, ThumbsUp } from "lucide-react";

const initialTemoignages = [
  {
    id: 1,
    name: "Marie L.",
    location: "Nancy, France",
    service: "Demande de Prière",
    text: "J'ai déposé une requête de prière pour ma santé sur la plateforme lors d'une période de grand doute. J'ai ressenti une paix surnaturelle et aujourd'hui, les examens médicaux confirment ma guérison complète. Gloire à Dieu et merci à l'équipe MGTS pour l'intercession !",
    date: "Il y a 3 jours",
  },
  {
    id: 2,
    name: "Anonyme",
    location: "Brazzaville, Congo",
    service: "Films & Animations",
    text: "Le film sur le pardon que j'ai regardé ici a brisé les chaînes de l'amertume dans mon cœur. Il m'a donné la force d'appeler mon frère après des années de silence pour lui pardonner. MGTS est une véritable bénédiction dans ma vie quotidienne.",
    date: "Il y a 1 semaine",
  },
  {
    id: 3,
    name: "Jean-Pierre K.",
    location: "Bruxelles, Belgique",
    service: "Bibliothèque numérique",
    text: "La lecture de la Bible Darby avec l'historique associé m'a permis d'approfondir mes études bibliques personnelles d'une manière que je n'aurais pas imaginée. L'accès direct et fluide aux PDF sur cette plateforme est un outil précieux pour tous les croyants.",
    date: "Il y a 2 semaines",
  },
];

const Temoignages = () => {
  const [temoignages, setTemoignages] = useState(initialTemoignages);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTestimony = {
      id: Date.now(),
      name: formData.isAnonymous ? "Anonyme" : formData.name || "Visiteur",
      location: formData.location || "Monde",
      service: formData.service,
      text: formData.text,
      date: "À l'instant",
    };
    setTemoignages([newTestimony, ...temoignages]);
    setSubmitted(true);
    setFormData({ name: "", location: "", service: "Film / Animation", text: "", isAnonymous: false });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-[#020917] text-white min-h-screen animate-page-fade">
      
      {/* Bannière de style AEBC */}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Formulaire de dépôt (Gauche) */}
          <div className="lg:col-span-7 bg-[#FAFAFA] text-slate-800 p-8 rounded-xl border border-slate-200 shadow-sm">
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

          {/* Témoignages de la communauté (Droite) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare size={18} className="text-amber-500" />
              Témoignages de la communauté
            </h3>
            <div className="h-1 w-12 bg-amber-500 rounded-full mb-6" />

            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
              {temoignages.map((t) => (
                <div 
                  key={t.id}
                  className="bg-[#FAFAFA] text-slate-800 p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition-all duration-200"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{t.name}</span>
                    <span className="text-slate-400">{t.date}</span>
                  </div>
                  
                  {/* Modification : Retrait complet de l'encadrement border, bg jaune et couleur de texte amber-700 */}
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {t.service}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    « {t.text} »
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 text-[10px] text-slate-400">
                    <span>{t.location}</span>
                    <button className="flex items-center gap-1 hover:text-amber-600 transition-colors">
                      <ThumbsUp size={10} />
                      <span>Encourageant</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Temoignages;