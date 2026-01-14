import { useState, useEffect } from 'react';
import { BookGrid } from '@/features/books/components/BookGrid';
import { booksService, categoriesService } from '@/services';
import type { Book as ApiBook, Category } from '@/types/api.types';
import type { Book } from '@/features/shared/types';

// Helper function to map API Book to local Book type
const mapApiBookToLocal = (apiBook: ApiBook): Book => ({
  id: String(apiBook.id),
  title: apiBook.title,
  author: apiBook.authorName,
  coverUrl: apiBook.coverImage,
  description: apiBook.description,
  genre: [apiBook.categoryName],
  rating: 0,
  reviewCount: 0,
});

export const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [booksByCategory, setBooksByCategory] = useState<Record<number, Book[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch all categories from API
        console.log('🔍 Fetching categories from API...');
        const apiCategories = await categoriesService.getAll();
        console.log('✅ Categories received:', apiCategories);
        setCategories(apiCategories);

        // 2. Fetch books for each category
        const booksMap: Record<number, Book[]> = {};

        await Promise.all(
          apiCategories.map(async (category) => {
            try {
              console.log(`📚 Fetching books for category: ${category.name}`);
              const categoryBooks = await booksService.getByCategory(category.id);
              const mappedBooks = categoryBooks.map(mapApiBookToLocal);
              booksMap[category.id] = mappedBooks;
              console.log(`✅ Got ${mappedBooks.length} books for ${category.name}`);
            } catch (err) {
              console.error(`Error fetching books for category ${category.name}:`, err);
              booksMap[category.id] = [];
            }
          })
        );

        setBooksByCategory(booksMap);
        console.log('✨ All categories and books loaded');
      } catch (err) {
        console.error('❌ Error fetching categories:', err);
        setError('Không thể tải danh mục. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="px-8 py-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-teal mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh mục...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-accent-teal text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-6 space-y-12">
      <h1 className="text-lg font-bold uppercase tracking-wide text-gray-900">Categories</h1>

      {categories.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Chưa có danh mục nào
        </div>
      ) : (
        categories.map(category => {
          const books = booksByCategory[category.id] || [];

          // Only show categories that have books
          if (books.length === 0) return null;

          return (
            <BookGrid
              key={category.id}
              books={books}
              title={category.name}
            />
          );
        })
      )}
    </div>
  );
};
