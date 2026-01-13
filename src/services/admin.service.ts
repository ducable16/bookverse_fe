/**
 * Admin Service
 * API service for admin operations
 */

import apiClient from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
    DashboardStats,
    User,
    Book,
    Author,
    Category,
    PaginatedResponse,
    PaginationParams,
    ApiResponse
} from '../types/api.types';

export const adminService = {
    // Dashboard
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await apiClient.get<ApiResponse<DashboardStats>>(
            API_ENDPOINTS.ADMIN.DASHBOARD
        );
        return response.data;
    },

    // User Management
    users: {
        getAll: async (params?: PaginationParams): Promise<PaginatedResponse<User>> => {
            const response = await apiClient.get<ApiResponse<PaginatedResponse<User>>>(
                API_ENDPOINTS.ADMIN.USERS.BASE,
                { params }
            );
            return response.data;
        },

        getById: async (id: number): Promise<User> => {
            const response = await apiClient.get<ApiResponse<User>>(
                API_ENDPOINTS.ADMIN.USERS.BY_ID(id)
            );
            return response.data;
        },

        ban: async (id: number): Promise<void> => {
            await apiClient.post(API_ENDPOINTS.ADMIN.USERS.BAN(id));
        },

        unban: async (id: number): Promise<void> => {
            await apiClient.post(API_ENDPOINTS.ADMIN.USERS.UNBAN(id));
        },
    },

    // Book Management
    books: {
        getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Book>> => {
            const response = await apiClient.get<ApiResponse<PaginatedResponse<Book>>>(
                API_ENDPOINTS.ADMIN.BOOKS.BASE,
                { params }
            );
            return response.data;
        },

        getById: async (id: number): Promise<Book> => {
            const response = await apiClient.get<ApiResponse<Book>>(
                API_ENDPOINTS.ADMIN.BOOKS.BY_ID(id)
            );
            return response.data;
        },

        create: async (bookData: Partial<Book>): Promise<Book> => {
            const response = await apiClient.post<ApiResponse<Book>>(
                API_ENDPOINTS.ADMIN.BOOKS.CREATE,
                bookData
            );
            return response.data;
        },

        update: async (id: number, bookData: Partial<Book>): Promise<Book> => {
            const response = await apiClient.put<ApiResponse<Book>>(
                API_ENDPOINTS.ADMIN.BOOKS.UPDATE(id),
                bookData
            );
            return response.data;
        },

        delete: async (id: number): Promise<void> => {
            await apiClient.delete(API_ENDPOINTS.ADMIN.BOOKS.DELETE(id));
        },
    },

    // Author Management
    authors: {
        getAll: async (params?: PaginationParams): Promise<Author[]> => {
            const response = await apiClient.get<ApiResponse<Author[]>>(
                API_ENDPOINTS.ADMIN.AUTHORS.BASE,
                { params }
            );
            return response.data.data;
        },

        getById: async (id: number): Promise<Author> => {
            const response = await apiClient.get<ApiResponse<Author>>(
                API_ENDPOINTS.ADMIN.AUTHORS.BY_ID(id)
            );
            return response.data.data;
        },

        create: async (authorData: Partial<Author>): Promise<Author> => {
            const response = await apiClient.post<ApiResponse<Author>>(
                API_ENDPOINTS.ADMIN.AUTHORS.CREATE,
                authorData
            );
            return response.data.data;
        },

        update: async (id: number, authorData: Partial<Author>): Promise<Author> => {
            const response = await apiClient.put<ApiResponse<Author>>(
                API_ENDPOINTS.ADMIN.AUTHORS.UPDATE(id),
                authorData
            );
            return response.data.data;
        },

        delete: async (id: number): Promise<void> => {
            await apiClient.delete(API_ENDPOINTS.ADMIN.AUTHORS.DELETE(id));
        },
    },

    // Category Management
    categories: {
        getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Category>> => {
            const response = await apiClient.get<ApiResponse<PaginatedResponse<Category>>>(
                API_ENDPOINTS.ADMIN.CATEGORIES.BASE,
                { params }
            );
            return response.data;
        },

        getById: async (id: number): Promise<Category> => {
            const response = await apiClient.get<ApiResponse<Category>>(
                API_ENDPOINTS.ADMIN.CATEGORIES.BY_ID(id)
            );
            return response.data;
        },

        create: async (categoryData: Partial<Category>): Promise<Category> => {
            const response = await apiClient.post<ApiResponse<Category>>(
                API_ENDPOINTS.ADMIN.CATEGORIES.CREATE,
                categoryData
            );
            return response.data;
        },

        update: async (id: number, categoryData: Partial<Category>): Promise<Category> => {
            const response = await apiClient.put<ApiResponse<Category>>(
                API_ENDPOINTS.ADMIN.CATEGORIES.UPDATE(id),
                categoryData
            );
            return response.data;
        },

        delete: async (id: number): Promise<void> => {
            await apiClient.delete(API_ENDPOINTS.ADMIN.CATEGORIES.DELETE(id));
        },
    },
};
