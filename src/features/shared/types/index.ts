export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  genre: string[];
  rating: number;
  reviewCount: number;
  producer?: string;
  releaseStatus?: string;
  totalChapters?: number;
  currentChapter?: number;
  lastReadDate?: string;
  lastReadTime?: string;
  isSaved?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Chapter {
  id: string;
  bookId: string;
  number: number;
  title: string;
  content: string;
}
