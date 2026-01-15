import { useState } from 'react';
import { MessageCircle, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { CommentResponse } from '@/types/api.types';
import { CommentForm } from './CommentForm';

interface CommentItemProps {
  comment: CommentResponse;
  currentUserId?: number;
  bookId: number;
  onReply: (commentId: number, content: string) => Promise<void>;
  onEdit: (commentId: number, content: string) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
}

export const CommentItem = ({
  comment,
  currentUserId,
  bookId,
  onReply,
  onEdit,
  onDelete,
}: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isOwnComment = currentUserId === comment.userId;

  const handleReply = async (content: string) => {
    await onReply(comment.id, content);
    setIsReplying(false);
  };

  const handleEdit = async (content: string) => {
    await onEdit(comment.id, content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc muốn xóa bình luận này?')) {
      await onDelete(comment.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return 'Vừa xong';
    if (diffInMins < 60) return `${diffInMins} phút trước`;
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-teal to-teal-600 flex items-center justify-center text-white font-semibold">
            {comment.username.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Comment Content */}
        <div className="flex-1">
          <div className="bg-gray-100 rounded-lg px-4 py-3">
            <div className="flex items-start justify-between mb-1">
              <div>
                <span className="font-semibold text-gray-900">{comment.username}</span>
                <span className="text-sm text-gray-500 ml-2">{formatDate(comment.createdDate)}</span>
              </div>

              {/* Action Menu */}
              {isOwnComment && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => {
                          handleDelete();
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Edit mode */}
            {isEditing ? (
              <div className="mt-2">
                <CommentForm
                  onSubmit={handleEdit}
                  placeholder="Chỉnh sửa bình luận..."
                  buttonText="Lưu"
                  autoFocus
                />
                <button
                  onClick={() => setIsEditing(false)}
                  className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <p className="text-gray-800">{comment.content}</p>
            )}
          </div>

          {/* Reply Button */}
          {!isEditing && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="mt-2 text-sm text-gray-600 hover:text-accent-teal flex items-center gap-1 font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              Trả lời
            </button>
          )}

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-3">
              <CommentForm
                onSubmit={handleReply}
                placeholder="Viết câu trả lời..."
                buttonText="Trả lời"
                autoFocus
              />
              <button
                onClick={() => setIsReplying(false)}
                className="mt-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
            </div>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  bookId={bookId}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
