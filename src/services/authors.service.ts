/**
 * Authors Service
 * API service for author operations
 */

import apiClient from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
    Author,
    CreateAuthorRequest,
    UpdateAuthorRequest,
    ApiResponse
} from '../types/api.types';

export const authorsService = {
    // Get all authors
    getAll: async (): Promise<Author[]> => {
        const response = await apiClient.get<ApiResponse<Author[]>>(
            API_ENDPOINTS.AUTHORS.LIST
        );
        return response.data.data;
    },

    // Get author by ID
    getById: async (id: number): Promise<Author> => {
        const response = await apiClient.get<ApiResponse<Author>>(
            API_ENDPOINTS.AUTHORS.DETAIL(id)
        );
        return response.data.data;
    },

    // Create author
    create: async (authorData: CreateAuthorRequest): Promise<Author> => {
        const response = await apiClient.post<ApiResponse<Author>>(
            API_ENDPOINTS.AUTHORS.CREATE,
            authorData
        );
        return response.data.data;
    },

    // Update author
    update: async (id: number, authorData: UpdateAuthorRequest): Promise<Author> => {
        const response = await apiClient.post<ApiResponse<Author>>(
            API_ENDPOINTS.AUTHORS.UPDATE(id),
            authorData
        );
        return response.data.data;
    },

    // Delete author
    delete: async (id: number): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.AUTHORS.DELETE(id));
    },
};
