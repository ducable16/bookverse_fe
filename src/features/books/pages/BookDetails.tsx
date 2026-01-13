import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, BookOpen, Bookmark, Heart, Share2 } from 'lucide-react';
import { StarRating } from '../components/StarRating';
import { booksService, commentsService } from '@/services';
import type { Book as ApiBook, Review } from '@/types/api.types';

export const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<ApiBook | null>(null);
  const [comments, setComments] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch book details and comments in parallel
        const [bookData, commentsData] = await Promise.all([
          booksService.getBookById(id),
          commentsService.getBookReviews(id).catch(() => []), // Fallback to empty if comments fail
        ]);

        setBook(bookData);
        setComments(commentsData);
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Không thể tải thông tin sách');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="px-8 py-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-teal mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin sách...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="px-8 py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Không tìm thấy sách</h1>
          <p className="text-gray-600 mb-4">{error || 'Sách bạn đang tìm không tồn tại.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-accent-teal text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>

      {/* Book Info */}
      <div className="flex gap-10">
        {/* Cover */}
        <div className="flex-shrink-0">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-48 h-72 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Details */}
        <div className="flex-1 max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h1>

          <div className="flex items-center space-x-2 mb-6">
            <span className="text-lg font-medium">{book.rating}</span>
            <StarRating rating={book.rating} />
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{book.totalReviews} Review</span>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-4 gap-6 py-4 border-b border-gray-200 mb-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Author</div>
              <div className="font-medium text-gray-900">{book.author.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Genre</div>
              <div className="font-medium text-gray-900">{book.genre.join(', ')}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Pages</div>
              <div className="font-medium text-gray-900">{book.totalPages}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Published</div>
              <div className="font-medium text-gray-900">{new Date(book.publishedDate).getFullYear()}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mb-8">
            <Link
              to={`/read/${book.id}`}
              className="flex items-center space-x-2 bg-accent-teal hover:bg-teal-600 text-white font-medium px-8 py-3 rounded-full transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              <span>Reading</span>
            </Link>
            <button className="p-3 hover:bg-cream-300 rounded-full transition-colors">
              <Bookmark className="w-6 h-6 text-gray-700" />
            </button>
            <button className="p-3 hover:bg-cream-300 rounded-full transition-colors">
              <Heart className="w-6 h-6 text-gray-700" />
            </button>
            <button className="p-3 hover:bg-cream-300 rounded-full transition-colors">
              <Share2 className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Description */}
          <div className="text-gray-700 leading-relaxed mb-2">
            {book.description}
          </div>
          <button className="text-accent-teal hover:underline text-sm">
            ...View more
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-10">
        <h2 className="text-lg font-bold mb-4">Comment ({comments.length})</h2>

        {comments.length === 0 ? (
          <div className="bg-cream-100 rounded-xl p-6 text-center text-gray-500">
            Chưa có bình luận nào
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment.id} className="bg-cream-100 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={comment.user.avatar || 'https://via.placeholder.com/40'}
                      alt={comment.user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{comment.user.username}</div>
                      <div className="flex items-center space-x-1 mb-1">
                        <StarRating rating={comment.rating} />
                      </div>
                      <div className="text-gray-700 mt-1">{comment.comment}</div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

