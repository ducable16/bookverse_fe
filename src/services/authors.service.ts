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
        const response: ApiResponse<Author[]> = await apiClient.get(
            API_ENDPOINTS.AUTHORS.LIST
        );
        console.log('Authors API Response:', response);
        console.log('Authors Data:', response.data);
        return response.data || [];
    },

    // Get author by ID
    getById: async (id: number): Promise<Author> => {
        const response: ApiResponse<Author> = await apiClient.get(
            API_ENDPOINTS.AUTHORS.DETAIL(id)
        );
        return response.data;
    },

    // Create author
    create: async (authorData: CreateAuthorRequest): Promise<Author> => {
        const response: ApiResponse<Author> = await apiClient.post(
            API_ENDPOINTS.AUTHORS.CREATE,
            authorData
        );
        return response.data;
    },

    // Update author
    update: async (id: number, authorData: UpdateAuthorRequest): Promise<Author> => {
        const response: ApiResponse<Author> = await apiClient.post(
            API_ENDPOINTS.AUTHORS.UPDATE(id),
            authorData
        );
        return response.data;
    },

    // Delete author
    delete: async (id: number): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.AUTHORS.DELETE(id));
    },
};
