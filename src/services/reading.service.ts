/**
 * Reading Service
 * API service for reading history and saved books
 */

import apiClient from '../lib/api-client';
import type {
    ReadingHistory,
    SavedBook,
    ReadingHistoryRequest,
    ApiResponse
} from '../types/api.types';

export const readingService = {
    /**
     * Save reading history
     */
    saveReadingHistory: async (data: ReadingHistoryRequest): Promise<ReadingHistory> => {
        const response = await apiClient.post<ApiResponse<ReadingHistory>>(
            '/reading-history/save',
            data
        ) as unknown as ApiResponse<ReadingHistory>;
        return response.data;
    },

    /**
     * Get user's reading history
     */
    getReadingHistory: async (userId: number): Promise<ReadingHistory[]> => {
        const response = await apiClient.get<ApiResponse<ReadingHistory[]>>(
            `/reading-history/user/${userId}`
        ) as unknown as ApiResponse<ReadingHistory[]>;
        return response.data;
    },

    /**
     * Get specific book history
     */
    getReadingHistoryByBook: async (userId: number, bookId: number): Promise<ReadingHistory> => {
        const response = await apiClient.get<ApiResponse<ReadingHistory>>(
            `/reading-history/user/${userId}/book/${bookId}`
        ) as unknown as ApiResponse<ReadingHistory>;
        return response.data;
    },

    /**
     * Delete reading history entry
     */
    deleteReadingHistory: async (id: number): Promise<void> => {
        await apiClient.post(`/reading-history/delete/${id}`);
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
