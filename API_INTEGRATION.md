# API Integration Guide

## Cấu hình đã hoàn thành

### 1. Cấu trúc thư mục

```
src/
├── config/
│   └── api.config.ts          # Cấu hình base URL và endpoints
├── lib/
│   └── api-client.ts          # Axios client với interceptors
├── services/
│   ├── auth.service.ts        # Service cho authentication
│   ├── books.service.ts       # Service cho books
│   ├── authors.service.ts     # Service cho authors
│   ├── categories.service.ts  # Service cho categories
│   ├── user.service.ts        # Service cho user operations
│   ├── admin.service.ts       # Service cho admin operations
│   └── index.ts              # Export tất cả services
└── types/
    └── api.types.ts          # TypeScript types cho API
```

### 2. Biến môi trường

File `.env` đã được tạo với cấu hình mặc định:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

**Lưu ý:** Bạn có thể thay đổi URL này theo địa chỉ server thực tế của bạn.

### 3. Cách sử dụng

#### 3.1. Import services

```typescript
// Import một service cụ thể
import { booksService } from '@/services';

// Hoặc import tất cả
import { booksService, authService, userService } from '@/services';
```

#### 3.2. Sử dụng trong React Component

**Ví dụ 1: Lấy danh sách books**

```typescript
import { useEffect, useState } from 'react';
import { booksService, Book } from '@/services';

function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await booksService.getBooks({
          page: 1,
          limit: 10,
        });
        setBooks(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {books.map(book => (
        <div key={book.id}>{book.title}</div>
      ))}
    </div>
  );
}
```

**Ví dụ 2: Get book details**

```typescript
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { booksService, Book } from '@/services';

function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      if (id) {
        const bookData = await booksService.getBookById(id);
        setBook(bookData);
      }
    };

    fetchBook();
  }, [id]);

  return <div>{book?.title}</div>;
}
```

**Ví dụ 3: Authentication - Login**

```typescript
import { useState } from 'react';
import { authService } from '@/services';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await authService.login({ email, password });
      console.log('Logged in:', response.user);
      // Token đã được tự động lưu vào localStorage
      // Redirect to dashboard or home
    } catch (error: any) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

**Ví dụ 4: Search books**

```typescript
import { useState } from 'react';
import { booksService, Book } from '@/services';

function SearchBooks() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);

  const handleSearch = async () => {
    const response = await booksService.searchBooks(query, {
      page: 1,
      limit: 20,
    });
    setResults(response.data);
  };

  return (
    <div>
      <input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      
      {results.map(book => (
        <div key={book.id}>{book.title}</div>
      ))}
    </div>
  );
}
```

**Ví dụ 5: User operations - Save book**

```typescript
import { userService } from '@/services';

function BookCard({ bookId }: { bookId: number }) {
  const handleSaveBook = async () => {
    try {
      await userService.addToSaved(bookId);
      alert('Book saved!');
    } catch (error: any) {
      console.error('Failed to save:', error.message);
    }
  };

  return (
    <button onClick={handleSaveBook}>
      Save Book
    </button>
  );
}
```

**Ví dụ 6: Admin operations**

```typescript
import { useEffect, useState } from 'react';
import { adminService, DashboardStats } from '@/services';

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await adminService.getDashboardStats();
      setStats(data);
    };

    fetchStats();
  }, []);

  return (
    <div>
      <p>Total Users: {stats?.totalUsers}</p>
      <p>Total Books: {stats?.totalBooks}</p>
    </div>
  );
}
```

### 4. Các service có sẵn

#### 4.1. Books Service

- `getBooks(params?)` - Lấy danh sách books với pagination
- `getBookById(id)` - Lấy chi tiết một book
- `searchBooks(query, params?)` - Tìm kiếm books
- `getTrendingBooks(limit?)` - Lấy books trending
- `getNewReleases(limit?)` - Lấy books mới ra mắt
- `getRecommendedBooks(limit?)` - Lấy books được gợi ý
- `getBooksByCategory(categoryId, params?)` - Lấy books theo category
- `getBooksByAuthor(authorId, params?)` - Lấy books theo tác giả

#### 4.2. Categories Service

- `getCategories()` - Lấy tất cả categories
- `getCategoryById(id)` - Lấy chi tiết một category

#### 4.3. Authors Service

- `getAuthors(params?)` - Lấy danh sách tác giả
- `getAuthorById(id)` - Lấy chi tiết một tác giả

#### 4.4. Auth Service

- `login(credentials)` - Đăng nhập
- `register(userData)` - Đăng ký tài khoản mới
- `logout()` - Đăng xuất
- `getProfile()` - Lấy thông tin user hiện tại
- `refreshToken()` - Refresh token
- `isAuthenticated()` - Kiểm tra trạng thái đăng nhập
- `getCurrentUser()` - Lấy thông tin user từ localStorage

#### 4.5. User Service

- `getReadingHistory()` - Lấy lịch sử đọc
- `getSavedBooks()` - Lấy danh sách sách đã lưu
- `addToSaved(bookId)` - Thêm sách vào danh sách lưu
- `removeFromSaved(bookId)` - Xóa sách khỏi danh sách lưu
- `updateReadingProgress(progress)` - Cập nhật tiến độ đọc
- `getReadingProgress(bookId)` - Lấy tiến độ đọc của một cuốn sách

#### 4.6. Admin Service

**Dashboard:**
- `getDashboardStats()` - Lấy thống kê tổng quan

**Users:**
- `users.getAll(params?)` - Lấy danh sách users
- `users.getById(id)` - Lấy chi tiết user
- `users.ban(id)` - Ban user
- `users.unban(id)` - Unban user

**Books:**
- `books.getAll(params?)` - Lấy danh sách books
- `books.getById(id)` - Lấy chi tiết book
- `books.create(data)` - Tạo book mới
- `books.update(id, data)` - Cập nhật book
- `books.delete(id)` - Xóa book

**Authors:**
- `authors.getAll(params?)` - Lấy danh sách authors
- `authors.getById(id)` - Lấy chi tiết author
- `authors.create(data)` - Tạo author mới
- `authors.update(id, data)` - Cập nhật author
- `authors.delete(id)` - Xóa author

**Categories:**
- `categories.getAll(params?)` - Lấy danh sách categories
- `categories.getById(id)` - Lấy chi tiết category
- `categories.create(data)` - Tạo category mới
- `categories.update(id, data)` - Cập nhật category
- `categories.delete(id)` - Xóa category

### 5. Error Handling

API client đã tự động xử lý các lỗi phổ biến:

- **401 Unauthorized**: Tự động xóa token và redirect về trang login
- **403 Forbidden**: Log lỗi ra console
- **404 Not Found**: Log lỗi ra console
- **500 Server Error**: Log lỗi ra console
- **Network Error**: Hiển thị thông báo lỗi mạng

Bạn có thể catch error trong component:

```typescript
try {
  const data = await booksService.getBooks();
  // Success
} catch (error: any) {
  // error.message chứa thông báo lỗi
  // error.statusCode chứa HTTP status code
  console.error(error.message);
}
```

### 6. Authentication Token

Token được tự động quản lý:

1. Khi login/register thành công, token được lưu vào `localStorage`
2. Mọi request sau đó tự động gửi kèm token trong header: `Authorization: Bearer <token>`
3. Khi logout hoặc gặp lỗi 401, token tự động bị xóa

### 7. Customization

#### Thay đổi Base URL

Chỉnh sửa file `.env`:

```env
VITE_API_BASE_URL=https://api.bookverse.com/api
```

#### Thêm endpoint mới

Chỉnh sửa `src/config/api.config.ts`:

```typescript
export const API_ENDPOINTS = {
  // ...existing endpoints
  REVIEWS: {
    BASE: '/reviews',
    BY_BOOK: (bookId: number) => `/reviews/book/${bookId}`,
  },
};
```

#### Tạo service mới

Tạo file `src/services/reviews.service.ts`:

```typescript
import apiClient from '../lib/api-client';
import { API_ENDPOINTS } from '../config/api.config';

export const reviewsService = {
  getReviewsByBook: async (bookId: number) => {
    const response = await apiClient.get(
      API_ENDPOINTS.REVIEWS.BY_BOOK(bookId)
    );
    return response.data;
  },
};
```

### 8. Best Practices

1. **Sử dụng TypeScript types**: Tất cả các response đều có types đầy đủ
2. **Handle loading states**: Luôn có state loading khi gọi API
3. **Handle errors**: Wrap API calls trong try-catch
4. **Use environment variables**: Không hard-code URLs
5. **Token management**: Để API client tự động quản lý tokens

### 9. Testing với Postman/Thunder Client

Base URL: `http://localhost:8080/api/v1`

Example endpoints:
- GET `/books` - Lấy danh sách sách
- GET `/books/1` - Lấy sách có id = 1
- POST `/auth/login` - Đăng nhập
- GET `/categories` - Lấy danh sách thể loại

Headers cho authenticated requests:
```
Authorization: Bearer <your-token>
Content-Type: application/json
```

---

## Bắt đầu sử dụng

1. Đảm bảo server backend đang chạy tại `http://localhost:8080`
2. Chạy frontend: `npm run dev`
3. Import services cần thiết vào components
4. Gọi API methods và xử lý responses

**Chúc bạn code vui vẻ! 🚀**
