import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookGrid } from '@/features/books/components/BookGrid';
import { SearchFilterBar, SearchParams } from '../components/SearchFilterBar';
import { booksService, readingService } from '@/services';
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
  rating: 0, // API doesn't provide rating
  reviewCount: 0, // API doesn't provide review count
});

export const Home = () => {
  const navigate = useNavigate();
  const [latestBooks, setLatestBooks] = useState<Book[]>([]);
  const [readingHistory, setReadingHistory] = useState<import('@/types/api.types').ReadingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all books and split them for display
        const allBooks = await booksService.getAll();

        // Fetch reading history if user is logged in
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user?.id !== undefined && user?.id !== null) {
              const history = await readingService.getReadingHistory(user.id);
              setReadingHistory(history);
            }
          } catch (e) {
            console.error('Failed to load reading history:', e);
          }
        }

        // Map books for latest section
        const mappedBooks = allBooks.map(mapApiBookToLocal);
        setLatestBooks(mappedBooks.slice(0, 7));
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Không thể tải sách. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = (params: SearchParams) => {
    // Build query string
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.set('q', params.query);
    if (params.categoryId) queryParams.set('category', params.categoryId);
    if (params.authorId) queryParams.set('author', params.authorId);
    
    // Navigate to search page
    navigate(`/search?${queryParams.toString()}`);
  };

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
    <div className="px-8 py-6 space-y-8">
      {/* Search Filter Bar */}
      <SearchFilterBar onSearch={handleSearch} />

      {/* Reading History Section */}
      {readingHistory.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Continue Reading</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {readingHistory.map((item) => (
              <a
                key={item.id}
                href={`/read/${item.book.id}`}
                className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100"
              >
                <div className="aspect-[2/3] relative overflow-hidden">
                  <img
                    src={item.book.coverImage}
                    alt={item.book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 truncate" title={item.book.title}>
                    {item.book.title}
                  </h3>
                  <p className="text-sm text-accent-teal mt-1">
                    Chapter {item.lastReadChapter}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(item.lastReadTime).toLocaleDateString()}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Latest Section */}
      <BookGrid
        books={latestBooks}
        title="Latest"
        viewAllLink="/all-books"
      />
    </div>
  );
};

