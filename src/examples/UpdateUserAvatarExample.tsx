import { useState } from 'react';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { userService } from '@/services';
import type { UserUpdateRequest } from '@/types/api.types';

/**
 * Example: Updating user avatar
 */
export const UpdateUserAvatarExample = () => {
    const userId = 1; // Get from auth context or props
    const [avatarUrl, setAvatarUrl] = useState<string>('');
    const [updating, setUpdating] = useState(false);

    const handleAvatarUpload = async (url: string) => {
        setAvatarUrl(url);

        // Automatically update user profile when avatar is uploaded
        try {
            setUpdating(true);
            const updateData: UserUpdateRequest = {
                avatarUrl: url,
            };

            const updatedUser = await userService.update(userId, updateData);
            console.log('Avatar updated:', updatedUser);
            // Handle success
        } catch (error) {
            console.error('Failed to update avatar:', error);
            // Handle error
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h2 className="text-xl font-bold mb-4">Update Profile Picture</h2>

            <ImageUpload
                label="Profile Picture"
                onUploadComplete={handleAvatarUpload}
                currentImage={avatarUrl}
                aspectRatio="1/1"
                maxSizeMB={2}
            />

            {updating && (
                <p className="text-sm text-gray-600 mt-2">Updating profile...</p>
            )}
        </div>
    );
};
