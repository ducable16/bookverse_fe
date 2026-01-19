/**
 * Admin User Service
 * API service for admin user management operations
 */

import apiClient from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
    AdminUser,
    UserSearchRequest,
    UserPageResponse,
    AdminUserCreateRequest,
    AdminUserUpdateRequest,
    UserStatisticsResponse,
    Role
} from '../features/admin/types';

export const adminUserService = {
    /**
     * Get all users with search, filter, and pagination
     * GET /api/admin/users
     */
    getAllUsers: async (params?: UserSearchRequest): Promise<UserPageResponse> => {
        const response = await apiClient.get<UserPageResponse>(
            API_ENDPOINTS.ADMIN.USERS.BASE,
            { params }
        );
        return response.data;
    },

    /**
     * Get user by ID
     * GET /api/admin/users/{id}
     */
    getUserById: async (id: number): Promise<AdminUser> => {
        const response = await apiClient.get<AdminUser>(
            API_ENDPOINTS.ADMIN.USERS.BY_ID(id)
        );
        return response.data;
    },

    /**
     * Create new user (by admin)
     * POST /api/admin/users
     */
    createUser: async (userData: AdminUserCreateRequest): Promise<AdminUser> => {
        const response = await apiClient.post<AdminUser>(
            API_ENDPOINTS.ADMIN.USERS.BASE,
            userData
        );
        return response.data;
    },

    /**
     * Update user information
     * PUT /api/admin/users/{id}
     */
    updateUser: async (id: number, userData: AdminUserUpdateRequest): Promise<AdminUser> => {
        const response = await apiClient.put<AdminUser>(
            API_ENDPOINTS.ADMIN.USERS.BY_ID(id),
            userData
        );
        return response.data;
    },

    /**
     * Change user role
     * PUT /api/admin/users/{id}/role?role=ADMIN
     */
    changeUserRole: async (id: number, role: Role): Promise<AdminUser> => {
        const response = await apiClient.put<AdminUser>(
            `${API_ENDPOINTS.ADMIN.USERS.BY_ID(id)}/role`,
            null,
            { params: { role } }
        );
        return response.data;
    },

    /**
     * Toggle user status (block/unblock)
     * PUT /api/admin/users/{id}/toggle-status
     */
    toggleUserStatus: async (id: number): Promise<AdminUser> => {
        const response = await apiClient.put<AdminUser>(
            `${API_ENDPOINTS.ADMIN.USERS.BY_ID(id)}/toggle-status`
        );
        return response.data;
    },

    /**
     * Soft delete user
     * DELETE /api/admin/users/{id}
     */
    deleteUser: async (id: number): Promise<void> => {
        await apiClient.delete(API_ENDPOINTS.ADMIN.USERS.BY_ID(id));
    },

    /**
     * Get user statistics
     * GET /api/admin/users/statistics
     */
    getUserStatistics: async (): Promise<UserStatisticsResponse> => {
        const response = await apiClient.get<UserStatisticsResponse>(
            `${API_ENDPOINTS.ADMIN.USERS.BASE}/statistics`
        );
        return response.data;
    }
};
