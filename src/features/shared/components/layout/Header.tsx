import { Link } from 'react-router-dom';
import { BookOpen, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Header = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-coral-600">
            <BookOpen className="w-8 h-8" />
            <span>BookVerse</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-coral-600 transition-colors">
              Trang chủ
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-coral-600 transition-colors">
              Thể loại
            </Link>
            <Link to="/library" className="text-gray-700 hover:text-coral-600 transition-colors">
              Thư viện
            </Link>
            <Link to="/discover" className="text-gray-700 hover:text-coral-600 transition-colors">
              Khám phá
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-coral-600 transition-colors font-medium"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-coral-500 text-white px-4 py-2 rounded-lg hover:bg-coral-600 transition-colors font-medium"
                >
                  Đăng ký
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user?.username}</span>
                </div>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-coral-600 hover:text-coral-700 transition-colors font-medium"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Quản trị</span>
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden lg:inline">Đăng xuất</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
