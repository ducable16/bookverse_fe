/**
 * Auth Service
 * API service for authentication operations
 */

import apiClient from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    User,
    ApiResponse
} from '../types/api.types';

export const authService = {
    // Login
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<ApiResponse<LoginResponse>>(
            API_ENDPOINTS.AUTH.LOGIN,
            credentials
        );
        return response.data.data;
    },

    // Register
    register: async (userData: RegisterRequest): Promise<User> => {
        const response = await apiClient.post<ApiResponse<User>>(
            API_ENDPOINTS.AUTH.REGISTER,
            userData
        );
        return response.data.data;
    },
};
