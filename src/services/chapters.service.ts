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
        ) as ApiResponse<ChapterResponse[]>;
        return response.data;
    },

    // Get chapter by ID
    getById: async (chapterId: number): Promise<ChapterResponse> => {
        const response = await apiClient.get<ApiResponse<ChapterResponse>>(
            API_ENDPOINTS.CHAPTERS.DETAIL(chapterId)
        ) as ApiResponse<ChapterResponse>;
        return response.data;
    },

    // Get chapter by book ID and chapter number
    getByBookAndNumber: async (bookId: number, chapterNumber: number): Promise<ChapterResponse> => {
        const response = await apiClient.get<ApiResponse<ChapterResponse>>(
            API_ENDPOINTS.CHAPTERS.BY_BOOK_AND_NUMBER(bookId, chapterNumber)
        ) as ApiResponse<ChapterResponse>;
        return response.data;
    },

    // Create chapter
    create: async (chapterData: ChapterRequest): Promise<ChapterResponse> => {
        const response = await apiClient.post<ApiResponse<ChapterResponse>>(
            API_ENDPOINTS.CHAPTERS.CREATE,
            chapterData
        ) as ApiResponse<ChapterResponse>;
        return response.data;
    },

    // Update chapter
    update: async (chapterId: number, chapterData: ChapterRequest): Promise<ChapterResponse> => {
        const response = await apiClient.post<ApiResponse<ChapterResponse>>(
            API_ENDPOINTS.CHAPTERS.UPDATE(chapterId),
            chapterData
        ) as ApiResponse<ChapterResponse>;
        return response.data;
    },

    // Delete chapter
    delete: async (chapterId: number): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.CHAPTERS.DELETE(chapterId));
    },
};
