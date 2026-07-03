const Legal = () => {
  return (
    /* Version Claire : Fond gris clair doux (slate-50) et texte sombre */
    <div className="bg-slate-50 text-slate-800 min-h-screen animate-page-fade">
      
      {/* Bannière de style AEBC (Le bandeau du haut reste sombre pour épouser la navbar) */}
      <div className="relative w-full overflow-hidden bg-slate-900 py-16 md:py-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://kepha384.b-cdn.net/Logos%20%26%20Banni%C3%A8res/aaron-burden-535Npq1wFG8-unsplash.jpg"
            alt="Mentions légales et confidentialité"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 max-w-[1380px] mx-auto px-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Mentions Légales & Confidentialité
          </h1>
          <p className="mt-4 text-sm md:text-base text-slate-200 max-w-2xl leading-relaxed">
            Informations officielles et politique de protection des données de MGTS
          </p>
        </div>
      </div>

      {/* Contenu principal : Simple texte fluide sans aucune carte ni encadré */}
      <section className="max-w-[1380px] mx-auto px-6 py-16 space-y-16">

        {/* ========================================== */}
        {/* PARTIE 1 : MENTIONS LÉGALES               */}
        {/* ========================================== */}
        <div className="space-y-6 max-w-4xl">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight border-b border-slate-200 pb-3">
            Mentions Légales – MGTS (Ma Grâce Te Suffit)
          </h2>
          
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            MGTS – Ma Grâce Te Suffit est une plateforme multimédia chrétienne dédiée à la diffusion de films, documentaires, audios, livres et images chrétiennes.
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Éditeur du site</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-600 pl-4 list-disc">
                <li><span className="font-semibold text-slate-700">Identité :</span> MGTS – Ma Grâce Te Suffit</li>
                <li><span className="font-semibold text-slate-700">Responsable de publication :</span> Julien</li>
                <li><span className="font-semibold text-slate-700">Adresse :</span> Nancy, France</li>
                <li><span className="font-semibold text-slate-700">Contact :</span> <a href="mailto:kepha384@gmail.com" className="text-amber-600 hover:underline">kepha384@gmail.com</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mt-6">Hébergement</h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                Le site est hébergé par la société <span className="font-semibold text-slate-700">Bunny Way d.o.o. (Bunny.net)</span>, service de CDN et d’hébergement situé en Slovénie (Europe).
                <br />Site officiel : <a href="https://bunny.net" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">https://bunny.net</a>
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mt-6">Objet du site</h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                MGTS propose des contenus multimédias chrétiens destinés à l’édification, l’enseignement et l’inspiration. Les ressources diffusées sont sélectionnées pour leur valeur spirituelle et leur conformité aux principes de la foi chrétienne.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mt-6">Propriété intellectuelle</h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                L’ensemble des contenus présents sur MGTS (textes, images, vidéos, logos, ressources multimédias) sont protégés par les lois relatives à la propriété intellectuelle. Toute reproduction, diffusion ou modification non autorisée est interdite.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mt-6">Responsabilité</h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                MGTS s’efforce de fournir des contenus fiables et de qualité. Cependant, l’éditeur ne peut être tenu responsable en cas d’erreur, d’interruption, ou de dysfonctionnement du site.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mt-6">Liens externes</h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                Le site peut contenir des liens vers des plateformes tierces (YouTube, Instagram, Facebook…). MGTS n’est pas responsable du contenu publié sur ces plateformes.
              </p>
            </div>
          </div>
        </div>

        {/* Ligne de séparation fine et épurée entre les deux parties */}
        <hr className="border-slate-200 max-w-4xl" />

        {/* ========================================== */}
        {/* PARTIE 2 : POLITIQUE DE CONFIDENTIALITÉ     */}
        {/* ========================================== */}
        <div className="space-y-6 max-w-4xl pt-4">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight border-b border-slate-200 pb-3">
            Politique de confidentialité – MGTS (Ma Grâce Te Suffit)
          </h2>
          
          <p className="text-sm text-slate-600 leading-relaxed">
            Cette politique explique comment MGTS collecte, utilise et protège les données des utilisateurs de la plateforme.
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Collecte des données</h3>
              <p className="mt-1 text-sm text-slate-600 mb-2">MGTS peut collecter les informations suivantes :</p>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-600 pl-4">
                <li>Données fournies via les formulaires (contact, dons, inscriptions).</li>
                <li>Adresse email lors de l’envoi d’un message ou d’un formulaire.</li>
                <li>Données techniques : adresse IP, type de navigateur, pages consultées.</li>
                <li>
                  Données liées aux paiements (via Stripe, PayPal…) :{" "}
                  <span className="italic">Ces données sont traitées uniquement par les services de paiement sécurisés partenaires et ne sont jamais stockées ni conservées par MGTS.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mt-6">Utilisation des données</h3>
              <p className="mt-1 text-sm text-slate-600 mb-2">Les données collectées servent exclusivement à :</p>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-600 pl-4">
                <li>Répondre aux demandes de contact ou d'intercession.</li>
                <li>Gérer et valider les dons et contributions de soutien.</li>
                <li>Améliorer la qualité des diffusions et de nos services en ligne.</li>
                <li>Assurer la sécurité de la plateforme.</li>
                <li>Produire des statistiques anonymes de fréquentation.</li>
              </ul>
              <p className="mt-3 text-sm text-slate-600 font-semibold italic">
                MGTS ne vend, ne partage et ne transmet aucune donnée personnelle à des tiers non autorisés.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mt-6">Cookies</h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                Le site peut utiliser des cookies pour améliorer votre confort d'utilisation, analyser l’audience générale de nos pages et sécuriser les sessions actives. Vous pouvez configurer et désactiver les cookies directement dans les paramètres de votre propre navigateur internet.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mt-6">Services tiers</h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                MGTS intègre des services externes de confiance pour son fonctionnement :
                <br />• YouTube (hébergement et lecture des vidéos)
                <br />• Stripe et PayPal (passerelles de paiements sécurisés)
                <br />• Bunny.net (hébergement web et réseau de diffusion CDN)
                <br />
                <span className="text-xs text-slate-400 italic">Ces services tiers peuvent collecter leurs propres données techniques selon leurs politiques de confidentialité respectives.</span>
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mt-6">Sécurité des données</h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                MGTS applique des protocoles et mesures de protection techniques adaptés pour préserver vos données contre tout accès non autorisé, perte accidentelle, modification ou divulgation.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mt-6">Droits des utilisateurs</h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed mb-2">
                Conformément au RGPD et aux lois sur la protection des données, vous disposez des droits suivants : d’accès, de rectification, de suppression, d’opposition et de portabilité de vos données personnelles.
              </p>
              <p className="text-sm text-slate-700">
                <span className="font-semibold text-slate-800">Pour exercer vos droits :</span>{" "}
                <a href="mailto:mgts.contact@gmail.com" className="text-amber-600 hover:text-amber-700 font-semibold">
                  mgts.contact@gmail.com
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mt-6">Modification de la politique</h3>
              <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                MGTS se réserve le droit de mettre à jour cette politique de confidentialité à tout moment. La version la plus récente reste consultable sur cette même page.
              </p>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default Legal;