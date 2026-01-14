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
        const response = await apiClient.get<ApiResponse<User>>(
            API_ENDPOINTS.USERS.BY_ID(id)
        );
        return response.data.data;
    },

    // Update user
    update: async (id: number, userData: UserUpdateRequest): Promise<UserResponse> => {
        const response = await apiClient.post<ApiResponse<UserResponse>>(
            API_ENDPOINTS.USERS.BY_ID(id),
            userData
        );
        return response.data.data;
    },
};
