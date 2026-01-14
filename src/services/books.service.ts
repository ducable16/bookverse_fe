/**
 * Books Service
 * API service for book operations
 */

import apiClient from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
    Book,
    CreateBookRequest,
    UpdateBookRequest,
    PaginationParams,
    ApiResponse
} from '../types/api.types';

export const booksService = {
    // Get all books
    getAll: async (): Promise<Book[]> => {
        const response = await apiClient.get<ApiResponse<Book[]>>(
            API_ENDPOINTS.BOOKS.LIST
        );
        console.log('Books API Response:', response);
        console.log('Books Data:', response.data);
        return response.data.data || [];
    },

    // Get book by ID
    getById: async (id: number): Promise<Book> => {
        const response = await apiClient.get<ApiResponse<Book>>(
            API_ENDPOINTS.BOOKS.DETAIL(id)
        );
        return response.data.data;
    },

    // Get book by slug
    getBySlug: async (slug: string): Promise<Book> => {
        const response = await apiClient.get<ApiResponse<Book>>(
            API_ENDPOINTS.BOOKS.BY_SLUG(slug)
        );
        return response.data.data;
    },

    // Search books
    search: async (keyword: string): Promise<Book[]> => {
        const response = await apiClient.get<ApiResponse<Book[]>>(
            API_ENDPOINTS.BOOKS.SEARCH,
            { params: { keyword } }
        );
        return response.data.data;
    },

    // Get books by category
    getByCategory: async (categoryId: number): Promise<Book[]> => {
        const response = await apiClient.get<ApiResponse<Book[]>>(
            API_ENDPOINTS.BOOKS.BY_CATEGORY(categoryId)
        );
        return response.data.data;
    },

    // Get books by author
    getByAuthor: async (authorId: number, params?: PaginationParams): Promise<Book[]> => {
        const response = await apiClient.get<ApiResponse<Book[]>>(
            API_ENDPOINTS.BOOKS.BY_AUTHOR(authorId),
            { params: { page: params?.page || 0, size: params?.size || 50 } }
        );
        return response.data.data;
    },

    // Create book
    create: async (bookData: CreateBookRequest): Promise<Book> => {
        const response = await apiClient.post<ApiResponse<Book>>(
            API_ENDPOINTS.BOOKS.CREATE,
            bookData
        );
        return response.data.data;
    },

    // Update book
    update: async (id: number, bookData: UpdateBookRequest): Promise<Book> => {
        const response = await apiClient.post<ApiResponse<Book>>(
            API_ENDPOINTS.BOOKS.UPDATE(id),
            bookData
        );
        return response.data.data;
    },

    // Delete book
    delete: async (id: number): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.BOOKS.DELETE(id));
    },
};
