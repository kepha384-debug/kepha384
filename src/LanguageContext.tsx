
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { withRetry } from "./lib/geminiRetry";

export type Language = 'fr' | 'en' | 'pt' | 'es' | 'de' | 'it' | 'la' | 'el' | 'ln' | 'kg' | 'wo' | 'hi' | 'ja' | 'ko' | 'sw' | 'rw' | 'am' | 'iw' | 'ar' | 'ru' | 'zh-CN';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateDynamic: (text: string | string[], sourceLang?: string) => Promise<string | string[]>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Simple translation dictionary for UI elements
const translations: Record<Language, Record<string, string>> = {
  fr: {
    'logo.title': 'MGTS',
    'logo.subtitle': 'Ma Grâce Te Suffit',
    'verse.day_title': 'VERSET DU JOUR',
    'verse.reflection_label': 'Réflexion :',
    'legal.mentions_title': 'Mentions Légales',
    'legal.privacy_title': 'Politique de Confidentialité',
    'legal.editor_title': 'Éditeur du site',
    'legal.editor_text': 'Le site "Ma Grâce Te Suffit" est édité par l\'association MGTS, dédiée à la diffusion de contenus spirituels et bibliques.',
    'legal.hosting_title': 'Hébergement',
    'legal.hosting_text': 'Ce site est hébergé sur des serveurs sécurisés garantissant la disponibilité et la protection des données.',
    'legal.intellectual_title': 'Propriété intellectuelle',
    'legal.intellectual_text': 'L\'ensemble des contenus (textes, vidéos, images) présents sur ce site sont la propriété de MGTS ou font l\'objet d\'une autorisation d\'utilisation. Toute reproduction est interdite sans accord préalable.',
    'legal.data_collection_title': 'Collecte des données',
    'legal.data_collection_text': 'Nous collectons uniquement les données nécessaires au bon fonctionnement du site (ex: email pour la newsletter).',
    'legal.data_usage_title': 'Utilisation des données',
    'legal.data_usage_text': 'Vos données ne sont jamais vendues à des tiers. Elles sont utilisées exclusivement pour vous informer de nos nouvelles publications.',
    'legal.rights_title': 'Vos droits',
    'legal.rights_text': 'Conformément au RGPD, vous disposez d\'un droit d\'accès, de rectification et de suppression de vos données personnelles.',
    'admin.edit': 'Modifier',
    'admin.delete': 'Supprimer',
    'admin.save': 'Sauvegarder',
    'admin.move_left': 'Déplacer à gauche',
    'admin.move_right': 'Déplacer à droite',
    'admin.placeholder_title': 'Titre...',
    'admin.placeholder_subtitle': 'Sous-titre...',
    'admin.placeholder_desc': 'Description...',
    'admin.placeholder_image': 'URL de l\'image...',
    'admin.placeholder_content': 'URL du contenu (vidéo, livre...)',
    'comments.default1_author': 'Marie L.',
    'comments.default1_text': 'Une plateforme magnifique, merci pour ce travail d\'édification !',
    'comments.default1_date': 'Il y a 2 jours',
    'comments.default2_author': 'Jean-Pierre',
    'comments.default2_text': 'Les films bibliques sont de très bonne qualité. Que Dieu vous bénisse.',
    'comments.default2_date': 'Il y a 5 jours',
    'verse.1.text': "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
    'verse.1.ref': 'Jean 3:16',
    'verse.1.reflection': "Ce verset est le cœur de l'Évangile. Il nous rappelle l'immensité de l'amour de Dieu qui a tout donné pour nous offrir la vie.",
    'verse.2.text': 'Je puis tout par celui qui me fortifie.',
    'verse.2.ref': 'Philippiens 4:13',
    'verse.2.reflection': 'Notre force ne vient pas de nous-mêmes, mais de Christ qui habite en nous et nous rend capables de surmonter tous les défis.',
    'verse.3.text': "L'Éternel est mon berger: je ne manquerai de rien.",
    'verse.3.ref': 'Psaume 23:1',
    'verse.3.reflection': 'Comme un berger prend soin de ses brebis, Dieu veille sur chaque détail de notre vie avec tendresse et fidélité.',
    'verse.4.text': "Ne t'ai-je pas donné cet ordre: Fortifie-toi et prends courage? Ne t'effraie point et ne t'épouvante point, car l'Éternel, ton Dieu, est avec toi dans tout ce que tu entreprendras.",
    'verse.4.ref': 'Josué 1:9',
    'verse.4.reflection': "Le courage n'est pas l'absence de peur, mais la confiance absolue en la présence de Dieu qui nous accompagne partout.",
    'verse.5.text': "Ma grâce te suffit, car ma puissance s'accomplit dans la faiblesse.",
    'verse.5.ref': '2 Corinthiens 12:9',
    'verse.5.reflection': "C'est dans nos moments de plus grande faiblesse que la force de Dieu brille le plus. Sa grâce est tout ce dont nous avons besoin.",
    'verse.6.text': "Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse.",
    'verse.6.ref': 'Proverbes 3:5',
    'verse.6.reflection': "Lâcher prise sur notre propre compréhension pour faire confiance au plan parfait de Dieu est le chemin de la vraie paix.",
    'verse.7.text': "Demandez, et l'on vous donnera; cherchez, et vous trouverez; frappez, et l'on vous ouvrira.",
    'verse.7.ref': 'Matthieu 7:7',
    'verse.7.reflection': 'Dieu nous invite à une relation active avec Lui. Il est attentif à nos prières et prêt à nous répondre avec générosité.',
    'nav.home': 'Accueil',
    'nav.sections': 'Sections',
    'nav.cinema': 'Cinéma',
    'nav.bible_history': 'Histoire Biblique',
    'nav.christian_history': 'Histoire chrétienne & Documentaire',
    'nav.animation': 'Dessin animé',
    'nav.audio': 'Audio',
    'nav.library': 'Bibliothèque',
    'nav.gallery': 'Galerie',
    'nav.testimonials': 'Témoignages',
    'nav.footer': 'Pied de page',
    'nav.contact': 'Contact',
    'nav.prayer': 'Prière',
    'nav.about': 'À propos',
    'nav.donate': 'Faire un don',
    'nav.share': 'Partager le site',
    'nav.translate': 'Traduire',
    'bible.version_label': 'Version Darby 1890',
    'bible.search_book': 'Rechercher un livre...',
    'bible.search_verse_placeholder': 'Rechercher un verset dans la Bible',
    'bible.compare': 'Comparer',
    'bible.strongs': 'Strongs',
    'bible.chapter_label': 'chapitre',
    'bible.translation.louis_segond': 'Darby 1890',
    'bible.translation.semeur': 'Semeur',
    'bible.translation.segond_21': 'Segond 21',
    'bible.translation.martin': 'Martin',
    'bible.translation.darby': 'Darby',
    'bible.translation.ostervald': 'Ostervald',
    'bible.translation.king_james': 'King-James',
    'bible.no_book_found': 'Aucun livre trouvé',
    'bible.reading_mode': 'Mode lecture',
    'bible.read_aloud': 'Lire à haute voix',
    'bible.pause': 'Pause',
    'bible.stop_reading': 'Arrêter la lecture',
    'bible.error_timeout': 'Le chargement est trop long. Veuillez réessayer.',
    'bible.error_not_found': 'Ce chapitre n\'existe pas.',
    'bible.copy': 'Copier',
    'bible.copied': 'Copié !',
    'search.placeholder': 'Rechercher...',
    'hero.title_part1': 'Ma Grâce',
    'hero.title_part2': 'Te Suffit',
    'hero.description': 'Découvrez la Parole de Dieu à travers une expérience multimédia unique et inspirante.',
    'hero.start': 'Commencer l\'exploration',
    'section.biblical_movies': 'Films',
    'section.other_movies': 'Documentaires & Témoignages',
    'section.animated_movies': 'Dessins Animés',
    'section.multimedia': 'Multimédia & Audio',
    'section.books': 'Bibliothèque Numérique',
    'section.images': 'Galerie d\'Images',
    'media.listen': 'ÉCOUTER',
    'media.watch': 'REGARDER',
    'media.read': 'LIRE',
    'media.view': 'VISIONNER',
    'media.open': 'OUVRIR',
    'media.enlarge': 'AGRANDIR',
    'media.new': 'Nouveau',
    'type.movie': 'Film',
    'type.video': 'Vidéo',
    'type.book': 'Livre',
    'type.image': 'Image',
    'type.audio': 'Audio',
    'admin.title': 'Espace Administrateur',
    'admin.desc': 'Connectez-vous avec Google pour accéder au mode édition.',
    'admin.google': 'Continuer avec Google',
    'admin.or_code': 'Ou avec code',
    'admin.code_placeholder': 'Code d\'accès',
    'admin.verify': 'Vérifier le code',
    'admin.error': 'Code incorrect.',
    'contact.title': 'Écrivez-nous',
    'contact.desc': 'Nous sommes à votre écoute pour toute demande, prière ou témoignage.',
    'contact.label_name': 'Votre Nom',
    'contact.placeholder_name': 'Ex: Jean l\'Évangéliste',
    'contact.label_email': 'Votre Adresse E-mail',
    'contact.label_subject': 'Sujet du message',
    'contact.placeholder_subject': 'Demande de prière, témoignage...',
    'contact.label_message': 'Votre Message',
    'contact.placeholder_message': 'Que la paix du Seigneur soit avec vous...',
    'contact.send': 'Envoyer mon message',
    'contact.sending': 'Envoi en cours...',
    'contact.success_title': 'Message bien reçu',
    'contact.success_msg1': 'Nous avons le plaisir de vous confirmer que votre message a bien été transmis à notre équipe.',
    'contact.success_msg2': 'Soyez assuré qu\'une réponse vous sera adressée dans les plus brefs délais sur votre boîte mail.',
    'contact.success_msg3': 'Que la paix du Seigneur vous accompagne.',
    'contact.error_title': 'Échec de l\'envoi',
    'contact.error_msg': 'Une erreur technique est survenue. Veuillez vérifier votre connexion Internet ou nous contacter directement par e-mail.',
    'contact.retry': 'Réessayer le formulaire',
    'contact.direct_email': 'Vous pouvez également nous écrire directement à cette adresse e-mail :',
    'contact.modal_title': 'Contactez-nous',
    'contact.modal_desc': 'Une question, une suggestion ou une demande de prière ? Nous sommes à votre écoute.',
    'contact.success_title_short': 'Message envoyé !',
    'contact.success_desc_short': 'Nous vous répondrons dans les plus brefs délais.',
    'contact.label_name_full': 'Nom complet',
    'contact.placeholder_name_full': 'Votre nom...',
    'contact.label_email_full': 'Email',
    'contact.placeholder_email_full': 'votre@email.com',
    'contact.label_subject_full': 'Sujet',
    'contact.subject_general': 'Question générale',
    'contact.subject_prayer': 'Demande de prière',
    'contact.subject_suggestion': 'Suggestion de contenu',
    'contact.subject_technical': 'Problème technique',
    'contact.label_message_full': 'Message',
    'contact.placeholder_message_full': 'Votre message ici...',
    'contact.send_btn': 'Envoyer le message',
    'donation.title': 'Soutenir l\'œuvre',
    'prayer.title': 'Demande de Prière',
    'prayer.intro': 'Confiez-nous vos intentions. Notre communauté de prière se joindra à vous dans la foi.',
    'prayer.request_label': 'Votre Intention',
    'prayer.placeholder': 'Décrivez votre besoin de prière...',
    'prayer.success_title': 'Demande Envoyée',
    'prayer.success_msg': 'Nous prions pour vous. Que Dieu vous bénisse.',
    'donation.desc': 'Votre contribution finance l\'hébergement et la diffusion de la Parole de Dieu.',
    'donation.securing': 'Sécurisation du don',
    'donation.connecting': 'Connexion sécurisée en cours...',
    'donation.redirecting': 'Redirection vers l\'interface Stripe cryptée',
    'donation.card': 'Carte Bancaire',
    'donation.via_stripe': 'Via Stripe',
    'donation.quick_donation': 'Don Rapide',
    'donation.verse': '"Donnez, et il vous sera donné." Luc 6:38.',
    'donation.amount_choice': 'Vous pourrez choisir le montant de votre don directement sur l\'interface sécurisée.',
    'donation.secure_payment': 'Paiement 100% sécurisé • Ma Grâce Te Suffit',
    'donation.modal_title': 'Soutenir notre mission',
    'donation.modal_desc': 'Votre don nous aide à maintenir cette plateforme gratuite et à diffuser la Parole de Dieu partout dans le monde.',
    'donation.label_amount': 'Choisir un montant (€)',
    'donation.other_amount': 'Autre',
    'donation.placeholder_amount': 'Entrez le montant...',
    'donation.pay_card': 'Payer par Carte Bancaire',
    'donation.pay_paypal': 'Payer avec PayPal',
    'about.title': 'À Propos',
    'about.subtitle': 'MGTS — Ma Grâce Te Suffit',
    'about.intro_bold': 'MGTS (Ma Grâce Te Suffit)',
    'about.intro_text': 'est une plateforme multimédia dédiée à la diffusion de la Parole de Dieu et à l\'édification spirituelle des croyants à travers le monde.',
    'about.mission_title': 'Notre Mission',
    'about.mission_desc': 'Offrir un accès gratuit et universel à des ressources bibliques de qualité : films, documentaires, livres et enseignements audio.',
    'about.vision_title': 'Notre Vision',
    'about.vision_desc': 'Utiliser les technologies modernes pour rendre la Bible vivante et accessible à tous, quelle que soit leur langue ou leur situation géographique.',
    'about.verse': '"Allez par tout le monde, et prêchez la bonne nouvelle à toute la création." — Marc 16:15',
    'about.who_title': 'Qui sommes-nous ?',
    'about.who_desc': 'Ma Grâce Te Suffit (MGTS) est une plateforme chrétienne indépendante née de la volonté de rendre accessible au plus grand nombre la Parole de Dieu et des contenus multimédias de qualité.',
    'about.vision_desc_full': 'Nous croyons que le numérique est un outil puissant pour l\'évangélisation et l\'édification. Notre plateforme regroupe des films bibliques, des documentaires, des livres et une Bible interactive pour nourrir votre foi au quotidien.',
    'about.free_title': 'Gratuité et Engagement',
    'about.free_desc': 'L\'accès à la plateforme est entièrement gratuit. Nous fonctionnons grâce aux dons de notre communauté, ce qui nous permet de maintenir le site sans publicité et de continuer à enrichir notre catalogue.',
    'about.community_join': 'Rejoignez les milliers de croyants qui utilisent notre plateforme chaque jour.',
    'video.close': 'Fermer le lecteur vidéo',
    'video.player_title': 'Lecteur Vidéo',
    'video.error': 'Format de vidéo non supporté ou lien incorrect.',
    'bible.version': 'Version',
    'bible.book': 'Livre',
    'bible.verse': 'Verset',
    'bible.listen': 'Lecture Audio',
    'bible.stop': 'Arrêter',
    'footer.description': 'Une plateforme dédiée à la diffusion de la Parole de Dieu à travers des médias inspirants, des films bibliques et des ressources spirituelles pour tous.',
    'footer.nav_title': 'Navigation',
    'footer.resources_title': 'Ressources',
    'footer.newsletter_title': 'Newsletter',
    'footer.newsletter_desc': 'Restez informé de nos nouvelles publications.',
    'footer.newsletter_placeholder': 'Votre email...',
    'footer.copyright': 'Tous droits réservés.',
    'footer.legal': 'Mentions Légales',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.admin_logout': 'Déconnexion',
    'footer.admin_reset': 'Réinitialiser',
    'footer.admin_tooltip': 'Connexion Admin',
    'hero.placeholder.url': "URL de l'image...",
    'hero.button.pc': 'PC',
    'hero.button.link': 'Lien',
    'hero.tooltip.upload_pc': 'Télécharger une image depuis mon PC',
    'hero.tooltip.change_link': "Changer le lien de l'image",
    'hero.tooltip.delete_local': "Supprimer l'image locale",
    'admin.modal.title': 'Espace Administrateur',
    'admin.modal.desc': "Veuillez saisir votre mot de passe pour accéder aux fonctions d'édition.",
    'admin.modal.password': 'Mot de passe',
    'admin.modal.error': 'Mot de passe incorrect',
    'admin.modal.submit': 'Se connecter',
    'content.button.read': 'Lire le livre',
    'content.button.listen': 'Écouter',
    'content.button.watch': 'Regarder',
    'content.button.subtitles': 'Sous-titres',
    'footer.resources_movies': 'Films Bibliques',
    'footer.resources_books': 'Livres & Bibles',
    'footer.resources_docs': 'Documentaires',
    'footer.resources_kids': 'Espace Enfants',
    'bible.loading': 'Ouverture du manuscrit...',
    'bible.error': 'Erreur de connexion.',
    'bible.loading_msg': 'Chargement de la Parole...',
    'bible.error_msg': 'Impossible de charger le chapitre. Veuillez vérifier votre connexion.',
    'bible.retry': 'Réessayer',
    'bible.chapter': 'Chapitre',
    'bible.end_chapter': 'Fin du chapitre',
    'bible.prev': 'Précédent',
    'bible.next': 'Suivant',
    'bible.instruction': 'Cliquez sur un verset pour le sélectionner',
    'bible.holy_bible': 'Sainte Bible',
    'bible.book.genesis': 'Genèse',
    'bible.book.exodus': 'Exode',
    'bible.book.leviticus': 'Lévitique',
    'bible.book.numbers': 'Nombres',
    'bible.book.deuteronomy': 'Deutéronome',
    'bible.book.joshua': 'Josué',
    'bible.book.judges': 'Juges',
    'bible.book.ruth': 'Ruth',
    'bible.book.1 samuel': '1 Samuel',
    'bible.book.2 samuel': '2 Samuel',
    'bible.book.1 kings': '1 Rois',
    'bible.book.2 kings': '2 Rois',
    'bible.book.1 chronicles': '1 Chroniques',
    'bible.book.2 chronicles': '2 Chroniques',
    'bible.book.ezra': 'Esdras',
    'bible.book.nehemiah': 'Néhémie',
    'bible.book.esther': 'Esther',
    'bible.book.job': 'Job',
    'bible.book.psalms': 'Psaumes',
    'bible.book.proverbs': 'Proverbes',
    'bible.book.ecclesiastes': 'Ecclésiaste',
    'bible.book.song of solomon': 'Cantique des Cantiques',
    'bible.book.isaiah': 'Ésaïe',
    'bible.book.jeremiah': 'Jérémie',
    'bible.book.lamentations': 'Lamentations',
    'bible.book.ezekiel': 'Ézéchiel',
    'bible.book.daniel': 'Daniel',
    'bible.book.hosea': 'Osée',
    'bible.book.joel': 'Joël',
    'bible.book.amos': 'Amos',
    'bible.book.obadiah': 'Abdias',
    'bible.book.jonah': 'Jonas',
    'bible.book.micah': 'Michée',
    'bible.book.nahum': 'Nahum',
    'bible.book.habakkuk': 'Habacuc',
    'bible.book.zephaniah': 'Sophonie',
    'bible.book.haggai': 'Aggée',
    'bible.book.zechariah': 'Zacharie',
    'bible.book.malachi': 'Malachie',
    'bible.book.matthew': 'Matthieu',
    'bible.book.mark': 'Marc',
    'bible.book.luke': 'Luc',
    'bible.book.john': 'Jean',
    'bible.book.acts': 'Actes',
    'bible.book.romans': 'Romains',
    'bible.book.1 corinthians': '1 Corinthiens',
    'bible.book.2 corinthians': '2 Corinthiens',
    'bible.book.galatians': 'Galates',
    'bible.book.ephesians': 'Éphésiens',
    'bible.book.philippians': 'Philippiens',
    'bible.book.colossians': 'Colossiens',
    'bible.book.1 thessalonians': '1 Thessaloniciens',
    'bible.book.2 thessalonians': '2 Thessaloniciens',
    'bible.book.1 timothy': '1 Timothée',
    'bible.book.2 timothy': '2 Timothée',
    'bible.book.titus': 'Tite',
    'bible.book.philemon': 'Philémon',
    'bible.book.hebrews': 'Hébreux',
    'bible.book.james': 'Jacques',
    'bible.book.1 peter': '1 Pierre',
    'bible.book.2 peter': '2 Pierre',
    'bible.book.1 john': '1 Jean',
    'bible.book.2 john': '2 Jean',
    'bible.book.3 john': '3 Jean',
    'bible.book.jude': 'Jude',
    'bible.book.revelation': 'Apocalypse',
    'book.thought': 'Pensée',
    'book.go_to': 'Aller à...',
    'book.no_content': 'Contenu absent.',
    'media.title.m1': 'La Passion du Christ',
    'media.subtitle.m1': 'Hébreu / Araméen',
    'media.desc.m1': 'Les dernières heures de Jésus-Christ, réalisé par Mel Gibson. Un témoignage puissant de sacrifice.',
    'media.title.m_esther': 'Esther',
    'media.subtitle.m_esther': 'L\'étoile de Perse',
    'media.desc.m_esther': 'La reine Esther risque sa vie pour sauver le peuple juif du massacre.',
    'media.title.m_jeremie': 'Jérémie',
    'media.subtitle.m_jeremie': 'Le prophète pleureur',
    'media.desc.m_jeremie': 'L\'appel de Jérémie pour porter le message de Dieu à Jérusalem.',
    'media.title.m_samson': 'Samson',
    'media.subtitle.m_samson': 'La Force de Dieu',
    'media.desc.m_samson': 'L\'histoire épique du juge Samson, sa force légendaire et sa rédemption finale.',
    'media.title.m_noah': 'Noé',
    'media.subtitle.m_noah': 'L\'Arche du Salut',
    'media.desc.m_noah': 'Le récit biblique du déluge, de la foi de Noé et de l\'alliance de Dieu avec l\'humanité.',
    'media.title.v_tem_1': 'Le Saint Suaire',
    'media.subtitle.v_tem_1': 'Documentaire',
    'media.desc.v_tem_1': "Une exploration fascinante du Saint Suaire de Turin, l'énigme la plus étudiée de l'histoire, qui témoigne silencieusement de la Passion du Christ.",
    'media.title.v_papes_1': 'Les Évêques de Rome',
    'media.subtitle.v_papes_1': 'Histoire des Papes',
    'media.desc.v_papes_1': "Un documentaire historique retraçant la lignée des successeurs de Pierre et l'évolution de la papauté à travers les siècles, de l'Église primitive à nos jours.",
    'media.title.v_prophetie_1': 'La Prophétie des Papes',
    'media.subtitle.v_prophetie_1': 'Saint Malachie',
    'media.desc.v_prophetie_1': "Découvrez le mystère des prophéties attribuées à Saint Malachie, détaillant une suite de devises latines correspondant à chaque pape jusqu'à la fin des temps.",
    'media.title.a1': 'Superbook',
    'media.subtitle.a1': 'Aventures Bibliques',
    'media.desc.a1': 'Chris, Joie et leur robot Gizmo voyagent dans le temps pour vivre les plus grandes histoires de la Bible.',
    'media.title.v_tob_emission': 'Émission proposée par : Virginia Crespeau',
    'media.subtitle.v_tob_emission': 'TOB : Traduction Oecuménique de la Bible',
    'media.desc.v_tob_emission': 'La nouvelle édition de la TOB, Traduction Oecuménique de la Bible présentée par Sophie Stavrou pour l’orthodoxie, et Bernard Coyault, pour le protestantisme.',
    'media.title.b_kjv': 'Sainte Bible (KJV)',
    'media.subtitle.b_kjv': 'Audio synchronisé',
    'media.desc.b_kjv': 'La Parole de Dieu dans une expérience interactive unique. Utilisez le sélecteur de langue en haut du site pour traduire instantanément les textes sacrés et profiter d\'une lecture audio intelligente, parfaitement synchronisée avec la voix de la langue de traduction choisie.',
    'media.title.b_tob_at': 'Ancien Testament (TOB)',
    'media.subtitle.b_tob_at': 'Bible Oecuménique',
    'media.desc.b_tob_at': 'La Traduction Oecuménique de la Bible : Ancien Testament.',
    'media.title.b_tob_nt': 'Nouveau Testament (TOB)',
    'media.subtitle.b_tob_nt': 'Bible Oecuménique',
    'media.desc.b_tob_nt': 'La Traduction Oecuménique de la Bible : Nouveau Testament.',
    'media.title.b_drive_new': 'Ancien & Nouveau Testament',
    'media.subtitle.b_drive_new': 'Traduction André Chouraqui',
    'media.desc.b_drive_new': "La traduction d'André Chouraqui : une œuvre monumentale qui s'attache à restituer le souffle original et la saveur hébraïque des textes sacrés, offrant une lecture renouvelée et poétique de la Parole de Dieu.",
    'media.title.b_imitation_jc': 'L\'Imitation de Jésus-Christ',
    'media.subtitle.b_imitation_jc': 'Thomas a Kempis',
    'media.desc.b_imitation_jc': "L'un des livres de dévotion chrétienne les plus lus au monde après la Bible. Un guide spirituel profond pour suivre les pas du Sauveur.",
    'media.title.b_voyage_pelerin': 'Le Voyage du Pèlerin',
    'media.subtitle.b_voyage_pelerin': 'John Bunyan',
    'media.desc.b_voyage_pelerin': "L'allégorie chrétienne classique de John Bunyan, retraçant le voyage spirituel de Chrétien vers la Cité Céleste. Un chef-d'œuvre de la littérature spirituelle mondiale.",
    'media.title.i_vm': 'La Vierge Marie',
    'media.subtitle.i_vm': 'Mère de Dieu',
    'media.title.i_ej': 'L\'Enfant Jésus',
    'media.subtitle.i_ej': 'Dieu fait homme',
    'media.title.i_jc_titles_main': 'Jésus-Christ',
    'media.subtitle.i_jc_titles_main': 'Souveraineté Divine',
    'media.title.i_sj': 'Saint Jean',
    'media.subtitle.i_sj': 'Le Disciple Bien‑Aimé',
    'media.title.i_sp': 'Saint Pierre',
    'media.subtitle.i_sp': 'Prince des Apôtres',
    'media.title.i_pa': 'Saint Paul',
    'media.subtitle.i_pa': 'Apôtre des Nations',
    'media.title.i_st': 'Le Saint Suaire',
    'media.subtitle.i_st': 'Suaire de Turin',
    'media.title.i_jn_scene': 'Jésus et Nathanaël',
    'media.subtitle.i_jn_scene': 'La vision de la vérité',
    'media.title.i_st_jacques': 'Saint Jacques',
    'media.subtitle.i_st_jacques': 'Le Frère du Seigneur',
    'media.desc.i_vm': `**24 titres clés de la Vierge Marie (avec descriptions)**

1. Théotokos (Mère de Dieu)
Dogme proclamé au Concile d’Éphèse (431).
Affirme que Marie est la mère de la Personne divine incarnée.

2. Immaculée Conception
Marie a été conçue sans le péché originel.

3. Assomption
Marie est élevée corps et âme au ciel à la fin de sa vie terrestre.

4. Vierge Perpétuelle
Marie est restée vierge avant, pendant et après la naissance de Jésus.

5. Mère du Christ
Elle est la mère du Messie annoncé par les prophètes.

6. Mère du Sauveur
Elle donne naissance à celui qui apporte le salut au monde.

7. Mère de l’Église
Marie est mère spirituelle de tous les croyants.

8. Co‑Rédemptrice
Marie coopère au salut par son « oui » et sa présence au pied de la Croix.

9. Médiatrice de toutes grâces
Marie intercède et transmet les grâces reçues du Christ.

10. Avocate
Marie plaide pour les croyants devant Dieu le Fils.

11. Étoile de la Mer (Stella Maris)
Marie guide les chrétiens dans les tempêtes de la vie.

12. Reine du Ciel
Marie est honorée comme reine en raison de sa maternité divine.

13. Nouvelle Ève
Comme Ève a participé à la chute, Marie participe à la rédemption.

14. Arche de la Nouvelle Alliance
Marie porte en elle Jésus, la Parole vivante.

15. Porte du Ciel (Porta Caeli)
Marie est la porte par laquelle Dieu entre dans le monde.

16. Rose Mystique
Symbole de beauté, pureté et mystère de la grâce.

17. Tour d’Ivoire
Évoque la force, la pureté et la dignité.

18. Maison d’Or
Symbolise la splendeur intérieure de Marie habitée par Dieu.

19. Notre‑Dame (Domina Nostra)
Exprime la seigneurie spirituelle et la protection maternelle.

20. Reine du Rosaire
Marie conduit à la contemplation des mystères du Christ.

21. Secours des Chrétiens
Marie est invoquée comme protectrice du peuple chrétien.

22. Consolatrice des Affligés
Marie apaise les souffrances et accompagne les cœurs blessés.

23. Refuge des Pécheurs
Marie accueille ceux qui cherchent la miséricorde divine.

24. Mère du Bon Conseil
Marie éclaire les décisions difficiles et guide les consciences.

Tableau récapitulatif des 24 titres de la Vierge Marie
N°|Titre marial|Nature|Sens / Description essentielle
1|**Théotokos (Mère de Dieu)**|Dogme|Marie est la mère de la Personne divine incarnée.
2|**Immaculée Conception**|Dogmatique|Marie est conçue sans péché originel.
3|**Assomption**|Dogme|Marie est élevée corps et âme au ciel.
4|**Vierge Perpétuelle**|Tradition|Virginité avant, pendant et après la naissance de Jésus.
5|**Mère du Christ**|Scripturaire|Mère du Messie annoncé par les prophètes.
6|**Mère du Sauveur**|Scripturaire|Mère de celui qui apporte le salut au monde.
7|**Mère de l’Église**|Magistère|Mère spirituelle de tous les croyants.
8|**Co-Rédemptrice**|Théologie|Coopération unique au salut par son « oui ».
9|**Médiatrice de toutes grâces**|Théologie|Marie intercède et transmet les grâces.
10|**Avocate**|Dogme|Marie plaide pour les croyants devant Dieu.
11|**Étoile de la Mer**|Tradition|Marie guide dans les tempêtes de la vie.
12|**Reine du Ciel**|Dogme|Honorée comme reine par sa maternité divine.
13|**Nouvelle Ève**|Théologie|Participe à la rédemption comme Ève à la chute.
14|**Arche de la Nouvelle Alliance**|Biblique|Porte en elle Jésus, la Parole vivante.
15|**Porte du Ciel**|Tradition|Porte par laquelle Dieu entre dans le monde.
16|**Rose Mystique**|Spirituel|Beauté, pureté et mystère de la grâce.
17|**Tour d’Ivoire**|Biblique|Force, pureté et dignité.
18|**Maison d’Or**|Symbolique|Splendeur intérieure habitée par Dieu.
19|**Notre‑Dame**|Dévotion|Seigneurie spirituelle et protection maternelle.
20|**Reine du Rosaire**|Spirituel|Conduit à la contemplation des mystères du Christ.
21|**Secours des Chrétiens**|Tradition|Protectrice du peuple chrétien.
22|**Consolatrice des Affligés**|Pastorale|Apaise les souffrances et accompagne les cœurs.
23|**Refuge des Pécheurs**|Spirituel|Accueille ceux qui cherchent la miséricorde.
24|**Mère du Bon Conseil**|Pastorale|Éclaire les décisions et guide les consciences.`,
    'media.desc.i_ej': `**12 titres de l’Enfant Jésus (avec descriptions)**

1. Enfant Jésus
Le Verbe incarné dans la fragilité d’un enfant.

2. Emmanuel (« Dieu avec nous »)
Dieu se rend présent au milieu des hommes dès la naissance.

3. Prince de la Paix
L’enfant annoncé par Isaïe 9, porteur de la paix divine.

4. Lumière des Nations
Syméon reconnaît en lui la lumière destinée à tous les peuples.

5. Sauveur Nouveau‑Né
Le salut entre dans l’histoire sous forme d’enfant.

6. Fils de David
Héritier royal, accomplissant la promesse faite à David.

7. Fils du Très‑Haut
Origine divine de l’enfant révélée à l’Annonciation.

8. Roi des Juifs
Reconnu comme roi par les Mages dès sa naissance.

9. Verbe fait Enfant
La Parole éternelle de Dieu se fait petit et vulnérable.

10. Agneau Innocent
Pureté parfaite, préfiguration du sacrifice rédempteur.

11. Enfant de la Crèche
Dieu se révèle dans la pauvreté et la simplicité.

12. Divin Enfant
Affirmation de la divinité dans la petitesse.

Tableau récapitulatif — 12 titres de l’Enfant Jésus
N°|Titre|Nature|Sens essentiel
1|**Enfant Jésus**|Central|Dieu fait enfant, incarnation dans la fragilité
2|**Emmanuel**|Prophétique|« Dieu avec nous », présence divine
3|**Prince de la Paix**|Prophétique|Porteur de la paix annoncée par Isaïe
4|**Lumière des Nations**|Scripturaire|Révélation universelle
5|**Sauveur Nouveau‑Né**|Liturgie|Le salut sous forme d’enfant
6|**Fils de David**|Messianique|Héritier royal de la lignée de David
7|**Fils du Très‑Haut**|Annonciation|Origine divine de l’enfant
8|**Roi des Juifs**|Épiphanie|Reconnu comme roi par les Mages
9|**Verbe fait Enfant**|Théologie|La Parole éternelle de Dieu incarnée
10|**Agneau Innocent**|Symbolique|Pureté et sacrifice annoncé
11|**Enfant de la Crèche**|Noël|Révélation dans la pauvreté
12|**Divin Enfant**|Dévotion|Divinité dans la douceur`,
    'media.desc.i_sj': `**12 titres de saint Jean (avec descriptions)**

1. Disciple Bien‑Aimé
Jean est ainsi désigné dans son propre Évangile, soulignant son intimité particulière avec Jésus.

2. Apôtre de l’Amour
Surnom traditionnel dû à l’insistance de ses écrits sur l’amour de Dieu et du prochain.

3. Fils du Tonnerre (Boanergès)
Surnom donné par Jésus à Jean et son frère Jacques, évoquant leur zèle et leur ardeur.

4. Témoin de la Transfiguration
Jean fait partie du cercle restreint des trois apôtres ayant contemplé la gloire du Christ sur le mont Thabor.

5. Témoin de la Passion
Il est le seul des Douze présent au pied de la Croix, manifestant une fidélité indéfectible.

6. Gardien de Marie
À la Croix, Jésus lui confie sa mère : « Voici ta mère ». Jean la prend chez lui.

7. Aigle de Patmos
Son symbole est l’aigle, car sa pensée s’élève vers les hauteurs du mystère divin.

8. Évangéliste Théologien
Auteur du quatrième Évangile, le plus mystique et le plus contemplatif.

9. Visionnaire de l’Apocalypse
Auteur du Livre de l’Apocalypse, reçu selon la tradition sur l’île de Patmos.

10. Docteur de la Lumière
Son Évangile développe les thèmes de la lumière, de la vérité et de la vie.

11. Apôtre de la Communion
Ses lettres insistent sur la fraternité, la vérité et la communion avec Dieu.

12. Dernier des Apôtres
Selon la tradition, Jean est le seul apôtre mort de vieillesse, dernier témoin direct du Christ.

Tableau récapitulatif — 12 titres de saint Jean
N°|Titre|Nature|Sens essentiel
1|**Disciple Bien‑Aimé**|Scripturaire|Relation unique avec Jésus
2|**Apôtre de l’Amour**|Théologique|Message centré on l’amour divin
3|**Fils du Tonnerre**|Tradition|Zèle et ardeur spirituelle
4|**Témoin de la Transfiguration**|Scripturaire|Présent lors de la gloire du Christ
5|**Témoin de la Passion**|Scripturaire|Fidèle jusqu’à la Croix
6|**Gardien de Marie**|Tradition|Reçoit Marie comme mère
7|**Aigle de Patmos**|Symbolique|Vision spirituelle élevée
8|**Évangéliste Théologien**|Scripturaire|Auteur du 4ᵉ Évangile
9|**Visionnaire de l’Apocalypse**|Scripturaire|Auteur de l’Apocalypse
10|**Docteur de la Lumière**|Théologique|Thèmes lumière/vérité/vie
11|**Apôtre de la Communion**|Spirituel|Fraternité et vérité
12|**Dernier des Apôtres**|Tradition|Dernier témoin direct du Christ`,
    'media.desc.i_sp': `**12 titres de saint Pierre (avec descriptions)**

1. Pierre (Kephas / Cephas)
Nom donné par Jésus. Signifie « rocher ». Indique sa mission de fondation dans l’Église.

2. Prince des Apôtres
Titre traditionnel. Pierre est le premier parmi les Douze, leur chef naturel et spirituel.

3. Premier Pape
Titre ecclésial. Pierre est considéré comme le premier évêque de Rome et le fondement de la succession apostolique.

4. Gardien des Clefs
Référence à Matthieu 16,19. Jésus lui confie les clefs du Royaume, symbole d’autorité spirituelle.

5. Pasteur Suprême
Après la Résurrection, Jésus lui dit : « Pais mes brebis ». Pierre reçoit la charge pastorale universelle.

6. Témoin de la Transfiguration
Pierre fait partie des trois apôtres choisis pour voir Jésus transfiguré.

7. Pêcheur de Galilée
Son identité humaine et humble. Jésus l’appelle à devenir « pêcheur d’hommes ».

8. Confesseur de la Foi
Pierre proclame : « Tu es le Christ, le Fils du Dieu vivant ». Première grande confession christologique.

9. Apôtre du Courage Fragile
Il marche sur l’eau, puis doute ; il promet fidélité, puis renie. Pierre incarne la foi humaine, forte mais vulnérable.

10. Témoin de la Résurrection
Il est l’un des premiers apôtres à voir le tombeau vide et le Christ ressuscité.

11. Martyr de Rome
Pierre meurt crucifié sous Néron, selon la tradition, la tête en bas par humilité.

12. Fondation de l’Église
Jésus dit : « Tu es Pierre, et sur cette pierre je bâtirai mon Église ». Titre théologique majeur.

Tableau récapitulatif — 12 titres de saint Pierre
N°|Titre|Nature|Sens essentiel
1|**Pierre (Kephas)**|Biblique|Le rocher choisi par Jésus
2|**Prince des Apôtres**|Tradition|Premier parmi les Douze
3|**Premier Pape**|Ecclésial|Premier évêque de Rome
4|**Gardien des Clefs**|Biblique|Autorité spirituelle confiée par Jésus
5|**Pasteur Suprême**|Pastorale|Charge de guider l’Église
6|**Témoin de la Transfiguration**|Scripturaire|Présent lors de la gloire du Christ
7|**Pêcheur de Galilée**|Historique|Origine humble et vocation
8|**Confesseur de la Foi**|Théologique|Proclame la divinité du Christ
9|**Apôtre du Courage Fragile**|Spirituel|Foi forte mais humaine
10|**Témoin de la Résurrection**|Scripturaire|Premier témoin apostolique
11|**Martyr de Rome**|Tradition|Mort pour le Christ
12|**Fondation de l’Église**|Théologique|Pierre de base de l’Église`,
    'media.desc.i_pa': `**12 titres de saint Paul (avec descriptions)**

1. Apôtre des Nations (Gentils)
Paul est envoyé annoncer le Christ aux peuples non‑juifs, ouvrant l’Église à l’universalité.

2. Docteur des Nations
Son enseignement structure la théologie chrétienne, notamment sur la foi, la grâce et la justification.

3. Apôtre par Appel
Paul n’est pas apôtre par compagnonnage terrestre, mais par vocation directe du Christ ressuscité.

4. Vaisseau d’Élection
Paul est choisi par Dieu comme instrument privilégié pour porter l’Évangile.

5. Missionnaire Itinérant
Il fonde des communautés dans tout le bassin méditerranéen : Antioche, Corinthe, Éphèse, Philippes…

6. Témoin du Ressuscité
Sur le chemin de Damas, Paul rencontre le Christ vivant, événement fondateur de sa mission.

7. Martyr de Rome
Paul meurt décapité sous Néron, fidèle jusqu'au bout à sa mission.

8. Théologien de la Grâce
Ses lettres développent la doctrine de la justification par la foi et la primauté de la grâce.

9. Père Spirituel des Communautés
Il accompagne, corrige, encourage et forme les Églises naissantes.

10. Prisonnier du Christ
Paul se présente ainsi dans ses lettres : ses chaînes deviennent un témoignage de fidélité.

11. Athlète du Christ
Paul se compare à un coureur, un lutteur, un combattant spirituel.

12. Auteur Inspiré
Ses lettres constituent une part essentielle du Nouveau Testament et de la doctrine chrétienne.

Tableau récapitulatif — 12 titres de saint Paul
N°|Titre|Nature|Sens essentiel
1|**Apôtre des Nations**|Mission|Évangélisation des peuples non‑juifs
2|**Docteur des Nations**|Liturgie|Enseignement théologique majeur
3|**Apôtre par Appel**|Théologique|Vocation directe du Christ
4|**Vaisseau d’Élection**|Tradition|Instrument choisi par Dieu
5|**Missionnaire Itinérant**|Historique|Fondateur de nombreuses Églises
6|**Témoin du Ressuscité**|Scripturaire|Vision du Christ à Damas
7|**Martyr de Rome**|Tradition|Mort pour la foi
8|**Théologien de la Grâce**|Théologique|Doctrine de la foi et de la grâce
9|**Père Spirituel**|Pastorale|Accompagnement des communautés
10|**Prisonnier du Christ**|Scripturaire|Chaînes vécues comme témoignage
11|**Athlète du Christ**|Symbolique|Combat spirituel et persévérance
12|**Auteur Inspiré**|Canonique|Lettres intégrées au Nouveau Testament`,
    'media.desc.i_st': `**12 titres / propriétés du Saint Suaire (avec descriptions)**

1. Linceul du Christ
Désigne le tissu qui enveloppa le corps de Jésus après la crucifixion.

2. Relique de la Passion
Témoin matériel de la Passion du Christ.

3. Image Acheiropoïète
L’image du corps n’est pas peinte mais formée par un phénomène inexpliqué.

4. Témoignage de la Résurrection
Signe matériel lié au passage de la mort à la vie.

5. Icône du Christ Souffrant
Montre les marques de la crucifixion et de la flagellation.

6. Relique de Contact
Tissu ayant touché directement le corps de Jésus.

7. Mandylion Occidental
Parallèle avec les images sacrées orientales.

8. Témoin Silencieux
Transmet un message spirituel sans paroles.

9. Document Archéologique Unique
Caractéristiques textiles du Proche‑Orient ancien.

10. Enigme Scientifique
Image inexpliquée par la science moderne.

11. Symbole de Miséricorde
Visage de compassion et de pardon.

12. Reliquaire de la Souffrance Humaine
Union des souffrances humaines à celles du Christ.

Tableau récapitulatif — 12 titres / propriétés du Saint Suaire
N°|Propriété|Nature|Sens essentiel
1|**Linceul du Christ**|Tradition|Tissu ayant enveloppé Jésus
2|**Relique de la Passion**|Dévotion|Témoignage de la Passion
3|**Image Acheiropoïète**|Théologie|Image non faite de main d’homme
4|**Témoignage de la Résurrection**|Dévotion|Signe lié au passage à la vie
5|**Icône du Christ Souffrant**|Dévotion|Marques de la crucifixion/flagellation
6|**Relique de Contact**|Tradition|Tissu ayant touché le corps de Jésus
7|**Mandylion Occidental**|Historique|Parallèle avec les images sacrées orientales
8|**Témoin Silencieux**|Spirituel|Message spirituel sans paroles
9|**Document Archéologique Unique**|Scientifique|Textile du Proche‑Orient ancien
10|**Enigme Scientifique**|Recherche|Image inexpliquée par la science
11|**Symbole de Miséricorde**|Spirituel|Visage de compassion et de pardon
12|**Reliquaire de la Souffrance Humaine**|Théologie|Union des souffrances au Christ`,
    'media.desc.i_jn_scene': `**Jésus et Nathanaël (L'Image du Chronoviseur)**

Cette image exceptionnelle est mondialement reconnue comme l'une des captures attribuées au Chronoviseur, un appareil secret du Vatican.

1. La capture du Chronoviseur
Selon la tradition, cette image a été obtenue par le Père Pellegrino Ernetti, moine bénédictin, à l'aide d'un appareil capable de capter les ondes du passé. Elle montre le véritable visage du Christ lors de son ministère terrestre.

2. La connaissance divine
Elle illustre le moment sacré : « Avant que Philippe t'appelât, quand tu étais sous le figuier, je t'ai vu. » Le regard de Jésus témoigne de sa capacité à sonder les cœurs et les temps.

3. Jean, le disciple bien-aimé
Positionné au premier plan derrière Jésus, on aperçoit Jean. Sa présence est marquée par un visage jeune et une attitude de contemplation profonde, témoignant de son intimité avec le Maître.

4. Pierre, le Rocher de l'Église
Plus en retrait derrière Jean, Pierre apparaît avec un bâton à la main. Ce bâton symbolise sa marche à la suite du Christ, son autorité future et son rôle de pasteur guidant le troupeau de Dieu.

5. Le Témoignage du Père Ernetti
Le Père Ernetti a affirmé que l'image reflète la majesté et la tristesse infinie de celui qui porte les péchés du monde, capturée à travers les dimensions temporelles par le Vatican.

Tableau récapitulatif — Jésus et Nathanaël
N°|Élément|Nature|Description Clé
1|**Image**|Chronoviseur|Capture temporelle du Vatican
2|**Regard**|Divinité|Connaissance de Nathanaël sous le figuier
3|**Jean**|Apôtre|Disciple bien-aimé au premier plan
4|**Pierre**|Pastorale|Figure d'autorité avec son bâton
5|**Témoignage**|Historique|Reflet de majesté et de tristesse`,
    'media.desc.i_jc_titles_main': `**24 titres de Jésus-Christ (avec descriptions)**

1. Fils de Dieu
Affirme la divinité de Jésus, consubstantiel au Père.

2. Fils de l’Homme
Titre renvoyant à Daniel 7 : figure messianique et eschatologique.

3. Messie (Christ)
Signifie « Oint », l’envoyé promis pour sauver le monde.

4. Seigneur (Kyrios)
Affirme l’autorité suprême de Jésus sur toute la création.

5. Sauveur
Jésus libère l’humanité du péché et de la mort.

6. Emmanuel (« Dieu avec nous »)
Dieu se rend présent dans l’histoire humaine.

7. Verbe (Logos)
Jésus est la Parole éternelle de Dieu faite chair.

8. Agneau de Dieu
Symbolise le sacrifice rédempteur pour enlever le péché.

9. Bon Pasteur
Jésus guide, protège et donne sa vie pour ses brebis.

10. Roi des rois
Jésus règne sur tous les royaumes visibles et invisibles.

11. Alpha et Oméga
Jésus est l’origine et l’accomplissement de l’histoire.

12. Lumière du Monde
Jésus éclaire la vérité et chasse les ténèbres spirituelles.

13. Chemin, Vérité et Vie
Jésus est l’accès au Père et la vie éternelle.

14. Pain de Vie
Jésus nourrit spirituellement les âmes.

15. Prince de la Paix
Jésus apporte la paix véritable entre Dieu et les hommes.

16. Époux
Jésus est l’Époux de l’Église, son peuple.

17. Médiateur
Lien entre Dieu et l’humanité.

18. Rédempteur
Il rachète l’humanité par son sang.

19. Maître (Rabbi)
Jésus enseigne avec autorité divine.

20. Prophète
Jésus annonce la volonté de Dieu.

21. Grand Prêtre
Jésus offre le sacrifice parfait et intercède pour nous.

22. Pierre Angulaire
Fondement de l'Église et de la foi.

23. Lion de Juda
Force, royauté et victoire sur le mal.

24. Ressuscité / Vivant
Vainqueur de la mort et vivant pour toujours.

Tableau récapitulatif des 24 titres de Jésus
N°|Titre|Nature|Sens essentiel
1|**Fils de Dieu**|Dogmatique|Divinité de Jésus
2|**Fils de l’Homme**|Scripturaire|Messie eschatologique
3|**Messie / Christ**|Scripturaire|Oint envoyé par Dieu
4|**Seigneur**|Liturgie|Autorité divine
5|**Sauveur**|Théologie|Libère du péché
6|**Emmanuel**|Prophétique|Dieu présent parmi nous
7|**Verbe (Logos)**|Théologie|Parole éternelle incarnée
8|**Agneau de Dieu**|Liturgie|Sacrifice rédempteur
9|**Bon Pasteur**|Pastorale|Guide et protection des brebis
10|**Roi des rois**|Biblique|Règne universel
11|**Alpha et Oméga**|Théologie|Origine et accomplissement
12|**Lumière du Monde**|Scripturaire|Éclaire la vérité
13|**Chemin, Vérité et Vie**|Scripturaire|Accès au Père
14|**Pain de Vie**|Sacramental|Nourriture spirituelle
15|**Prince de la Paix**|Prophétique|Paix entre Dieu et les hommes
16|**Époux**|Ecclésial|Époux de l'Église
17|**Médiateur**|Théologique|Lien Dieu/Humanité
18|**Rédempteur**|Sotériologique|Rachète par son sang
19|**Maître (Rabbi)**|Didactique|Enseignement avec autorité
20|**Prophète**|Messianique|Annonce la volonté divine
21|**Grand Prêtre**|Sacerdotal|Sacrifice et intercession
22|**Pierre Angulaire**|Ecclésial|Fondement de la foi
23|**Lion de Juda**|Royal|Force et victoire sur le mal
24|**Ressuscité / Vivant**|Glorieux|Vainqueur de la mort`,
    'media.desc.i_st_jacques': `**12 titres clés de saint Jacques (avec descriptions)**

1. Frère du Seigneur
Appellation de Paul (Ga 1,19) et de Flavius Josèphe.
Désigne sa parenté avec Jésus selon la chair.

2. Jacques le Juste
Surnom donné par la tradition primitive.
Lié à sa sainteté exceptionnelle et sa fidélité à la Loi.

3. Oblias
Titre hébreu (Hégésippe).
Signifie « rempart du peuple » ou « justice ».

4. Premier évêque de Jérusalem
Élu par les Apôtres après l’Ascension.
Guide de la première communauté chrétienne.

5. Apôtre
Reconnu comme pilier de l'Église.
Souvent identifié à Jacques d’Alphée dans la tradition.

6. Chef de l’Église de Jérusalem
Rôle dirigeant attesté (Actes 15).
Préside le premier Concile de l'histoire de l'Église.

7. Docteur de la Nouvelle Alliance
Enseignement et arbitrage doctrinal.
Décisif pour l'unité entre chrétiens juifs et païens.

8. Auteur de l’Épître de Jacques
Tradition du Nouveau Testament.
Lettre riche en conseils de sagesse et de vie chrétienne.

9. Liturge
Auteur de la Divine Liturgie de saint Jacques.
L'une des plus anciennes liturgies de la chrétienté.

10. Martyr
Mort vers 61/62 à Jérusalem.
Précipité du haut du Temple puis achevé pour sa foi.

11. Nazaréen / Ascète
Vie d’ascèse rigoureuse.
Passait son temps en prière, intercédant pour le peuple.

12. Justificateur des païens
Ouverture de l’Église aux nations.
N'a pas imposé la Loi de Moïse aux convertis païens.

Tableau récapitulatif des 12 titres de saint Jacques
N°|Titre|Nature|Sens / Description essentielle
1|**Frère du Seigneur**|Scripturaire|Parenté avec Jésus selon la chair.
2|**Jacques le Juste**|Tradition|Sainteté et justice exemplaire.
3|**Oblias**|Hébraïque|Rempart du peuple et justice.
4|**Premier évêque de Jérusalem**|Ecclésial|Guide de l'Église mère de Jérusalem.
5|**Apôtre**|Biblique|Pilier de l'Église primitive.
6|**Chef de l’Église de Jérusalem**|Pastorale|Rôle dirigeant au Concile de Jérusalem.
7|**Docteur de la Nouvelle Alliance**|Théologique|Arbitrage et enseignement doctrinal.
8|**Auteur de l’Épître de Jacques**|Canonique|Auteur inspiré d'une épître catholique.
9|**Liturge**|Liturgique|Auteur de la liturgie primitive.
10|**Martyr**|Tradition|Témoignage suprême par le don de sa vie.
11|**Nazaréen / Ascète**|Spirituel|Vie de prière et d'ascèse stricte.
12|**Justificateur des païens**|Missionnaire|Ouverture de l'Évangile aux nations.`,
    'footer.contact_us': 'Nous contacter',
    'footer.contact': 'Contact',
    'footer.about': 'À propos',
    'footer.top': 'Haut de page',
    'footer.admin_exit': 'Quitter le mode Admin',
    'footer.admin_access': 'Accès Admin',
    'footer.rights': 'Tous droits réservés',
    'modal.close': 'Fermer',
    'modal.back': 'Retour',
    'modal.secure_open': 'Ouverture sécurisée',
    'modal.secure_open_desc': 'Ce document nécessite d\'être ouvert dans un nouvel onglet pour un affichage optimal.',
    'modal.open_doc': 'Ouvrir le document',
    'modal.bib_badge': 'BIB',
    'modal.table_summary': 'Tableau récapitulatif',
    'modal.table_col_num': 'N°',
    'modal.table_col_title': 'Titre',
    'modal.table_col_prop': 'Propriété',
    'modal.table_col_nature': 'Nature',
    'modal.table_col_meaning': 'Sens / Description essentielle',
    'modal.table_default_title': 'Tableau Récapitulatif',
    'modal.error_connection': 'Erreur de connexion.',
    'modal.highlight_words': 'Dogme,Dogmatique,Chronoviseur,Vatican,Messianique,Prophétique,Scripturaire,Tradition,Ecclésiaste,Central,Théologie,Magistère,Hébraïque,Ecclésial,Biblique,Pastorale,Canonique,Liturgique,Missionnaire,Spirituel,Historique,Dévotion,Apocalyptique,Eschatologique,Noël,Épiphanie,Annonciation,Liturgie',
    'modal.special_titles': 'titres clés de la Vierge Marie,titres de la Vierge Marie,titres de Jésus-Christ,titres de l’Enfant Jésus,titres de saint Jean,titres de saint Pierre,titres de saint Paul,titres de saint Jacques,Les propriétés et titres de l\'Enfant Jésus,Jésus et Nathanaël,Image du Chronoviseur,Les titres majeurs de Jésus-Christ,Les propriétés et titres majeurs de Jésus-Christ,Le Saint Suaire,Le Saint Suaire de Turin,titres / propriétés du Saint Suaire',
    'bible.choose': 'Choisir',
    'button.add': '+ Ajouter',
    'comments.title': 'Témoignages',
    'comments.messages_count': 'messages',
    'comments.leave_message': 'Laissez un message',
    'comments.placeholder_name': 'Votre nom...',
    'comments.placeholder_text': 'Votre témoignage ou commentaire...',
    'comments.publish_btn': 'Publier le commentaire',
    'comments.just_now': 'À l\'instant',
    'comments.days_ago': 'Il y a %d jours',
    'comments.placeholder': 'Laissez un commentaire...',
    'comments.submit': 'Envoyer',
    'comments.approve': 'Approuver',
    'comments.delete': 'Supprimer',
    'comments.pending': 'En attente d\'approbation',
    'comments.no_comments': 'Aucun commentaire pour le moment.',
    'comments.login_to_post': 'Connectez-vous pour laisser un commentaire.',
    'comments.login_button': 'Se connecter avec Google',
    'comments.count_singular': 'Commentaire',
    'comments.count_plural': 'Commentaires',
    'blog.title': "Livre d'or & Témoignages",
    'verse.fallback.text': 'Tout ce que vous demanderez avec foi par la prière, vous le recevrez.',
    'verse.fallback.reference': 'Matthieu 21:22',
    'verse.fallback.reflection': 'La foi est la clé qui ouvre les portes des bénédictions divines.',
    'verse.fallback_error.text': 'Car Dieu a tant aimé le monde qu\'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu\'il ait la vie éternelle.',
    'verse.fallback_error.reference': 'Jean 3:16',
    'verse.fallback_error.reflection': 'L\'amour de Dieu est le fondement de notre espoir et de notre salut.',
  },
  en: {
    'logo.title': 'MGTS',
    'logo.subtitle': 'My Grace Is Sufficient For Thee',
    'verse.day_title': 'VERSE OF THE DAY',
    'verse.reflection_label': 'Reflection:',
    'legal.mentions_title': 'Legal Notice',
    'legal.privacy_title': 'Privacy Policy',
    'nav.home': 'Home',
    'nav.sections': 'Sections',
    'nav.cinema': 'Cinema',
    'nav.bible_history': 'Bible History',
    'nav.christian_history': 'Christian History & Documentary',
    'nav.animation': 'Animation',
    'nav.audio': 'Audio',
    'nav.library': 'Library',
    'nav.gallery': 'Gallery',
    'nav.testimonials': 'Testimonials',
    'nav.footer': 'Footer',
    'nav.contact': 'Contact',
    'nav.prayer': 'Prayer',
    'nav.about': 'About',
    'nav.donate': 'Donate',
    'nav.share': 'Share',
    'nav.translate': 'Translate',
    'section.biblical_movies': 'Biblical Stories',
    'section.other_movies': 'Christian Life',
    'section.animated_movies': 'Cartoons',
    'section.multimedia': 'Multimedia',
    'section.books': 'Books',
    'section.images': 'Images',
    'search.placeholder': 'Search for a movie, book...',
    'comments.title': 'Testimonials',
    'comments.leave_message': 'Leave a message',
    'comments.publish_btn': 'Publish',
    'comments.placeholder_name': 'Your name...',
    'comments.placeholder_text': 'Your message...',
    'comments.messages_count': 'Messages',
    'comments.just_now': 'Just now',
    'legal.editor_title': 'Site Editor',
    'legal.editor_text': 'The "Ma Grâce Te Suffit" website is published by the MGTS association, dedicated to the dissemination of spiritual and biblical content.',
    'legal.hosting_title': 'Hosting',
    'legal.hosting_text': 'This site is hosted on secure servers guaranteeing availability and data protection.',
    'legal.intellectual_title': 'Intellectual Property',
    'legal.intellectual_text': 'All content (texts, videos, images) present on this site are the property of MGTS or are subject to an authorization for use. Any reproduction is prohibited without prior agreement.',
    'legal.data_collection_title': 'Data Collection',
    'legal.data_collection_text': 'We only collect the data necessary for the proper functioning of the site (e.g. email for the newsletter).',
    'legal.data_usage_title': 'Data Usage',
    'legal.data_usage_text': 'Your data is never sold to third parties. It is used exclusively to inform you of our new publications.',
    'legal.rights_title': 'Your Rights',
    'legal.rights_text': 'In accordance with the GDPR, you have a right of access, rectification and deletion of your personal data.',
    'admin.edit': 'Edit',
    'admin.delete': 'Delete',
    'admin.save': 'Save',
    'admin.move_left': 'Move left',
    'admin.move_right': 'Move right',
    'admin.placeholder_title': 'Title...',
    'admin.placeholder_subtitle': 'Subtitle...',
    'admin.placeholder_desc': 'Description...',
    'admin.placeholder_image': 'Image URL...',
    'admin.placeholder_content': 'Content URL (video, book...)',
    'comments.default1_author': 'Marie L.',
    'comments.default1_text': 'A beautiful platform, thank you for this work of edification!',
    'comments.default1_date': '2 days ago',
    'comments.default2_author': 'Jean-Pierre',
    'comments.default2_text': 'The biblical films are of very good quality. May God bless you.',
    'comments.default2_date': '5 days ago',
    'verse.1.text': "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    'verse.1.ref': 'John 3:16',
    'verse.1.reflection': "This verse is the heart of the Gospel. It reminds us of the immensity of God's love who gave everything to offer us life.",
    'verse.2.text': 'I can do all things through Christ who strengthens me.',
    'verse.2.ref': 'Philippians 4:13',
    'verse.2.reflection': 'Our strength does not come from ourselves, but from Christ who lives in us and makes us capable of overcoming all challenges.',
    'verse.3.text': 'The Lord is my shepherd; I shall not want.',
    'verse.3.ref': 'Psalm 23:1',
    'verse.3.reflection': 'As a shepherd takes care of his sheep, God watches over every detail of our life with tenderness and faithfulness.',
    'verse.4.text': 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
    'verse.4.ref': 'Joshua 1:9',
    'verse.4.reflection': 'Courage is not the absence of fear, but absolute trust in the presence of God who accompanies us everywhere.',
    'verse.5.text': 'My grace is sufficient for you, for my power is made perfect in weakness.',
    'verse.5.ref': '2 Corinthians 12:9',
    'verse.5.reflection': "It is in our moments of greatest weakness that God's strength shines the most. His grace is all we need.",
    'verse.6.text': 'Trust in the Lord with all your heart and lean not on your own understanding.',
    'verse.6.ref': 'Proverbs 3:5',
    'verse.6.reflection': 'Letting go of our own understanding to trust in God\'s perfect plan is the path to true peace.',
    'verse.7.text': 'Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.',
    'verse.7.ref': 'Matthew 7:7',
    'verse.7.reflection': 'God invites us to an active relationship with Him. He is attentive to our prayers and ready to answer us with generosity.',
    'bible.version_label': 'World English Bible',
    'bible.search_book': 'Search for a book...',
    'bible.search_verse_placeholder': 'Search for a verse in the Bible',
    'bible.compare': 'Compare',
    'bible.strongs': 'Strongs',
    'bible.chapter_label': 'chapter',
    'bible.translation.louis_segond': 'Darby 1890',
    'bible.translation.semeur': 'Semeur',
    'bible.translation.segond_21': 'Segond 21',
    'bible.translation.martin': 'Martin',
    'bible.translation.darby': 'Darby',
    'bible.translation.ostervald': 'Ostervald',
    'bible.translation.king_james': 'King-James',
    'bible.no_book_found': 'No book found',
    'bible.reading_mode': 'Reading mode',
    'bible.read_aloud': 'Read aloud',
    'bible.pause': 'Pause',
    'bible.stop_reading': 'Stop reading',
    'bible.error_timeout': 'Loading is taking too long. Please try again.',
    'bible.error_not_found': 'This chapter does not exist.',
    'bible.copy': 'Copy',
    'bible.copied': 'Copied!',
    'hero.title_part1': 'My Grace',
    'hero.title_part2': 'Is Sufficient',
    'hero.description': 'Discover the Word of God through a unique and inspiring multimedia experience.',
    'hero.start': 'Start Exploration',
    'media.listen': 'LISTEN',
    'media.watch': 'WATCH',
    'media.read': 'READ',
    'media.view': 'VIEW',
    'media.open': 'OPEN',
    'media.enlarge': 'ENLARGE',
    'media.new': 'New',
    'type.movie': 'Movie',
    'type.video': 'Video',
    'type.book': 'Book',
    'type.image': 'Image',
    'type.audio': 'Audio',
    'admin.title': 'Admin Space',
    'admin.desc': 'Log in with Google to access edit mode.',
    'admin.google': 'Continue with Google',
    'admin.or_code': 'Or with code',
    'admin.code_placeholder': 'Access Code',
    'admin.verify': 'Verify Code',
    'admin.error': 'Incorrect code.',
    'contact.title': 'Write to us',
    'contact.desc': 'We are here to listen to any request, prayer or testimony.',
    'contact.label_name': 'Your Name',
    'contact.placeholder_name': 'Ex: John the Evangelist',
    'contact.label_email': 'Your Email Address',
    'contact.label_subject': 'Message Subject',
    'contact.placeholder_subject': 'Prayer request, testimony...',
    'contact.label_message': 'Your Message',
    'contact.placeholder_message': 'May the peace of the Lord be with you...',
    'contact.send': 'Send my message',
    'contact.sending': 'Sending...',
    'contact.success_title': 'Message received',
    'contact.success_msg1': 'We are pleased to confirm that your message has been transmitted to our team.',
    'contact.success_msg2': 'Rest assured that a response will be sent to you as soon as possible to your email address.',
    'contact.success_msg3': 'May the peace of the Lord accompany you.',
    'contact.error_title': 'Sending failed',
    'contact.error_msg': 'A technical error occurred. Please check your internet connection or contact us directly by email.',
    'contact.retry': 'Retry the form',
    'contact.direct_email': 'You can also write to us directly at this email address:',
    'contact.modal_title': 'Contact Us',
    'contact.modal_desc': 'A question, a suggestion or a prayer request? We are listening to you.',
    'contact.success_title_short': 'Message sent!',
    'contact.success_desc_short': 'We will reply to you as soon as possible.',
    'contact.label_name_full': 'Full Name',
    'contact.placeholder_name_full': 'Your name...',
    'contact.label_email_full': 'Email',
    'contact.placeholder_email_full': 'your@email.com',
    'contact.label_subject_full': 'Subject',
    'contact.subject_general': 'General Question',
    'contact.subject_prayer': 'Prayer Request',
    'contact.subject_suggestion': 'Content Suggestion',
    'contact.subject_technical': 'Technical Issue',
    'contact.label_message_full': 'Message',
    'contact.placeholder_message_full': 'Your message here...',
    'contact.send_btn': 'Send message',
    'donation.title': 'Support the Work',
    'prayer.title': 'Prayer Request',
    'prayer.intro': 'Entrust us with your intentions. Our prayer community will join you in faith.',
    'prayer.request_label': 'Your Intention',
    'prayer.placeholder': 'Describe your prayer need...',
    'prayer.success_title': 'Request Sent',
    'prayer.success_msg': 'We are praying for you. God bless you.',
    'donation.desc': 'Your contribution funds the hosting and dissemination of the Word of God.',
    'donation.securing': 'Securing the Donation',
    'donation.connecting': 'Secure connection in progress...',
    'donation.redirecting': 'Redirecting to the encrypted Stripe interface',
    'donation.card': 'Credit Card',
    'donation.via_stripe': 'Via Stripe',
    'donation.quick_donation': 'Quick Donation',
    'donation.verse': '"Give, and it will be given to you." Luke 6:38.',
    'donation.amount_choice': 'You can choose the amount of your donation directly on the secure interface.',
    'donation.secure_payment': '100% secure payment • My Grace Is Sufficient For Thee',
    'donation.modal_title': 'Support Our Mission',
    'donation.modal_desc': 'Your donation helps us maintain this free platform and spread the Word of God throughout the world.',
    'donation.label_amount': 'Choose an amount (€)',
    'donation.other_amount': 'Other',
    'donation.placeholder_amount': 'Enter the amount...',
    'donation.pay_card': 'Pay by Credit Card',
    'donation.pay_paypal': 'Pay with PayPal',
    'about.title': 'About',
    'about.subtitle': 'MGTS — My Grace Is Sufficient For Thee',
    'about.intro_bold': 'MGTS (My Grace Is Sufficient For Thee)',
    'about.intro_text': 'is a multimedia platform dedicated to the dissemination of the Word of God and the spiritual edification of believers throughout the world.',
    'about.mission_title': 'Our Mission',
    'about.mission_desc': 'To provide free and universal access to quality biblical resources: films, documentaries, books and audio teachings.',
    'about.vision_title': 'Our Vision',
    'about.vision_desc': 'To use modern technologies to make the Bible alive and accessible to all, regardless of their language or geographical location.',
    'about.verse': '"Go into all the world and preach the gospel to all creation." — Mark 16:15',
    'about.who_title': 'Who are we?',
    'about.who_desc': 'Ma Grâce Te Suffit (MGTS) is an independent Christian platform born from the desire to make the Word of God and quality multimedia content accessible to as many people as possible.',
    'about.vision_desc_full': 'We believe that digital technology is a powerful tool for evangelization and edification. Our platform brings together biblical films, documentaries, books and an interactive Bible to nourish your faith daily.',
    'about.free_title': 'Free and Commitment',
    'about.free_desc': 'Access to the platform is entirely free. We operate thanks to the donations of our community, which allows us to maintain the site without advertising and to continue to enrich our catalog.',
    'about.community_join': 'Join the thousands of believers who use our platform every day.',
    'video.close': 'Close video player',
    'video.player_title': 'Video Player',
    'video.error': 'Unsupported video format or incorrect link.',
    'bible.version': 'Version',
    'bible.book': 'Book',
    'bible.verse': 'Verse',
    'bible.listen': 'Audio Reading',
    'bible.stop': 'Stop',
    'footer.description': 'A platform dedicated to spreading the Word of God through inspiring media, biblical films and spiritual resources for all.',
    'footer.nav_title': 'Navigation',
    'footer.resources_title': 'Resources',
    'footer.newsletter_title': 'Newsletter',
    'footer.newsletter_desc': 'Stay informed of our new publications.',
    'footer.newsletter_placeholder': 'Your email...',
    'footer.copyright': 'All rights reserved.',
    'footer.legal': 'Legal Notice',
    'footer.privacy': 'Privacy Policy',
    'footer.admin_logout': 'Logout',
    'footer.admin_reset': 'Reset',
    'footer.admin_tooltip': 'Admin Login',
    'hero.placeholder.url': 'Image URL...',
    'hero.button.pc': 'PC',
    'hero.button.link': 'Link',
    'hero.tooltip.upload_pc': 'Upload image from my PC',
    'hero.tooltip.change_link': 'Change image link',
    'hero.tooltip.delete_local': 'Delete local image',
    'admin.modal.title': 'Administrator Area',
    'admin.modal.desc': 'Please enter your password to access editing functions.',
    'admin.modal.password': 'Password',
    'admin.modal.error': 'Incorrect password',
    'admin.modal.submit': 'Log In',
    'content.button.read': 'Read book',
    'content.button.listen': 'Listen',
    'content.button.watch': 'Watch',
    'content.button.subtitles': 'Subtitles',
    'footer.resources_movies': 'Biblical Films',
    'footer.resources_books': 'Books & Bibles',
    'footer.resources_docs': 'Documentaries',
    'footer.resources_kids': 'Children\'s Space',
    'bible.loading': 'Opening the manuscript...',
    'bible.error': 'Connection error.',
    'bible.loading_msg': 'Loading the Word...',
    'bible.error_msg': 'Unable to load the chapter. Please check your connection.',
    'bible.retry': 'Retry',
    'bible.chapter': 'Chapter',
    'bible.end_chapter': 'End of chapter',
    'bible.prev': 'Previous',
    'bible.next': 'Next',
    'bible.instruction': 'Click on a verse to select it',
    'bible.holy_bible': 'Holy Bible',
    'bible.book.genesis': 'Genesis',
    'bible.book.exodus': 'Exodus',
    'bible.book.leviticus': 'Leviticus',
    'bible.book.numbers': 'Numbers',
    'bible.book.deuteronomy': 'Deuteronomy',
    'bible.book.joshua': 'Joshua',
    'bible.book.judges': 'Judges',
    'bible.book.ruth': 'Ruth',
    'bible.book.1 samuel': '1 Samuel',
    'bible.book.2 samuel': '2 Samuel',
    'bible.book.1 kings': '1 Kings',
    'bible.book.2 kings': '2 Kings',
    'bible.book.1 chronicles': '1 Chronicles',
    'bible.book.2 chronicles': '2 Chronicles',
    'bible.book.ezra': 'Ezra',
    'bible.book.nehemiah': 'Nehemiah',
    'bible.book.esther': 'Esther',
    'bible.book.job': 'Job',
    'bible.book.psalms': 'Psalms',
    'bible.book.proverbs': 'Proverbs',
    'bible.book.ecclesiastes': 'Ecclesiastes',
    'bible.book.song of solomon': 'Song of Solomon',
    'bible.book.isaiah': 'Isaiah',
    'bible.book.jeremiah': 'Jeremiah',
    'bible.book.lamentations': 'Lamentations',
    'bible.book.ezekiel': 'Ezekiel',
    'bible.book.daniel': 'Daniel',
    'bible.book.hosea': 'Hosea',
    'bible.book.joel': 'Joel',
    'bible.book.amos': 'Amos',
    'bible.book.obadiah': 'Obadiah',
    'bible.book.jonah': 'Jonah',
    'bible.book.micah': 'Micah',
    'bible.book.nahum': 'Nahum',
    'bible.book.habakkuk': 'Habakkuk',
    'bible.book.zephaniah': 'Zephaniah',
    'bible.book.haggai': 'Haggai',
    'bible.book.zechariah': 'Zechariah',
    'bible.book.malachi': 'Malachi',
    'bible.book.matthew': 'Matthew',
    'bible.book.mark': 'Mark',
    'bible.book.luke': 'Luke',
    'bible.book.john': 'John',
    'bible.book.acts': 'Acts',
    'bible.book.romans': 'Romans',
    'bible.book.1 corinthians': '1 Corinthians',
    'bible.book.2 corinthians': '2 Corinthians',
    'bible.book.galatians': 'Galatians',
    'bible.book.ephesians': 'Ephesians',
    'bible.book.philippians': 'Philippians',
    'bible.book.colossians': 'Colossians',
    'bible.book.1 thessalonians': '1 Thessalonians',
    'bible.book.2 thessalonians': '2 Thessalonians',
    'bible.book.1 timothy': '1 Timothy',
    'bible.book.2 timothy': '2 Timothy',
    'bible.book.titus': 'Titus',
    'bible.book.philemon': 'Philemon',
    'bible.book.hebrews': 'Hebrews',
    'bible.book.james': 'James',
    'bible.book.1 peter': '1 Peter',
    'bible.book.2 peter': '2 Peter',
    'bible.book.1 john': '1 John',
    'bible.book.2 john': '2 John',
    'bible.book.3 john': '3 John',
    'bible.book.jude': 'Jude',
    'bible.book.revelation': 'Revelation',
    'book.thought': 'Thought',
    'book.go_to': 'Go to...',
    'book.no_content': 'No content.',
    'media.title.m1': 'The Passion of the Christ',
    'media.subtitle.m1': 'Hebrew / Aramaic',
    'media.desc.m1': 'The final hours of Jesus Christ, directed by Mel Gibson. A powerful testimony of sacrifice.',
    'media.title.m_esther': 'Esther',
    'media.subtitle.m_esther': 'The Star of Persia',
    'media.desc.m_esther': 'Queen Esther risks her life to save the Jewish people from massacre.',
    'media.title.m_jeremie': 'Jeremiah',
    'media.subtitle.m_jeremie': 'The Weeping Prophet',
    'media.desc.m_jeremie': 'Jeremiah\'s call to carry God\'s message to Jerusalem.',
    'media.title.m_samson': 'Samson',
    'media.subtitle.m_samson': 'The Strength of God',
    'media.desc.m_samson': 'The epic story of the judge Samson, his legendary strength and final redemption.',
    'media.title.m_noah': 'Noah',
    'media.subtitle.m_noah': 'The Ark of Salvation',
    'media.desc.m_noah': 'The biblical account of the flood, Noah\'s faith and God\'s covenant with humanity.',
    'media.title.v_tem_1': 'The Holy Shroud',
    'media.subtitle.v_tem_1': 'Documentary',
    'media.desc.v_tem_1': "A fascinating exploration of the Shroud of Turin, the most studied enigma in history, which silently bears witness to the Passion of Christ.",
    'media.title.v_papes_1': 'The Bishops of Rome',
    'media.subtitle.v_papes_1': 'History of the Popes',
    'media.desc.v_papes_1': "A historical documentary tracing the lineage of Peter's successors and the evolution of the papacy through the centuries, from the early Church to the present day.",
    'media.title.v_prophetie_1': 'The Prophecy of the Popes',
    'media.subtitle.v_prophetie_1': 'Saint Malachy',
    'media.desc.v_prophetie_1': "Discover the mystery of the prophecies attributed to Saint Malachy, detailing a series of Latin mottos corresponding to each pope until the end of time.",
    'media.title.a1': 'Superbook',
    'media.subtitle.a1': 'Bible Adventures',
    'media.desc.a1': 'Chris, Joy, and their robot Gizmo travel through time to experience the greatest stories of the Bible.',
    'media.title.v_tob_emission': 'Program presented by: Virginia Crespeau',
    'media.subtitle.v_tob_emission': 'TOB: Ecumenical Translation of the Bible',
    'media.desc.v_tob_emission': 'The new edition of the TOB, Ecumenical Translation of the Bible presented by Sophie Stavrou for Orthodoxy, and Bernard Coyault, for Protestantism.',
    'media.title.b_kjv': 'Holy Bible (KJV)',
    'media.subtitle.b_kjv': 'Synchronized Audio',
    'media.desc.b_kjv': 'The Word of God in a unique interactive experience. Use the language selector at the top of the site to instantly translate the sacred texts and enjoy intelligent audio reading, perfectly synchronized with the voice of the chosen translation language.',
    'media.title.b_tob_at': 'Old Testament (TOB)',
    'media.subtitle.b_tob_at': 'Ecumenical Bible',
    'media.desc.b_tob_at': 'The Ecumenical Translation of the Bible: Old Testament.',
    'media.title.b_tob_nt': 'New Testament (TOB)',
    'media.subtitle.b_tob_nt': 'Ecumenical Bible',
    'media.desc.b_tob_nt': 'The Ecumenical Translation of the Bible: New Testament.',
    'media.title.b_drive_new': 'Old & New Testament',
    'media.subtitle.b_drive_new': 'André Chouraqui Translation',
    'media.desc.b_drive_new': "André Chouraqui's translation: a monumental work that strives to restore the original breath and Hebrew flavor of the sacred texts, offering a renewed and poetic reading of the Word of God.",
    'media.title.b_imitation_jc': 'The Imitation of Christ',
    'media.subtitle.b_imitation_jc': 'Thomas à Kempis',
    'media.desc.b_imitation_jc': "One of the most widely read Christian devotional books in the world after the Bible. A profound spiritual guide to following in the Savior's footsteps.",
    'media.title.b_voyage_pelerin': 'The Pilgrim\'s Progress',
    'media.subtitle.b_voyage_pelerin': 'John Bunyan',
    'media.desc.b_voyage_pelerin': "John Bunyan's classic Christian allegory, tracing Christian's spiritual journey to the Celestial City. A masterpiece of world spiritual literature.",
    'media.title.i_vm': 'The Virgin Mary',
    'media.subtitle.i_vm': 'Mother of God',
    'media.title.i_ej': 'The Child Jesus',
    'media.subtitle.i_ej': 'God made man',
    'media.title.i_jc_titles_main': 'Jesus Christ',
    'media.subtitle.i_jc_titles_main': 'Divine Sovereignty',
    'media.title.i_sj': 'Saint John',
    'media.subtitle.i_sj': 'The Beloved Disciple',
    'media.title.i_sp': 'Saint Peter',
    'media.subtitle.i_sp': 'Prince of the Apostles',
    'media.title.i_pa': 'Saint Paul',
    'media.subtitle.i_pa': 'Apostle of the Nations',
    'media.title.i_st': 'The Holy Shroud',
    'media.subtitle.i_st': 'Shroud of Turin',
    'media.title.i_jn_scene': 'Jesus and Nathanael',
    'media.subtitle.i_jn_scene': 'The vision of truth',
    'media.desc.i_jn_scene': `**Jesus and Nathanael (Chronovisor Image)**

This exceptional image is globally recognized as one of the captures attributed to the Chronovisor, a secret Vatican device.

1. The Chronovisor capture
According to tradition, this image was obtained by Father Pellegrino Ernetti, a Benedictine monk, using a device capable of capturing waves from the past. It shows the true face of Christ during his earthly ministry.

2. Divine knowledge
It illustrates the sacred moment: "Before Philip called you, when you were under the fig tree, I saw you." Jesus' gaze bears witness to his ability to probe hearts and times.

3. John, the beloved disciple
Positioned in the foreground behind Jesus, we can see John. His presence is marked by a look of deep contemplation, confirming his role as a privileged witness to the life of the Master.`,
    'media.title.i_st_jacques': 'Saint Jacques',
    'media.subtitle.i_st_jacques': 'The Brother of the Lord',
    'media.desc.i_vm': `**24 key titles of the Virgin Mary (with descriptions)**

1. Theotokos (Mother of God)
Dogma proclaimed at the Council of Ephesus (431).
Affirms that Mary is the mother of the incarnate divine Person.

2. Immaculate Conception
Mary was conceived without original sin.

3. Assumption
Mary is taken up body and soul into heaven at the end of her earthly life.

4. Perpetual Virgin
Mary remained a virgin before, during, and after the birth of Jesus.

5. Mother of Christ
She is the mother of the Messiah announced by the prophets.

6. Mother of the Savior
She gives birth to the one who brings salvation to the world.

7. Mother of the Church
Mary is the spiritual mother of all believers.

8. Co-Redemptrix
Mary cooperates in salvation through her "yes" and her presence at the foot of the Cross.

9. Mediatrix of all graces
Mary intercedes and transmits the graces received from Christ.

10. Advocate
Mary pleads for believers before God the Son.

11. Star of the Sea (Stella Maris)
Mary guides Christians through the storms of life.

12. Queen of Heaven
Mary is honored as queen because of her divine motherhood.

13. New Eve
As Eve participated in the fall, Mary participates in redemption.

14. Ark of the New Covenant
Mary carries within her Jesus, the living Word.

15. Gate of Heaven (Porta Caeli)
Mary is the gate through which God enters the world.

16. Mystical Rose
Symbol of beauty, purity, and the mystery of grace.

17. Ivory Tower
Evokes strength, purity, and dignity.

18. House of Gold
Symbolizes the interior splendor of Mary inhabited by God.

19. Our Lady (Domina Nostra)
Expresses spiritual lordship and maternal protection.

20. Queen of the Rosary
Mary leads to the contemplation of the mysteries of Christ.

21. Help of Christians
Mary is invoked as the protectress of the Christian people.

22. Comforter of the Afflicted
Mary soothes suffering and accompanies wounded hearts.

23. Refuge of Sinners
Mary welcomes those who seek divine mercy.

24. Mother of Good Counsel
Mary enlightens difficult decisions and guides consciences.

Summary table of the 24 titles of the Virgin Mary
No.|Marian Title|Nature|Essential Meaning / Description
1|**Theotokos (Mother of God)**|Dogma|Mary is the mother of the incarnate divine Person.
2|**Immaculate Conception**|Dogmatic|Mary is conceived without original sin.
3|**Assumption**|Dogma|Mary is taken up body and soul into heaven.
4|**Perpetual Virgin**|Tradition|Virginity before, during, and after the birth of Jesus.
5|**Mother of Christ**|Scriptural|Mother of the Messiah announced by the prophets.
6|**Mother of the Savior**|Scriptural|Mother of the one who brings salvation to the world.
7|**Mother of the Church**|Magisterium|Spiritual mother of all believers.
8|**Co-Redemptrix**|Theology|Unique cooperation in salvation through her "yes".
9|**Mediatrix of all graces**|Theology|Mary intercedes and transmits graces.
10|**Advocate**|Dogma|Mary pleads for believers before God.
11|**Star of the Sea**|Tradition|Mary guides through the storms of life.
12|**Queen of Heaven**|Dogma|Honored as queen by her divine motherhood.
13|**New Eve**|Theology|Participates in redemption as Eve in the fall.
14|**Ark of the New Covenant**|Biblical|Carries Jesus, the living Word, within her.
15|**Gate of Heaven**|Tradition|Gate through which God enters the world.
16|**Mystical Rose**|Spiritual|Beauty, purity and mystery of grace.
17|**Ivory Tower**|Biblical|Strength, purity and dignity.
18|**House of Gold**|Symbolic|Interior splendor inhabited by God.
19|**Our Lady**|Devotion|Spiritual lordship and maternal protection.
20|**Queen of the Rosary**|Spiritual|Leads to contemplation of Christ's mysteries.
21|**Help of Christians**|Tradition|Protectress of the Christian people.
22|**Comforter of the Afflicted**|Pastoral|Soothes suffering and accompanies hearts.
23|**Refuge of Sinners**|Spiritual|Welcomes those seeking divine mercy.
24|**Mother of Good Counsel**|Pastoral|Enlightens decisions and guides consciences.`,
    'media.desc.i_ej': `**12 titles of the Child Jesus (with descriptions)**

1. Child Jesus
The Word incarnate in the fragility of a child.

2. Emmanuel ("God with us")
God makes himself present among men from birth.

3. Prince of Peace
The child announced by Isaiah 9, bearer of divine peace.

4. Light of the Nations
Simeon recognizes in him the light intended for all peoples.

5. Newborn Savior
Salvation enters history in the form of a child.

6. Son of David
Royal heir, fulfilling the promise made to David.

7. Son of the Most High
Divine origin of the child revealed at the Annunciation.

8. King of the Jews
Recognized as king by the Magi from his birth.

9. Word made Child
The eternal Word of God becomes small and vulnerable.

10. Innocent Lamb
Perfect purity, prefiguration of the redemptive sacrifice.

11. Child of the Manger
God reveals himself in poverty and simplicity.

12. Divine Child
Affirmation of divinity in smallness.

Summary table — 12 titles of the Child Jesus
No.|Title|Nature|Essential Meaning
1|**Child Jesus**|Central|God made child, incarnation in fragility
2|**Emmanuel**|Prophetic|"God with us", divine presence
3|**Prince of Peace**|Prophetic|Bearer of the peace announced by Isaiah
4|**Light of the Nations**|Scriptural|Universal revelation
5|**Newborn Savior**|Liturgy|Salvation in the form of a child
6|**Son of David**|Messianic|Royal heir of the line of David
7|**Son of the Most High**|Annunciation|Divine origin of the child
8|**King of the Jews**|Epiphany|Recognized as king by the Magi
9|**Word made Child**|Theology|The eternal Word of God incarnate
10|**Innocent Lamb**|Symbolic|Purity and announced sacrifice
11|**Child of the Manger**|Christmas|Revelation in poverty
12|**Divine Child**|Devotion|Divinity in gentleness`,
    'media.desc.i_sj': `**12 titles of Saint John (with descriptions)**

1. Beloved Disciple
John is so designated in his own Gospel, highlighting his special intimacy with Jesus.

2. Apostle of Love
Traditional nickname due to the insistence of his writings on the love of God and neighbor.

3. Son of Thunder (Boanerges)
Nickname given by Jesus to John and his brother James, evoking their zeal and ardor.

4. Witness of the Transfiguration
John is part of the restricted circle of the three apostles who contemplated the glory of Christ on Mount Tabor.

5. Witness of the Passion
He is the only one of the Twelve present at the foot of the Cross, manifesting unfailing fidelity.

6. Guardian of Mary
At the Cross, Jesus entrusts his mother to him: "Behold your mother". John takes her into his home.

7. Eagle of Patmos
His symbol is the eagle, because his thought rises to the heights of the divine mystery.

8. Evangelist Theologian
Author of the fourth Gospel, the most mystical and contemplative.

9. Visionary of the Apocalypse
Author of the Book of Revelation, received according to tradition on the island of Patmos.

10. Doctor of Light
His Gospel develops the themes of light, truth and life.

11. Apostle of Communion
His letters insist on brotherhood, truth and communion with God.

12. Last of the Apostles
According to tradition, John is the only apostle who died of old age, the last direct witness of Christ.

Summary table — 12 titles of Saint John
No.|Title|Nature|Essential Meaning
1|**Beloved Disciple**|Scriptural|Unique relationship with Jesus
2|**Apostle of Love**|Theological|Message centered on divine love
3|**Son of Thunder**|Tradition|Zeal and spiritual ardor
4|**Witness of the Transfiguration**|Scriptural|Present during the glory of Christ
5|**Witness of the Passion**|Scriptural|Faithful to the Cross
6|**Guardian of Mary**|Tradition|Receives Mary as mother
7|**Eagle of Patmos**|Symbolic|High spiritual vision
8|**Evangelist Theologian**|Scriptural|Author of the 4th Gospel
9|**Visionary of the Apocalypse**|Scriptural|Author of the Apocalypse
10|**Doctor of Light**|Theological|Themes light/truth/life
11|**Apostle of Communion**|Spiritual|Brotherhood and truth
12|**Last of the Apostles**|Tradition|Last direct witness of Christ`,
    'media.desc.i_sp': `**12 titles of Saint Peter (with descriptions)**

1. Peter (Kephas / Cephas)
Name given by Jesus. Means "rock". Indicates his mission of foundation in the Church.

2. Prince of the Apostles
Traditional title. Peter is the first among the Twelve, their natural and spiritual leader.

3. First Pope
Ecclesial title. Peter is considered the first bishop of Rome and the foundation of the apostolic succession.

4. Guardian of the Keys
Reference to Matthew 16:19. Jesus entrusts him with the keys of the Kingdom, a symbol of spiritual authority.

5. Supreme Pastor
After the Resurrection, Jesus says to him: "Feed my sheep". Peter receives the universal pastoral charge.

6. Witness of the Transfiguration
Peter is one of the three apostles chosen to see Jesus transfigured.

7. Fisherman of Galilee
His human and humble identity. Jesus calls him to become a "fisher of men".

8. Confessor of the Faith
Peter proclaims: "You are the Christ, the Son of the living God". First great christological confession.

9. Apostle of Fragile Courage
He walks on water, then doubts; he promises fidelity, then denies. Peter embodies human faith, strong but vulnerable.

10. Witness of the Resurrection
He is one of the first apostles to see the empty tomb and the risen Christ.

11. Martyr of Rome
Peter dies crucified under Nero, according to tradition, upside down out of humility.

12. Foundation of the Church
Jesus says: "You are Peter, and on this rock I will build my Church". Major theological title.

Summary table — 12 titles of Saint Peter
No.|Title|Nature|Essential Meaning
1|**Peter (Kephas)**|Biblical|The rock chosen by Jesus
2|**Prince of the Apostles**|Tradition|First among the Twelve
3|**First Pope**|Ecclesial|First bishop of Rome
4|**Guardian of the Keys**|Biblical|Spiritual authority entrusted by Jesus
5|**Supreme Pastor**|Pastoral|Charge of guiding the Church
6|**Witness of the Transfiguration**|Scriptural|Present during the glory of Christ
7|**Fisherman of Galilee**|Historical|Humble origin and vocation
8|**Confesseur de la Foi**|Theological|Proclaims the divinity of Christ
9|**Apostle of Fragile Courage**|Spiritual|Strong but human faith
10|**Witness of the Resurrection**|Scriptural|First apostolic witness
11|**Martyr of Rome**|Tradition|Death for Christ
12|**Foundation of the Church**|Theological|Foundation stone of the Church`,
    'media.desc.i_pa': `**12 titles of Saint Paul (with descriptions)**

1. Apostle of the Nations (Gentiles)
Paul is sent to announce Christ to non-Jewish peoples, opening the Church to universality.

2. Doctor of the Nations
His teaching structures Christian theology, particularly on faith, grace and justification.

3. Apostle by Call
Paul is not an apostle by earthly companionship, but by direct vocation from the risen Christ.

4. Vessel of Election
Paul is chosen by God as a privileged instrument to carry the Gospel.

5. Itinerant Missionary
He founded communities throughout the Mediterranean basin: Antioch, Corinth, Ephesus, Philippi...

6. Witness of the Risen One
On the road to Damascus, Paul meets the living Christ, the founding event of his mission.

7. Martyr of Rome
Paul died beheaded under Nero, faithful to the end to his mission.

8. Theologian of Grace
His letters develop the doctrine of justification by faith and the primacy of grace.

9. Spiritual Father of the Communities
He accompanies, corrects, encourages and forms the nascent Churches.

10. Prisoner of Christ
Paul presents himself thus in his letters: his chains become a testimony of fidelity.

11. Athlete of Christ
Pauline image: Paul compares himself to a runner, a wrestler, a spiritual fighter.

12. Inspired Author
His letters constitute an essential part of the New Testament and Christian doctrine.

Summary table — 12 titles of Saint Paul
No.|Title|Nature|Essential Meaning
1|**Apostle of the Nations**|Mission|Evangelization of non-Jewish peoples
2|**Doctor of the Nations**|Liturgy|Major theological teaching
3|**Apostle by Call**|Theological|Direct vocation from Christ
4|**Vessel of Election**|Tradition|Instrument chosen by God
5|**Itinerant Missionary**|Historical|Founder of many Churches
6|**Witness of the Risen One**|Scriptural|Vision of Christ at Damascus
7|**Martyr of Rome**|Tradition|Death for the faith
8|**Theologian of Grace**|Theology|Doctrine of faith and grace
9|**Spiritual Father**|Pastoral|Accompanying communities
10|**Prisoner of Christ**|Scriptural|Chains lived as testimony
11|**Athlete of Christ**|Symbolic|Spiritual combat and perseverance
12|**Inspired Author**|Canonical|Letters integrated into the New Testament`,
    'media.desc.i_st': `**12 titles / properties of the Holy Shroud (with descriptions)**

1. Shroud of Christ
Designates the cloth that wrapped the body of Jesus after the crucifixion.

2. Relic of the Passion
Material witness of the Passion of Christ.

3. Acheiropoietos Image
The image of the body is not painted but formed by an unexplained phenomenon.

4. Witness of the Resurrection
Material sign linked to the passage from death to life.

5. Icon of the Suffering Christ
Shows the marks of the crucifixion and scourging.

6. Contact Relic
Fabric that directly touched the body of Jesus.

7. Western Mandylion
Parallel with sacred Eastern images.

8. Silent Witness
Transmits a spiritual message without words.

9. Unique Archaeological Document
Textile characteristics of the ancient Near East.

10. Scientific Enigma
Image unexplained by modern science.

11. Symbol of Mercy
Face of compassion and forgiveness.

12. Reliquary of Human Suffering
Union of human suffering with that of Christ.

Summary table — 12 titles / properties of the Holy Shroud
No.|Property|Nature|Essential Meaning
1|**Shroud of Christ**|Tradition|Cloth that wrapped Jesus
2|**Relic of the Passion**|Devotion|Witness of the Passion
3|**Acheiropoietos Image**|Theology|Image not made by human hands
4|**Witness of the Resurrection**|Devotion|Sign linked to the passage to life
5|**Icon of the Suffering Christ**|Devotion|Marks of crucifixion/scourging
6|**Contact Relic**|Tradition|Fabric that directly touched Jesus
7|**Western Mandylion**|Historical|Parallel with sacred Eastern images
8|**Silent Witness**|Spiritual|Spiritual message without words
9|**Unique Archaeological Document**|Scientific|Ancient Near East textile
10|**Scientific Enigma**|Research|Image unexplained by science
11|**Symbol of Mercy**|Spiritual|Face of compassion and forgiveness
12|**Reliquary of Human Suffering**|Theology|Union of human suffering with Christ`,
    'media.desc.i_jc_titles_main': `**24 titles of Jesus Christ (with descriptions)**

1. Son of God
Affirms the divinity of Jesus, consubstantial with the Father.

2. Son of Man
Title referring to Daniel 7: messianic and eschatological figure.

3. Messiah (Christ)
Means "Anointed", the one promised to save the world.

4. Lord (Kyrios)
Affirms the supreme authority of Jesus over all creation.

5. Savior
Jesus delivers humanity from sin and death.

6. Emmanuel ("God with us")
God makes himself present in human history.

7. Word (Logos)
Jesus is the eternal Word of God made flesh.

8. Lamb of God
Symbolizes the redemptive sacrifice to take away sin.

9. Good Shepherd
Jesus guides, protects and gives his life for his sheep.

10. King of kings
Jesus reigns over all visible and invisible kingdoms.

11. Alpha and Omega
Jesus is the origin and fulfillment of history.

12. Light of the World
Jesus enlightens the truth and dispels spiritual darkness.

13. Way, Truth and Life
Jesus is the access to the Father and eternal life.

14. Bread of Life
Jesus spiritually feeds souls.

15. Prince of Peace
Jesus brings true peace between God and men.

16. Spouse
Jesus is the Spouse of the Church, his people.

17. Mediator
Link between God and humanity.

18. Redeemer
He redeems humanity by his blood.

19. Master (Rabbi)
Jesus teaches with divine authority.

20. Prophet
Jesus announces the will of God.

21. High Priest
Jesus offers the perfect sacrifice and intercedes for us.

22. Cornerstone
Foundation of the Church and of faith.

23. Lion of Judah
Strength, royalty and victory over evil.

24. Risen / Living
Conqueror of death and living forever.

Summary table of the 24 titles of Jesus
No.|Title|Nature|Essential Meaning
1|**Son of God**|Dogmatic|Divinity of Jesus
2|**Son of Man**|Scriptural|Eschatological Messiah
3|**Messiah / Christ**|Scriptural|Anointed sent by God
4|**Lord**|Liturgie|Divine authority
5|**Savior**|Theological|Delivers from sin
6|**Emmanuel**|Prophétique|God present among us
7|**Word (Logos)**|Theology|Eternal Word incarnate
8|**Lamb of God**|Liturgie|Redemptive sacrifice
9|**Good Shepherd**|Symbolique|Guide and protector
10|**King of kings**|Eschatological|Universal sovereign
11|**Alpha and Omega**|Apocalyptic|Origin and end
12|**Light of the World**|Symbolique|Propulsion and illumination
13|**Way, Truth, Life**|Scriptural|Access to the Father
14|**Bread of Life**|Biblique|Spiritual nourishment
15|**Prince of Peace**|Prophétique|Peace between God and men
16|**Spouse**|Mystique|Spouse of the Church
17|**Mediator**|Theological|Link between God and man
18|**Redeemer**|Theological|Ransom paid by his blood
19|**Master / Rabbi**|Historical|Teaching authority
20|**Prophet**|Biblique|Announces God's will
21|**High Priest**|Liturgical|Sacrifice and intercession
22|**Cornerstone**|Biblique|Foundation of faith
23|**Lion of Juda**|Apocalyptic|Victory over evil
24|**Risen / Living**|Dogmatic|Conqueror of death`,
    'media.desc.i_st_jacques': `**12 key titles of Saint James (with descriptions)**

1. Brother of the Lord
Appellation of Paul (Gal 1:19) and Flavius Josephus.
Designates his kinship with Jesus according to the flesh.

2. James the Just
Nickname given by early tradition.
Linked to his exceptional holiness and fidelity to the Law.

3. Oblias
Hebrew title (Hegesippus).
Means "rampart of the people" or "justice".

4. First Bishop of Jerusalem
Elected by the Apostles after the Ascension.
Guide of the first Christian community.

5. Apostle
Recognized as a pillar of the Church.
Often identified with James of Alphaeus in tradition.

6. Head of the Church of Jerusalem
Attested leadership role (Acts 15).
Presides over the first Council in the history of the Church.

7. Doctor of the New Covenant
Teaching and doctrinal arbitration.
Decisive for unity between Jewish and Gentile Christians.

8. Author of the Epistle of James
New Testament tradition.
Letter rich in advice for wisdom and Christian life.

9. Liturgist
Author of the Divine Liturgy of Saint James.
One of the oldest liturgies in Christendom.

10. Martyr
Died around 61/62 in Jerusalem.
Thrown from the top of the Temple and then finished off for his faith.

11. Nazirite / Ascetic
Life of rigorous asceticism.
Spent his time in prayer, interceding for the people.

12. Justifier of the Gentiles
Opening of the Church to the nations.
Did not impose the Law of Moses on Gentile converts.

Summary table of the 12 titles of Saint James
No.|Title|Nature|Meaning / Essential Description
1|**Brother of the Lord**|Scriptural|Kinship with Jesus according to the flesh.
2|**James the Just**|Tradition|Exceptional holiness and justice.
3|**Oblias**|Hebrew|Rampart of the people and justice.
4|**First Bishop of Jerusalem**|Ecclésial|Guide of the mother Church of Jerusalem.
5|**Apostle**|Biblique|Pillar of the early Church.
6|**Head of the Church of Jerusalem**|Pastorale|Leading role at the Council of Jerusalem.
7|**Doctor of the New Covenant**|Théologique|Arbitration and doctrinal teaching.
8|**Author of the Epistle of James**|Canonical|Inspired author of a catholic epistle.
9|**Liturgist**|Liturgical|Author of the primitive liturgy.
10|**Martyr**|Tradition|Supreme testimony by the gift of his life.
11|**Nazirite / Ascetic**|Spirituel|Life of prayer and strict asceticism.
12|**Justifier of the Gentiles**|Missionary|Opening of the Gospel to the nations.`,
    'footer.contact_us': 'Contact us',
    'footer.contact': 'Contact',
    'footer.about': 'About',
    'footer.top': 'Top of page',
    'footer.admin_exit': 'Exit Admin Mode',
    'footer.admin_access': 'Admin Access',
    'footer.rights': 'All rights reserved',
    'modal.close': 'Close',
    'modal.back': 'Back',
    'modal.secure_open': 'Secure Opening',
    'modal.secure_open_desc': 'This document needs to be opened in a new tab for optimal viewing.',
    'modal.open_doc': 'Open Document',
    'modal.bib_badge': 'BIB',
    'modal.table_summary': 'Summary table',
    'modal.table_col_num': 'No.',
    'modal.table_col_title': 'Title',
    'modal.table_col_prop': 'Property',
    'modal.table_col_nature': 'Nature',
    'modal.table_col_meaning': 'Meaning / Essential Description',
    'modal.table_default_title': 'Summary Table',
    'modal.error_connection': 'Connection error.',
    'modal.highlight_words': 'Dogma,Dogmatic,Chronovisor,Vatican,Messianic,Prophetic,Scriptural,Tradition,Ecclesiastes,Central,Theology,Magisterium,Hebraic,Ecclesial,Biblical,Pastoral,Canonical,Liturgical,Missionary,Spiritual,Historical,Devotion,Apocalyptic,Eschatological,Christmas,Epiphany,Annunciation,Liturgy',
    'modal.special_titles': 'key titles of the Virgin Mary,titles of the Virgin Mary,titles of Jesus Christ,titles of the Child Jesus,titles of Saint John,titles of Saint Peter,titles of Saint Paul,titles of Saint James,The properties and titles of the Child Jesus,Jesus and Nathanael,Image of the Chronovisor,The major titles of Jesus Christ,The major properties and titles of Jesus Christ,The Holy Shroud,The Shroud of Turin,titles / properties of the Holy Shroud',
    'bible.choose': 'Choose',
    'button.add': '+ Add',
    'blog.title': 'Guestbook & Testimonies',
    'verse.fallback.text': 'And all things, whatsoever ye shall ask in prayer, believing, ye shall receive.',
    'verse.fallback.reference': 'Matthew 21:22',
    'verse.fallback.reflection': 'Faith is the key that opens the doors of divine blessings.',
    'verse.fallback_error.text': 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    'verse.fallback_error.reference': 'John 3:16',
    'verse.fallback_error.reflection': 'God\'s love is the foundation of our hope and salvation.',
  },
  // Add other languages as needed, or use a fallback mechanism
  // For now, I'll provide a few more common ones
  es: {
    'nav.home': 'Inicio',
    'nav.sections': 'Secciones',
    'nav.cinema': 'Cine',
    'nav.bible_history': 'Historia Bíblica',
    'nav.christian_history': 'Historia Cristiana y Documentales',
    'nav.animation': 'Animación',
    'nav.audio': 'Audio',
    'nav.library': 'Biblioteca',
    'nav.gallery': 'Galería',
    'nav.testimonials': 'Testimonios',
    'nav.contact': 'Contacto',
    'nav.about': 'Acerca de',
    'nav.donate': 'Donar',
    'nav.share': 'Compartir sitio',
    'nav.translate': 'Traducir',
    'section.biblical_movies': 'Historias Bíblicas',
    'section.other_movies': 'Vida Cristiana y Documentales',
    'section.animated_movies': 'Dibujos Animados',
    'section.multimedia': 'Multimedia y Audio',
    'section.books': 'Biblioteca Digital',
    'section.images': 'Galería de Imágenes',
    'search.placeholder': 'Buscar una película, libro...',
    'bible.version_label': 'Versión Reina Valera',
    'hero.title': 'Mi Gracia Te Basta',
    'hero.subtitle': 'Cine, Biblioteca y Galería Cristiana',
    'footer.rights': 'Todos los derechos reservados',
    'modal.close': 'Cerrar',
    'modal.back': 'Volver',
    'bible.version': 'Versión',
    'bible.book': 'Libro',
    'bible.chapter': 'Capítulo',
    'bible.verse': 'Versículo',
    'bible.audio': 'Lectura de Audio',
    'bible.stop': 'Detener',
    'bible.loading': 'Abriendo el manuscrito...',
    'bible.error': 'Error de conexión.',
    'contact.title': 'Contáctenos',
    'about.title': 'Sobre nosotros',
    'donation.title': 'Apoyar el proyecto',
    'comments.title': 'Comentarios',
    'comments.placeholder': 'Deja un comentario...',
    'comments.submit': 'Enviar',
    'comments.approve': 'Aprobar',
    'comments.delete': 'Eliminar',
    'comments.pending': 'Pendiente de aprobación',
    'comments.no_comments': 'No hay comentarios aún.',
    'comments.login_to_post': 'Inicia sesión para dejar un comentario.',
    'comments.login_button': 'Iniciar sesión con Google',
    'comments.count_singular': 'Comentario',
    'comments.count_plural': 'Comentarios',
    'blog.title': 'Libro de visitas y testimonios',
    'verse.day_title': 'PALABRA DEL DÍA',
    'verse.reflection_label': 'Reflexión:',
    'verse.title': 'Palabra del Día',
    'verse.fallback.text': 'Y todo lo que pidiereis en oración, creyendo, lo recibiréis.',
    'verse.fallback.reference': 'Mateo 21:22',
    'verse.fallback.reflection': 'La fe es la llave que abre las puertas de las bendiciones divinas.',
    'verse.fallback_error.text': 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
    'verse.fallback_error.reference': 'Juan 3:16',
    'verse.fallback_error.reflection': 'El amor de Dios es el fundamento de nuestra esperanza y salvación.',
  },
  pt: {
    'nav.home': 'Início',
    'nav.sections': 'Seções',
    'nav.cinema': 'Cinema',
    'nav.bible_history': 'História Bíblica',
    'nav.christian_history': 'História Cristã e Documentários',
    'nav.animation': 'Animação',
    'nav.audio': 'Áudio',
    'nav.library': 'Biblioteca',
    'nav.gallery': 'Galeria',
    'nav.testimonials': 'Depoimentos',
    'nav.contact': 'Contato',
    'nav.about': 'Sobre',
    'nav.donate': 'Doar',
    'nav.share': 'Compartilhar site',
    'nav.translate': 'Traduzir',
    'section.biblical_movies': 'Histórias Bíblicas',
    'section.other_movies': 'Vida Cristã e Documentários',
    'section.animated_movies': 'Desenhos Animados',
    'section.multimedia': 'Multimídia e Áudio',
    'section.books': 'Biblioteca Digital',
    'section.images': 'Galeria de Imagens',
    'search.placeholder': 'Pesquisar um filme, livro...',
    'bible.version_label': 'Versão Almeida',
    'hero.title': 'A Minha Graça Te Basta',
    'hero.subtitle': 'Cinema, Biblioteca e Galeria Cristã',
    'footer.rights': 'Todos os direitos reservados',
    'modal.close': 'Fechar',
    'modal.back': 'Voltar',
    'bible.version': 'Versão',
    'bible.book': 'Livro',
    'bible.chapter': 'Capítulo',
    'bible.verse': 'Versículo',
    'bible.audio': 'Leitura de Áudio',
    'bible.stop': 'Parar',
    'bible.loading': 'Abrindo o manuscrito...',
    'bible.error': 'Erro de conexão.',
    'bible.search_book': 'Pesquisar livro...',
    'bible.search_verse_placeholder': 'Pesquisar um versículo na Bíblia',
    'bible.compare': 'Comparar',
    'bible.strongs': 'Strongs',
    'bible.chapter_label': 'capítulo',
    'bible.translation.louis_segond': 'Darby 1890',
    'bible.translation.semeur': 'Semeur',
    'bible.translation.segond_21': 'Segond 21',
    'bible.translation.martin': 'Martin',
    'bible.translation.darby': 'Darby',
    'bible.translation.ostervald': 'Ostervald',
    'bible.translation.king_james': 'King-James',
    'bible.no_book_found': 'Nenhum livro encontrado',
    'bible.read_aloud': 'Ler em voz alta',
    'bible.stop_reading': 'Parar leitura',
    'bible.error_timeout': 'O carregamento está demorando muito. Tente novamente.',
    'bible.error_not_found': 'Este capítulo não existe.',
    'bible.copy': 'Copiar',
    'bible.copied': 'Copiado!',
    'contact.title': 'Contate-nos',
    'about.title': 'Sobre nós',
    'donation.title': 'Apoiar o projeto',
    'comments.title': 'Comentários',
    'comments.placeholder': 'Deixe um comentário...',
    'comments.submit': 'Enviar',
    'comments.approve': 'Aprovar',
    'comments.delete': 'Excluir',
    'comments.pending': 'Aguardando aprovação',
    'comments.no_comments': 'Nenhum comentário ainda.',
    'comments.login_to_post': 'Faça login para deixar um comentário.',
    'comments.login_button': 'Entrar com Google',
    'comments.count_singular': 'Comentário',
    'comments.count_plural': 'Comentários',
    'blog.title': 'Livro de Visitas e Testemunhos',
    'verse.day_title': 'PALAVRA DO DIA',
    'verse.reflection_label': 'Reflexão:',
    'verse.title': 'Palavra do Dia',
    'verse.fallback.text': 'E tudo o que pedirdes na oração, crendo, o recebereis.',
    'verse.fallback.reference': 'Mateus 21:22',
    'verse.fallback.reflection': 'A fé é a chave que abre as portas das bênçãos divinas.',
    'verse.fallback_error.text': 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigénito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.',
    'verse.fallback_error.reference': 'João 3:16',
    'verse.fallback_error.reflection': 'O amor de Deus é o fundamento da nossa esperança e salvação.',
  },
  it: {
    'nav.home': 'Home',
    'nav.cinema': 'Cinema',
    'nav.bible_history': 'Storia Biblica',
    'nav.christian_history': 'Storia Cristiana e Documentari',
    'nav.animation': 'Animazione',
    'nav.audio': 'Audio',
    'nav.library': 'Biblioteca',
    'nav.gallery': 'Galleria',
    'nav.contact': 'Contatto',
    'nav.about': 'Informazioni',
    'nav.donate': 'Donare',
    'nav.share': 'Condividi il sito',
    'bible.version_label': 'Versione Louis Segond',
    'search.placeholder': 'Cerca...',
    'hero.title': 'La Mia Grazia Ti Basta',
    'hero.subtitle': 'Cinema, Biblioteca e Galleria Cristiana',
    'section.biblical_movies': 'Storie Bibliche',
    'section.other_movies': 'Vita Cristiana e Documentari',
    'section.animated_movies': 'Cartoni Animati',
    'section.multimedia': 'Multimedia e Audio',
    'section.books': 'Biblioteca Digitale',
    'section.images': 'Galleria di Immagini',
    'footer.rights': 'Tutti i diritti riservati',
    'modal.close': 'Chiudi',
    'modal.back': 'Indietro',
    'bible.version': 'Versione',
    'bible.book': 'Libro',
    'bible.chapter': 'Capitolo',
    'bible.verse': 'Versetto',
    'bible.audio': 'Lettura Audio',
    'bible.stop': 'Ferma',
    'bible.loading': 'Apertura del manoscritto...',
    'bible.error': 'Errore di connessione.',
    'bible.search_book': 'Cerca libro...',
    'bible.search_verse_placeholder': 'Cerca un versetto nella Bibbia',
    'bible.compare': 'Confronta',
    'bible.strongs': 'Strongs',
    'bible.chapter_label': 'capitolo',
    'bible.translation.louis_segond': 'Darby 1890',
    'bible.translation.semeur': 'Semeur',
    'bible.translation.segond_21': 'Segond 21',
    'bible.translation.martin': 'Martin',
    'bible.translation.darby': 'Darby',
    'bible.translation.ostervald': 'Ostervald',
    'bible.translation.king_james': 'King-James',
    'bible.no_book_found': 'Nessun libro trovato',
    'bible.read_aloud': 'Leggi ad alta voce',
    'bible.stop_reading': 'Interrompi lettura',
    'bible.error_timeout': 'Il caricamento richiede troppo tempo. Riprova.',
    'bible.error_not_found': 'Questo capitolo non esiste.',
    'bible.copy': 'Copia',
    'bible.copied': 'Copiato!',
    'contact.title': 'Contattaci',
    'about.title': 'Chi siamo',
    'donation.title': 'Sostieni il progetto',
    'comments.title': 'Commenti',
    'comments.placeholder': 'Lascia un commento...',
    'comments.submit': 'Invia',
    'comments.approve': 'Approva',
    'comments.delete': 'Elimina',
    'comments.pending': 'In attesa di approvazione',
    'comments.no_comments': 'Ancora nessun commento.',
    'comments.login_to_post': 'Accedi per lasciare un commento.',
    'comments.login_button': 'Accedi con Google',
    'comments.count_singular': 'Commento',
    'comments.count_plural': 'Commenti',
    'blog.title': 'Libro degli ospiti e testimonianze',
    'verse.day_title': 'PAROLA DEL GIORNO',
    'verse.reflection_label': 'Riflessione:',
    'verse.title': 'Parola del Giorno',
    'verse.fallback.text': 'E tutte le cose che domanderete con preghiera, avendo fede, le otterrete.',
    'verse.fallback.reference': 'Matteo 21:22',
    'verse.fallback.reflection': 'La fede è la chiave che apre le porte delle benedizioni divine.',
    'verse.fallback_error.text': 'Perché Dio ha tanto amato il mondo, che ha dato il suo unigenito Figlio, affinché chiunque crede in lui non perisca, ma abbia vita eterna.',
    'verse.fallback_error.reference': 'Giovanni 3:16',
    'verse.fallback_error.reflection': 'L\'amore di Dio è il fondamento della nostra speranza e salvezza.',
  },
  de: {
    'nav.home': 'Startseite',
    'nav.cinema': 'Kino',
    'nav.bible_history': 'Biblische Geschichte',
    'nav.christian_history': 'Christliche Geschichte & Dokumentation',
    'nav.animation': 'Animation',
    'nav.audio': 'Audio',
    'nav.library': 'Bibliothek',
    'nav.gallery': 'Galerie',
    'nav.contact': 'Kontakt',
    'nav.about': 'Über uns',
    'nav.donate': 'Spenden',
    'nav.share': 'Seite teilen',
    'bible.version_label': 'Schlachter 2000',
    'search.placeholder': 'Suchen...',
    'hero.title': 'Meine Gnade genügt dir',
    'hero.subtitle': 'Christliches Kino, Bibliothek und Galerie',
    'section.biblical_movies': 'Biblische Geschichten',
    'section.other_movies': 'Christliches Leben & Dokumentationen',
    'section.animated_movies': 'Zeichentrickfilme',
    'section.multimedia': 'Multimedia & Audio',
    'section.books': 'Digitale Bibliothek',
    'section.images': 'Bildergalerie',
    'footer.rights': 'Alle Rechte vorbehalten',
    'modal.close': 'Schließen',
    'modal.back': 'Zurück',
    'bible.version': 'Version',
    'bible.book': 'Buch',
    'bible.chapter': 'Kapitel',
    'bible.verse': 'Vers',
    'bible.audio': 'Audio-Lesung',
    'bible.stop': 'Stopp',
    'bible.loading': 'Manuskript wird geöffnet...',
    'bible.error': 'Verbindungsfehler.',
    'bible.search_book': 'Buch suchen...',
    'bible.search_verse_placeholder': 'Suche einen Vers in der Bibel',
    'bible.compare': 'Vergleichen',
    'bible.strongs': 'Strongs',
    'bible.chapter_label': 'Kapitel',
    'bible.translation.louis_segond': 'Darby 1890',
    'bible.translation.semeur': 'Semeur',
    'bible.translation.segond_21': 'Segond 21',
    'bible.translation.martin': 'Martin',
    'bible.translation.darby': 'Darby',
    'bible.translation.ostervald': 'Ostervald',
    'bible.translation.king_james': 'King-James',
    'bible.no_book_found': 'Kein Buch gefunden',
    'bible.read_aloud': 'Vorlesen',
    'bible.stop_reading': 'Lesen stoppen',
    'bible.error_timeout': 'Das Laden dauert zu lange. Bitte versuchen Sie es erneut.',
    'bible.error_not_found': 'Dieses Kapitel existiert nicht.',
    'bible.copy': 'Kopieren',
    'bible.copied': 'Kopiert!',
    'contact.title': 'Kontaktieren Sie uns',
    'about.title': 'Über uns',
    'donation.title': 'Projekt unterstützen',
    'comments.title': 'Kommentare',
    'comments.placeholder': 'Hinterlasse einen Kommentar...',
    'comments.submit': 'Senden',
    'comments.approve': 'Genehmigen',
    'comments.delete': 'Löschen',
    'comments.pending': 'Wartet auf Genehmigung',
    'comments.no_comments': 'Noch keine Kommentare.',
    'comments.login_to_post': 'Melden Sie sich an, um einen Kommentar zu hinterlassen.',
    'comments.login_button': 'Mit Google anmelden',
    'comments.count_singular': 'Kommentar',
    'comments.count_plural': 'Kommentare',
    'blog.title': 'Gästebuch & Zeugnisse',
    'verse.day_title': 'WORT DES TAGES',
    'verse.reflection_label': 'Reflexion:',
    'verse.title': 'Wort des Tages',
    'verse.fallback.text': 'Und alles, was ihr bittet im Gebet, wenn ihr glaubet, so werdet ihr\'s empfangen.',
    'verse.fallback.reference': 'Matthäus 21:22',
    'verse.fallback.reflection': 'Glaube ist der Schlüssel, der die Türen zu göttlichen Segnungen öffnet.',
    'verse.fallback_error.text': 'Denn also hat Gott die Welt geliebt, daß er seinen eingeborenen Sohn gab, auf daß alle, die an ihn glauben, nicht verloren werden, sondern das ewige Leben haben.',
    'verse.fallback_error.reference': 'Johannes 3:16',
    'verse.fallback_error.reflection': 'Gottes Liebe ist das Fundament unserer Hoffnung und Erlösung.',
  },
  ar: {
    'nav.home': 'الصفحة الرئيسية',
    'nav.sections': 'الأقسام',
    'nav.cinema': 'السينما',
    'nav.bible_history': 'التاريخ الكتابي',
    'nav.christian_history': 'التاريخ المسيحي والوثائقي',
    'nav.animation': 'رسوم متحركة',
    'nav.audio': 'صوتيات',
    'nav.library': 'المكتبة',
    'nav.gallery': 'المعرض',
    'nav.testimonials': 'شهادات',
    'nav.contact': 'اتصل بنا',
    'nav.about': 'من نحن',
    'nav.donate': 'تبرع',
    'nav.share': 'شارك الموقع',
    'nav.translate': 'ترجمة',
    'section.biblical_movies': 'قصص كتابية',
    'section.other_movies': 'حياة مسيحية ووثائقيات',
    'section.animated_movies': 'رسوم متحركة',
    'section.multimedia': 'وسائط متعددة وصوتيات',
    'section.books': 'المكتبة الرقمية',
    'section.images': 'معرض الصور',
    'search.placeholder': 'ابحث عن فيلم، كتاب...',
    'logo.title': 'MGTS',
    'logo.subtitle': 'نعمتي تكفيك',
    'verse.day_title': 'آية اليوم',
    'verse.reflection_label': 'تأمل:',
    'bible.version_label': 'فاندايك',
    'footer.rights': 'جميع الحقوق محفوظة',
    'modal.close': 'إغلاق',
    'modal.back': 'رجوع',
    'bible.version': 'الإصدار',
    'bible.book': 'السفر',
    'bible.chapter': 'الإصحاح',
    'bible.verse': 'الآية',
    'bible.audio': 'قراءة صوتية',
    'bible.stop': 'إيقاف',
    'bible.loading': 'جاري فتح المخطوطة...',
    'bible.error': 'خطأ في الاتصال.',
    'bible.search_book': 'بحث عن سفر...',
    'bible.search_verse_placeholder': 'بحث عن آية في الكتاب المقدس',
    'bible.compare': 'مقارنة',
    'bible.strongs': 'سترونج',
    'bible.chapter_label': 'إصحاح',
    'bible.no_book_found': 'لم يتم العثور على سفر',
    'bible.read_aloud': 'قراءة بصوت عالٍ',
    'bible.stop_reading': 'إيقاف القراءة',
    'bible.copy': 'نسخ',
    'bible.copied': 'تم النسخ!',
    'contact.title': 'اتصل بنا',
    'about.title': 'من نحن',
    'donation.title': 'دعم المشروع',
    'comments.title': 'تعليقات',
    'comments.placeholder': 'اترك تعليقاً...',
    'comments.submit': 'إرسال',
    'comments.approve': 'موافقة',
    'comments.delete': 'حذف',
    'comments.pending': 'في انتظار الموافقة',
    'comments.no_comments': 'لا توجد تعليقات بعد.',
    'comments.login_to_post': 'سجل الدخول لترك تعليق.',
    'comments.login_button': 'سجل الدخول باستخدام جوجل',
    'comments.count_singular': 'تعليق',
    'comments.count_plural': 'تعليقات',
    'blog.title': 'سجل الزوار والشهادات',
    'verse.title': 'آية اليوم',
  },
  ln: {
    'nav.home': 'Ebandeli',
    'nav.sections': 'Biteni',
    'nav.cinema': 'Sinema',
    'nav.bible_history': 'Lisolo ya Biblia',
    'nav.christian_history': 'Lisolo ya Bakristo',
    'nav.animation': 'Bilili ya bana',
    'nav.audio': 'Audio',
    'nav.library': 'Bibliotɛkɛ',
    'nav.gallery': 'Galeri',
    'nav.testimonials': 'Témoignages',
    'nav.contact': 'Kutana na biso',
    'nav.about': 'Mpo na biso',
    'nav.donate': 'Kopesa',
    'nav.share': 'Kokabola site',
    'nav.translate': 'Kobongola',
    'section.biblical_movies': 'Masolo ya Biblia',
    'section.other_movies': 'Bomoi ya Bakristo',
    'section.animated_movies': 'Bilili ya bana',
    'section.multimedia': 'Multimedia mpe Audio',
    'section.books': 'Bibliotɛkɛ ya nzeté',
    'section.images': 'Galeri ya bilili',
    'search.placeholder': 'Koluka filme, buku...',
    'logo.title': 'MGTS',
    'logo.subtitle': 'Ngolu na ngai ekoki mpo na yo',
    'verse.day_title': 'LILOBA YA MOKOLO',
    'verse.reflection_label': 'Likanisi:',
    'bible.version_label': 'Biblia na Lingala',
    'footer.rights': 'Lotómo nyonso ebatelami',
    'modal.close': 'Kokanga',
    'modal.back': 'Kozonga nsima',
    'bible.version': 'Libongoli',
    'bible.book': 'Buku',
    'bible.chapter': 'Mokapo',
    'bible.verse': 'Vɛrsɛ',
    'bible.audio': 'Botángi ya Audio',
    'bible.stop': 'Kotɛlɛma',
    'bible.loading': 'Kofungola buku...',
    'bible.error': 'Zunguluke ya mopepe.',
    'bible.search_book': 'Koluka buku...',
    'bible.search_verse_placeholder': 'Koluka vɛrsɛ na Biblia',
    'bible.compare': 'Kokokanisa',
    'bible.strongs': 'Strongs',
    'bible.chapter_label': 'mokapo',
    'bible.no_book_found': 'Buku emonani te',
    'bible.read_aloud': 'Kotánga na mongongo',
    'bible.stop_reading': 'Kotika kotánga',
    'bible.copy': 'Kokopi',
    'bible.copied': 'Ekopi!',
    'contact.title': 'Kutana na biso',
    'about.title': 'Mpo na biso',
    'donation.title': 'Kosunga mosala',
    'comments.title': 'Bikomami',
    'comments.placeholder': 'Tika likanisi...',
    'comments.submit': 'Kotinda',
    'comments.approve': 'Kondima',
    'comments.delete': 'Kolongola',
    'comments.pending': 'Ezelaka kondimama',
    'comments.no_comments': 'Naino bikomami te.',
    'comments.login_to_post': 'Koma nkombo mpo na kotika likanisi.',
    'comments.login_button': 'Koma nkombo na Google',
    'comments.count_singular': 'Likanisi',
    'comments.count_plural': 'Bikanisi',
    'blog.title': 'Buku ya bapaya mpe litatoli',
    'verse.title': 'Liloba ya Mokolo',
  }
} as any;

const languageNames: Record<string, string> = {
  'fr': 'French', 'en': 'English', 'pt': 'Portuguese', 'es': 'Spanish',
  'de': 'German', 'it': 'Italian', 'la': 'Latin', 'el': 'Greek',
  'ln': 'Lingala', 'kg': 'Kikongo', 'wo': 'Wolof', 'hi': 'Hindi',
  'ja': 'Japanese', 'ko': 'Korean', 'sw': 'Swahili', 'rw': 'Kinyarwanda',
  'am': 'Amharic', 'iw': 'Hebrew', 'ar': 'Arabic', 'ru': 'Russian', 'zh-CN': 'Chinese (Simplified)'
};

// Initialize Gemini AI outside to keep instance stable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// --- CONFIGURATION ---
const CACHE_VERSION = 'v138'; // Increment to force cache clear

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('mgts_target_lang') as Language) || 'fr';
  });

  const [dynamicTranslations, setDynamicTranslations] = useState<Record<string, string>>(() => {
    const initialLang = (localStorage.getItem('mgts_target_lang') as Language) || 'fr';
    const saved = localStorage.getItem(`mgts_dynamic_cache_${initialLang}_${CACHE_VERSION}`);
    return saved ? JSON.parse(saved) : {};
  });
  
  const currentLanguageRef = useRef<Language>(language);

  // Sync ref with state
  useEffect(() => {
    currentLanguageRef.current = language;
  }, [language]);

  useEffect(() => {
    const handleLanguageChange = (e: any) => {
      const newLang = e.detail as Language;
      if (newLang !== language) {
        setLanguageState(newLang);
        const saved = localStorage.getItem(`mgts_dynamic_cache_${newLang}_${CACHE_VERSION}`);
        setDynamicTranslations(saved ? JSON.parse(saved) : {});
      }
    };
    window.addEventListener('siteLanguageChanged', handleLanguageChange as EventListener);
    return () => window.removeEventListener('siteLanguageChanged', handleLanguageChange as EventListener);
  }, [language]);

  const setLanguage = (lang: Language) => {
    if (lang === language) return;
    
    setLanguageState(lang);
    localStorage.setItem('mgts_target_lang', lang);
    
    // Update cache immediately to prevent mixing
    const saved = localStorage.getItem(`mgts_dynamic_cache_${lang}_${CACHE_VERSION}`);
    setDynamicTranslations(saved ? JSON.parse(saved) : {});
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Trigger the global event for index.html and other components
    window.dispatchEvent(new CustomEvent('siteLanguageChanged', { detail: lang }));
    
    // Also trigger Google Translate if available
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event('change'));
      combo.dispatchEvent(new Event('input'));
    }
  };

  const t = useCallback((key: string): string => {
    // 1. Check static translations for current language
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    
    const frenchText = translations['fr'][key];
    if (!frenchText) return key;

    // 2. Check dynamic translations for the French text
    if (dynamicTranslations[frenchText]) {
      return dynamicTranslations[frenchText];
    }
    
    // 3. Fallback to French static translation
    return frenchText;
  }, [language, dynamicTranslations]);

  const [isConfigured, setIsConfigured] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  
  // Singleton translation queue to prevent multiple parallel requests to Gemini
  const translationQueueRef = useRef<{
    texts: string[];
    sourceLang: string;
    targetLang: string;
    resolve: (value: string | string[]) => void;
    reject: (reason: any) => void;
  }[]>([]);
  const isProcessingQueueRef = useRef(false);

  const processTranslationQueue = useCallback(async () => {
    if (isProcessingQueueRef.current || translationQueueRef.current.length === 0) return;
    
    isProcessingQueueRef.current = true;
    
    while (translationQueueRef.current.length > 0) {
      if (isRateLimited || isPermissionDenied) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        if (isRateLimited || isPermissionDenied) break;
      }

      const request = translationQueueRef.current.shift();
      if (!request) continue;

      const { texts, sourceLang, targetLang, resolve, reject } = request;
      const originalRequestWasArray = Array.isArray(request.texts);

      try {
        const targetLangName = languageNames[targetLang] || targetLang;
        const sourceLangName = languageNames[sourceLang] || sourceLang;

        const currentCache = JSON.parse(localStorage.getItem(`mgts_dynamic_cache_${targetLang}_${CACHE_VERSION}`) || '{}');
        const finalResults: string[] = new Array(texts.length);
        const missingIndices: number[] = [];
        const missingTexts: string[] = [];

        texts.forEach((text, i) => {
          if (currentCache[text]) {
            finalResults[i] = currentCache[text];
          } else {
            missingIndices.push(i);
            missingTexts.push(text);
          }
        });

        if (missingTexts.length === 0) {
          resolve(originalRequestWasArray ? finalResults : finalResults[0]);
          continue;
        }

        const CHUNK_SIZE = 15;
        const allNewTranslations: string[] = [];
        
        for (let i = 0; i < missingTexts.length; i += CHUNK_SIZE) {
          if (isRateLimited || isPermissionDenied) break;
          
          const chunk = missingTexts.slice(i, i + CHUNK_SIZE);
          if (i > 0) {
            await new Promise(r => setTimeout(r, 4000));
          }

          try {
            const response = await withRetry(() => ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: `Translate to ${targetLangName} (Christian site): ${JSON.stringify(chunk)}. 
              Return ONLY JSON array of strings. No formatting.`,
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              }
            }), 3, 5000);

            const text = response.text || "[]";
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed)) {
              allNewTranslations.push(...parsed.slice(0, chunk.length));
              while (allNewTranslations.length < (i + chunk.length)) {
                allNewTranslations.push(chunk[allNewTranslations.length - i]);
              }
            } else {
              allNewTranslations.push(...chunk);
            }
          } catch (chunkErr: any) {
            console.error("Chunk translation failure:", chunkErr);
            allNewTranslations.push(...chunk);
            if (chunkErr.message?.includes('429') || chunkErr.status === 'RESOURCE_EXHAUSTED') {
              setIsRateLimited(true);
              setTimeout(() => setIsRateLimited(false), 90000);
              break;
            }
          }
        }

        setDynamicTranslations(prev => {
          const newCache = { ...prev };
          allNewTranslations.forEach((translated, index) => {
            const original = missingTexts[index];
            if (original) {
              newCache[original] = translated;
              finalResults[missingIndices[index]] = translated;
            }
          });
          localStorage.setItem(`mgts_dynamic_cache_${targetLang}_${CACHE_VERSION}`, JSON.stringify(newCache));
          return newCache;
        });

        resolve(originalRequestWasArray ? finalResults : finalResults[0]);
      } catch (err: any) {
        console.error("Critical queue error:", err);
        reject(err);
      }
    }
    
    isProcessingQueueRef.current = false;
  }, [isRateLimited, isPermissionDenied]);

  const translateDynamic = useCallback((text: string | string[], sourceLang?: string): Promise<string | string[]> => {
    const effectiveSource = sourceLang || 'fr';
    if (!text || !isConfigured || isRateLimited || isPermissionDenied || language === effectiveSource) {
      return Promise.resolve(text);
    }
    
    const texts = Array.isArray(text) ? text : [text];
    
    return new Promise((resolve, reject) => {
      translationQueueRef.current.push({
        texts,
        sourceLang: effectiveSource,
        targetLang: language,
        resolve: resolve as any,
        reject
      });
      setTimeout(() => processTranslationQueue(), 100);
    });
  }, [language, isConfigured, isRateLimited, isPermissionDenied, processTranslationQueue]);

  useEffect(() => {
    const translateUI = async () => {
      if (language === 'fr' || isRateLimited || isPermissionDenied) return;
      
      const missingTexts: string[] = [];
      const frenchEntries = Object.entries(translations['fr']);
      
      frenchEntries.forEach(([key, frenchText]) => {
        const isStaticTranslated = translations[language] && translations[language][key];
        const isDynamicTranslated = dynamicTranslations[frenchText];
        
        if (!isStaticTranslated && !isDynamicTranslated) {
          missingTexts.push(frenchText);
        }
      });

      if (missingTexts.length > 0) {
        // Increase wave size to 60 items to get more done per session
        const limitedTexts = missingTexts.slice(0, 60);
        
        // Add a small delay before starting the translation to avoid rapid-fire batches
        // especially when the component re-renders
        const timer = setTimeout(async () => {
          await translateDynamic(limitedTexts, 'fr');
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    };
    translateUI();
  }, [language, translateDynamic, dynamicTranslations, isRateLimited, isPermissionDenied]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateDynamic }}>
      {children}
    </LanguageContext.Provider>
  );
};
