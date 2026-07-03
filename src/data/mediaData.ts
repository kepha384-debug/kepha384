export interface MediaItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: "films" | "documentaires" | "audio" | "livres" | "galerie";
}

export const mediaData: MediaItem[] = [
  {
    id: "film-01",
    title: "Film spirituel",
    description: "Un film inspirant sur la foi et la persévérance.",
    image: "https://kepha384.b-cdn.net/Logos%20%26%20Banni%C3%A8res/icon-kepha384.png",
    category: "films",
  },
  {
    id: "doc-01",
    title: "Documentaire chrétien",
    description: "Un regard profond sur la grâce et la transformation.",
    image: "https://kepha384.b-cdn.net/Logos%20%26%20Banni%C3%A8res/icon-kepha384.png",
    category: "documentaires",
  },
  {
    id: "audio-01",
    title: "Podcast biblique",
    description: "Des échanges riches autour de la Parole de Dieu.",
    image: "https://kepha384.b-cdn.net/Logos%20%26%20Banni%C3%A8res/icon-kepha384.png",
    category: "audio",
  },
  {
    id: "livre-01",
    title: "Étude biblique",
    description: "Un ouvrage spirituel pour approfondir la connaissance biblique.",
    image: "https://kepha384.b-cdn.net/Logos%20%26%20Banni%C3%A8res/icon-kepha384.png",
    category: "livres",
  },
  {
    id: "galerie-01",
    title: "Lumière de grâce",
    description: "Une illustration chrétienne inspirante.",
    image: "https://kepha384.b-cdn.net/Logos%20%26%20Banni%C3%A8res/icon-kepha384.png",
    category: "galerie",
  },
];
