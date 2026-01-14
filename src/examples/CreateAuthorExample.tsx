import { useState } from 'react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { authorsService } from '@/services';
import type { AuthorRequest } from '@/types/api.types';

/**
 * Example: Creating an author with avatar upload
 */
export const CreateAuthorExample = () => {
    const [formData, setFormData] = useState<Partial<AuthorRequest>>({
        name: '',
        biography: '',
        avatarUrl: '',
    });

    const handleAvatarUpload = (url: string) => {
        setFormData(prev => ({
            ...prev,
            avatarUrl: url,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const author = await authorsService.create(formData as AuthorRequest);
            console.log('Author created:', author);
            // Handle success
        } catch (error) {
            console.error('Failed to create author:', error);
            // Handle error
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Create New Author</h1>

            {/* Avatar Upload */}
            <ImageUpload
                label="Author Avatar"
                onUploadComplete={handleAvatarUpload}
                currentImage={formData.avatarUrl}
                aspectRatio="1/1"
                maxSizeMB={3}
            />

            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-teal focus:border-transparent"
                    required
                />
            </div>

            {/* Biography */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biography
                </label>
                <textarea
                    value={formData.biography}
                    onChange={(e) => setFormData(prev => ({ ...prev, biography: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-teal focus:border-transparent"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-accent-teal hover:bg-teal-600 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
                Create Author
            </button>
        </form>
    );
};
