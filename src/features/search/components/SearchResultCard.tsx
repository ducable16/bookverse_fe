import { Link } from 'react-router-dom';
import { BookOpen, User, Tag } from 'lucide-react';
import type { SearchResult } from '@/types/search.types';

interface SearchResultCardProps {
  result: SearchResult;
}

export const SearchResultCard = ({ result }: SearchResultCardProps) => {
  // Parse HTML snippet to render highlighted text
  const renderSnippet = (snippet: string) => {
    return <span dangerouslySetInnerHTML={{ __html: snippet }} />;
  };

  const getMatchTypeBadge = () => {
    const badges = {
      TITLE: { label: 'Tên sách', className: 'bg-blue-100 text-blue-700' },
      AUTHOR: { label: 'Tác giả', className: 'bg-purple-100 text-purple-700' },
      CATEGORY: { label: 'Thể loại', className: 'bg-green-100 text-green-700' },
      CONTENT: { label: 'Nội dung', className: 'bg-orange-100 text-orange-700' },
    };
    
    const badge = badges[result.matchType];
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <Link
      to={`/book/${result.bookId}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
    >
      <div className="flex gap-4 p-4">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          <img
            src={result.coverImage}
            alt={result.title}
            className="w-24 h-32 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/150x200?text=No+Cover';
            }}
          />
        </div>

        {/* Book Info */}
        <div className="flex-1 min-w-0">
          {/* Match Type Badge */}
          <div className="mb-2">
            {getMatchTypeBadge()}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-accent-teal transition-colors mb-2 line-clamp-2">
            {result.title}
          </h3>

          {/* Author & Categories */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{result.authorName}</span>
            </div>
            {result.categoryNames.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                <span>{result.categoryNames.join(', ')}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{result.totalChapters} chương</span>
            </div>
          </div>

          {/* Snippet */}
          <div className="text-sm text-gray-700 line-clamp-2 mb-2 search-snippet">
            {renderSnippet(result.snippet)}
          </div>

          {/* Matched Chapter (if applicable) */}
          {result.matchedChapterId && result.matchedChapterTitle && (
            <div className="text-xs text-accent-teal font-medium">
              Tìm thấy trong: Chương "{result.matchedChapterTitle}"
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
