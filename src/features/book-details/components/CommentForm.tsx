import { useState } from 'react';
import { Send } from 'lucide-react';

interface CommentFormProps {
    onSubmit: (content: string) => Promise<void>;
    placeholder?: string;
    buttonText?: string;
    autoFocus?: boolean;
}

export const CommentForm = ({
    onSubmit,
    placeholder = 'Viết bình luận...',
    buttonText = 'Gửi',
    autoFocus = false
}: CommentFormProps) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim() || isSubmitting) return;

        try {
            setIsSubmitting(true);
            await onSubmit(content.trim());
            setContent('');
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                autoFocus={autoFocus}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent-teal focus:border-transparent"
                disabled={isSubmitting}
            />
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                    className="inline-flex items-center space-x-2 px-6 py-2 bg-accent-teal text-white rounded-full hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Đang gửi...' : buttonText}</span>
                </button>
            </div>
        </form>
    );
};
