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
    ApiResponse,
    User // Added User type
} from '../types/api.types';

export const authService = {
    // Login
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response: ApiResponse<LoginResponse> = await apiClient.post( // Added type annotation for response
            API_ENDPOINTS.AUTH.LOGIN,
            credentials
        );
        // apiClient interceptor returns response.data which is {code, message, data}
        // response.data contains the actual LoginResponse {token, username, email, role}
        return response.data; // Changed to directly return response.data
    },

    // Register
    register: async (userData: RegisterRequest): Promise<User> => { // Changed return type to Promise<User>
        const response: ApiResponse<User> = await apiClient.post( // Changed generic type for post and added type annotation for response
            API_ENDPOINTS.AUTH.REGISTER,
            userData
        );
        // API only returns success message, doesn't auto-login
        return response.data; // Added return statement
    },
};
