import { useState } from 'react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { booksService } from '@/services';
import type { BookRequest } from '@/types/api.types';

/**
 * Example: Creating a book with image upload
 */
export const CreateBookExample = () => {
    const [formData, setFormData] = useState<Partial<BookRequest>>({
        title: '',
        description: '',
        coverImage: '',
        totalChapters: 0,
        authorId: 0,
        categoryIds: [],
    });

    const handleImageUpload = (url: string) => {
        setFormData(prev => ({
            ...prev,
            coverImage: url,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const book = await booksService.create(formData as BookRequest);
            console.log('Book created:', book);
            // Handle success (e.g., redirect or show success message)
        } catch (error) {
            console.error('Failed to create book:', error);
            // Handle error
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Create New Book</h1>

            {/* Cover Image Upload */}
            <ImageUpload
                label="Book Cover"
                onUploadComplete={handleImageUpload}
                currentImage={formData.coverImage}
                aspectRatio="2/3"
                maxSizeMB={5}
            />

            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-teal focus:border-transparent"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-teal focus:border-transparent"
                    required
                />
            </div>

            {/* Total Chapters */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Chapters
                </label>
                <input
                    type="number"
                    value={formData.totalChapters}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalChapters: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-teal focus:border-transparent"
                    required
                    min="0"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!formData.coverImage}
                className="w-full bg-accent-teal hover:bg-teal-600 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                Create Book
            </button>
        </form>
    );
};
