import { useState, useEffect } from "react";
import { Send, Heart, BookOpen } from "lucide-react";

const Priere = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    request: "",
    isAnonymous: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", request: "", isAnonymous: false });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="bg-[#020917] text-white min-h-screen animate-page-fade">
      
      {/* Bannière de style AEBC */}
      <div className="relative w-full overflow-hidden bg-slate-900 py-16 md:py-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://kepha384.b-cdn.net/Images/john-price-RAZQiZOX3mU-unsplash%20(1).jpg"
            alt="Espace Prière"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-[1380px] mx-auto px-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Prière
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-200 max-w-2xl leading-relaxed">
            Approchons-nous avec assurance du trône de la grâce afin d'obtenir miséricorde
          </p>
        </div>
      </div>

      {/* Contenu principal de la page structuré en lignes indépendantes pour un alignement précis */}
      <section className="max-w-[1380px] mx-auto px-6 py-12 space-y-12">
        
        {/* LIGNE 1 : Formulaire d'envoi & Promesses divines d'exaucement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Gauche (7 colonnes) : Remplissage de la requête */}
          <div className="lg:col-span-7 bg-[#FAFAFA] text-slate-800 p-8 rounded-xl border border-slate-200 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Confiez-nous votre requête
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              Notre équipe d'intercession se fera un devoir de porter votre situation devant le Seigneur dans la confidentialité et le respect.
            </p>

            {submitted && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-medium">
                Votre requête de prière a été envoyée avec succès. Nous prions avec vous.
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
                    Adresse Email (Optionnelle)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500 text-slate-800"
                    placeholder="Votre adresse email"
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
                    Je souhaite soumettre cette requête anonymement
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Votre sujet de prière
                </label>
                <textarea
                  rows={4}
                  value={formData.request}
                  onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500 text-slate-800"
                  placeholder="Décrivez brièvement votre besoin de prière..."
                  required
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-2 justify-center w-full sm:w-auto shadow-sm"
              >
                <Send size={14} />
                Soumettre ma demande
              </button>
            </form>
          </div>

          {/* Droite (5 colonnes) : Promesses divines d'exaucement */}
          <div className="lg:col-span-5 bg-[#FAFAFA] text-slate-800 p-6 rounded-xl border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Heart size={16} className="text-red-500" />
              La promesse de l'écoute divine
            </h3>
            <div className="h-[1px] bg-slate-200" />
            
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                « Ne vous inquiétez de rien ; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces. » <span className="font-bold text-slate-800">— Philippiens 4:6</span>
              </p>
              
              <div className="h-[1px] bg-slate-200" />

              <p className="text-xs text-slate-600 leading-relaxed">
                « Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux. » <span className="font-bold text-slate-800">— Matthieu 18:20</span>
              </p>
            </div>
          </div>

        </div>

        {/* LIGNE 2 : Lecture de la Prière du Notre Père & Image illustrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Gauche (7 colonnes) : La Prière du Notre Père */}
          <div className="lg:col-span-7 bg-[#FAFAFA] text-slate-800 p-8 rounded-xl border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-base border-b border-slate-200 pb-2">
              <BookOpen size={18} className="text-slate-700" />
              <span>La prière du Notre Père — Matthieu 6, 7-13</span>
            </div>
            
            <p className="text-xs text-slate-500 italic leading-relaxed">
              « 7 En priant, ne multipliez pas de vaines paroles, comme les païens, qui s'imaginent qu'à force de paroles ils seront exaucés. 8 Ne leur ressemblez pas; car votre Père sait de quoi vous avez besoin, avant que vous le lui demandiez. »
            </p>

            <div className="p-5 bg-slate-50 border border-slate-200/50 rounded-lg text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-line italic">
              {`9 Voici donc comment vous devez prier:
              
              Notre Père qui es aux cieux! Que ton nom soit sanctifié;
              
              10 que ton règne vienne; que ta volonté soit faite sur la terre comme au ciel.
              
              11 Donne-nous aujourd'hui notre pain quotidien;
              
              12 pardonne-nous nos offenses, comme nous aussi nous pardonnons à ceux qui nous ont offensés;
              
              13 ne nous induis pas en tentation, mais délivre-nous du malin. Car c'est à toi qu'appartiennent, dans tous les siècles, le règne, la puissance et la gloire. Amen!`}
            </div>
          </div>

          {/* Droite (5 colonnes) : Image illustrative (Désormais fixe et stable au survol) [3] */}
          <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-2xl border border-white/10 h-80 lg:h-[480px]">
            <img
              src="https://kepha384.b-cdn.net/Images/priere-img(3).jpg"
              alt="Prière et communion"
              className="w-full h-full object-cover"
            />
          </div>

        </div>

      </section>
    </div>
  );
};

export default Priere;