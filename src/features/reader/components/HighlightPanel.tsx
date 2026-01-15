import { Trash2, Palette } from 'lucide-react';
import type { Highlight, HighlightColor } from '../hooks/useHighlights';
import { getHighlightColorClass } from '../hooks/useHighlights';

interface HighlightPanelProps {
  highlights: any[];
  onRemove: (id: string) => void;
  onNavigate: (chapterId: number, pageNumber: number) => void;
  onColorChange: (highlightId: string, color: HighlightColor) => void;
  theme: 'light' | 'sepia' | 'dark';
}

type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink';

const COLORS: { value: HighlightColor; label: string; class: string }[] = [
  { value: 'yellow', label: 'Vàng', class: 'bg-yellow-200' },
  { value: 'green', label: 'Xanh lá', class: 'bg-green-200' },
  { label: 'Xanh dương', value: 'blue', class: 'bg-blue-200' },
  { label: 'Hồng', value: 'pink', class: 'bg-pink-200' },
];

export const HighlightPanel = ({ highlights, onRemove, onJumpTo }: HighlightPanelProps) => {
  const isDark = false; // This will be passed from parent

  if (highlights.length === 0) {
    return (
      <div className="text-center py-12">
        <Highlighter className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-500">Chưa có highlight nào</p>
        <p className="text-sm text-gray-400 mt-2">
          Bôi đen văn bản để highlight
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {highlights.map((highlight) => (
        <div
          key={highlight.id}
          className={`p-4 rounded-lg cursor-pointer transition-colors ${
            isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50'
          }`}
          onClick={() => onHighlightClick(highlight)}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div
                className={`w-4 h-4 rounded ${getHighlightColorClass(highlight.color)}`}
              />
              <span className="text-xs text-gray-500">
                Chương {highlight.chapterNumber} - Trang {highlight.pageNumber}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(highlight.id);
              }}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm line-clamp-3">{highlight.text}</p>
          <p className="text-xs text-gray-400 mt-2">
            {new Date(highlight.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </div>
      ))}
    </div>
  );
};
