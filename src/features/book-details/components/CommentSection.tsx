import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { CommentResponse } from '@/types/api.types';
import { commentsService } from '@/services';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';

interface CommentSectionProps {
    bookId: number;
    currentUserId?: number;
}

export const CommentSection = ({ bookId, currentUserId }: CommentSectionProps) => {
    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication from localStorage
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            setIsAuthenticated(!!token);
        };

        // Initial check
        checkAuth();

        // Listen for storage changes (login/logout from other tabs)
        window.addEventListener('storage', checkAuth);

        // Custom event for same-tab login/logout
        window.addEventListener('auth-change', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('auth-change', checkAuth);
        };
    }, []);

    const fetchComments = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await commentsService.getByBook(bookId);
            setComments(data);
        } catch (err) {
            console.error('Error fetching comments:', err);
            setError('Không thể tải bình luận. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [bookId]);

    const handleCreateComment = async (content: string) => {
        try {
            await commentsService.create(bookId, content);
            await fetchComments(); // Refresh comments
        } catch (error) {
            console.error('Error creating comment:', error);
            throw error;
        }
    };

    const handleReply = async (parentId: number, content: string) => {
        try {
            await commentsService.create(bookId, content, parentId);
            await fetchComments(); // Refresh comments
        } catch (error) {
            console.error('Error creating reply:', error);
            throw error;
        }
    };

    const handleEdit = async (commentId: number, content: string) => {
        try {
            await commentsService.update(bookId, commentId, content);
            await fetchComments(); // Refresh comments
        } catch (error) {
            console.error('Error updating comment:', error);
            throw error;
        }
    };

    const handleDelete = async (commentId: number) => {
        try {
            await commentsService.delete(bookId, commentId);
            await fetchComments(); // Refresh comments
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    };

    return (
        <div className="mt-12">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-accent-teal" />
                <h2 className="text-2xl font-bold">
                    Bình luận ({comments.length})
                </h2>
            </div>

            {/* Add Comment Form - Check token from localStorage */}
            {isAuthenticated ? (
                <div className="mb-8">
                    <CommentForm onSubmit={handleCreateComment} />
                </div>
            ) : (
                <div className="mb-8 p-4 bg-gray-100 rounded-lg text-center text-gray-600">
                    Vui lòng <a href="/login" className="text-accent-teal hover:underline font-semibold">đăng nhập</a> để bình luận
                </div>
            )}

            {/* Comments List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-teal mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải bình luận...</p>
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={fetchComments}
                        className="mt-4 px-6 py-2 bg-accent-teal text-white rounded-full hover:bg-teal-600"
                    >
                        Thử lại
                    </button>
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUserId={currentUserId}
                            bookId={bookId}
                            onReply={handleReply}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
