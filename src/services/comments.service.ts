/**
 * Comments Service
 * API service for book comment operations
 */

import apiClient from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
    CommentResponse,
    CommentCreateRequest,
    UpdateCommentRequest,
    ApiResponse
} from '../types/api.types';

export const commentsService = {
    // Get comments by book (with nested replies)
    getByBook: async (bookId: number): Promise<CommentResponse[]> => {
        const response: ApiResponse<CommentResponse[]> = await apiClient.get(
            API_ENDPOINTS.BOOKS.COMMENTS(bookId)
        );
        return response.data;
    },

    // Create comment or reply
    create: async (bookId: number, content: string, parentId?: number): Promise<void> => {
        const commentData: CommentCreateRequest = {
            content,
            bookId,
            parentId,
        };
        await apiClient.post(
            API_ENDPOINTS.BOOKS.COMMENTS(bookId),
            commentData
        );
    },

    // Update comment
    update: async (bookId: number, commentId: number, content: string): Promise<void> => {
        const commentData: UpdateCommentRequest = { content };
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
