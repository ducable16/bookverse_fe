import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Search, Plus, X, Check, Upload } from 'lucide-react';
import { Author } from '../types';
import { authorsService } from '@/services';

interface AuthorSelectProps {
  value: string;
  onChange: (authorId: string, authorName: string) => void;
  onAddAuthor?: (author: Author) => void;
}

export const AuthorSelect = ({ value, onChange, onAddAuthor }: AuthorSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authors, setAuthors] = useState<Author[]>([]);
  const [allAuthors, setAllAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
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

  const handleAddNewAuthor = (newAuthor: Author) => {
    if (onAddAuthor) {
      onAddAuthor(newAuthor);
    }
    handleSelect(newAuthor);
    setShowAddModal(false);
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
              <div className="p-4 text-center">
                <p className="text-gray-500 text-sm mb-3">
                  Không tìm thấy tác giả "{searchQuery}"
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(true);
                    setIsOpen(false);
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white text-sm rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm tác giả mới</span>
                </button>
              </div>
            )}
          </div>

          {/* Add New Button (Footer) */}
          {authors.length > 0 && (
            <div className="p-2 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-coral-600 hover:bg-coral-50 rounded-lg transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm tác giả mới</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Author Modal */}
      {showAddModal && (
        <AddAuthorModal
          defaultName={searchQuery}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddNewAuthor}
        />
      )}
    </div>
  );
};

interface AddAuthorModalProps {
  defaultName: string;
  onClose: () => void;
  onSave: (author: Author) => void;
}

const AddAuthorModal = ({ defaultName, onClose, onSave }: AddAuthorModalProps) => {
  const [formData, setFormData] = useState({
    name: defaultName,
    bio: '',
    avatar: '',
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File quá lớn! Vui lòng chọn file nhỏ hơn 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setFormData({ ...formData, avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Simulate API call
    setTimeout(() => {
      const newAuthor: Author = {
        id: String(Date.now()),
        name: formData.name,
        bio: formData.bio,
        avatar: formData.avatar,
        booksCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };

      // In thực tế, bạn sẽ gọi API ở đây
      // const response = await fetch('/api/authors', {
      //   method: 'POST',
      //   body: JSON.stringify(formData)
      // });
      // const newAuthor = await response.json();

      onSave(newAuthor);
      setSaving(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-bold">Thêm tác giả mới</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên tác giả <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
              required
              autoFocus
            />
          </div>

          {/* Upload ảnh đại diện */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh đại diện
            </label>
            <div className="flex items-start space-x-3">
              {/* Preview */}
              <div className="flex-shrink-0">
                {avatarPreview || formData.avatar ? (
                  <img
                    src={avatarPreview || formData.avatar}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-full border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No image</span>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <label className="flex-1 flex flex-col items-center justify-center h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">Tải lên ảnh</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG (MAX. 5MB)</p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiểu sử
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400 h-20 resize-none"
              placeholder="Nhập tiểu sử ngắn gọn..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Đang lưu...' : 'Thêm tác giả'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

