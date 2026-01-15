import { Bookmark as BookmarkIcon, Trash2, Clock } from 'lucide-react';
import type { Bookmark } from '../hooks/useBookmarks';

interface BookmarkPanelProps {
  bookmarks: Bookmark[];
  onBookmarkClick: (chapterId: number, pageNumber: number) => void;
  onRemoveBookmark: (bookmarkId: string) => void;
  theme: 'light' | 'sepia' | 'dark';
}

export const BookmarkPanel = ({ bookmarks, onBookmarkClick, onRemove }: {
  bookmarks: any[];
  onBookmarkClick: (chapterId: number, pageNumber: number) => void;
  onRemove: (id: string) => void;
  theme: 'light' | 'sepia' | 'dark';
}) => {
  const isDark = theme === 'dark';
  const isSepia = theme === 'sepia';

  const getTextSecondaryClass = () => {
    if (isDark) return 'text-gray-400';
    if (isSepia) return 'text-amber-700';
    return 'text-gray-600';
  };

  const getCardBgClass = () => {
    if (theme === 'dark') return 'bg-gray-700 hover:bg-gray-600';
    if (theme === 'sepia') return 'bg-amber-100 hover:bg-amber-200';
    return 'bg-white hover:bg-gray-50';
  };

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <Bookmark className={`w-12 h-12 mx-auto mb-3 ${theme === 'dark' ? 'text-gray-600' : theme === 'sepia' ? 'text-amber-400' : 'text-gray-400'
          }`} />
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : theme === 'sepia' ? 'text-amber-700' : 'text-gray-600'
          }`}>
          Chưa có bookmark nào
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className={`p-3 rounded-lg transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600' :
              isSepia ? 'bg-amber-100 hover:bg-amber-200' :
                'bg-white hover:bg-cream-200'
            }`}
        >
          <div className="flex items-start justify-between mb-2">
            <button
              onClick={() => onBookmarkClick(bookmark)}
              className="flex-1 text-left"
            >
              <div className="font-semibold text-sm">
                Chương {bookmark.chapterNumber}: {bookmark.chapterTitle}
              </div>
              <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : theme === 'sepia' ? 'text-amber-700' : 'text-gray-600'
                }`}>
                Trang {bookmark.pageNumber} • {new Date(bookmark.createdAt).toLocaleDateString('vi-VN')}
              </div>
              <div className={`text-sm mt-2 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : theme === 'sepia' ? 'text-amber-700' : 'text-gray-600'
                }`}>
                "{bookmark.content}"
              </div>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(bookmark.id);
              }}
              className={`p-2 rounded transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : theme === 'sepia' ? 'hover:bg-amber-100' : 'hover:bg-cream-200'
                }`}
              aria-label="Xóa bookmark"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}

      {bookmarks.length === 0 && (
        <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : theme === 'sepia' ? 'text-amber-700' : 'text-gray-500'
          }`}>
          <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Chưa có bookmark nào</p>
          <p className="text-xs mt-1">Nhấn vào icon bookmark để lưu trang</p>
        </div>
      )}
    </div>
  );
};
