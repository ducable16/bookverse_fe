/**
 * Categories Service
 * API service for category operations
 */

import apiClient from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
    Category,
    CreateCategoryRequest,
    UpdateCategoryRequest,
    ApiResponse
} from '../types/api.types';

export const categoriesService = {
    // Get all categories
    getAll: async (): Promise<Category[]> => {
        const response = await apiClient.get<ApiResponse<Category[]>>(
            API_ENDPOINTS.CATEGORIES.LIST
        );
        return response.data.data;
    },

    // Get category by ID
    getById: async (id: number): Promise<Category> => {
        const response = await apiClient.get<ApiResponse<Category>>(
            API_ENDPOINTS.CATEGORIES.DETAIL(id)
        );
        return response.data.data;
    },

    // Get category by slug
    getBySlug: async (slug: string): Promise<Category> => {
        const response = await apiClient.get<ApiResponse<Category>>(
            API_ENDPOINTS.CATEGORIES.BY_SLUG(slug)
        );
        return response.data.data;
    },

    // Create category
    create: async (categoryData: CreateCategoryRequest): Promise<Category> => {
        const response = await apiClient.post<ApiResponse<Category>>(
            API_ENDPOINTS.CATEGORIES.CREATE,
            categoryData
        );
        return response.data.data;
    },

    // Update category
    update: async (id: number, categoryData: UpdateCategoryRequest): Promise<Category> => {
        const response = await apiClient.post<ApiResponse<Category>>(
            API_ENDPOINTS.CATEGORIES.UPDATE(id),
            categoryData
        );
        return response.data.data;
    },

    // Delete category
    delete: async (id: number): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.CATEGORIES.DELETE(id));
    },
};
