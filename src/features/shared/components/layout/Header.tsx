import { Search, Bell } from 'lucide-react';
import { useState } from 'react';

export const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-30 bg-cream-200/95 backdrop-blur supports-[backdrop-filter]:bg-cream-200/80">
      <div className="flex items-center justify-between h-16 px-8">
        {/* Search Bar */}
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search book, name, author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-transparent border-none text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <button className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
            <span className="text-sm font-medium">VN</span>
            <span className="text-lg">🇻🇳</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
              alt="User"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <span className="font-medium text-gray-800">Harleen Quinzel</span>
          </div>

          {/* Notifications */}
          <button className="p-2 hover:bg-cream-300 rounded-full transition-colors relative">
            <Bell className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
