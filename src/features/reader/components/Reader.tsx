import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Type,
  Sun,
  Moon,
  BookOpen
} from 'lucide-react';
import { Book } from '@/features/shared/types';
import { chaptersService } from '@/services';
import type { ChapterResponse } from '@/types/api.types';

interface ReaderProps {
  book: Book;
}

export const Reader = ({ book }: ReaderProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get chapter number from URL or default to 1
  const chapterNumberFromUrl = parseInt(searchParams.get('chapter') || '1');

  const [chapters, setChapters] = useState<ChapterResponse[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI States
  const [showChapterList, setShowChapterList] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<string[]>([]);
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Fetch chapters
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        setLoading(true);
        setError(null);

        const chaptersData = await chaptersService.getByBook(Number(book.id));
        setChapters(chaptersData);

        // Find chapter index from URL
        const chapterIndex = chaptersData.findIndex(
          ch => ch.chapterNumber === chapterNumberFromUrl
        );
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

  // Split content into pages when chapter or fontSize changes
  useEffect(() => {
    if (!currentChapter?.content) {
      setPages([]);
      return;
    }

    // Calculate available height for content
    const viewportHeight = window.innerHeight;
    const headerHeight = 80;
    const footerHeight = 100;
    const availableHeight = viewportHeight - headerHeight - footerHeight - 100;

    // Create a temporary container to measure content height
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.visibility = 'hidden';
    tempContainer.style.width = '100%';
    tempContainer.style.maxWidth = '896px'; // max-w-4xl
    tempContainer.style.fontSize = `${fontSize}px`;
    tempContainer.style.lineHeight = '1.6';
    tempContainer.className = 'prose prose-lg max-w-none leading-relaxed';
    document.body.appendChild(tempContainer);

    // Parse HTML content and split by block elements
    const parser = new DOMParser();
    const doc = parser.parseFromString(currentChapter.content, 'text/html');
    const elements = Array.from(doc.body.children);

    const newPages: string[] = [];
    let currentPageContent = '';
    let currentPageHeight = 0;

    for (const element of elements) {
      // Measure this element's height
      tempContainer.innerHTML = element.outerHTML;
      const elementHeight = tempContainer.offsetHeight;

      // If element fits in current page, add it
      if (currentPageHeight + elementHeight <= availableHeight) {
        currentPageContent += element.outerHTML;
        currentPageHeight += elementHeight;
      }
      // If current page has content and element doesn't fit, start new page
      else if (currentPageContent) {
        // Save current page
        newPages.push(currentPageContent.trim());

        // Check if element fits in a fresh page
        if (elementHeight <= availableHeight) {
          // Element fits in new page, start new page with this element
          currentPageContent = element.outerHTML;
          currentPageHeight = elementHeight;
        } else {
          // Element is too large for one page, need to split it
          const textContent = element.textContent || '';
          const tagName = element.tagName.toLowerCase();

          // Split text into sentences or chunks
          const sentences = textContent.match(/[^.!?]+[.!?]+/g) || [textContent];

          currentPageContent = '';
          currentPageHeight = 0;

          for (const sentence of sentences) {
            const testElement = `<${tagName}>${sentence}</${tagName}>`;
            tempContainer.innerHTML = currentPageContent + testElement;
            const testHeight = tempContainer.offsetHeight;

            if (testHeight <= availableHeight) {
              currentPageContent += testElement;
              currentPageHeight = testHeight;
            } else {
              // Current chunk is full, save it
              if (currentPageContent) {
                newPages.push(currentPageContent.trim());
              }
              currentPageContent = testElement;
              tempContainer.innerHTML = testElement;
              currentPageHeight = tempContainer.offsetHeight;
            }
          }
        }
      }
      // First element and it's too large
      else {
        const textContent = element.textContent || '';
        const tagName = element.tagName.toLowerCase();
        const sentences = textContent.match(/[^.!?]+[.!?]+/g) || [textContent];

        for (const sentence of sentences) {
          const testElement = `<${tagName}>${sentence}</${tagName}>`;
          tempContainer.innerHTML = currentPageContent + testElement;
          const testHeight = tempContainer.offsetHeight;

          if (testHeight <= availableHeight) {
            currentPageContent += testElement;
            currentPageHeight = testHeight;
          } else {
            if (currentPageContent) {
              newPages.push(currentPageContent.trim());
            }
            currentPageContent = testElement;
            tempContainer.innerHTML = testElement;
            currentPageHeight = tempContainer.offsetHeight;
          }
        }
      }
    }

    // Add the last page
    if (currentPageContent.trim()) {
      newPages.push(currentPageContent.trim());
    }

    // Clean up
    document.body.removeChild(tempContainer);

    // Fallback to single page if no pages were created
    setPages(newPages.length > 0 ? newPages : [currentChapter.content]);
    setCurrentPage(0);
  }, [currentChapter, fontSize, windowDimensions]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hasPrevPage = currentPage > 0;
  const hasNextPage = currentPage < pages.length - 1;
  const hasPrevChapter = currentChapterIndex > 0;
  const hasNextChapter = currentChapterIndex < chapters.length - 1;

  const goToPrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(currentPage - 1);
    } else if (hasPrevChapter) {
      // Go to last page of previous chapter
      const newIndex = currentChapterIndex - 1;
      setCurrentChapterIndex(newIndex);
      setSearchParams({ chapter: String(chapters[newIndex].chapterNumber) });
      // Page will be set to last page in useEffect
    }
  };

  const goToNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    } else if (hasNextChapter) {
      // Go to first page of next chapter
      const newIndex = currentChapterIndex + 1;
      setCurrentChapterIndex(newIndex);
      setSearchParams({ chapter: String(chapters[newIndex].chapterNumber) });
      setCurrentPage(0);
    }
  };

  const goToChapter = (index: number) => {
    setCurrentChapterIndex(index);
    setSearchParams({ chapter: String(chapters[index].chapterNumber) });
    setShowChapterList(false);
    setCurrentPage(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevPage();
      if (e.key === 'ArrowRight') goToNextPage();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, currentChapterIndex, pages.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-teal mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải chương...</p>
        </div>
      </div>
    );
  }

  if (error || !currentChapter) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Không tìm thấy chương</h1>
          <p className="text-gray-600 mb-4">{error || 'Chương này không tồn tại.'}</p>
          <button
            onClick={() => navigate(`/books/${book.id}`)}
            className="bg-accent-teal text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-cream-200 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-20 px-4 md:px-8 py-4 flex items-center justify-between border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-cream-200 border-cream-300'}`}>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/books/${book.id}`)}
            className="p-2 hover:bg-cream-300 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg">{book.title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chương {currentChapter.chapterNumber}: {currentChapter.title}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {/* Font Size */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-cream-100 dark:bg-gray-700 rounded-full">
            <Type className="w-4 h-4" />
            <button
              onClick={() => setFontSize(Math.max(12, fontSize - 2))}
              className="px-2 py-1 hover:bg-cream-200 dark:hover:bg-gray-600 rounded"
            >
              -
            </button>
            <span className="text-sm">{fontSize}px</span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 2))}
              className="px-2 py-1 hover:bg-cream-200 dark:hover:bg-gray-600 rounded"
            >
              +
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-cream-300 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Chapter List Toggle */}
          <button
            onClick={() => setShowChapterList(!showChapterList)}
            className="p-2 hover:bg-cream-300 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            {showChapterList ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Chapter List Sidebar */}
        {showChapterList && (
          <aside className={`fixed md:sticky top-16 right-0 h-[calc(100vh-4rem)] w-80 overflow-y-auto border-l ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-cream-100 border-cream-300'} z-10`}>
            <div className="p-4">
              <h2 className="font-bold text-lg mb-4 flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Danh sách chương</span>
              </h2>
              <div className="space-y-2">
                {chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => goToChapter(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${index === currentChapterIndex
                      ? 'bg-accent-teal text-white'
                      : isDarkMode
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-cream-200'
                      }`}
                  >
                    <div className="font-semibold">Chương {chapter.chapterNumber}</div>
                    <div className={`text-sm line-clamp-1 ${index === currentChapterIndex ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {chapter.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-8 py-8 max-w-4xl mx-auto">
          {/* Chapter Title */}
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">
              Chương {currentChapter.chapterNumber}
            </h2>
            <h3 className="text-xl text-gray-600 dark:text-gray-400">
              {currentChapter.title}
            </h3>
          </div>

          {/* Page Content - Fixed Height */}
          <div
            className="relative overflow-hidden"
            style={{
              minHeight: `calc(100vh - 300px)`,
              maxHeight: `calc(100vh - 300px)`
            }}
          >
            <div
              className="prose prose-lg dark:prose-invert max-w-none leading-relaxed"
              style={{ fontSize: `${fontSize}px` }}
              dangerouslySetInnerHTML={{ __html: pages[currentPage] || 'Đang tải...' }}
            />
          </div>

          {/* Page Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-300 dark:border-gray-700">
            <button
              onClick={goToPrevPage}
              disabled={!hasPrevPage && !hasPrevChapter}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-colors ${(hasPrevPage || hasPrevChapter)
                ? 'bg-accent-teal text-white hover:bg-teal-600'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>{hasPrevPage ? 'Trang trước' : 'Chương trước'}</span>
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Trang {currentPage + 1} / {pages.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Chương {currentChapterIndex + 1} / {chapters.length}
              </div>
            </div>

            <button
              onClick={goToNextPage}
              disabled={!hasNextPage && !hasNextChapter}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-colors ${(hasNextPage || hasNextChapter)
                ? 'bg-accent-teal text-white hover:bg-teal-600'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
            >
              <span>{hasNextPage ? 'Trang sau' : 'Chương sau'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Keyboard Hint */}
          <div className="text-center mt-4 text-xs text-gray-500 dark:text-gray-600">
            Dùng phím ← → để chuyển trang
          </div>
        </main>
      </div>
    </div>
  );
};
