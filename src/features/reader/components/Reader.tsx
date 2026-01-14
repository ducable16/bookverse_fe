import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Bookmark, Edit3 } from 'lucide-react';
import { Book } from '@/features/shared/types';
import { chaptersService } from '@/services';
import type { ChapterResponse } from '@/types/api.types';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '@/features/shared/components/layout/Sidebar';

interface ReaderProps {
  book: Book;
}

export const Reader = ({ book }: ReaderProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [chapters, setChapters] = useState<ChapterResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const totalPages = 10;

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        setError(null);

        const chaptersData = await chaptersService.getByBook(Number(book.id));
        setChapters(chaptersData);
      } catch (err) {
        console.error('Error fetching chapters:', err);
        setError('Không thể tải chương. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [book.id]);

  const chapter = chapters[0] || {
    chapterNumber: 1,
    title: 'Loading...',
    content: ''
  };

  // Split content into paragraphs
  const paragraphs = chapter.content ? chapter.content.split('\n\n').filter(p => p.trim()) : [];
  const midPoint = Math.ceil(paragraphs.length / 2);
  const leftColumn = paragraphs.slice(0, midPoint);
  const rightColumn = paragraphs.slice(midPoint);

  return (
    <div className="min-h-screen bg-cream-200 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-20">
        {/* Header */}
        <header className="sticky top-0 bg-cream-200 z-10 px-8 py-4 flex items-center justify-between border-b border-cream-300">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-medium text-gray-900">{book.title}</span>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-cream-300 rounded-lg transition-colors">
              <Clock className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-cream-300 rounded-lg transition-colors">
              <Bookmark className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-cream-300 rounded-lg transition-colors">
              <Edit3 className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-teal mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải chương...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
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
        ) : (
          <>
            {/* Chapter Title */}
            <div className="text-center py-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Chương {chapter.chapterNumber}</h1>
              <h2 className="text-2xl text-gray-800">{chapter.title}</h2>
            </div>

            {/* Two Column Content */}
            <div className="max-w-6xl mx-auto px-8 pb-24 relative">
              <div className="grid grid-cols-2 gap-16">
                {/* Left Column */}
                <div className="space-y-6 text-gray-800 leading-relaxed">
                  {leftColumn.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                {/* Right Column */}
                <div className="space-y-6 text-gray-800 leading-relaxed">
                  {rightColumn.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="fixed left-28 top-1/2 -translate-y-1/2 p-3 hover:bg-cream-300 rounded-full transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="w-8 h-8 text-gray-600" />
              </button>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="fixed right-8 top-1/2 -translate-y-1/2 p-3 hover:bg-cream-300 rounded-full transition-colors disabled:opacity-30"
              >
                <ChevronRight className="w-8 h-8 text-gray-600" />
              </button>
            </div>

            {/* Page Number */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 text-gray-600">
              {currentPage}/{totalPages}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
