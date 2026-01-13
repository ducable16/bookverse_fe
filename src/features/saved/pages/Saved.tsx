import { useState, useEffect } from 'react';
import { BookGrid } from '@/features/books/components/BookGrid';
import { readingService } from '@/services';
import type { SavedBook as ApiSavedBook } from '@/types/api.types';
import type { Book } from '@/features/shared/types';

// Helper function to map API SavedBook to local Book type
const mapSavedBook = (saved: ApiSavedBook): Book => ({
  id: String(saved.book.id),
  title: saved.book.title,
  author: saved.book.author.name,
  coverUrl: saved.book.coverImage,
  description: saved.book.description,
  genre: saved.book.categories[0]?.name || 'General',
  rating: saved.book.rating,
  reviewCount: saved.book.totalReviews,
  isSaved: true,
});

export const Saved = () => {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedBooks = async () => {
      try {
        setLoading(true);
        const saved = await readingService.getSavedBooks();
        setSavedBooks(saved.map(mapSavedBook));
      } catch (err) {
        console.error('Error fetching saved books:', err);
        setError('Không thể tải sách đã lưu');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedBooks();
  }, []);

  if (loading) {
    return (
      <div className="px-8 py-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-teal mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-6">
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-6">
      <h1 className="text-lg font-bold uppercase tracking-wide text-gray-900 mb-6">Saved Books</h1>

      {savedBooks.length > 0 ? (
        <BookGrid books={savedBooks} />
      ) : (
        <div className="text-center py-12 text-gray-500">
          Chưa có sách đã lưu
        </div>
      )}
    </div>
  );
};

