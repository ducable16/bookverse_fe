import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadService } from '@/services';

interface ImageUploadProps {
    onUploadComplete: (url: string) => void;
    currentImage?: string;
    label?: string;
    maxSizeMB?: number;
    aspectRatio?: string;
    className?: string;
}

export const ImageUpload = ({
    onUploadComplete,
    currentImage,
    label = 'Upload Image',
    maxSizeMB = 5,
    aspectRatio,
    className = '',
}: ImageUploadProps) => {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        try {
            // Validate the file
            uploadService.validateImage(file, maxSizeMB);

            // Create preview
            const previewUrl = uploadService.createPreviewUrl(file);
            setPreview(previewUrl);

            // Upload to server
            setUploading(true);
            const url = await uploadService.uploadImage(file);
            onUploadComplete(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload image');
            setPreview(currentImage || null);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        if (preview && preview.startsWith('blob:')) {
            uploadService.revokePreviewUrl(preview);
        }
        setPreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            <div
                className={`relative border-2 border-dashed rounded-lg overflow-hidden ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
                style={aspectRatio ? { aspectRatio } : { minHeight: '200px' }}
            >
                {preview ? (
                    <>
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        {/* Remove button */}
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            disabled={uploading}
                        >
                            <X className="w-4 h-4" />
                        </button>
                        {/* Uploading overlay */}
                        {uploading && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            </div>
                        )}
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={handleClick}
                        className="w-full h-full flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition-colors"
                        disabled={uploading}
                    >
                        {uploading ? (
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-teal"></div>
                        ) : (
                            <>
                                <ImageIcon className="w-12 h-12 text-gray-400" />
                                <div className="text-center">
                                    <span className="text-sm font-medium text-accent-teal">
                                        Click to upload
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">
                                        PNG, JPG, GIF or WebP (max {maxSizeMB}MB)
                                    </p>
                                </div>
                            </>
                        )}
                    </button>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
