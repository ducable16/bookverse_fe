import { Link, useLocation } from 'react-router-dom';
import { Home, History, BookMarked, LayoutGrid } from 'lucide-react';
import { cn } from '@/features/shared/utils/cn';

const navItems = [
  { icon: Home, path: '/', label: 'Home' },
  { icon: History, path: '/history', label: 'History' },
  { icon: BookMarked, path: '/saved', label: 'Saved' },
  { icon: LayoutGrid, path: '/categories', label: 'Categories' },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 bg-cream-50 border-r border-cream-300 flex flex-col items-center py-6 z-40">
      {/* Logo */}
      <Link to="/" className="mb-10">
        <div className="w-10 h-10 flex items-center justify-center">
          <svg viewBox="0 0 40 40" className="w-10 h-10 text-gray-800">
            <rect x="8" y="4" width="24" height="32" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 10 L28 10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16 L24 16" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 22 L20 22" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col items-center space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200',
                isActive 
                  ? 'bg-coral-100 text-coral-400' 
                  : 'text-gray-500 hover:bg-cream-200 hover:text-gray-700'
              )}
              title={item.label}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2 : 1.5} />
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

