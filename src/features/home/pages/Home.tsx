import { useState, useEffect } from 'react';
import { BookGrid } from '@/features/books/components/BookGrid';
import { booksService } from '@/services';
import type { Book as ApiBook } from '@/types/api.types';
import type { Book } from '@/features/shared/types';

// Helper function to map API Book to local Book type
const mapApiBookToLocal = (apiBook: ApiBook): Book => ({
  id: String(apiBook.id),
  title: apiBook.title,
  author: apiBook.author.name,
  coverUrl: apiBook.coverImage,
  description: apiBook.description,
  genre: apiBook.categories[0]?.name || 'General',
  rating: apiBook.rating,
  reviewCount: apiBook.totalReviews,
});

export const Home = () => {
  const [latestBooks, setLatestBooks] = useState<Book[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both latest and recommended books
        const [latestData, recommendedData] = await Promise.all([
          booksService.getNewReleases(7),
          booksService.getRecommendedBooks(7),
        ]);

        setLatestBooks(latestData.map(mapApiBookToLocal));
        setRecommendedBooks(recommendedData.map(mapApiBookToLocal));
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Không thể tải sách. Vui lòng thử lại sau.');
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
          <p className="text-gray-600">Đang tải sách...</p>
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
      {/* Latest Section */}
      <BookGrid
        books={latestBooks}
        title="Latest"
        viewAllLink="/library"
      />

      {/* Recommended Section */}
      <BookGrid
        books={recommendedBooks}
        title="Recommended Books"
        viewAllLink="/discover"
      />
    </div>
  );
};

