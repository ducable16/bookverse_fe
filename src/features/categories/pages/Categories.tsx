import { useState, useEffect } from 'react';
import { BookGrid } from '@/features/books/components/BookGrid';
import { booksService } from '@/services';
import type { Book as ApiBook } from '@/types/api.types';
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
  const [booksByCategory, setBooksByCategory] = useState<Record<string, Book[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        const allBooks = await booksService.getAll();
        const mappedBooks = allBooks.map(mapApiBookToLocal);

        // Group books by category
        const grouped: Record<string, Book[]> = {};
        mappedBooks.forEach(book => {
          book.genre.forEach(category => {
            if (!grouped[category]) {
              grouped[category] = [];
            }
            grouped[category].push(book);
          });
        });

        setBooksByCategory(grouped);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Không thể tải danh mục. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
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

  const categories = Object.keys(booksByCategory);

  return (
    <div className="px-8 py-6 space-y-12">
      <h1 className="text-lg font-bold uppercase tracking-wide text-gray-900">Categories</h1>

      {categories.map(category => (
        <BookGrid
          key={category}
          books={booksByCategory[category]}
          title={category}
        />
      ))}
    </div>
  );
};
