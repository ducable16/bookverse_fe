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
        const response: ApiResponse<Category[]> = await apiClient.get(
            API_ENDPOINTS.CATEGORIES.LIST
        );
        return response.data;
    },

    // Get category by ID
    getById: async (id: number): Promise<Category> => {
        const response: ApiResponse<Category> = await apiClient.get(
            API_ENDPOINTS.CATEGORIES.DETAIL(id)
        );
        return response.data;
    },

    // Get category by slug
    getBySlug: async (slug: string): Promise<Category> => {
        const response: ApiResponse<Category> = await apiClient.get(
            API_ENDPOINTS.CATEGORIES.BY_SLUG(slug)
        );
        return response.data;
    },

    // Create category
    create: async (categoryData: CreateCategoryRequest): Promise<Category> => {
        const response: ApiResponse<Category> = await apiClient.post(
            API_ENDPOINTS.CATEGORIES.CREATE,
            categoryData
        );
        return response.data;
    },

    // Update category
    update: async (id: number, categoryData: UpdateCategoryRequest): Promise<Category> => {
        const response: ApiResponse<Category> = await apiClient.post(
            API_ENDPOINTS.CATEGORIES.UPDATE(id),
            categoryData
        );
        return response.data;
    },

    // Delete category
    delete: async (id: number): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.CATEGORIES.DELETE(id));
    },
};
