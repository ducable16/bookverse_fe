import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AdminHeader } from '../components/AdminHeader';
import { TiptapEditor } from '../components/TiptapEditor';
import { Plus, Edit2, Trash2, ChevronLeft, X, BookOpen } from 'lucide-react';
import { chaptersService, booksService } from '@/services';
import type { ChapterResponse, ChapterRequest } from '@/types/api.types';

export const ChapterManagement = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  const [bookTitle, setBookTitle] = useState('');
  const [chapters, setChapters] = useState<ChapterResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState<ChapterResponse | null>(null);
  const [operationLoading, setOperationLoading] = useState(false);

  useEffect(() => {
    if (!bookId) {
      navigate('/admin/books');
      return;
    }
    fetchData();
  }, [bookId]);

  const fetchData = async () => {
    if (!bookId) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch book info and chapters in parallel
      const [bookData, chaptersData] = await Promise.all([
        booksService.getById(Number(bookId)),
        chaptersService.getByBook(Number(bookId)),
      ]);

      setBookTitle(bookData.title);
      // Sort chapters by chapter number
      const sortedChapters = chaptersData.sort((a, b) => a.chapterNumber - b.chapterNumber);
      setChapters(sortedChapters);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Không thể tải thông tin. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (chapterId: number) => {
    if (!confirm('Bạn có chắc muốn xóa chapter này?')) return;

    try {
      setOperationLoading(true);
      await chaptersService.delete(chapterId);
      await fetchData(); // Refresh list
      toast.success('Xóa chapter thành công!');
    } catch (err) {
      console.error('Error deleting chapter:', err);
      toast.error('Không thể xóa chapter. Vui lòng thử lại.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleEdit = (chapter: ChapterResponse) => {
    setEditingChapter(chapter);
    setShowModal(true);
  };

  const handleSave = async (chapterData: ChapterRequest) => {
    try {
      setOperationLoading(true);

      if (editingChapter) {
        await chaptersService.update(editingChapter.id, chapterData);
        toast.success('Cập nhật chapter thành công!');
      } else {
        await chaptersService.create(chapterData);
        toast.success('Thêm chapter thành công!');
      }

      await fetchData(); // Refresh list
      setShowModal(false);
      setEditingChapter(null);
    } catch (err) {
      console.error('Error saving chapter:', err);
      toast.error('Không thể lưu chapter. Vui lòng thử lại.');
    } finally {
      setOperationLoading(false);
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (loading) {
    return (
      <div>
        <AdminHeader title="Quản lý chapters" subtitle="Đang tải..." />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách chapters...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <AdminHeader title="Quản lý chapters" subtitle="Lỗi" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchData}
              className="bg-coral-500 text-white px-6 py-2 rounded-lg hover:bg-coral-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Quản lý chapters"
        subtitle={`${bookTitle} - ${chapters.length} chapters`}
      />

      <div className="p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/books')}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Quay lại Quản lý sách</span>
        </button>

        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-coral-500" />
            <h2 className="text-xl font-bold text-gray-900">{bookTitle}</h2>
          </div>
          <button
            onClick={() => {
              setEditingChapter(null);
              setShowModal(true);
            }}
            className="flex items-center space-x-2 bg-coral-500 hover:bg-coral-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm chapter mới</span>
          </button>
        </div>

        {/* Chapters Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {chapters.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Chưa có chapter nào
              </h3>
              <p className="text-gray-500 mb-4">
                Thêm chapter đầu tiên để bắt đầu viết nội dung cho sách này
              </p>
              <button
                onClick={() => {
                  setEditingChapter(null);
                  setShowModal(true);
                }}
                className="inline-flex items-center space-x-2 bg-coral-500 hover:bg-coral-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Thêm chapter đầu tiên</span>
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 w-24">
                    Chapter
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Tiêu đề
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Nội dung preview
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600 w-32">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {chapters.map((chapter) => (
                  <tr key={chapter.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-coral-100 text-coral-700 font-semibold">
                        {chapter.chapterNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{chapter.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm line-clamp-2">
                        {stripHtml(chapter.content).substring(0, 100)}
                        {stripHtml(chapter.content).length > 100 ? '...' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(chapter)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          disabled={operationLoading}
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(chapter.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          disabled={operationLoading}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ChapterModal
          chapter={editingChapter}
          bookId={Number(bookId)}
          onClose={() => {
            setShowModal(false);
            setEditingChapter(null);
          }}
          onSave={handleSave}
          loading={operationLoading}
          nextChapterNumber={chapters.length > 0 ? Math.max(...chapters.map(c => c.chapterNumber)) + 1 : 1}
        />
      )}
    </div>
  );
};

interface ChapterModalProps {
  chapter: ChapterResponse | null;
  bookId: number;
  onClose: () => void;
  onSave: (data: ChapterRequest) => void;
  loading: boolean;
  nextChapterNumber: number;
}

const ChapterModal = ({ chapter, bookId, onClose, onSave, loading, nextChapterNumber }: ChapterModalProps) => {
  const [formData, setFormData] = useState({
    chapterNumber: chapter?.chapterNumber || nextChapterNumber,
    title: chapter?.title || '',
    content: chapter?.content || '',
    bookId: bookId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content.trim() || formData.content === '<p></p>') {
      toast.error('Vui lòng nhập nội dung chapter');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {chapter ? 'Chỉnh sửa chapter' : 'Thêm chapter mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Chapter Number and Title */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số chapter <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.chapterNumber}
                onChange={(e) =>
                  setFormData({ ...formData, chapterNumber: Number(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
                required
                disabled={loading}
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề chapter
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
                placeholder="VD: Chapter 1: Bắt đầu hành trình"
                disabled={loading}
              />
            </div>
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <TiptapEditor
              content={formData.content}
              onChange={(html) => setFormData({ ...formData, content: html })}
              placeholder="Viết nội dung chapter tại đây..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : chapter ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
