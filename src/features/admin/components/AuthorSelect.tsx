import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import { Author } from '../types';
import { authorsService } from '@/services';

interface AuthorSelectProps {
  value: string;
  onChange: (authorId: string, authorName: string) => void;
  onAddAuthor?: () => void;
}

export const AuthorSelect = ({ value, onChange, onAddAuthor }: AuthorSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authors, setAuthors] = useState<Author[]>([]);
  const [allAuthors, setAllAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch all authors on mount
  useEffect(() => {
    const fetchAllAuthors = async () => {
      try {
        setLoading(true);
        const fetchedAuthors = await authorsService.getAll();
        // Map API authors to local Author type
        const mappedAuthors: Author[] = fetchedAuthors.map(a => ({
          id: String(a.id),
          name: a.name,
          bio: a.biography || '',
          booksCount: 0, // API doesn't provide this
          createdAt: new Date().toISOString().split('T')[0],
        }));
        setAllAuthors(mappedAuthors);
        setAuthors(mappedAuthors);
      } catch (error) {
        console.error('Error fetching authors:', error);
        setAllAuthors([]);
        setAuthors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAuthors();
  }, []);

  // Filter authors based on search query
  useEffect(() => {
    const filtered = allAuthors.filter(author =>
      author.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setAuthors(filtered);
  }, [searchQuery, allAuthors]);

  // Get selected author info
  useEffect(() => {
    if (value) {
      const author = allAuthors.find(a => a.id === value);
      setSelectedAuthor(author || null);
    }
  }, [value, allAuthors]);

  const handleSelect = (author: Author) => {
    onChange(author.id, author.name);
    setSelectedAuthor(author);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleAddNew = () => {
    setIsOpen(false);
    onAddAuthor?.();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <span className={selectedAuthor ? 'text-gray-900' : 'text-gray-400'}>
          {selectedAuthor ? selectedAuthor.name : 'Chọn tác giả...'}
        </span>
        <Search className="w-4 h-4 text-gray-400" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden flex flex-col">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tác giả..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400 text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* Authors List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Đang tìm kiếm...
              </div>
            ) : authors.length > 0 ? (
              authors.map((author) => (
                <button
                  key={author.id}
                  type="button"
                  onClick={() => handleSelect(author)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                      {author.avatar ? (
                        <img src={author.avatar} alt={author.name} className="w-8 h-8 object-cover" />
                      ) : (
                        <span className="text-sm text-gray-600 font-medium">{author.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 truncate">{author.name}</div>
                      <div className="text-xs text-gray-500">{author.booksCount} sách</div>
                    </div>
                  </div>
                  {value === author.id && (
                    <Check className="w-4 h-4 text-coral-500 flex-shrink-0" />
                  )}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                {searchQuery ? `Không tìm thấy tác giả "${searchQuery}"` : 'Chưa có tác giả nào'}
              </div>
            )}
          </div>

          {/* Add New Button (Footer) */}
          {onAddAuthor && authors.length > 0 && (
            <div className="p-2 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={handleAddNew}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-coral-600 hover:bg-coral-50 rounded-lg transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm tác giả mới</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

