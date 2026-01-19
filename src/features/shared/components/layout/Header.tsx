import { Link } from 'react-router-dom';
import { BookOpen, User, LogOut, Shield, UserCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';

export const Header = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-coral-600">
            <BookOpen className="w-8 h-8" />
            <span>BookVerse</span>
          </Link>


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
                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-coral-600 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">{user?.username}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <UserCircle className="w-5 h-5" />
                        <span>Chỉnh sửa thông tin</span>
                      </Link>

                      {isAdmin && (
                        <>
                          <div className="border-t border-gray-100 my-1"></div>
                          <Link
                            to="/admin"
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-coral-600 hover:bg-gray-50 transition-colors"
                          >
                            <Shield className="w-5 h-5" />
                            <span>Quản trị</span>
                          </Link>
                        </>
                      )}

                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
