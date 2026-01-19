import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Settings, Volume2, VolumeX, Pause, Play } from 'lucide-react';

import { Book } from '@/types';
import { ReaderSidebar } from './ReaderSidebar';
import { chaptersService, readingService } from '@/services';
import { ChapterResponse } from '@/types/api.types';
import { useTTS } from '../hooks/useTTS';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const chapterNumberFromUrl = parseInt(searchParams.get('chapter') || '1');

  // Data state
  const [chapters, setChapters] = useState<ChapterResponse[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'settings' | 'chapters'>('settings');
  const [currentPage, setCurrentPage] = useState(0);

  // TTS hook
  const { speak, pause, resume, stop, isPlaying, isLoading: isTTSLoading } = useTTS();

  // Reading history tracking
  const lastSavedChapterRef = useRef<number | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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


  // Fetch chapters once when component mounts
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.id]); // Only fetch when book.id changes, not on every chapter change

  const currentChapter = chapters[currentChapterIndex];

  // Calculate chapter reading progress
  const chapterProgress = totalPages > 0
    ? Math.min(100, Math.round(((currentPage + settings.pagesPerView) / totalPages) * 100))
    : 0;

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

  // Reset to first page when chapter changes, unless we're going back to previous chapter
  const shouldGoToLastPage = useRef(false);

  useEffect(() => {
    if (!shouldGoToLastPage.current) {
      // Only reset to first page if we're not going to the last page
      setCurrentPage(0);
    }
    // Don't reset the flag here - let the totalPages calculation effect handle it
  }, [currentChapter?.id]);

  // Calculate total pages after content renders
  // Note: Each column = 1 page, so total pages = total columns
  useEffect(() => {
    if (!contentRef.current || !columnWidth) return;

    const timer = setTimeout(() => {
      const content = contentRef.current;
      if (!content) return;

      const scrollWidth = content.scrollWidth;

      // Calculate number of full columns that fit
      // Add columnGap to account for gaps between columns
      const effectiveColumnWidth = columnWidth + columnGap;
      const totalColumns = Math.max(1, Math.round(scrollWidth / effectiveColumnWidth));

      setTotalPages(totalColumns);

      // If we should go to last page (coming back from next chapter)
      if (shouldGoToLastPage.current) {
        const lastPage = Math.max(0, totalColumns - settings.pagesPerView);
        setCurrentPage(lastPage);
        shouldGoToLastPage.current = false;
      } else {
        // Adjust current page if it exceeds new total pages
        setCurrentPage(prev => Math.min(prev, Math.max(0, totalColumns - settings.pagesPerView)));
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentChapter?.id, columnWidth, settings.fontSize, settings.fontFamily, settings.lineHeight, settings.pagesPerView]);

  // Auto-save reading history when user reaches end of chapter
  useEffect(() => {
    // Clear any pending save timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    // Only save if user is logged in and we have a current chapter
    if (!user || !currentChapter || totalPages === 0) return;

    const currentChapterNumber = currentChapter.chapterNumber;

    // Check if user is on last page of chapter (completed chapter)
    const isOnLastPage = currentPage >= totalPages - settings.pagesPerView;

    // Only save if:
    // 1. User is on last page
    // 2. Haven't saved this chapter yet
    if (isOnLastPage && lastSavedChapterRef.current !== currentChapterNumber) {
      // Debounce: wait 3 seconds before saving to ensure user has actually finished
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await readingService.saveReadingHistory({
            userId: user.id,
            bookId: Number(book.id),
            lastReadChapter: currentChapterNumber,
          });
          lastSavedChapterRef.current = currentChapterNumber;
          console.log(`Reading history saved for chapter ${currentChapterNumber}`);
        } catch (err) {
          console.error('Error saving reading history:', err);
          // Silently fail - don't interrupt reading experience
        }
      }, 3000); // 3 second delay
    }

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [user, book.id, currentChapter, currentPage, totalPages, settings.pagesPerView]);

  // Reset saved chapter tracking when changing chapters
  useEffect(() => {
    lastSavedChapterRef.current = null;
  }, [currentChapter?.id]);

  // Chapter navigation
  const hasPrevChapter = currentChapterIndex > 0;
  const hasNextChapter = currentChapterIndex < chapters.length - 1;

  const goToPrevChapter = () => {
    if (!hasPrevChapter) return;

    // Signal that we want to go to last page after chapter loads
    shouldGoToLastPage.current = true;

    const newIndex = currentChapterIndex - 1;
    setCurrentChapterIndex(newIndex);
    setSearchParams({ chapter: String(chapters[newIndex].chapterNumber) });
  };

  const goToNextChapter = () => {
    if (!hasNextChapter) return;

    const newIndex = currentChapterIndex + 1;
    setCurrentChapterIndex(newIndex);
    setSearchParams({ chapter: String(chapters[newIndex].chapterNumber) });
  };

  // Navigation handlers
  // Jump by number of pages displayed at once (1 or 2)
  const goToPrevPage = () => {
    const jump = settings.pagesPerView;
    if (currentPage > 0) {
      setCurrentPage(prev => Math.max(0, prev - jump));
    } else if (hasPrevChapter) {
      // At first page, go to previous chapter
      goToPrevChapter();
    }
  };

  const goToNextPage = () => {
    const jump = settings.pagesPerView;
    const maxPage = totalPages - settings.pagesPerView;
    if (currentPage < maxPage) {
      setCurrentPage(prev => Math.min(maxPage, prev + jump));
    } else if (hasNextChapter) {
      // At last page, go to next chapter
      goToNextChapter();
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // TTS handlers
  const handleTTSToggle = () => {
    if (isPlaying) {
      pause();
    } else if (currentChapter) {
      // Extract plain text from HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = currentChapter.content;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      speak(plainText);
    }
  };

  const handleTTSStop = () => {
    stop();
  };

  // Stop TTS when changing chapter
  useEffect(() => {
    stop();
  }, [currentChapter?.id]);

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
        {sidebarTab === 'chapters' && (
          <div className="space-y-2">
            {chapters.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Không có chương nào
              </div>
            ) : (
              chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  onClick={() => {
                    setCurrentChapterIndex(index);
                    setSearchParams({ chapter: String(chapter.chapterNumber) });
                    setShowSidebar(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${index === currentChapterIndex
                      ? 'bg-accent-teal text-white'
                      : settings.theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                        : settings.theme === 'sepia'
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                          : 'bg-white hover:bg-cream-200 text-gray-900'
                    }`}
                >
                  <div className="font-medium text-sm mb-1">
                    Chương {chapter.chapterNumber}
                  </div>
                  <div className={`text-xs ${index === currentChapterIndex
                      ? 'text-white/90'
                      : settings.theme === 'dark'
                        ? 'text-gray-400'
                        : settings.theme === 'sepia'
                          ? 'text-amber-700'
                          : 'text-gray-600'
                    }`}>
                    {chapter.title}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </ReaderSidebar>

      {/* Header */}
      < header className={`flex-none px-6 py-4 flex items-center justify-between border-b ${settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' :
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

        <div className="flex items-center gap-2">
          {/* TTS Controls */}
          {isPlaying ? (
            <>
              <button
                onClick={handleTTSToggle}
                className="p-2 hover:bg-black/5 rounded-full transition-colors flex-shrink-0"
                title="Tạm dừng"
                disabled={isTTSLoading}
              >
                <Pause className="w-5 h-5" />
              </button>
              <button
                onClick={handleTTSStop}
                className="p-2 hover:bg-black/5 rounded-full transition-colors flex-shrink-0"
                title="Dừng"
              >
                <VolumeX className="w-5 h-5" />
              </button>
            </>
          ) : (
            <button
              onClick={handleTTSToggle}
              className="p-2 hover:bg-black/5 rounded-full transition-colors flex-shrink-0"
              title="Đọc to"
              disabled={isTTSLoading}
            >
              {isTTSLoading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          )}

          <button
            onClick={() => {
              setSidebarTab('settings');
              setShowSidebar(!showSidebar);
            }}
            className="p-2 hover:bg-black/5 rounded-full transition-colors flex-shrink-0"
            title="Cài đặt"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header >

      {/* Main Content */}
      < main className="flex-1 overflow-hidden relative flex items-center justify-center p-8" >
        {/* Previous Page Button */}
        < button
          onClick={goToPrevPage}
          disabled={currentPage === 0 && !hasPrevChapter}
          className={`absolute left-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all ${currentPage > 0 || hasPrevChapter
            ? 'hover:bg-black/5 cursor-pointer'
            : 'opacity-30 cursor-not-allowed'
            }`}
        >
          <ChevronLeft className="w-8 h-8" />
        </button >

        {/* Content Container */}
        < div ref={containerRef} className="max-w-6xl w-full h-full overflow-hidden relative" >
          {/* Content Area with 2 Columns */}
          < div
            ref={contentRef}
            className={`h-full ${settings.pagesPerView === 2 ? 'columns-2 gap-12' : 'columns-1'
              }`}
            style={{
              fontSize: `${scaledFontSize}px`,
              fontFamily: settings.fontFamily,
              lineHeight: settings.lineHeight,
              columnFill: 'auto',
              columnWidth: `${columnWidth}px`,
              columnGap: `${columnGap}px`,
              transform: `translateX(-${currentPage * (columnWidth + columnGap)}px)`,
            }}
          >
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: currentChapter.content }}
            />
          </div >

          {/* Chapter end indicator */}
          {
            currentPage >= totalPages - 2 && hasNextChapter && (
              <div className="absolute bottom-4 right-4 bg-accent-teal/10 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-medium">
                Chương tiếp: {chapters[currentChapterIndex + 1]?.title}
              </div>
            )
          }
        </div >

        {/* Next Page Button */}
        < button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages - settings.pagesPerView && !hasNextChapter}
          className={`absolute right-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all ${currentPage < totalPages - settings.pagesPerView || hasNextChapter
            ? 'hover:bg-black/5 cursor-pointer'
            : 'opacity-30 cursor-not-allowed'
            }`}
        >
          <ChevronRight className="w-8 h-8" />
        </button >
      </main >

      {/* Footer */}
      < footer className={`flex-none py-4 text-center border-t ${settings.theme === 'dark' ? 'bg-gray-800 border-gray-700' :
        settings.theme === 'sepia' ? 'bg-amber-100 border-amber-200' :
          'bg-white border-gray-200'
        }`}>
        <div className="flex items-center justify-center space-x-3">
          <div className="text-xs opacity-60">
            Chương {currentChapter.chapterNumber}/{chapters.length}
          </div>
          <div className="text-xs opacity-40">•</div>
          <div className="text-sm font-medium">
            {settings.pagesPerView === 2 && currentPage + 1 < totalPages
              ? `${currentPage + 1}-${Math.min(currentPage + 2, totalPages)}/${totalPages}`
              : `${currentPage + 1}/${totalPages}`
            }
          </div>
          <div className="text-xs opacity-40">•</div>
          <div className="text-sm font-medium text-accent-teal">
            {chapterProgress}% chương này
          </div>
        </div>
      </footer >
    </div >
  );
};
