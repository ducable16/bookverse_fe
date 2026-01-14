import { useState, useEffect } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { Plus, Edit2, Trash2, Search, BookOpen, Upload, X, Eye } from 'lucide-react';
import { Author } from '../types';
import { authorsService, booksService } from '@/services';
import type { Author as ApiAuthor, Book as ApiBook } from '@/types/api.types';

// Helper to map API Author to local Author type
const mapApiAuthorToLocal = (apiAuthor: ApiAuthor): Author => ({
  id: String(apiAuthor.id),
  name: apiAuthor.name,
  bio: apiAuthor.biography || '',
  booksCount: 0,
  createdAt: new Date().toISOString().split('T')[0],
});

export const AuthorManagement = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [showBooksModal, setShowBooksModal] = useState(false);
  const [operationLoading, setOperationLoading] = useState(false);
  const [selectedAuthorBooks, setSelectedAuthorBooks] = useState<{ authorName: string; books: ApiBook[] }>({ authorName: '', books: [] });

  // Fetch authors on mount
  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiAuthors = await authorsService.getAll();
      // Empty array is valid response, not an error
      const mappedAuthors = apiAuthors.map(mapApiAuthorToLocal);
      setAuthors(mappedAuthors);
    } catch (err) {
      console.error('Error fetching authors:', err);
      setError('Không thể tải danh sách tác giả. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa tác giả này?')) return;

    try {
      setOperationLoading(true);
      await authorsService.delete(Number(id));
      await fetchAuthors(); // Refresh list
      alert('Xóa tác giả thành công!');
    } catch (err) {
      console.error('Error deleting author:', err);
      alert('Không thể xóa tác giả. Vui lòng thử lại.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setShowModal(true);
  };

  const handleSave = async (authorData: Partial<Author>) => {
    try {
      setOperationLoading(true);

      const apiAuthorData = {
        name: authorData.name || '',
        biography: authorData.bio || '',
      };

      if (editingAuthor) {
        await authorsService.update(Number(editingAuthor.id), apiAuthorData);
        alert('Cập nhật tác giả thành công!');
      } else {
        await authorsService.create(apiAuthorData);
        alert('Thêm tác giả thành công!');
      }

      await fetchAuthors(); // Refresh list
      setShowModal(false);
      setEditingAuthor(null);
    } catch (err) {
      console.error('Error saving author:', err);
      alert('Không thể lưu tác giả. Vui lòng thử lại.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleViewBooks = async (author: Author) => {
    try {
      setOperationLoading(true);
      const authorBooks = await booksService.getByAuthor(Number(author.id));
      setSelectedAuthorBooks({ authorName: author.name, books: authorBooks });
      setShowBooksModal(true);
    } catch (err) {
      console.error('Error fetching author books:', err);
      alert('Không thể tải danh sách sách của tác giả.');
    } finally {
      setOperationLoading(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Quản lý tác giả"
        subtitle={`Tổng cộng ${authors.length} tác giả`}
      />

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách tác giả...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchAuthors}
              className="bg-coral-500 text-white px-6 py-2 rounded-lg hover:bg-coral-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8">
          {/* Actions Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm tác giả..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400 w-80"
              />
            </div>
            <button
              onClick={() => { setEditingAuthor(null); setShowModal(true); }}
              className="flex items-center space-x-2 bg-coral-500 hover:bg-coral-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Thêm tác giả mới</span>
            </button>
          </div>

          {/* Authors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuthors.map((author) => (
              <div key={author.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                      {author.avatar ? (
                        <img src={author.avatar} alt={author.name} className="w-16 h-16 object-cover" />
                      ) : (
                        <span className="text-2xl text-gray-600 font-medium">{author.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{author.name}</h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{author.booksCount} sách</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(author)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(author.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                {author.bio && (
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{author.bio}</p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-400">
                    Ngày thêm: {author.createdAt}
                  </div>
                  <button
                    onClick={() => handleViewBooks(author)}
                    className="flex items-center space-x-1 text-sm text-coral-600 hover:text-coral-700 font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Xem sách</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredAuthors.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Không tìm thấy tác giả nào
            </div>
          )}
        </div>
      )}

      {/* Author Modal */}
      {showModal && (
        <AuthorModal
          author={editingAuthor}
          onClose={() => { setShowModal(false); setEditingAuthor(null); }}
          onSave={handleSave}
        />
      )}

      {/* Books List Modal */}
      {showBooksModal && (
        <BooksListModal
          authorName={selectedAuthorBooks.authorName}
          books={selectedAuthorBooks.books}
          onClose={() => setShowBooksModal(false)}
        />
      )}
    </div>
  );
};

interface AuthorModalProps {
  author: Author | null;
  onClose: () => void;
  onSave: (data: Partial<Author>) => void;
}

const AuthorModal = ({ author, onClose, onSave }: AuthorModalProps) => {
  const [formData, setFormData] = useState({
    name: author?.name || '',
    bio: author?.bio || '',
    avatar: author?.avatar || '',
  });
  const [avatarPreview, setAvatarPreview] = useState(author?.avatar || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File quá lớn! Vui lòng chọn file nhỏ hơn 5MB');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">
            {author ? 'Chỉnh sửa tác giả' : 'Thêm tác giả mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên tác giả <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
              required
            />
          </div>

          {/* Upload ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh đại diện
            </label>
            <div className="flex items-start space-x-4">
              {/* Preview */}
              <div className="flex-shrink-0">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-full border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No image</span>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <label className="flex-1 flex flex-col items-center justify-center h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Tải lên ảnh</span>
                  </p>
                  <p className="text-xs text-gray-400">PNG, JPG (MAX. 5MB)</p>
                </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiểu sử</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400 h-32 resize-none"
              placeholder="Nhập tiểu sử tác giả..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
            >
              {author ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface BooksListModalProps {
  authorName: string;
  books: ApiBook[];
  onClose: () => void;
}

const BooksListModal = ({ authorName, books, onClose }: BooksListModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold">Danh sách sách của {authorName}</h2>
            <p className="text-sm text-gray-500 mt-1">Tổng cộng {books.length} cuốn sách</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {books.length > 0 ? (
            <div className="space-y-4">
              {books.map((book) => (
                <div key={book.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                        {book.categoryName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{book.authorName}</span>
                      <span>•</span>
                      <span>{book.publishedYear}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    ID: {book.id}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tác giả này chưa có sách nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
