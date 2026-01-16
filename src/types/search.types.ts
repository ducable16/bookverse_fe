/**
 * Search API Types
 */

export type SearchMatchType = 'TITLE' | 'AUTHOR' | 'CATEGORY' | 'CONTENT';

export interface SearchResult {
  bookId: number;
  title: string;
  slug: string;
  coverImage: string;
  authorName: string;
  categoryNames: string[];
  snippet: string;
  matchType: SearchMatchType;
  totalChapters: number;
  matchedChapterId: number | null;
  matchedChapterTitle: string | null;
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  query: string;
}

export interface SearchParams {
  keyword: string;
  categoryId?: number;
  sortBy?: 'title' | 'createdAt' | 'relevance';
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  size?: number;
}
