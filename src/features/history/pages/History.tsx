import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, BookOpen } from 'lucide-react';
import { StarRating } from '@/features/books/components/StarRating';
import { readingService } from '@/services';
import type { ReadingHistory } from '@/types/api.types';

export const History = () => {
  const [historyBooks, setHistoryBooks] = useState<ReadingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const history = await readingService.getReadingHistory();
        setHistoryBooks(history);
      } catch (err) {
        console.error('Error fetching reading history:', err);
        setError('Không thể tải lịch sử đọc');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="px-8 py-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-teal mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải lịch sử...</p>
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
      <h1 className="text-lg font-bold uppercase tracking-wide text-gray-900 mb-6">History</h1>

      <div className="space-y-6">
        {historyBooks.map(item => (
          <div key={item.id} className="flex items-start gap-6 group">
            {/* Cover */}
            <Link to={`/book/${item.book.id}`} className="flex-shrink-0">
              <img
                src={item.book.coverImage}
                alt={item.book.title}
                className="w-32 h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
              />
            </Link>

            {/* Details */}
            <div className="flex-1">
              <Link to={`/book/${item.book.id}`}>
                <h2 className="text-xl font-bold text-gray-900 hover:text-coral-500 transition-colors">
                  {item.book.title}
                </h2>
              </Link>

              <div className="flex items-center space-x-2 mt-1 mb-4">
                <span className="font-medium">{item.book.rating}</span>
                <StarRating rating={item.book.rating} size="sm" />
                <span className="text-gray-500">•</span>
                <span className="text-gray-600 text-sm">{item.book.totalReviews} đánh giá</span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Tiến độ: {item.progress}%</span>
                  <span>Trang {item.lastPage}/{item.totalPages}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-accent-teal h-2 rounded-full transition-all"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-3 gap-6 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Author</div>
                  <div className="font-medium text-gray-900">{item.book.author.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Genre</div>
                  <div className="font-medium text-gray-900">{item.book.categories[0]?.name || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Đã đọc</div>
                  <div className="font-medium text-gray-900">{new Date(item.lastReadAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Reading Button */}
              <Link
                to={`/read/${item.book.id}`}
                className="inline-flex items-center space-x-2 bg-accent-teal hover:bg-teal-600 text-white font-medium px-6 py-2.5 rounded-full transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>Tiếp tục đọc</span>
              </Link>
            </div>

            {/* Remove Button */}
            <button className="p-2 hover:bg-cream-300 rounded-full transition-colors opacity-0 group-hover:opacity-100">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        ))}

        {historyBooks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Chưa có lịch sử đọc sách
          </div>
        )}
      </div>
    </div>
  );
};

