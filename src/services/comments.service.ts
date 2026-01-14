/**
 * Comments Service
 * API service for book comment operations
 */

import apiClient from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
    Comment,
    CreateCommentRequest,
    UpdateCommentRequest,
    ApiResponse
} from '../types/api.types';

export const commentsService = {
    // Get comments by book
    getByBook: async (bookId: number): Promise<Comment[]> => {
        const response: ApiResponse<Comment[]> = await apiClient.get(
            API_ENDPOINTS.BOOKS.COMMENTS(bookId)
        );
        return response.data;
    },

    // Create comment
    create: async (bookId: number, commentData: CreateCommentRequest): Promise<void> => {
        await apiClient.post(
            API_ENDPOINTS.BOOKS.COMMENTS(bookId),
            commentData
        );
    },

    // Update comment
    update: async (bookId: number, commentId: number, commentData: UpdateCommentRequest): Promise<void> => {
        await apiClient.put(
            API_ENDPOINTS.BOOKS.COMMENT_BY_ID(bookId, commentId),
            commentData
        );
    },

    // Delete comment
    delete: async (bookId: number, commentId: number): Promise<void> => {
        await apiClient.delete(
            API_ENDPOINTS.BOOKS.COMMENT_BY_ID(bookId, commentId)
        );
    },
};
