import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';

import { Book } from '@/types';
import { ReaderSidebar } from './ReaderSidebar';
import { chaptersService } from '@/services';
import { ChapterResponse } from '@/types/api.types';

interface ReaderProps {
  book: Book;
}

const READER_FONTS = [
  { name: 'Be Vietnam Pro', value: "'Be Vietnam Pro', sans-serif", category: 'Sans-serif' },
  { name: 'Noto Serif', value: "'Noto Serif', serif", category: 'Serif' },
  { name: 'Merriweather', value: "'Merriweather', serif", category: 'Serif' },
  { name: 'Lora', value: "'Lora', serif", category: 'Serif' },
  { name: 'Inter', value: "'Inter', sans-serif", category: 'Sans-serif' },
  { name: 'Roboto', value: "'Roboto', sans-serif", category: 'Sans-serif' },
  { name: 'Noto Sans', value: "'Noto Sans', sans-serif", category: 'Sans-serif' },
];

const THEME_CLASSES = {
  light: { bg: 'bg-cream-50', text: 'text-gray-900' },
  sepia: { bg: 'bg-amber-50', text: 'text-amber-900' },
  dark: { bg: 'bg-gray-900', text: 'text-gray-100' },
};

export const Reader = ({ book }: ReaderProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const chapterNumberFromUrl = parseInt(searchParams.get('chapter') || '1');

  // Data state
  const [chapters, setChapters] = useState<ChapterResponse[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'settings' | 'bookmarks' | 'highlights'>('settings');
  const [currentPage, setCurrentPage] = useState(0);

  // Reader settings
  const [settings, setSettings] = useState({
    fontSize: 16,
    fontFamily: READER_FONTS[0].value,
    lineHeight: 1.6,
    pagesPerView: 2 as 1 | 2,
    theme: 'sepia' as 'light' | 'sepia' | 'dark',
  });

  // Refs for pagination
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [columnWidth, setColumnWidth] = useState(1);


  // Fetch chapters
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        setError(null);
        const chaptersData = await chaptersService.getByBook(Number(book.id));
        setChapters(chaptersData);
        
        const chapterIndex = chaptersData.findIndex(ch => ch.chapterNumber === chapterNumberFromUrl);
        setCurrentChapterIndex(chapterIndex >= 0 ? chapterIndex : 0);
      } catch (err) {
        console.error('Error fetching chapters:', err);
        setError('Không thể tải chương. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, [book.id, chapterNumberFromUrl]);

  const currentChapter = chapters[currentChapterIndex];

  // Gap between columns (gap-12 = 48px)
  const columnGap = 48;

  // Calculate column width and total pages
  useEffect(() => {
    if (!containerRef.current || !currentChapter) return;

    const updateDimensions = () => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      
      let effectiveColumnWidth: number;
      if (settings.pagesPerView === 2) {
        effectiveColumnWidth = Math.floor((containerWidth - columnGap) / 2);
      } else {
        effectiveColumnWidth = containerWidth;
      }
      
      setColumnWidth(effectiveColumnWidth);
    };

    // Call immediately when effect runs
    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    
    return () => resizeObserver.disconnect();
  }, [settings.pagesPerView, currentChapter]);

  // Calculate total pages after content renders
  // Note: Each column = 1 page, so total pages = total columns
  useEffect(() => {
    if (!contentRef.current || !columnWidth) return;

    const timer = setTimeout(() => {
      const content = contentRef.current;
      if (!content) return;

      const scrollWidth = content.scrollWidth;
      // Total columns (each column is 1 page)
      const totalColumns = Math.max(1, Math.ceil(scrollWidth / columnWidth));
      setTotalPages(totalColumns);
      
      // Reset to first page when chapter changes
      setCurrentPage(0);
    }, 100);

    return () => clearTimeout(timer);
  }, [currentChapter?.id, columnWidth, settings.fontSize, settings.fontFamily, settings.lineHeight]);

  // Navigation handlers
  // Jump by number of pages displayed at once (1 or 2)
  const goToPrevPage = () => {
    const jump = settings.pagesPerView;
    if (currentPage > 0) {
      setCurrentPage(prev => Math.max(0, prev - jump));
    }
  };

  const goToNextPage = () => {
    const jump = settings.pagesPerView;
    const maxPage = totalPages - settings.pagesPerView;
    if (currentPage < maxPage) {
      setCurrentPage(prev => Math.min(maxPage, prev + jump));
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showSidebar) return;
      if (e.key === 'ArrowLeft') goToPrevPage();
      if (e.key === 'ArrowRight') goToNextPage();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showSidebar, currentPage, totalPages]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-teal mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !currentChapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Không thể tải nội dung'}</p>
          <button
            onClick={() => navigate(`/book/${book.id}`)}
            className="px-4 py-2 bg-accent-teal text-white rounded-lg hover:bg-teal-600"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const themeClasses = THEME_CLASSES[settings.theme];

  return (
    <div className={`h-screen w-screen overflow-hidden flex flex-col ${themeClasses.bg} ${themeClasses.text}`}>
      {/* Sidebar */}
      <ReaderSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        settings={settings}
        onSettingsChange={(newSettings) => setSettings(prev => ({ ...prev, ...newSettings }))}
        fonts={READER_FONTS}
        activeTab={sidebarTab}
        onTabChange={setSidebarTab}
      >
        {sidebarTab === 'bookmarks' && (
          <div className="text-center py-8 text-gray-500">
            Chưa có bookmark nào
          </div>
        )}
        {sidebarTab === 'highlights' && (
          <div className="text-center py-8 text-gray-500">
            Chưa có highlight nào
          </div>
        )}
      </ReaderSidebar>

      {/* Header */}
      <header className={`flex-none px-6 py-4 flex items-center justify-between border-b ${
        settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' :
        settings.theme === 'sepia' ? 'bg-amber-100 border-amber-200' :
        'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button
            onClick={() => navigate(`/book/${book.id}`)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="font-bold text-lg truncate">{book.title}</h1>
            <p className="text-sm opacity-70 truncate">
              Chương {currentChapter.chapterNumber}: {currentChapter.title}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setSidebarTab('settings');
            setShowSidebar(!showSidebar);
          }}
          className="p-2 hover:bg-black/5 rounded-full transition-colors flex-shrink-0"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative flex items-center justify-center p-8">
        {/* Previous Page Button */}
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 0}
          className={`absolute left-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all ${
            currentPage > 0
              ? 'hover:bg-black/5 cursor-pointer'
              : 'opacity-30 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Content Container */}
        <div ref={containerRef} className="max-w-6xl w-full h-full overflow-hidden">
          {/* Content Area with 2 Columns */}
          <div 
            ref={contentRef}
            className={`h-full ${
              settings.pagesPerView === 2 ? 'columns-2 gap-12' : 'columns-1'
            }`}
            style={{
              fontSize: `${settings.fontSize}px`,
              fontFamily: settings.fontFamily,
              lineHeight: settings.lineHeight,
              columnFill: 'auto',
              columnWidth: `${columnWidth}px`,
              columnGap: `${columnGap}px`,
              transform: `translateX(-${currentPage * (columnWidth + columnGap)}px)`,
              transition: 'transform 0.3s ease',
            }}
          >
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: currentChapter.content }}
            />
          </div>
        </div>

        {/* Next Page Button */}
        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages - 1}
          className={`absolute right-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all ${
            currentPage < totalPages - 1
              ? 'hover:bg-black/5 cursor-pointer'
              : 'opacity-30 cursor-not-allowed'
          }`}
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </main>

      {/* Footer */}
      <footer className={`flex-none py-4 text-center border-t ${
        settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' :
        settings.theme === 'sepia' ? 'bg-amber-100 border-amber-200' :
        'bg-white border-gray-200'
      }`}>
        <div className="text-sm font-medium">
          {settings.pagesPerView === 2 && currentPage + 1 < totalPages
            ? `${currentPage + 1}-${Math.min(currentPage + 2, totalPages)}/${totalPages}`
            : `${currentPage + 1}/${totalPages}`
          }
        </div>
      </footer>
    </div>
  );
};
