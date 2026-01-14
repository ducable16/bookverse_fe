import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Eye, EyeOff } from 'lucide-react';

export const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);

        try {
            await register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });
            // Registration successful, redirect to login
            navigate('/login', {
                replace: true,
                state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' }
            });
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-50 via-pink-50 to-coral-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1MSwgMTQ2LCA2MCwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
                    {/* Logo */}
                    <div className="mb-8">
                        <Link to="/" className="inline-flex items-center space-x-3 text-4xl font-bold text-coral-600">
                            <BookOpen className="w-12 h-12" />
                            <span>BookVerse</span>
                        </Link>
                    </div>

                    {/* Illustration - Books */}
                    <div className="relative w-full max-w-md">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform -rotate-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg"></div>
                                <div className="h-40 bg-gradient-to-br from-coral-500 to-orange-500 rounded-xl shadow-lg"></div>
                                <div className="h-40 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg"></div>
                                <div className="h-40 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg flex items-center justify-center">
                                    <BookOpen className="w-16 h-16 text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-purple-500 rounded-full opacity-20 blur-2xl"></div>
                        <div className="absolute -top-4 -left-4 w-32 h-32 bg-pink-500 rounded-full opacity-20 blur-2xl"></div>
                    </div>

                    {/* Quote */}
                    <div className="mt-12 text-center max-w-md">
                        <p className="text-2xl font-semibold text-gray-800 mb-2">
                            Bắt đầu hành trình đọc sách
                        </p>
                        <p className="text-gray-600">
                            Tham gia cộng đồng yêu sách BookVerse ngay hôm nay
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link to="/" className="inline-flex items-center space-x-2 text-3xl font-bold text-coral-600">
                            <BookOpen className="w-8 h-8" />
                            <span>BookVerse</span>
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký</h1>
                        <p className="text-gray-600">Tạo tài khoản mới để bắt đầu khám phá</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Tên người dùng
                            </label>
                            <input
                                id="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all"
                                placeholder="username"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-coral-500 text-white py-3 rounded-lg hover:bg-coral-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-coral-500/30"
                        >
                            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Đã có tài khoản?{' '}
                            <Link to="/login" className="text-coral-600 hover:text-coral-700 font-medium">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8 text-center">
                        <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm inline-flex items-center">
                            ← Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
