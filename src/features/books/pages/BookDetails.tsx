import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, BookOpen, Bookmark, Heart, Share2 } from 'lucide-react';
import { mockBooks, mockComments } from '../data/mockBooks';
import { StarRating } from '../components/StarRating';

export const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const book = mockBooks.find(b => b.id === id);
  const comments = mockComments.filter(c => c.bookId === id);

  if (!book) {
    return (
      <div className="px-8 py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Book Not Found</h1>
          <p className="text-gray-600">The book you're looking for doesn't exist.</p>
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
            src={book.coverUrl}
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
            <span className="text-gray-600">{book.reviewCount} Review</span>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-4 gap-6 py-4 border-b border-gray-200 mb-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Author</div>
              <div className="font-medium text-gray-900">{book.author}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Genre</div>
              <div className="font-medium text-gray-900">{book.genre}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Producer</div>
              <div className="font-medium text-gray-900">{book.producer || 'Updating'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Release status</div>
              <div className="font-medium text-gray-900">{book.releaseStatus || 'N/A'}</div>
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
        
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="bg-cream-100 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={comment.userAvatar || 'https://via.placeholder.com/40'}
                    alt={comment.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{comment.userName}</div>
                    <div className="text-gray-700 mt-1">{comment.content}</div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{comment.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
