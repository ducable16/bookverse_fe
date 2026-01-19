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
    getSavedBooks: async (userId: number): Promise<SavedBook[]> => {
        const response = await apiClient.get<ApiResponse<SavedBook[]>>(
            `/saved-books/user/${userId}`
        ) as unknown as ApiResponse<SavedBook[]>;
        return response.data;
    },

    /**
     * Save a book
     */
    saveBook: async (userId: number, bookId: number): Promise<SavedBook> => {
        const response = await apiClient.post<ApiResponse<SavedBook>>(
            '/saved-books/save',
            { userId, bookId }
        ) as unknown as ApiResponse<SavedBook>;
        return response.data;
    },

    /**
     * Remove a saved book
     */
    removeSavedBook: async (savedBookId: number): Promise<void> => {
        await apiClient.post(`/saved-books/unsave?savedBookId=${savedBookId}`);
    },

    /**
     * Check if a book is saved by a user
     */
    checkIfSaved: async (userId: number, bookId: number): Promise<boolean> => {
        const response = await apiClient.get<boolean>(
            `/saved-books/check?userId=${userId}&bookId=${bookId}`
        );
        return response as unknown as boolean;
    },
};
