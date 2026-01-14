/**
 * Upload Service
 * API service for file upload operations
 */

import apiClient from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api.config';
import type { UploadResponse } from '../types/api.types';

export const uploadService = {
    /**
     * Upload an image file
     * @param file - The file to upload
     * @returns Promise with the uploaded file URL
     */
    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        console.log('📤 Uploading image...', file.name);

        // Server returns { url: "..." } (wrapped in response.data by Spring Boot)
        const response: { url: string } = await apiClient.post(
            API_ENDPOINTS.UPLOAD,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        console.log('✅ Upload response:', response);
        
        // Interceptor returns response.data, which is { url: "..." }
        // So we access response.url directly
        if (!response.url) {
            console.error('❌ No URL in response:', response);
            throw new Error('Upload failed: No URL in response');
        }

        console.log('🔗 URL received:', response.url);
        return response.url;
    },

    /**
     * Upload multiple images
     * @param files - Array of files to upload
     * @returns Promise with array of uploaded file URLs
     */
    uploadMultipleImages: async (files: File[]): Promise<string[]> => {
        const uploadPromises = files.map(file => uploadService.uploadImage(file));
        return Promise.all(uploadPromises);
    },

    /**
     * Validate image file
     * @param file - The file to validate
     * @param maxSizeMB - Maximum file size in MB (default: 5MB)
     * @returns true if valid, throws error if invalid
     */
    validateImage: (file: File, maxSizeMB: number = 5): boolean => {
        // Check file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            throw new Error('Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP).');
        }

        // Check file size
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            throw new Error(`File size exceeds ${maxSizeMB}MB limit.`);
        }

        return true;
    },

    /**
     * Create a preview URL for an image file
     * @param file - The file to preview
     * @returns Object URL for preview
     */
    createPreviewUrl: (file: File): string => {
        return URL.createObjectURL(file);
    },

    /**
     * Revoke a preview URL to free memory
     * @param url - The preview URL to revoke
     */
    revokePreviewUrl: (url: string): void => {
        URL.revokeObjectURL(url);
    },
};
