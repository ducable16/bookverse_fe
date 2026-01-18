import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AdminHeader } from '../components/AdminHeader';
import { Plus, Edit2, Trash2, Search, Filter, Eye, Upload, X, BookOpen } from 'lucide-react';
import { AdminBook, Author } from '../types';
import { AuthorSelect } from '../components/AuthorSelect';
import { CategorySelect } from '../components/CategorySelect';
import { booksService, categoriesService, uploadService } from '@/services';
import type { Book as ApiBook, Category } from '@/types/api.types';

// Helper to map API Book to AdminBook
const mapApiBookToAdminBook = (apiBook: ApiBook): AdminBook => ({
  id: String(apiBook.id),
  title: apiBook.title,
  authorId: String(apiBook.authorId),
  authorName: apiBook.authorName,
  coverUrl: apiBook.coverImage,
  description: apiBook.description,
  genre: [apiBook.categoryName],
  status: 'published' as const,
  totalChapters: 0,
  views: 0,
  createdAt: new Date().toISOString().split('T')[0],
  updatedAt: new Date().toISOString().split('T')[0],
});

export const BookManagement = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<AdminBook | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [operationLoading, setOperationLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [categoryLoading, setCategoryLoading] = useState(false);

  // Fetch books and categories on mount
  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('🔍 Fetching categories...');
      const apiCategories = await categoriesService.getAll();
      console.log('✅ Categories received:', apiCategories);
      setCategories(apiCategories);
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📚 Fetching books from API...');
      const apiBooks = await booksService.getAll();
      console.log('✅ API Books received:', apiBooks);
      console.log('📊 Number of books:', apiBooks.length);

      // Empty array is valid response, not an error
      const mappedBooks = apiBooks.map(mapApiBookToAdminBook);
      console.log('🔄 Mapped books:', mappedBooks);

      setBooks(mappedBooks);
      console.log('💾 Books state updated');
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Không thể tải danh sách sách. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || book.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa sách này?')) return;

    try {
      setOperationLoading(true);
      await booksService.delete(Number(id));
      await fetchBooks(); // Refresh list
      toast.success('Xóa sách thành công!');
    } catch (err) {
      console.error('Error deleting book:', err);
      toast.error('Không thể xóa sách. Vui lòng thử lại.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Vui lòng nhập tên danh mục');
      return;
    }

    try {
      setCategoryLoading(true);
      await categoriesService.create({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim(),
      });

      // Refresh categories list
      await fetchCategories();

      // Close modal and reset form
      setShowCategoryModal(false);
      setNewCategoryName('');
      setNewCategoryDescription('');

      toast.success('Thêm danh mục thành công!');
    } catch (err) {
      console.error('Error creating category:', err);
      toast.error('Không thể thêm danh mục. Vui lòng thử lại.');
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleEdit = (book: AdminBook) => {
    setEditingBook(book);
    setShowModal(true);
  };

  const handleSave = async (bookData: Partial<AdminBook>) => {
    try {
      setOperationLoading(true);

      // Convert selected genre IDs to numbers for categoryIds array
      const categoryIds = bookData.genre && bookData.genre.length > 0
        ? bookData.genre.map(id => Number(id))
        : [];

      if (categoryIds.length === 0) {
        toast.error('Vui lòng chọn ít nhất một thể loại');
        setOperationLoading(false);
        return;
      }

      const apiBookData = {
        title: bookData.title || '',
        description: bookData.description || '',
        authorId: Number(bookData.authorId),
        categoryIds: categoryIds, // Send as array
        publishedYear: new Date().getFullYear(),
        isbn: '',
        coverImage: bookData.coverUrl || '',
        price: 0,
      };

      if (editingBook) {
        await booksService.update(Number(editingBook.id), apiBookData);
        toast.success('Cập nhật sách thành công!');
      } else {
        await booksService.create(apiBookData);
        toast.success('Thêm sách thành công!');
      }

      await fetchBooks(); // Refresh list
      setShowModal(false);
      setEditingBook(null);
    } catch (err) {
      console.error('Error saving book:', err);
      toast.error('Không thể lưu sách. Vui lòng thử lại.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleAddAuthor = (newAuthor: Author) => {
    // Author is added via AuthorSelect component which handles API
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div>
      <AdminHeader
        title="Quản lý sách"
        subtitle={`Tổng cộng ${books.length} cuốn sách`}
      />

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách sách...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchBooks}
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
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sách..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400 w-80"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400 appearance-none bg-white"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="draft">Bản nháp</option>
                  <option value="archived">Lưu trữ</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => { setEditingBook(null); setShowModal(true); }}
              className="flex items-center space-x-2 bg-coral-500 hover:bg-coral-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Thêm sách mới</span>
            </button>
          </div>

          {/* Books Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Sách</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Tác giả</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Thể loại</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Trạng thái</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Chương</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Lượt xem</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Cập nhật</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-10 h-14 object-cover rounded"
                        />
                        <span className="font-medium text-gray-900 max-w-[200px] truncate">{book.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{book.authorName}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {book.genre.map(g => (
                          <span key={g} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${book.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : book.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                        }`}>
                        {book.status === 'published' ? 'Đã xuất bản' :
                          book.status === 'draft' ? 'Bản nháp' : 'Lưu trữ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{book.totalChapters}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Eye className="w-4 h-4" />
                        <span>{formatViews(book.views)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{book.updatedAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/admin/chapters/${book.id}`)}
                          className="p-2 hover:bg-coral-50 rounded-lg transition-colors"
                          title="Quản lý chapters"
                        >
                          <BookOpen className="w-4 h-4 text-coral-600" />
                        </button>
                        <button
                          onClick={() => handleEdit(book)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <BookModal
          book={editingBook}
          categories={categories}
          onClose={() => { setShowModal(false); setEditingBook(null); }}
          onSave={handleSave}
          onAddAuthor={handleAddAuthor}
          onAddCategory={() => setShowCategoryModal(true)}
        />
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => {
          console.log('🚪 Closing category modal');
          setShowCategoryModal(false);
          setNewCategoryName('');
          setNewCategoryDescription('');
        }}
        onSave={() => {
          console.log('💾 Saving category');
          handleCreateCategory();
        }}
        loading={categoryLoading}
        name={newCategoryName}
        setName={setNewCategoryName}
        description={newCategoryDescription}
        setDescription={setNewCategoryDescription}
      />
    </div>
  );
};

interface BookModalProps {
  book: AdminBook | null;
  categories: Category[];
  onClose: () => void;
  onSave: (data: Partial<AdminBook>) => void;
  onAddAuthor: (author: Author) => void;
  onAddCategory: () => void;
}

const BookModal = ({ book, categories, onClose, onSave, onAddAuthor, onAddCategory }: BookModalProps) => {
  const [formData, setFormData] = useState({
    title: book?.title || '',
    authorId: book?.authorId || '',
    authorName: book?.authorName || '',
    coverUrl: book?.coverUrl || '',
    description: book?.description || '',
    genre: book?.genre || [],
    status: book?.status || 'draft',
  });
  const [coverPreview, setCoverPreview] = useState(book?.coverUrl || '');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(book?.genre || []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('📁 File selected:', file);
    if (!file) return;

    setUploadError(null);

    try {
      console.log('🔍 Validating file...');
      // Validate file
      uploadService.validateImage(file, 5);
      console.log('✅ Validation passed');

      // Show preview immediately
      const previewUrl = uploadService.createPreviewUrl(file);
      setCoverPreview(previewUrl);
      console.log('👁️ Preview URL created:', previewUrl);

      // Upload to server
      console.log('📤 Starting upload to server...');
      setUploading(true);
      const url = await uploadService.uploadImage(file);
      console.log('✅ Upload complete! URL:', url);

      // Update form data with server URL
      setFormData({ ...formData, coverUrl: url });
      console.log('💾 Form data updated with URL');

      // Update preview to server URL
      setCoverPreview(url);
    } catch (error) {
      console.error('❌ Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Không thể tải ảnh lên');
      setCoverPreview(book?.coverUrl || '');
    } finally {
      setUploading(false);
      console.log('🏁 Upload process finished');
    }
  };

  const toggleGenre = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(newGenres);
    setFormData({ ...formData, genre: newGenres });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.authorId) {
      toast.error('Vui lòng chọn tác giả');
      return;
    }
    if (formData.genre.length === 0) {
      toast.error('Vui lòng chọn ít nhất một thể loại');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {book ? 'Chỉnh sửa sách' : 'Thêm sách mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tên sách */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên sách <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
              required
            />
          </div>

          {/* Tác giả và Trạng thái */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tác giả <span className="text-red-500">*</span>
              </label>
              <AuthorSelect
                value={formData.authorId}
                onChange={(authorId, authorName) => {
                  setFormData({ ...formData, authorId, authorName });
                }}
                onAddAuthor={onAddAuthor}
              />
              {!formData.authorId && (
                <p className="text-xs text-red-500 mt-1">Vui lòng chọn tác giả</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as AdminBook['status'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
              >
                <option value="draft">Bản nháp</option>
                <option value="published">Đã xuất bản</option>
                <option value="archived">Lưu trữ</option>
              </select>
            </div>
          </div>

          {/* Ảnh bìa - Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh bìa
            </label>
            <div className="flex items-start space-x-4">
              {/* Preview */}
              <div className="flex-shrink-0 relative">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Preview"
                    className="w-32 h-48 object-cover rounded-lg border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-32 h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No image</span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Nhấp để tải lên</span> hoặc kéo thả
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
                {uploadError && (
                  <p className="text-sm text-red-600 mt-2">{uploadError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Danh mục - Multi Select with Search and Add */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục <span className="text-red-500">*</span>
            </label>
            {categories.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Đang tải danh mục...</p>
            ) : (
              <div className="border border-gray-300 rounded-lg p-4">
                {/* Add Category Button */}
                <button
                  type="button"
                  onClick={() => {
                    console.log('🔘 Add Category button clicked');
                    onAddCategory();
                  }}
                  className="w-full mb-3 px-4 py-2 border-2 border-dashed border-coral-300 rounded-lg text-coral-600 hover:bg-coral-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">Thêm danh mục mới</span>
                </button>

                {/* Category Buttons */}
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleGenre(String(category.id))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedGenres.includes(String(category.id))
                        ? 'bg-coral-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>

                {selectedGenres.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Đã chọn: <span className="font-medium">
                        {selectedGenres.map(genreId =>
                          categories.find(c => String(c.id) === genreId)?.name
                        ).join(', ')}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
            {formData.genre.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Vui lòng chọn ít nhất một danh mục</p>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400 h-32 resize-none"
              placeholder="Nhập mô tả sách..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {uploading ? 'Đang tải...' : (book ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Category Modal Component
const CategoryModal = ({ isOpen, onClose, onSave, loading, name, setName, description, setDescription }: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  loading: boolean;
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Thêm danh mục mới</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
              placeholder="Ví dụ: Tiểu thuyết, Trinh thám..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
              rows={3}
              placeholder="Mô tả ngắn về danh mục..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={loading || !name.trim()}
              className="flex-1 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang lưu...' : 'Thêm mới'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
