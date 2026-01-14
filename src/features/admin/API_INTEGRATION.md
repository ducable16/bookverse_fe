# Hướng dẫn tích hợp API cho AuthorSelect

## Hiện tại (Mock Data)
Component `AuthorSelect` hiện đang sử dụng mock data từ `mockData.ts`.

## Tích hợp API thực

### 1. Tạo service để gọi API

Tạo file `src/features/admin/services/authorService.ts`:

```typescript
// src/features/admin/services/authorService.ts
import { Author } from '../types';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';

export const authorService = {
  // Tìm kiếm tác giả
  async searchAuthors(query: string): Promise<Author[]> {
    const response = await fetch(
      `${API_BASE_URL}/authors/search?q=${encodeURIComponent(query)}`,
      {
        headers: {
          'Content-Type': 'application/json',
          // Thêm token nếu cần
          // 'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search authors');
    }

    return response.json();
  },

  // Lấy thông tin tác giả theo ID
  async getAuthorById(id: string): Promise<Author> {
    const response = await fetch(`${API_BASE_URL}/authors/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to get author');
    }

    return response.json();
  },

  // Thêm tác giả mới
  async createAuthor(data: {
    name: string;
    bio?: string;
    avatar?: string;
  }): Promise<Author> {
    const response = await fetch(`${API_BASE_URL}/authors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create author');
    }

    return response.json();
  },
};
```

### 2. Cập nhật AuthorSelect component

Trong file `src/features/admin/components/AuthorSelect.tsx`, thay đổi:

```typescript
// Thay đổi từ:
useEffect(() => {
  const fetchAuthors = async () => {
    setLoading(true);
    setTimeout(() => {
      import('../data/mockData').then(({ mockAuthors }) => {
        const filtered = mockAuthors.filter(author =>
          author.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setAuthors(filtered);
        setLoading(false);
      });
    }, 300);
  };

  fetchAuthors();
}, [searchQuery]);

// Thành:
useEffect(() => {
  const fetchAuthors = async () => {
    if (!searchQuery) {
      setAuthors([]);
      return;
    }

    setLoading(true);
    
    try {
      const results = await authorService.searchAuthors(searchQuery);
      setAuthors(results);
    } catch (error) {
      console.error('Error fetching authors:', error);
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  const timeoutId = setTimeout(fetchAuthors, 300);
  return () => clearTimeout(timeoutId);
}, [searchQuery]);
```

### 3. Cập nhật AddAuthorModal

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  try {
    // Gọi API thật
    const newAuthor = await authorService.createAuthor(formData);
    onSave(newAuthor);
  } catch (error) {
    console.error('Error creating author:', error);
    alert('Có lỗi xảy ra khi thêm tác giả');
  } finally {
    setSaving(false);
  }
};
```

## API Endpoints cần có

### Backend API cần implement:

1. **GET** `/api/authors/search?q={query}`
   - Tìm kiếm tác giả theo tên
   - Response: `Author[]`

2. **GET** `/api/authors/:id`
   - Lấy thông tin chi tiết tác giả
   - Response: `Author`

3. **POST** `/api/authors`
   - Tạo tác giả mới
   - Body: `{ name: string, bio?: string, avatar?: string }`
   - Response: `Author`

## Ví dụ response từ API

```json
{
  "id": "123",
  "name": "Nguyễn Nhật Ánh",
  "bio": "Nhà văn nổi tiếng Việt Nam",
  "avatar": "https://example.com/avatar.jpg",
  "booksCount": 25,
  "createdAt": "2024-01-15"
}
```

## Environment Variables

Thêm vào `.env`:

```bash
VITE_API_URL=http://localhost:3000/api
```

## Error Handling

Component đã có sẵn error handling cơ bản. Bạn có thể mở rộng:

- Hiển thị toast notification khi lỗi
- Retry logic
- Loading states chi tiết hơn
- Validation errors từ backend

## Authentication

Nếu API cần authentication:

```typescript
const token = localStorage.getItem('authToken');

const response = await fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```


