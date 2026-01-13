import { useState } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { Plus, Edit2, Trash2, Search, Filter, Eye, Upload, X } from 'lucide-react';
import { mockAdminBooks, mockAuthors, genres } from '../data/mockData';
import { AdminBook, Author } from '../types';
import { AuthorSelect } from '../components/AuthorSelect';

export const BookManagement = () => {
  const [books, setBooks] = useState<AdminBook[]>(mockAdminBooks);
  const [authors, setAuthors] = useState<Author[]>(mockAuthors);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<AdminBook | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || book.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa sách này?')) {
      setBooks(books.filter(b => b.id !== id));
    }
  };

  const handleEdit = (book: AdminBook) => {
    setEditingBook(book);
    setShowModal(true);
  };

  const handleSave = (bookData: Partial<AdminBook>) => {
    if (editingBook) {
      setBooks(books.map(b => b.id === editingBook.id ? { ...b, ...bookData, updatedAt: new Date().toISOString().split('T')[0] } : b));
    } else {
      const author = authors.find(a => a.id === bookData.authorId);
      const newBook: AdminBook = {
        id: String(Date.now()),
        title: bookData.title || '',
        authorId: bookData.authorId || '',
        authorName: author?.name || '',
        coverUrl: bookData.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
        description: bookData.description || '',
        genre: bookData.genre || [],
        status: bookData.status || 'draft',
        totalChapters: 0,
        views: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setBooks([...books, newBook]);
    }
    setShowModal(false);
    setEditingBook(null);
  };

  const handleAddAuthor = (newAuthor: Author) => {
    setAuthors([...authors, newAuthor]);
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
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      book.status === 'published' 
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
                        onClick={() => handleEdit(book)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => handleDelete(book.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Modal */}
      {showModal && (
        <BookModal 
          book={editingBook}
          onClose={() => { setShowModal(false); setEditingBook(null); }}
          onSave={handleSave}
          onAddAuthor={handleAddAuthor}
        />
      )}
    </div>
  );
};

interface BookModalProps {
  book: AdminBook | null;
  onClose: () => void;
  onSave: (data: Partial<AdminBook>) => void;
  onAddAuthor: (author: Author) => void;
}

const BookModal = ({ book, onClose, onSave, onAddAuthor }: BookModalProps) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Trong thực tế, bạn sẽ upload lên server và nhận URL
      // Ở đây chỉ demo với FileReader để preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCoverPreview(result);
        setFormData({ ...formData, coverUrl: result });
      };
      reader.readAsDataURL(file);
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
      alert('Vui lòng chọn tác giả');
      return;
    }
    if (formData.genre.length === 0) {
      alert('Vui lòng chọn ít nhất một thể loại');
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
              <div className="flex-shrink-0">
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
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Thể loại - Multi Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thể loại <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedGenres.includes(genre)
                        ? 'bg-coral-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
              {selectedGenres.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Đã chọn: <span className="font-medium">{selectedGenres.join(', ')}</span>
                  </p>
                </div>
              )}
            </div>
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
              className="px-6 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors font-medium"
            >
              {book ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
