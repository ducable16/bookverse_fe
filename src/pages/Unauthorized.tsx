import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const Unauthorized = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center px-4">
                <div className="mb-6">
                    <ShieldAlert className="w-24 h-24 text-coral-500 mx-auto mb-4" />
                    <h1 className="text-6xl font-bold text-gray-900 mb-2">403</h1>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        Không có quyền truy cập
                    </h2>
                </div>

                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
                </p>

                <div className="flex items-center justify-center space-x-4">
                    <Link
                        to="/"
                        className="px-6 py-3 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors font-medium"
                    >
                        Về trang chủ
                    </Link>
                    <Link
                        to="/login"
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        Đăng nhập
                    </Link>
                </div>
            </div>
        </div>
    );
};
