/**
 * API Configuration
 * Central configuration for all API endpoints and settings
 */

// Base URL from environment variable or default
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090/api';

// API version
export const API_VERSION = '';

// Full base URL with version
export const API_URL = `${API_BASE_URL}/${API_VERSION}`;

// API Endpoints
export const API_ENDPOINTS = {
    // Auth endpoints
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
    },

    // Books endpoints
    BOOKS: {
        LIST: '/book/list',
        DETAIL: (id: string | number) => `/book/detail/${id}`,
        BY_SLUG: (slug: string) => `/book/slug/${slug}`,
        SEARCH: '/book/search',
        BY_CATEGORY: (categoryId: string | number) => `/book/category/${categoryId}`,
        BY_AUTHOR: (authorId: string | number) => `/book/author/${authorId}`,
        CREATE: '/book/create',
        UPDATE: (id: string | number) => `/book/update/${id}`,
        DELETE: (id: string | number) => `/book/delete/${id}`,
        // Comments
        COMMENTS: (bookId: string | number) => `/books/${bookId}/comments`,
        COMMENT_BY_ID: (bookId: string | number, commentId: string | number) =>
            `/books/${bookId}/comments/${commentId}`,
    },

    // Categories endpoints
    CATEGORIES: {
        LIST: '/category/list',
        DETAIL: (id: string | number) => `/category/detail/${id}`,
        BY_SLUG: (slug: string) => `/category/slug/${slug}`,
        CREATE: '/category/create',
        UPDATE: (id: string | number) => `/category/update/${id}`,
        DELETE: (id: string | number) => `/category/delete/${id}`,
    },

    // Authors endpoints
    AUTHORS: {
        LIST: '/author/list',
        DETAIL: (id: string | number) => `/author/detail/${id}`,
        CREATE: '/author/create',
        UPDATE: (id: string | number) => `/author/update/${id}`,
        DELETE: (id: string | number) => `/author/delete/${id}`,
    },

    // User endpoints
    USERS: {
        REGISTER: '/users/register',
        BY_ID: (id: string | number) => `/users/${id}`,
    },

    // Chapters endpoints
    CHAPTERS: {
        BY_BOOK: (bookId: string | number) => `/books/${bookId}/chapters`,
        DETAIL: (chapterId: string | number) => `/chapters/${chapterId}`,
        CREATE: '/chapters/create',
        UPDATE: (chapterId: string | number) => `/chapters/update/${chapterId}`,
        DELETE: (chapterId: string | number) => `/chapters/delete/${chapterId}`,
    },

    // Upload endpoint
    UPLOAD: '/upload',
    // Admin endpoints
    ADMIN: {
        DASHBOARD: '/admin/dashboard',
        USERS: {
            BASE: '/admin/users',
            BY_ID: (id: string | number) => `/admin/users/${id}`,
            BAN: (id: string | number) => `/admin/users/${id}/ban`,
            UNBAN: (id: string | number) => `/admin/users/${id}/unban`,
        },
        BOOKS: {
            BASE: '/admin/books',
            BY_ID: (id: string | number) => `/admin/books/${id}`,
            CREATE: '/admin/books',
            UPDATE: (id: string | number) => `/admin/books/${id}`,
            DELETE: (id: string | number) => `/admin/books/${id}`,
        },
        AUTHORS: {
            BASE: '/admin/authors',
            BY_ID: (id: string | number) => `/admin/authors/${id}`,
            CREATE: '/admin/authors',
            UPDATE: (id: string | number) => `/admin/authors/${id}`,
            DELETE: (id: string | number) => `/admin/authors/${id}`,
        },
        CATEGORIES: {
            BASE: '/admin/categories',
            BY_ID: (id: string | number) => `/admin/categories/${id}`,
            CREATE: '/admin/categories',
            UPDATE: (id: string | number) => `/admin/categories/${id}`,
            DELETE: (id: string | number) => `/admin/categories/${id}`,
        },
    },
};

// Request timeout (in milliseconds)
export const REQUEST_TIMEOUT = 30000;

// Default headers
export const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
};
