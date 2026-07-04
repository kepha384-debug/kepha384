import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Mail, Phone, MapPin, Youtube, Send } from "lucide-react";

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSending(true);
    setStatus(null);

    const serviceId = "service_5b49zua";
    const templateId = "template_639tvjf";
    const publicKey = "ek3lu911oh86YJcXi";

    const form = formRef.current;
    const data = new FormData(form);

    // Extraction sécurisée des valeurs et suppression des espaces superflus
    const payload = {
      user_name: (data.get("user_name") as string)?.trim() || "",
      user_email: (data.get("user_email") as string)?.trim() || "",
      subject: (data.get("subject") as string)?.trim() || "",
      message: (data.get("message") as string)?.trim() || "",
    };

    try {
      // Exécution parallèle des deux envois pour réduire la latence réseau
      await Promise.all([
        // 1️⃣ Email vers MGTS (forcé vers l'adresse d'administration)
        emailjs.send(
          serviceId,
          templateId,
          {
            ...payload,
            reply_message: "Nouveau message reçu via le formulaire MGTS.",
            user_email: "kepha384@gmail.com",
          },
          publicKey
        ),
        // 2️⃣ Email vers le client (accusé de réception automatique)
        emailjs.send(
          serviceId,
          templateId,
          {
            ...payload,
            reply_message:
              "Merci pour votre message ! Nous vous répondrons rapidement.",
          },
          publicKey
        )
      ]);

      setStatus("success");
      form.reset();
    } catch (error) {
      console.error("Erreur de transmission EmailJS :", error);
      setStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen animate-page-fade">
      {/* Bannière */}
      <div className="relative w-full overflow-hidden bg-slate-900 py-16 md:py-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://kepha384.b-cdn.net/Images/pexels-pamanjoe-28785829.jpg"
            alt="Contact"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-[1380px] mx-auto px-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Contact
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-200 max-w-2xl leading-relaxed">
            Entrer en relation avec l'équipe de MGTS
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <section className="max-w-[1380px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Formulaire */}
          <div className="lg:col-span-7 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">
              Envoyez-nous un message
            </h3>

            {status === "success" && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm font-medium">
                Votre message a bien été envoyé ! Un accusé de réception vous a
                été transmis par email.
              </div>
            )}
            {status === "error" && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm font-medium">
                Une erreur s'est produite lors de l'envoi. Veuillez réessayer.
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="user_name"
                    required
                    autoComplete="name"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-amber-500 text-slate-800"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="user_email"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-amber-500 text-slate-800"
                    placeholder="Votre email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-amber-500 text-slate-800"
                  placeholder="Objet"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  name="message"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-amber-500 text-slate-800"
                  placeholder="Votre message..."
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-2 bg-slate-900 text-white font-medium text-sm rounded-lg hover:bg-amber-600 transition-all flex items-center gap-2 justify-center w-full sm:w-auto disabled:bg-slate-400 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                <Send size={16} />
                {isSending ? "Envoi en cours..." : "Envoyer le message"}
              </button>
            </form>
          </div>

          {/* Cartes d'information */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-amber-300 transition-all">
              <div className="p-3 bg-slate-50 rounded-lg text-slate-700">
                <Mail size={20} className="text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">
                  Email
                </p>
                <a
                  href="mailto:kepha384@gmail.com"
                  className="text-sm text-slate-800 hover:text-amber-600 font-medium break-all"
                >
                  kepha384@gmail.com
                </a>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-amber-300 transition-all">
              <div className="p-3 bg-slate-50 rounded-lg text-slate-700">
                <Phone size={20} className="text-sky-500" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">
                  Téléphone
                </p>
                <p className="text-sm text-slate-800 font-medium">(+33) ...</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-amber-300 transition-all">
              <div className="p-3 bg-slate-50 rounded-lg text-slate-700">
                <MapPin size={20} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">
                  Adresse
                </p>
                <p className="text-sm text-slate-800 font-medium">
                  Vandoeuvre-Lès-Nancy, France
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-amber-300 transition-all">
              <div className="p-3 bg-slate-50 rounded-lg text-slate-700">
                <Youtube size={20} className="text-red-500" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">
                  Réseau Social
                </p>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-800 hover:text-red-600 font-medium flex items-center gap-1"
                >
                  Chaîne YouTube MGTS
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;