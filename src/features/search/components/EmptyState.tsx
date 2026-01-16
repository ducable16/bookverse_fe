import { SearchX, Home, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  query?: string;
  hasFilters?: boolean;
}

export const EmptyState = ({ query, hasFilters }: EmptyStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center justify-center p-6 bg-gray-100 rounded-full mb-6">
        <SearchX className="w-16 h-16 text-gray-400" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        Không tìm thấy kết quả
      </h3>

      {query ? (
        <p className="text-gray-600 mb-2">
          Không tìm thấy sách nào phù hợp với "<span className="font-medium">{query}</span>"
        </p>
      ) : (
        <p className="text-gray-600 mb-2">
          Không tìm thấy sách nào phù hợp với bộ lọc đã chọn
        </p>
      )}

      <p className="text-gray-500 text-sm mb-8">
        {hasFilters
          ? 'Thử thay đổi hoặc xóa bộ lọc để xem thêm kết quả'
          : 'Thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả'}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => navigate('/search')}
          className="inline-flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Xóa bộ lọc</span>
        </button>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-accent-teal text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
        >
          <Home className="w-4 h-4" />
          <span>Về trang chủ</span>
        </button>
      </div>

      {/* Suggestions */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Gợi ý tìm kiếm:</h4>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => navigate('/search?q=romance')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm"
          >
            Romance
          </button>
          <button
            onClick={() => navigate('/search?q=fantasy')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm"
          >
            Fantasy
          </button>
          <button
            onClick={() => navigate('/search?q=mystery')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm"
          >
            Mystery
          </button>
          <button
            onClick={() => navigate('/search?q=thriller')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm"
          >
            Thriller
          </button>
        </div>
      </div>
    </div>
  );
};

