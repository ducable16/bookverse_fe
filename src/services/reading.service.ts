/**
 * Reading Service
 * API service for reading history and saved books
 */

import apiClient from '../lib/api-client';
import type {
    ReadingHistory,
    SavedBook,
    UpdateProgressRequest,
    ApiResponse
} from '../types/api.types';

export const readingService = {
    /**
     * Get user's reading history
     */
    getReadingHistory: async (): Promise<ReadingHistory[]> => {
        const response = await apiClient.get<ApiResponse<ReadingHistory[]>>(
            '/user/reading-history'
        );
        return response as unknown as ReadingHistory[];
    },


    /**
     * Update reading progress
     */
    updateProgress: async (data: UpdateProgressRequest): Promise<ReadingHistory> => {
        const response = await apiClient.post<ApiResponse<ReadingHistory>>(
            '/user/reading-history',
            data
        );
        return response as unknown as ReadingHistory;
    },

    /**
     * Get user's saved books
     */
    getSavedBooks: async (): Promise<SavedBook[]> => {
        const response = await apiClient.get<ApiResponse<SavedBook[]>>(
            '/user/saved-books'
        );
        return response as unknown as SavedBook[];
    },

    /**
     * Save a book
     */
    saveBook: async (bookId: number): Promise<SavedBook> => {
        const response = await apiClient.post<ApiResponse<SavedBook>>(
            '/user/saved-books',
            { bookId }
        );
        return response as unknown as SavedBook;
    },

    /**
     * Remove a saved book
     */
    removeSavedBook: async (bookId: number): Promise<void> => {
        await apiClient.delete(`/user/saved-books/${bookId}`);
    },
};
