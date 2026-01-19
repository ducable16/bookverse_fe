import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export const AdminHeader = ({ title, subtitle }: AdminHeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center space-x-4">
          {/* Admin Profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="w-10 h-10 rounded-full bg-coral-100 flex items-center justify-center">
              <User className="w-6 h-6 text-coral-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{user?.username || 'Admin'}</div>
              <div className="text-xs text-gray-500 capitalize">{user?.role || 'Admin'}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

