/**
 * API Response Types
 * TypeScript interfaces for API responses
 */

// Base API Response - All server responses follow this structure
export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
}

// Auth Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    id?: number;
    username: string;
    email: string;
    fullName: string;
    role: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: string;
}

export interface UserResponse {
    id: number;
    username: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
}

export interface UserUpdateRequest {
    username?: string;
    fullName?: string;
    email?: string;
    password?: string;
    avatarUrl?: string;
}

// Author Types
export interface Author {
    id: number;
    name: string;
    biography?: string;
    avatarUrl?: string;
    bookCount?: number;
}

export interface AuthorResponse {
    id: number;
    name: string;
    biography?: string;
    avatarUrl?: string;
}

export interface AuthorRequest {
    name: string;
    biography?: string;
    avatarUrl?: string;
}

export interface CreateAuthorRequest {
    name: string;
    biography: string;
    avatar?: string;
}

export interface UpdateAuthorRequest {
    name: string;
    biography: string;
}

// Book Types
export interface Book {
    id: number;
    title: string;
    slug: string;
    description: string;
    authorId: number;
    authorName: string;
    categoryId: number;
    categoryName: string;
    publishedYear: number;
    isbn: string;
    coverImage: string;
    price: number;
}

export interface BookResponse {
    id: number;
    title: string;
    slug: string;
    coverImage: string;
    description: string;
    totalChapters: number;
    author: AuthorResponse;
    categories: CategoryResponse[];
}

export interface BookRequest {
    title: string;
    coverImage: string;
    description: string;
    totalChapters: number;
    authorId: number;
    categoryIds: number[];
}

export interface CreateBookRequest {
    title: string;
    description: string;
    authorId: number;
    categoryId: number;
    publishedYear: number;
    isbn: string;
    coverImage: string;
    price: number;
}

export interface UpdateBookRequest {
    title: string;
    description: string;
    authorId: number;
    categoryId: number;
    publishedYear: number;
    isbn: string;
    coverImage: string;
    price: number;
}

// Category Types
export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
}

export interface CategoryResponse {
    id: number;
    name: string;
    slug: string;
}

export interface CategoryRequest {
    name: string;
}

export interface CreateCategoryRequest {
    name: string;
    description: string;
}

export interface UpdateCategoryRequest {
    name: string;
    description: string;
}

// Comment Types
export interface Comment {
    id: number;
    userId: number;
    username: string;
    content: string;
    createdAt: string;
}

export interface CommentResponse {
    id: number;
    userId: number;
    username: string;
    content: string;
    createdDate: string;
    replies: CommentResponse[];
}

export interface CommentCreateRequest {
    content: string;
    bookId: number;
    parentId?: number;
}

export interface CreateCommentRequest {
    userId: number;
    content: string;
}

export interface UpdateCommentRequest {
    content: string;
}

// Review Types
export interface Review {
    id: number;
    user: {
        avatar?: string;
        username: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
}

// Reading History Types
export interface ReadingHistoryRequest {
    userId: number;
    bookId: number;
    lastReadChapter: number;
}

export interface ReadingHistory {
    id: number;
    user: UserResponse;
    book: BookResponse;
    lastReadChapter: number;
    lastReadTime: string;
}

export interface SavedBook {
    id: number;
    user: UserResponse;
    book: {
        id: number;
        title: string;
        slug: string;
        coverImage: string;
        description: string;
        author: {
            name: string;
        };
        categories: Array<{
            name: string;
        }>;
    };
    savedAt: string;
}

// Deprecated: UpdateProgressRequest is replaced by ReadingHistoryRequest
export interface UpdateProgressRequest {
    bookId: number;
    lastPage: number;
    totalPages: number;
    progress: number;
}

// Upload Types
export interface UploadResponse {
    url: string;
}

// Chapter Types
export interface ChapterResponse {
    id: number;
    chapterNumber: number;
    title: string;
    content: string;
}

export interface ChapterRequest {
    chapterNumber: number;
    title: string;
    content: string;
    bookId: number;
}

// Pagination
export interface PaginationParams {
    page?: number;
    size?: number;
}

// Error Types
export interface ApiError {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
}
