import { useState } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { Plus, Edit2, Trash2, Search, BookOpen } from 'lucide-react';
import { mockAuthors } from '../data/mockData';
import { Author } from '../types';

export const AuthorManagement = () => {
  const [authors, setAuthors] = useState<Author[]>(mockAuthors);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);

  const filteredAuthors = authors.filter(author => 
    author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa tác giả này?')) {
      setAuthors(authors.filter(a => a.id !== id));
    }
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setShowModal(true);
  };

  const handleSave = (authorData: Partial<Author>) => {
    if (editingAuthor) {
      setAuthors(authors.map(a => a.id === editingAuthor.id ? { ...a, ...authorData } : a));
    } else {
      const newAuthor: Author = {
        id: String(Date.now()),
        name: authorData.name || '',
        bio: authorData.bio || '',
        avatar: authorData.avatar,
        booksCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setAuthors([...authors, newAuthor]);
    }
    setShowModal(false);
    setEditingAuthor(null);
  };

  return (
    <div>
      <AdminHeader 
        title="Quản lý tác giả" 
        subtitle={`Tổng cộng ${authors.length} tác giả`}
      />

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
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {author.avatar ? (
                      <img src={author.avatar} alt={author.name} className="w-16 h-16 object-cover" />
                    ) : (
                      <span className="text-2xl text-gray-600 font-medium">{author.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{author.name}</h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{author.booksCount} sách</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => handleEdit(author)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => handleDelete(author.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
              
              {author.bio && (
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{author.bio}</p>
              )}
              
              <div className="text-xs text-gray-400">
                Ngày thêm: {author.createdAt}
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

      {/* Modal */}
      {showModal && (
        <AuthorModal 
          author={editingAuthor}
          onClose={() => { setShowModal(false); setEditingAuthor(null); }}
          onSave={handleSave}
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-6">
          {author ? 'Chỉnh sửa tác giả' : 'Thêm tác giả mới'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên tác giả</label>
            <input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL ảnh đại diện</label>
            <input 
              type="url"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
              placeholder="https://..."
            />
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

