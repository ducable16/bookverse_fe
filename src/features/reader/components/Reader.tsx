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
  { name: 'Be Vietnam Pro', value: "'Be Vietnam Pro', sans-serif", category: 'Sans-serif', scale: 1.0 },
  { name: 'Noto Serif', value: "'Noto Serif', serif", category: 'Serif', scale: 0.95 },
  { name: 'Merriweather', value: "'Merriweather', serif", category: 'Serif', scale: 0.90 },
  { name: 'Lora', value: "'Lora', serif", category: 'Serif', scale: 0.92 },
  { name: 'Inter', value: "'Inter', sans-serif", category: 'Sans-serif', scale: 1.0 },
  { name: 'Roboto', value: "'Roboto', sans-serif", category: 'Sans-serif', scale: 1.05 },
  { name: 'Noto Sans', value: "'Noto Sans', sans-serif", category: 'Sans-serif', scale: 1.0 },
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
  const [preloadedChapters, setPreloadedChapters] = useState<Set<number>>(new Set());
  const [isLoadingNextChapter, setIsLoadingNextChapter] = useState(false);

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
        // Sort chapters by chapterNumber to ensure correct order
        const sortedChapters = chaptersData.sort((a, b) => a.chapterNumber - b.chapterNumber);
        setChapters(sortedChapters);
        
        const chapterIndex = sortedChapters.findIndex(ch => ch.chapterNumber === chapterNumberFromUrl);
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

  // Pre-load next 2-3 chapters
  useEffect(() => {
    const preloadNextChapters = async () => {
      if (!currentChapter || chapters.length === 0) return;
      
      const nextChaptersToPreload = [];
      for (let i = 1; i <= 3; i++) {
        const nextIndex = currentChapterIndex + i;
        if (nextIndex < chapters.length && !preloadedChapters.has(chapters[nextIndex].id)) {
          nextChaptersToPreload.push(chapters[nextIndex].id);
        }
      }
      
      if (nextChaptersToPreload.length > 0) {
        // Mark as preloaded (content is already in chapters array from initial fetch)
        setPreloadedChapters(prev => {
          const newSet = new Set(prev);
          nextChaptersToPreload.forEach(id => newSet.add(id));
          return newSet;
        });
      }
    };
    
    preloadNextChapters();
  }, [currentChapterIndex, currentChapter, chapters, preloadedChapters]);

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

  // Reset to first page when chapter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [currentChapter?.id]);

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
      
      // Adjust current page if it exceeds new total pages
      setCurrentPage(prev => Math.min(prev, Math.max(0, totalColumns - settings.pagesPerView)));
    }, 100);

    return () => clearTimeout(timer);
  }, [currentChapter?.id, columnWidth, settings.fontSize, settings.fontFamily, settings.lineHeight, settings.pagesPerView]);

  // Chapter navigation
  const hasPrevChapter = currentChapterIndex > 0;
  const hasNextChapter = currentChapterIndex < chapters.length - 1;

  const goToPrevChapter = async () => {
    if (!hasPrevChapter) return;
    
    setIsLoadingNextChapter(true);
    const newIndex = currentChapterIndex - 1;
    
    // Small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setCurrentChapterIndex(newIndex);
    setSearchParams({ chapter: String(chapters[newIndex].chapterNumber) });
    setCurrentPage(0);
    setIsLoadingNextChapter(false);
  };

  const goToNextChapter = async () => {
    if (!hasNextChapter) return;
    
    setIsLoadingNextChapter(true);
    const newIndex = currentChapterIndex + 1;
    
    // Small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 100));
    
    setCurrentChapterIndex(newIndex);
    setSearchParams({ chapter: String(chapters[newIndex].chapterNumber) });
    setCurrentPage(0);
    setIsLoadingNextChapter(false);
  };

  // Navigation handlers
  // Jump by number of pages displayed at once (1 or 2)
  const goToPrevPage = async () => {
    const jump = settings.pagesPerView;
    if (currentPage > 0) {
      setCurrentPage(prev => Math.max(0, prev - jump));
    } else if (hasPrevChapter) {
      // At first page, go to previous chapter
      await goToPrevChapter();
    }
  };

  const goToNextPage = async () => {
    const jump = settings.pagesPerView;
    const maxPage = totalPages - settings.pagesPerView;
    if (currentPage < maxPage) {
      setCurrentPage(prev => Math.min(maxPage, prev + jump));
    } else if (hasNextChapter) {
      // At last page, go to next chapter
      await goToNextChapter();
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

  // Find current font and apply scaling for visual size normalization
  const currentFont = READER_FONTS.find(f => f.value === settings.fontFamily);
  const fontScale = currentFont?.scale || 1.0;
  const scaledFontSize = settings.fontSize * fontScale;

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
          disabled={currentPage === 0 && !hasPrevChapter}
          className={`absolute left-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all ${
            currentPage > 0 || hasPrevChapter
              ? 'hover:bg-black/5 cursor-pointer'
              : 'opacity-30 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Content Container */}
        <div ref={containerRef} className="max-w-6xl w-full h-full overflow-hidden relative">
          {/* Loading overlay when switching chapters */}
          {isLoadingNextChapter && (
            <div className="absolute inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal mx-auto mb-2"></div>
                <p className="text-sm opacity-70">Đang chuyển chương...</p>
              </div>
            </div>
          )}
          
          {/* Content Area with 2 Columns */}
          <div 
            ref={contentRef}
            className={`h-full ${
              settings.pagesPerView === 2 ? 'columns-2 gap-12' : 'columns-1'
            }`}
            style={{
              fontSize: `${scaledFontSize}px`,
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
          
          {/* Chapter end indicator */}
          {currentPage >= totalPages - 2 && hasNextChapter && (
            <div className="absolute bottom-4 right-4 bg-accent-teal/10 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-medium">
              Chương tiếp: {chapters[currentChapterIndex + 1]?.title}
            </div>
          )}
        </div>

        {/* Next Page Button */}
        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages - settings.pagesPerView && !hasNextChapter}
          className={`absolute right-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all ${
            currentPage < totalPages - settings.pagesPerView || hasNextChapter
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
        <div className="flex items-center justify-center space-x-4">
          <div className="text-xs opacity-60">
            Chương {currentChapter.chapterNumber}/{chapters.length}
          </div>
          <div className="text-sm font-medium">
            {settings.pagesPerView === 2 && currentPage + 1 < totalPages
              ? `${currentPage + 1}-${Math.min(currentPage + 2, totalPages)}/${totalPages}`
              : `${currentPage + 1}/${totalPages}`
            }
          </div>
        </div>
      </footer>
    </div>
  );
};
