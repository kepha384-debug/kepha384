# Mémoire du Projet - MGTS

## Correctifs Importants

### Bible Reader - Chargement Infini & Contrôles
- **Problème** : Le chargement des versets bibliques restait bloqué indéfiniment si l'API `bible-api.com` ne répondait pas ou si le navigateur ne supportait pas `AbortSignal.any()`.
- **Solution** : 
  - Implémentation d'un système de fusion manuelle des signaux d'annulation (`AbortController`).
  - Ajout d'un délai d'attente (timeout) de 15 secondes forcé.
  - Gestion robuste des erreurs avec possibilité de réessayer.
  - Persistance du livre et du chapitre en cours via `localStorage` pour éviter la perte de progression.
- **Contrôles de Lecture** : Ajout de boutons **Play** et **Pause** séparés. La lecture peut désormais être mise en pause et reprise exactement là où elle s'était arrêtée. L'arrêt est désormais **instantané** lors de l'appui sur pause grâce à l'annulation forcée de la synthèse vocale.
- **Fichier** : `/src/components/BibleReader.tsx`

### Navigation & Layout
- **Header** : Ajusté pour inclure la barre de langue et la barre de navigation avec un décalage correct pour les ancres de section (120px).
- **Bible** : Intégration d'un bouton retour et fermeture automatique lors de la navigation vers d'autres sections.

### Bible KJV & Traduction IA
- **Mise à jour (Français)** : La version française utilise désormais la **King James Version (KJV)** comme source, traduite dynamiquement en français par l'IA pour une fidélité optimale.
- **Correction Profonde (FR, ES, DE, HI)** : Correction d'un bug critique dans l'intégration de l'IA Gemini (serveur) qui empêchait le chargement des bibles de secours.
- **Système de Secours Robuste** : 
  - Pour les langues problématiques (Français, Espagnol, Allemand, Hindi), l'application utilise désormais l'IA Gemini comme source **primaire** ou **secondaire immédiate** pour garantir l'affichage systématique des versets.
  - Ajout d'une cascade de secours : si une langue échoue, l'IA tente de la traduire, et en dernier recours, la version anglaise (la plus stable) est affichée pour éviter un écran vide.
- **Voix Française** : Priorité donnée aux voix **Neural** ou **Google** (plus humaines) pour la lecture en français. La voix "Hortense" est désormais évitée car jugée trop robotisée.
- **Lecture des Titres** : La voix lit désormais le nom du livre et le numéro du chapitre avant les versets.
- **Nettoyage du Texte** : Suppression agressive de tous les chiffres insérés dans le texte biblique (numéros de Strong, notes de bas de page, etc.) pour un affichage professionnel.
- **Performance TTS** : 
  - Système de **pré-chargement (prefetching)** pour un enchaînement fluide des versets.
  - Pré-chargement du premier verset pour un démarrage instantané.
- **Cache** : Invalidation du cache IndexedDB (passage à `v10`) pour appliquer ces corrections en profondeur et vider les données corrompues.

### Déploiement & Serveur
- **Correctif** : Changement du script `start` pour utiliser `node server.ts` au lieu de `tsx` pour assurer la compatibilité en production.
- **Express v5** : Mise à jour de la route wildcard de `*` vers `*all` pour la compatibilité avec Express v5.

## Instructions pour les futurs agents
- Ne pas supprimer la logique de `AbortController` manuel dans `BibleReader.tsx`.
- Toujours utiliser `STORAGE_VERSION` pour la persistance `localStorage`.
- Maintenir le décalage de 120px pour le défilement vers les sections afin d'éviter que le Header ne cache le titre.
