/**
 * Chapters Service
 * API service for book chapter operations
 */

import apiClient from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api.config';
import type {
    ChapterResponse,
    ChapterRequest,
    ApiResponse
} from '../types/api.types';

export const chaptersService = {
    // Get chapters by book ID
    getByBook: async (bookId: number): Promise<ChapterResponse[]> => {
        const response = await apiClient.get<ApiResponse<ChapterResponse[]>>(
            API_ENDPOINTS.CHAPTERS.BY_BOOK(bookId)
        );
        return response.data.data;
    },

    // Get chapter by ID
    getById: async (chapterId: number): Promise<ChapterResponse> => {
        const response = await apiClient.get<ApiResponse<ChapterResponse>>(
            API_ENDPOINTS.CHAPTERS.DETAIL(chapterId)
        );
        return response.data.data;
    },

    // Create chapter
    create: async (chapterData: ChapterRequest): Promise<ChapterResponse> => {
        const response = await apiClient.post<ApiResponse<ChapterResponse>>(
            API_ENDPOINTS.CHAPTERS.CREATE,
            chapterData
        );
        return response.data.data;
    },

    // Update chapter
    update: async (chapterId: number, chapterData: ChapterRequest): Promise<ChapterResponse> => {
        const response = await apiClient.post<ApiResponse<ChapterResponse>>(
            API_ENDPOINTS.CHAPTERS.UPDATE(chapterId),
            chapterData
        );
        return response.data.data;
    },

    // Delete chapter
    delete: async (chapterId: number): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.CHAPTERS.DELETE(chapterId));
    },
};
