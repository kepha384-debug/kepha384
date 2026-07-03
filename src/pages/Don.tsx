import { CreditCard, Coins, Lock, Heart } from "lucide-react";

const Don = () => {
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen animate-page-fade">
      
      {/* Bannière de style AEBC */}
      <div className="relative w-full overflow-hidden bg-slate-900 py-16 md:py-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://kepha384.b-cdn.net/Images/larm-rmah-AEaTUnvneik-unsplash.jpg"
            alt="Soutenir MGTS"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-[1380px] mx-auto px-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Faire un don
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-200 max-w-2xl leading-relaxed">
            Soutenez l'œuvre et la diffusion de l'Évangile à travers les médias chrétiens
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <section className="max-w-[1380px] mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-12">
          <h2 className="text-2xl font-bold text-slate-900">
            Pourquoi soutenir Ma Grâce Te Suffit ?
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            Chaque don contribue directement au maintien technique de nos serveurs, à l'acquisition d'ouvrages pour la bibliothèque, à l'hébergement de nos flux vidéos de haute qualité, ainsi qu'au développement de nouvelles productions pour édifier la foi de milliers de personnes.
          </p>
        </div>

        {/* Grille de deux colonnes pour les méthodes de don (Cartes claires de type #FAFAFA) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Option 1 : Stripe / Bunny Mediadelivery (Lien Stripe / Carte Bancaire) */}
          <div className="bg-[#FAFAFA] p-8 rounded-xl border border-slate-200 shadow-lg flex flex-col justify-between h-full hover:border-amber-300 transition-all">
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-lg text-amber-700 w-fit">
                <CreditCard size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Don par Carte Bancaire via Stripe</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Soutenez-nous de manière simple et sécurisée avec votre carte de crédit (Visa, Mastercard, etc.). La transaction est cryptée et gérée directement par l'infrastructure sécurisée de Stripe.
              </p>
            </div>
            
            <a 
              href="https://donate.stripe.com/test_3cI00l6LL1BogTOeJw2wU00"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 w-full py-3 bg-[#635BFF] hover:bg-[#5249cf] text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm text-center"
            >
              Donner avec Stripe
            </a>
          </div>

          {/* Option 2 : PayPal */}
          <div className="bg-[#FAFAFA] p-8 rounded-xl border border-slate-200 shadow-lg flex flex-col justify-between h-full hover:border-sky-300 transition-all">
            <div className="space-y-4">
              <div className="p-3 bg-sky-50 rounded-lg text-sky-700 w-fit">
                <Coins size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Don via PayPal</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Utilisez votre solde PayPal ou votre compte bancaire lié pour effectuer votre don en quelques clics. Vous pouvez facilement planifier un don unique ou récurrent.
              </p>
            </div>
            
            <a 
              href="https://www.paypal.com" /* Remplacez par votre lien de don Paypal.me ou de bouton Paypal */
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 w-full py-3 bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm text-center"
            >
              Donner avec PayPal
            </a>
          </div>

        </div>

        {/* Section de réassurance de sécurité SSL en bas */}
        <div className="max-w-md mx-auto mt-12 p-4 bg-white border border-slate-200/80 rounded-xl flex items-center gap-3 justify-center text-xs text-slate-500">
          <Lock size={16} className="text-slate-400" />
          <span>Transactions chiffrées SSL et 100% sécurisées.</span>
        </div>

      </section>
    </div>
  );
};

export default Don;