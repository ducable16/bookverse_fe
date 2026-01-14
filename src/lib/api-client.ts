/**
 * API Client
 * Axios instance configured with interceptors for authentication and error handling
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_URL, REQUEST_TIMEOUT, DEFAULT_HEADERS } from '../config/api.config';
import type { ApiResponse, ApiError } from '../types/api.types';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: REQUEST_TIMEOUT,
    headers: DEFAULT_HEADERS,
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors and transform responses
apiClient.interceptors.response.use(
    (response) => {
        // Return the data directly
        return response.data;
    },
    async (error: AxiosError<ApiError>) => {
        // Handle different error scenarios
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');

                    // Only redirect if not already on login page
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                    break;

                case 403:
                    // Forbidden
                    console.error('Access forbidden:', data.message);
                    break;

                case 404:
                    // Not found
                    console.error('Resource not found:', data.message);
                    break;

                case 500:
                    // Server error
                    console.error('Server error:', data.message);
                    break;

                default:
                    console.error('API error:', data.message);
            }

            // Return standardized error
            return Promise.reject({
                message: data.message || 'An error occurred',
                statusCode: status,
                errors: data.errors,
            } as ApiError);
        } else if (error.request) {
            // Request made but no response received
            return Promise.reject({
                message: 'Network error. Please check your connection.',
                statusCode: 0,
            } as ApiError);
        } else {
            // Something else happened
            return Promise.reject({
                message: error.message || 'An unexpected error occurred',
                statusCode: 0,
            } as ApiError);
        }
    }
);

// Helper function to handle API responses
export const handleApiResponse = <T>(response: ApiResponse<T>): T => {
    if (response.success) {
        return response.data;
    }
    throw new Error(response.error || response.message || 'API request failed');
};

export default apiClient;
