// Role enum matching backend
export type Role = 'ADMIN' | 'USER';

// Admin User Response (from backend)
export interface AdminUser {
  id: number;
  username: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: Role;
  isActive: boolean;
  isDeleted: boolean;
  createdDate: string;
  updatedDate?: string;
  createdUser?: string;
  updatedUser?: string;
}

// User Search Request (for filtering and pagination)
export interface UserSearchRequest {
  keyword?: string;          // Search in username, email, fullName
  role?: Role;               // Filter by role
  isActive?: boolean;        // Filter by status (active/blocked)
  isDeleted?: boolean;       // Filter by deleted status
  sortBy?: string;           // Sort field: username, email, createdDate
  sortDirection?: 'ASC' | 'DESC';
  page?: number;
  size?: number;
}

// User Page Response (paginated results)
export interface UserPageResponse {
  users: AdminUser[];
  totalUsers: number;
  currentPage: number;
  totalPages: number;
}

// Admin User Create Request
export interface AdminUserCreateRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  role: Role;
  avatarUrl?: string;
}

// Admin User Update Request
export interface AdminUserUpdateRequest {
  username?: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
}

// User Statistics Response
export interface UserStatisticsResponse {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  deletedUsers: number;
  usersByRole: Record<string, number>;  // Role name -> count
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  booksCount: number;
  createdAt: string;
}

export interface AdminBook {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  coverUrl: string;
  description: string;
  genre: string[];
  status: 'published' | 'draft' | 'archived';
  totalChapters: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

