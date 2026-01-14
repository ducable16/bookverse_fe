import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Reader } from '../components/Reader';
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

export const ReadBook = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const apiBook = await booksService.getById(Number(id));
        setBook(mapApiBookToLocal(apiBook));
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('Không thể tải sách. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-teal mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải sách...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Book Not Found</h1>
          <p className="text-gray-600 mb-4">{error || "The book you're trying to read doesn't exist."}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-accent-teal text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <Reader book={book} />;
};
