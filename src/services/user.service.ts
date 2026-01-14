import apiClient from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
    User,
    UserResponse,
    UserUpdateRequest,
    ApiResponse
} from '../types/api.types';

export const userService = {
    // Get user by ID
    getById: async (id: number): Promise<User> => {
        const response: ApiResponse<User> = await apiClient.get(
            API_ENDPOINTS.USERS.BY_ID(id)
        );
        return response.data;
    },

    // Update user
    update: async (id: number, userData: UserUpdateRequest): Promise<UserResponse> => {
        const response: ApiResponse<UserResponse> = await apiClient.post(
            API_ENDPOINTS.USERS.BY_ID(id),
            userData
        );
        return response.data;
    },
};
