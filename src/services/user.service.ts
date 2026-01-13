/**
 * User Service
 * API service for user operations
 */

import apiClient from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
    User,
    ApiResponse
} from '../types/api.types';

export const userService = {
    // Get user by ID
    getById: async (id: number): Promise<User> => {
        const response = await apiClient.get<ApiResponse<User>>(
            API_ENDPOINTS.USERS.BY_ID(id)
        );
        return response.data.data;
    },
};
