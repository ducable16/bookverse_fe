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
    ApiResponse
} from '../types/api.types';

export const authService = {
    // Login
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<ApiResponse<LoginResponse>>(
            API_ENDPOINTS.AUTH.LOGIN,
            credentials
        );
        // apiClient interceptor returns response.data which is {code, message, data}
        // response.data contains the actual LoginResponse {token, username, email, role}
        return (response as any).data;
    },

    // Register
    register: async (userData: RegisterRequest): Promise<void> => {
        await apiClient.post<ApiResponse<{ message: string }>>(
            API_ENDPOINTS.AUTH.REGISTER,
            userData
        );
        // API only returns success message, doesn't auto-login
    },
};
