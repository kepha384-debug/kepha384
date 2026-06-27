
export enum MediaType {
  MOVIE = 'MOVIE',
  VIDEO = 'VIDEO',
  BOOK = 'BOOK',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
}

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  subtitle?: string | null;
  description: string;
  imageUrl: string | null;
  secondaryImageUrl?: string | null;
  contentUrl?: string | null;
  subtitleUrl?: string | null;
  isNew?: boolean;
}
