import { Mail, Phone, MapPin, Youtube, Send } from "lucide-react";

const Contact = () => {
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen animate-page-fade">
      
      {/* Bannière de style AEBC */}
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
          
          {/* Formulaire d'envoi de message */}
          <div className="lg:col-span-7 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">
              Envoyez-nous un message
            </h3>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nom</label>
                  <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-amber-500" placeholder="Votre nom" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-amber-500" placeholder="Votre email" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Sujet</label>
                <input type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-amber-500" placeholder="Objet" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Message</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:border-amber-500" placeholder="Votre message..."></textarea>
              </div>
              <button type="submit" className="px-6 py-2 bg-slate-900 text-white font-medium text-sm rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 justify-center w-full sm:w-auto">
                <Send size={16} />
                Envoyer le message
              </button>
            </form>
          </div>

          {/* Cartes d'adresses et réseaux sociaux */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Carte Email (Mise à jour : kepha384@gmail.com) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-amber-300 transition-all">
              <div className="p-3 bg-slate-50 rounded-lg text-slate-700">
                <Mail size={20} className="text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Email</p>
                <a href="mailto:kepha384@gmail.com" className="text-sm text-slate-800 hover:text-amber-600 font-medium break-all">
                  kepha384@gmail.com
                </a>
              </div>
            </div>

            {/* Carte Téléphone (Mise à jour : (+33) ...) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-amber-300 transition-all">
              <div className="p-3 bg-slate-50 rounded-lg text-slate-700">
                <Phone size={20} className="text-sky-500" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Téléphone</p>
                <p className="text-sm text-slate-800 font-medium">(+33) ...</p>
              </div>
            </div>

            {/* Carte Adresse (Mise à jour : Vandoeuvre-Lès-Nancy, France) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-amber-300 transition-all">
              <div className="p-3 bg-slate-50 rounded-lg text-slate-700">
                <MapPin size={20} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Adresse</p>
                <p className="text-sm text-slate-800 font-medium">Vandoeuvre-Lès-Nancy, France</p>
              </div>
            </div>

            {/* Carte YouTube */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-amber-300 transition-all">
              <div className="p-3 bg-slate-50 rounded-lg text-slate-700">
                <Youtube size={20} className="text-red-500" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Réseau Social</p>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-800 hover:text-red-600 font-medium flex items-center gap-1">
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