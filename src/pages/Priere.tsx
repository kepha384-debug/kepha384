import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Send, Heart, BookOpen } from "lucide-react";

const Priere = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    request: "",
    isAnonymous: false,
  });
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSending(true);
    setStatus(null);

    const serviceId = "service_5b49zua";
    const templateId = "template_639tvjf";
    const publicKey = "ek3lu911oh86YJcXi";

    const payload = {
      user_name: formData.isAnonymous ? "Anonyme" : formData.name,
      user_email: formData.email || "Non renseigné",
      subject: "Requête de prière",
      message: formData.request,
    };

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          ...payload,
          reply_message: "Nouvelle requête de prière reçue via MGTS.",
          user_email: "kepha384@gmail.com",
        },
        publicKey
      );

      setStatus("success");
      setFormData({ name: "", email: "", request: "", isAnonymous: false });
      formRef.current.reset();
    } catch (error) {
      console.error("Erreur EmailJS :", error);
      setStatus("error");
    } finally {
      setIsSending(false);
    }
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
            Approchons-nous avec assurance du trône de la grâce afin d'obtenir
            miséricorde
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
              Notre équipe d'intercession se fera un devoir de porter votre
              situation devant le Seigneur dans la confidentialité et le
              respect.
            </p>

            {status === "success" && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-medium">
                Votre requête de prière a été envoyée avec succès. Nous prions
                avec vous.
              </div>
            )}

            {status === "error" && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm font-medium">
                Une erreur s'est produite lors de l&apos;envoi. Veuillez
                réessayer.
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Nom ou Prénom
                  </label>
                  <input
                    type="text"
                    name="user_name"
                    disabled={formData.isAnonymous}
                    value={formData.isAnonymous ? "Anonyme" : formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
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
                    name="user_email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isAnonymous: e.target.checked,
                        name: e.target.checked ? "" : formData.name,
                      })
                    }
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
                  name="request"
                  value={formData.request}
                  onChange={(e) =>
                    setFormData({ ...formData, request: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-amber-500 text-slate-800"
                  placeholder="Décrivez brièvement votre besoin de prière..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-2.5 bg-slate-900 text-white hover:bg-amber-500 hover:text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-2 justify-center w-full sm:w-auto shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                <Send size={14} />
                {isSending ? "Envoi en cours..." : "Soumettre ma demande"}
              </button>
            </form>
          </div>

          {/* Droite (5 colonnes) : Promesses divines d'exaucement */}
          <div className="lg:col-span-5 bg-[#FAFAFA] text-slate-800 p-6 rounded-xl border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Heart size={16} className="text-red-500" />
              La promesse de l&apos;écoute divine
            </h3>
            <div className="h-[1px] bg-slate-200" />

            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                « Ne vous inquiétez de rien ; mais en toute chose faites
                connaître vos besoins à Dieu par des prières et des
                supplications, avec des actions de grâces. »{" "}
                <span className="font-bold text-slate-800">
                  — Philippiens 4:6
                </span>
              </p>

              <div className="h-[1px] bg-slate-200" />

              <p className="text-xs text-slate-600 leading-relaxed">
                « Car là où deux ou trois sont assemblés en mon nom, je suis au
                milieu d&apos;eux. »{" "}
                <span className="font-bold text-slate-800">
                  — Matthieu 18:20
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* LIGNE 2 : Lecture de la Prière du Notre Père & Image illustrative (Alignées) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-stretch items-start">
          {/* Gauche (7 colonnes) : La Prière du Notre Père */}
          <div className="lg:col-span-7 bg-[#FAFAFA] text-slate-800 p-8 rounded-xl border border-slate-200 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-800 font-bold text-base border-b border-slate-200 pb-2">
                <BookOpen size={18} className="text-slate-700" />
                <span>La prière du Notre Père — Matthieu 6, 7-13</span>
              </div>

              <p className="text-xs text-slate-500 italic leading-relaxed mt-4 mb-4">
                « En priant, ne multipliez pas de vaines paroles, comme les
                païens, qui s&apos;imaginent qu&apos;à force de paroles ils
                seront exaucés. Ne leur ressemblez pas; car votre Père sait de
                quoi vous avez besoin, avant que vous le lui demandiez. »
              </p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200/50 rounded-lg text-sm text-slate-800 font-medium leading-relaxed italic">
              <p className="mb-4">Voici donc comment vous devez prier :</p>

              {/* Le conteneur applique la couleur et l'espacement */}
              <div className="text-amber-700 space-y-4">
                <p>
                  Notre Père qui es aux cieux ! Que ton nom soit sanctifié ;
                </p>
                <p>
                  Que ton règne vienne ; que ta volonté soit faite sur la terre
                  comme au ciel.
                </p>
                <p>Donne-nous aujourd&apos;hui notre pain de ce jour ;</p>
                <p>
                  Pardonne-nous nos offenses, comme nous pardonnons aussi à
                  ceux qui nous ont offensés ;
                </p>
                <p>
                  Ne nous soumets pas à la tentation, mais délivre-nous du mal.
                  Car c&apos;est à toi qu&apos;appartiennent le règne, la
                  puissance et la gloire pour les siècles et des siècles. Amen
                  !
                </p>
              </div>
            </div>
          </div>

          {/* Droite (5 colonnes) : Image illustrative (De même hauteur, sans contour blanc) */}
          <div className="lg:col-span-5 rounded-xl overflow-hidden border border-transparent shadow-xl h-80 lg:h-full min-h-[300px]">
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