import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SearchFilterBar, SearchParams as FilterParams } from '@/features/home/components/SearchFilterBar';
import { EmptyState } from '../components/EmptyState';
import { SearchResultGrid } from '../components/SearchResultGrid';
import { searchService } from '@/services';
import type { SearchResult } from '@/types/search.types';

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const categoryId = searchParams.get('category') || '';
  const authorId = searchParams.get('author') || '';
  const searchType = searchParams.get('type') || 'all'; // all, title, author, content

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query || categoryId) {
      performSearch();
    } else {
      // No search query, show empty state
      setSearchResults([]);
      setTotalResults(0);
      setLoading(false);
    }
  }, [query, categoryId, authorId, searchType, currentPage]);

  const performSearch = async () => {
    try {
      setLoading(true);
      setError(null);

      let searchResponse;

      // Determine which search endpoint to use
      if (searchType === 'title' && query) {
        // Search by title
        searchResponse = await searchService.searchByTitle({
          keyword: query,
          categoryId: categoryId ? Number(categoryId) : undefined,
          sortBy: 'relevance',
          page: currentPage,
          size: 20,
        });
      } else if (searchType === 'author' && query) {
        // Search by author
        searchResponse = await searchService.searchByAuthor({
          keyword: query,
          categoryId: categoryId ? Number(categoryId) : undefined,
          sortBy: 'relevance',
          page: currentPage,
          size: 20,
        });
      } else if (searchType === 'content' && query) {
        // Search by content
        searchResponse = await searchService.searchByContent({
          keyword: query,
          categoryId: categoryId ? Number(categoryId) : undefined,
          sortBy: 'relevance',
          page: currentPage,
          size: 20,
        });
      } else if (categoryId && !query) {
        // Category-only search
        searchResponse = await searchService.searchByCategory(Number(categoryId), {
          keyword: '',
          sortBy: 'title',
          page: currentPage,
          size: 20,
        });
      } else if (query) {
        // Combined search (default)
        searchResponse = await searchService.searchAll({
          keyword: query,
          categoryId: categoryId ? Number(categoryId) : undefined,
          sortBy: 'relevance',
          page: currentPage,
          size: 20,
        });
      } else {
        // No search criteria
        setSearchResults([]);
        setTotalResults(0);
        setTotalPages(0);
        setLoading(false);
        return;
      }

      setSearchResults(searchResponse.results);
      setTotalResults(searchResponse.totalResults);
      setTotalPages(searchResponse.totalPages);
    } catch (err) {
      console.error('Error performing search:', err);
      setError('Không thể tải kết quả tìm kiếm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params: FilterParams) => {
    // Build query string
    const queryParams = new URLSearchParams();
    if (params.query) queryParams.set('q', params.query);
    if (params.categoryId) queryParams.set('category', params.categoryId);
    if (params.authorId) queryParams.set('author', params.authorId);

    // Reset to first page on new search
    setCurrentPage(0);

    // Update URL
    navigate(`/search?${queryParams.toString()}`, { replace: true });
  };

  if (loading) {
    return (
      <div className="px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Đang tìm kiếm...</h1>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-teal mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải kết quả...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-8 py-6">
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
      </div>
    );
  }

  return (
    <div className="px-8 py-6 space-y-6">
      {/* Search Summary */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Kết quả tìm kiếm</h1>
        <p className="text-gray-600 mt-1">
          Tìm thấy <span className="font-semibold text-accent-teal">{totalResults}</span> kết quả
          {query && (
            <span>
              {' '}
              cho "<span className="font-medium">{query}</span>"
            </span>
          )}
        </p>
      </div>

      {/* Filters Bar */}
      <div className="sticky top-0 z-10 bg-cream-50 -mx-8 px-8 py-4">
        <SearchFilterBar
          defaultValues={{ query, categoryId, authorId }}
          onSearch={handleSearch}
        />
      </div>

      {/* Search Type Selector */}
      {query && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600 font-medium">Tìm kiếm theo:</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.delete('type');
                navigate(`/search?${params.toString()}`, { replace: true });
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchType === 'all'
                  ? 'bg-accent-teal text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('type', 'title');
                navigate(`/search?${params.toString()}`, { replace: true });
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchType === 'title'
                  ? 'bg-accent-teal text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Tên sách
            </button>
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('type', 'author');
                navigate(`/search?${params.toString()}`, { replace: true });
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchType === 'author'
                  ? 'bg-accent-teal text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Tác giả
            </button>
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('type', 'content');
                navigate(`/search?${params.toString()}`, { replace: true });
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchType === 'content'
                  ? 'bg-accent-teal text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Nội dung
            </button>
          </div>
        </div>
      )}

      {/* Results Grid or Empty State */}
      {searchResults.length > 0 ? (
        <>
          <SearchResultGrid results={searchResults} />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i;
                  } else if (currentPage < 3) {
                    pageNum = i;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 5 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-accent-teal text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          query={query}
          hasFilters={!!(categoryId || authorId)}
        />
      )}
    </div>
  );
};

