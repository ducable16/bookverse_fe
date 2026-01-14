import { AdminHeader } from '../components/AdminHeader';
import { Users, BookOpen, PenTool, Eye, TrendingUp, TrendingDown } from 'lucide-react';

// TODO: Replace with API calls when backend is ready
const mockAdminUsers: any[] = [];
const mockAdminBooks: any[] = [];
const mockAuthors: any[] = [];

const stats = [
  {
    label: 'Tổng người dùng',
    value: mockAdminUsers.length,
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    label: 'Tổng số sách',
    value: mockAdminBooks.length,
    change: '+8%',
    trend: 'up',
    icon: BookOpen,
    color: 'bg-green-500',
  },
  {
    label: 'Tổng tác giả',
    value: mockAuthors.length,
    change: '+5%',
    trend: 'up',
    icon: PenTool,
    color: 'bg-purple-500',
  },
  {
    label: 'Lượt xem hôm nay',
    value: '2.4K',
    change: '-3%',
    trend: 'down',
    icon: Eye,
    color: 'bg-orange-500',
  },
];

export const Dashboard = () => {
  const recentBooks = mockAdminBooks.slice(0, 5);
  const recentUsers = mockAdminUsers.slice(0, 5);

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        subtitle="Tổng quan về hệ thống BookVerse"
      />

      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Books */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Sách mới cập nhật</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentBooks.map((book) => (
                  <div key={book.id} className="flex items-center space-x-4">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{book.title}</div>
                      <div className="text-sm text-gray-500">{book.authorName}</div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${book.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : book.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                      {book.status === 'published' ? 'Đã xuất bản' :
                        book.status === 'draft' ? 'Bản nháp' : 'Lưu trữ'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Người dùng mới</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <span className="text-gray-600 font-medium">{user.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : user.role === 'manager'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                      {user.role === 'admin' ? 'Admin' :
                        user.role === 'manager' ? 'Manager' : 'User'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

