import { useState } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { Plus, Edit2, Trash2, Search, Filter, Eye } from 'lucide-react';
import { mockAdminBooks, mockAuthors, genres } from '../data/mockData';
import { AdminBook } from '../types';

export const BookManagement = () => {
  const [books, setBooks] = useState<AdminBook[]>(mockAdminBooks);
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
      setBooks(books.map(b => b.id === editingBook.id ? { ...b, ...bookData } : b));
    } else {
      const author = mockAuthors.find(a => a.id === bookData.authorId);
      const newBook: AdminBook = {
        id: String(Date.now()),
        title: bookData.title || '',
        authorId: bookData.authorId || '',
        authorName: author?.name || '',
        coverUrl: bookData.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
        description: bookData.description || '',
        genre: bookData.genre || 'Romance',
        status: bookData.status || 'draft',
        totalChapters: bookData.totalChapters || 0,
        views: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setBooks([...books, newBook]);
    }
    setShowModal(false);
    setEditingBook(null);
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
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {book.genre}
                    </span>
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
        />
      )}
    </div>
  );
};

interface BookModalProps {
  book: AdminBook | null;
  onClose: () => void;
  onSave: (data: Partial<AdminBook>) => void;
}

const BookModal = ({ book, onClose, onSave }: BookModalProps) => {
  const [formData, setFormData] = useState({
    title: book?.title || '',
    authorId: book?.authorId || '',
    coverUrl: book?.coverUrl || '',
    description: book?.description || '',
    genre: book?.genre || 'Romance',
    status: book?.status || 'draft',
    totalChapters: book?.totalChapters || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">
          {book ? 'Chỉnh sửa sách' : 'Thêm sách mới'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên sách</label>
              <input 
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tác giả</label>
              <select 
                value={formData.authorId}
                onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
                required
              >
                <option value="">Chọn tác giả</option>
                {mockAuthors.map(author => (
                  <option key={author.id} value={author.id}>{author.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thể loại</label>
              <select 
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số chương</label>
              <input 
                type="number"
                value={formData.totalChapters}
                onChange={(e) => setFormData({ ...formData, totalChapters: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
                min="0"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">URL ảnh bìa</label>
              <input 
                type="url"
                value={formData.coverUrl}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
                placeholder="https://..."
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400 h-32 resize-none"
                placeholder="Nhập mô tả sách..."
              />
            </div>
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
              {book ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

