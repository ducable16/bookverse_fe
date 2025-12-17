import { Link } from 'react-router-dom';
import { X, BookOpen } from 'lucide-react';
import { mockBooks } from '@/features/books/data/mockBooks';
import { StarRating } from '@/features/books/components/StarRating';

export const History = () => {
  // Filter books that have been read
  const historyBooks = mockBooks.filter(book => book.lastReadDate);

  return (
    <div className="px-8 py-6">
      <h1 className="text-lg font-bold uppercase tracking-wide text-gray-900 mb-6">History</h1>

      <div className="space-y-6">
        {historyBooks.map(book => (
          <div key={book.id} className="flex items-start gap-6 group">
            {/* Cover */}
            <Link to={`/book/${book.id}`} className="flex-shrink-0">
              <img 
                src={book.coverUrl}
                alt={book.title}
                className="w-32 h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow"
              />
            </Link>

            {/* Details */}
            <div className="flex-1">
              <Link to={`/book/${book.id}`}>
                <h2 className="text-xl font-bold text-gray-900 hover:text-coral-500 transition-colors">
                  {book.title}
                </h2>
              </Link>
              
              <div className="flex items-center space-x-2 mt-1 mb-4">
                <span className="font-medium">{book.rating}</span>
                <StarRating rating={book.rating} size="sm" />
                <span className="text-gray-500">•</span>
                <span className="text-gray-600 text-sm">{book.reviewCount} đánh giá</span>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-4 gap-6 mb-4">
                <div>
                  <div className="text-sm text-gray-500">Author</div>
                  <div className="font-medium text-gray-900">{book.author}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Genre</div>
                  <div className="font-medium text-gray-900">{book.genre}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Producer</div>
                  <div className="font-medium text-gray-900">{book.producer || 'Updating'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Release Status</div>
                  <div className="font-medium text-gray-900">{book.releaseStatus || 'N/A'}</div>
                </div>
              </div>

              {/* Reading Button */}
              <Link
                to={`/read/${book.id}`}
                className="inline-flex items-center space-x-2 bg-accent-teal hover:bg-teal-600 text-white font-medium px-6 py-2.5 rounded-full transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span>Reading</span>
              </Link>

              {/* Last Read */}
              <div className="mt-4 text-sm text-gray-600">
                <span className="font-medium">Đã đọc:</span> {book.lastReadDate} {book.lastReadTime}
              </div>
            </div>

            {/* Remove Button */}
            <button className="p-2 hover:bg-cream-300 rounded-full transition-colors opacity-0 group-hover:opacity-100">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        ))}

        {historyBooks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No reading history yet
          </div>
        )}
      </div>
    </div>
  );
};

