import { useState } from 'react';
import { LayoutDashboard, Users, BookOpen, PenTool } from 'lucide-react';
import { cn } from '@/features/shared/utils/cn';
import { Dashboard } from './Dashboard';
import { UserManagement } from './UserManagement';
import { BookManagement } from './BookManagement';
import { AuthorManagement } from './AuthorManagement';

type TabType = 'dashboard' | 'users' | 'books' | 'authors';

interface Tab {
    id: TabType;
    label: string;
    icon: typeof LayoutDashboard;
}

const tabs: Tab[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Quản lý người dùng', icon: Users },
    { id: 'books', label: 'Quản lý sách', icon: BookOpen },
    { id: 'authors', label: 'Quản lý tác giả', icon: PenTool },
];

export const Admin = () => {
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'users':
                return <UserManagement />;
            case 'books':
                return <BookManagement />;
            case 'authors':
                return <AuthorManagement />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Tab Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="px-6">
                    <nav className="flex space-x-1 -mb-px">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        'flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors',
                                        isActive
                                            ? 'border-coral-500 text-coral-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    )}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
                {renderContent()}
            </div>
        </div>
    );
};
