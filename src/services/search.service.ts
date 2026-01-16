import api from '@/lib/api-client';
import type { SearchResponse, SearchParams } from '@/types/search.types';

/**
 * Search Service
 * Handles all search-related API calls
 */
class SearchService {
  /**
   * Search books by title
   * GET /api/search/books/by-title
   */
  async searchByTitle(params: SearchParams): Promise<SearchResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('keyword', params.keyword);
    if (params.categoryId) queryParams.append('categoryId', String(params.categoryId));
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    if (params.page !== undefined) queryParams.append('page', String(params.page));
    if (params.size !== undefined) queryParams.append('size', String(params.size));

    const response = await api.get(`/search/books/by-title?${queryParams.toString()}`);
    return response.data;
  }

  /**
   * Search books by author name
   * GET /api/search/books/by-author
   */
  async searchByAuthor(params: SearchParams): Promise<SearchResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('keyword', params.keyword);
    if (params.categoryId) queryParams.append('categoryId', String(params.categoryId));
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    if (params.page !== undefined) queryParams.append('page', String(params.page));
    if (params.size !== undefined) queryParams.append('size', String(params.size));

    const response = await api.get(`/search/books/by-author?${queryParams.toString()}`);
    return response.data;
  }

  /**
   * Search books by category
   * GET /api/search/books/by-category/{categoryId}
   */
  async searchByCategory(categoryId: number, params: Omit<SearchParams, 'categoryId'>): Promise<SearchResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('keyword', params.keyword);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    if (params.page !== undefined) queryParams.append('page', String(params.page));
    if (params.size !== undefined) queryParams.append('size', String(params.size));

    const response = await api.get(`/search/books/by-category/${categoryId}?${queryParams.toString()}`);
    return response.data;
  }

  /**
   * Search books by content (full-text search in chapters)
   * GET /api/search/books/by-content
   */
  async searchByContent(params: SearchParams): Promise<SearchResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('keyword', params.keyword);
    if (params.categoryId) queryParams.append('categoryId', String(params.categoryId));
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    if (params.page !== undefined) queryParams.append('page', String(params.page));
    if (params.size !== undefined) queryParams.append('size', String(params.size));

    const response = await api.get(`/search/books/by-content?${queryParams.toString()}`);
    return response.data;
  }

  /**
   * Combined search (searches title first, then content if no results)
   * GET /api/search/books/all
   */
  async searchAll(params: SearchParams): Promise<SearchResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('keyword', params.keyword);
    if (params.categoryId) queryParams.append('categoryId', String(params.categoryId));
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
    if (params.page !== undefined) queryParams.append('page', String(params.page));
    if (params.size !== undefined) queryParams.append('size', String(params.size));

    const response = await api.get(`/search/books/all?${queryParams.toString()}`);
    return response.data;
  }
}

export const searchService = new SearchService();
