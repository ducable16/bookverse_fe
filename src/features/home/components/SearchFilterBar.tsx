import { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { categoriesService, authorsService } from '@/services';
import type { Category, Author } from '@/types/api.types';

export interface SearchParams {
  query: string;
  categoryId?: string;
  authorId?: string;
}

interface SearchFilterBarProps {
  onSearch: (params: SearchParams) => void;
  defaultValues?: Partial<SearchParams>;
}

export const SearchFilterBar = ({ onSearch, defaultValues }: SearchFilterBarProps) => {
  const [searchQuery, setSearchQuery] = useState(defaultValues?.query || '');
  const [selectedCategory, setSelectedCategory] = useState(defaultValues?.categoryId || '');
  const [selectedAuthor, setSelectedAuthor] = useState(defaultValues?.authorId || '');
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories and authors on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        const [categoriesData, authorsData] = await Promise.all([
          categoriesService.getAll(),
          authorsService.getAll(),
        ]);
        setCategories(categoriesData);
        setAuthors(authorsData);
      } catch (error) {
        console.error('Error fetching filters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  const handleSearch = () => {
    onSearch({
      query: searchQuery.trim(),
      categoryId: selectedCategory || undefined,
      authorId: selectedAuthor || undefined,
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedAuthor('');
    onSearch({ query: '', categoryId: undefined, authorId: undefined });
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedAuthor;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm sách theo tên, tác giả, mô tả..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-teal focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Category Filter */}
        <div className="md:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-teal focus:border-transparent bg-white"
            disabled={loading}
          >
            <option value="">Tất cả thể loại</option>
            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Author Filter */}
        <div className="md:w-48">
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-teal focus:border-transparent bg-white"
            disabled={loading}
          >
            <option value="">Tất cả tác giả</option>
            {authors.map((author) => (
              <option key={author.id} value={String(author.id)}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center space-x-2 px-6 py-2.5 bg-accent-teal text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Tìm kiếm</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Xóa bộ lọc"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Xóa</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <Filter className="w-4 h-4 mr-2" />
            <span>Bộ lọc đang áp dụng:</span>
          </div>
          
          {searchQuery && (
            <div className="inline-flex items-center px-3 py-1 bg-accent-teal/10 text-accent-teal rounded-full text-sm">
              <span className="font-medium">"{searchQuery}"</span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  onSearch({ query: '', categoryId: selectedCategory, authorId: selectedAuthor });
                }}
                className="ml-2 hover:bg-accent-teal/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {selectedCategory && (
            <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
              <span>
                {categories.find(c => String(c.id) === selectedCategory)?.name}
              </span>
              <button
                onClick={() => {
                  setSelectedCategory('');
                  onSearch({ query: searchQuery, categoryId: undefined, authorId: selectedAuthor });
                }}
                className="ml-2 hover:bg-blue-100 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {selectedAuthor && (
            <div className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
              <span>
                {authors.find(a => String(a.id) === selectedAuthor)?.name}
              </span>
              <button
                onClick={() => {
                  setSelectedAuthor('');
                  onSearch({ query: searchQuery, categoryId: selectedCategory, authorId: undefined });
                }}
                className="ml-2 hover:bg-purple-100 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

