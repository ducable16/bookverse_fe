import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Save, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { userService, uploadService } from '@/services';

export const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetchingProfile, setFetchingProfile] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        avatarUrl: '',
        password: '',
    });

    // Fetch user profile on mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user?.id) {
                navigate('/login');
                return;
            }

            try {
                setFetchingProfile(true);
                const profileData = await userService.getById(user.id);
                setFormData({
                    username: profileData.username || '',
                    email: profileData.email || '',
                    fullName: profileData.fullName || '',
                    avatarUrl: profileData.avatarUrl || '',
                    password: '',
                });
                setAvatarPreview(profileData.avatarUrl || '');
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('Không thể tải thông tin cá nhân');
            } finally {
                setFetchingProfile(false);
            }
        };

        fetchUserProfile();
    }, [user, navigate]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // Validate file
            uploadService.validateImage(file, 5);

            // Show preview immediately
            const previewUrl = uploadService.createPreviewUrl(file);
            setAvatarPreview(previewUrl);

            // Upload to server
            setUploading(true);
            const url = await uploadService.uploadImage(file);
            setFormData({ ...formData, avatarUrl: url });
            setAvatarPreview(url);
            toast.success('Tải ảnh lên thành công!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tải ảnh lên');
            setAvatarPreview(formData.avatarUrl);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id) {
            toast.error('Vui lòng đăng nhập lại');
            navigate('/login');
            return;
        }

        try {
            setLoading(true);

            // Prepare update data
            const updateData: any = {
                username: formData.username,
                email: formData.email,
            };

            if (formData.fullName) {
                updateData.fullName = formData.fullName;
            }

            if (formData.avatarUrl) {
                updateData.avatarUrl = formData.avatarUrl;
            }

            if (formData.password) {
                updateData.password = formData.password;
            }

            await userService.update(user.id, updateData);

            toast.success('Cập nhật thông tin thành công');

            // Clear password field
            setFormData({
                ...formData,
                password: '',
            });

            // Update user in localStorage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                userData.username = formData.username;
                userData.email = formData.email;
                localStorage.setItem('user', JSON.stringify(userData));
                window.dispatchEvent(new Event('auth-change'));
            }
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Không thể cập nhật thông tin');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    if (fetchingProfile) {
        return (
            <div className="min-h-screen bg-cream-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Thông tin cá nhân</h1>
                    <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Avatar Upload Section */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Ảnh đại diện
                            </label>
                            <div className="flex items-center space-x-6">
                                {/* Preview */}
                                <div className="flex-shrink-0 relative">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar"
                                            className="w-24 h-24 object-cover rounded-full border-2 border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                                            <User className="w-10 h-10 text-gray-400" />
                                        </div>
                                    )}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Upload Button */}
                                <label className="flex-1 flex flex-col items-center justify-center h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center space-x-2">
                                        <Upload className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm text-gray-500">
                                            {uploading ? 'Đang tải...' : 'Tải lên ảnh'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (MAX. 5MB)</p>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        disabled={uploading}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Personal Information Section */}
                        <div className="border-t border-gray-200 pt-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên đăng nhập *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Họ tên
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
                                        placeholder="Nhập họ tên của bạn"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password Change Section */}
                        <div className="border-t border-gray-200 pt-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Đổi mật khẩu</h2>
                            <p className="text-sm text-gray-600 mb-4">Để lại trống nếu không muốn thay đổi mật khẩu</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mật khẩu mới
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
                                            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                            minLength={6}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={loading || uploading}
                                className="flex items-center space-x-2 px-6 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-5 h-5" />
                                <span>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Additional Info */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>Lưu ý:</strong> Thông tin sẽ được cập nhật ngay lập tức. Nếu đổi mật khẩu, chỉ cần nhập mật khẩu mới.
                    </p>
                </div>
            </div>
        </div>
    );
};
