export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive' | 'banned';
  createdAt: string;
  lastLogin?: string;
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  booksCount: number;
  createdAt: string;
}

export interface AdminBook {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  coverUrl: string;
  description: string;
<<<<<<< HEAD
  genre: string[];
=======
  genre: string;
>>>>>>> 6cd3856ed10f6540887912c908fca38fdea82d1b
  status: 'published' | 'draft' | 'archived';
  totalChapters: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

