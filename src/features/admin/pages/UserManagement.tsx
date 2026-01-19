import { useState, useEffect } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { Plus, Edit2, Trash2, Search, Filter, RefreshCw, Ban, CheckCircle, Upload, User } from 'lucide-react';
import type { AdminUser, UserSearchRequest, Role, AdminUserCreateRequest, AdminUserUpdateRequest } from '../types';
import { adminUserService } from '../../../services/adminUser.service';
import { uploadService } from '../../../services';

export const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<Role | ''>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'blocked'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: UserSearchRequest = {
        keyword: searchQuery || undefined,
        role: filterRole || undefined,
        isActive: filterStatus === 'all' ? undefined : filterStatus === 'active',
        page: currentPage,
        size: pageSize,
        sortBy: 'createdDate',
        sortDirection: 'DESC'
      };

      const response = await adminUserService.getAllUsers(params);
      setUsers(response.users);
      setTotalUsers(response.totalUsers);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách người dùng');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when filters change
  useEffect(() => {
    fetchUsers();
  }, [searchQuery, filterRole, filterStatus, currentPage, pageSize]);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return;

    try {
      setLoading(true);
      await adminUserService.deleteUser(id);
      await fetchUsers(); // Refresh list
    } catch (err: any) {
      alert(err.message || 'Không thể xóa người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      setLoading(true);
      await adminUserService.toggleUserStatus(id);
      await fetchUsers(); // Refresh list
    } catch (err: any) {
      alert(err.message || 'Không thể thay đổi trạng thái người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (id: number, newRole: Role) => {
    if (!confirm(`Bạn có chắc muốn thay đổi vai trò thành ${newRole}?`)) return;

    try {
      setLoading(true);
      await adminUserService.changeUserRole(id, newRole);
      await fetchUsers(); // Refresh list
    } catch (err: any) {
      alert(err.message || 'Không thể thay đổi vai trò');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleSave = async (userData: AdminUserCreateRequest | AdminUserUpdateRequest) => {
    try {
      setLoading(true);
      if (editingUser) {
        await adminUserService.updateUser(editingUser.id, userData as AdminUserUpdateRequest);
      } else {
        await adminUserService.createUser(userData as AdminUserCreateRequest);
      }
      setShowModal(false);
      setEditingUser(null);
      await fetchUsers(); // Refresh list
    } catch (err: any) {
      alert(err.message || 'Không thể lưu thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0); // Reset to first page when searching
  };

  return (
    <div>
      <AdminHeader
        title="Quản lý người dùng"
        subtitle={`Tổng cộng ${totalUsers} người dùng`}
      />

      <div className="p-8">
        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm người dùng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400 w-80"
              />
            </form>

            {/* Role Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => {
                  setFilterRole(e.target.value as Role | '');
                  setCurrentPage(0);
                }}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400 appearance-none bg-white"
              >
                <option value="">Tất cả vai trò</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as 'all' | 'active' | 'blocked');
                setCurrentPage(0);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400 appearance-none bg-white"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="blocked">Bị chặn</option>
            </select>

            {/* Refresh Button */}
            <button
              onClick={fetchUsers}
              disabled={loading}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              title="Làm mới"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <button
            onClick={() => { setEditingUser(null); setShowModal(true); }}
            className="flex items-center space-x-2 bg-coral-500 hover:bg-coral-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm người dùng</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Người dùng</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Vai trò</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Đang tải...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">{user.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.fullName} className="w-10 h-10 object-cover" />
                          ) : (
                            <span className="text-gray-600 font-medium">
                              {user.fullName?.charAt(0) || user.username.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.fullName || user.username}</div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user.id, e.target.value as Role)}
                        disabled={loading}
                        className={`px-3 py-1 text-xs font-medium rounded-full border-0 cursor-pointer ${user.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="USER">User</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${user.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}>
                        {user.isActive ? 'Hoạt động' : 'Bị chặn'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          disabled={loading}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                          title={user.isActive ? 'Chặn người dùng' : 'Bỏ chặn người dùng'}
                        >
                          {user.isActive ? (
                            <Ban className="w-4 h-4 text-orange-600" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          disabled={loading}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={loading}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Hiển thị {users.length} / {totalUsers} người dùng
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0 || loading}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <span className="text-sm text-gray-600">
                  Trang {currentPage + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1 || loading}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <UserModal
          user={editingUser}
          onClose={() => { setShowModal(false); setEditingUser(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

interface UserModalProps {
  user: AdminUser | null;
  onClose: () => void;
  onSave: (data: AdminUserCreateRequest | AdminUserUpdateRequest) => void;
}

const UserModal = ({ user, onClose, onSave }: UserModalProps) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    fullName: user?.fullName || '',
    password: '',
    role: user?.role || 'USER' as Role,
    avatarUrl: user?.avatarUrl || '',
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || '');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      uploadService.validateImage(file, 5);

      const previewUrl = uploadService.createPreviewUrl(file);
      setAvatarPreview(previewUrl);

      setUploading(true);
      const url = await uploadService.uploadImage(file);
      setFormData({ ...formData, avatarUrl: url });
      setAvatarPreview(url);
      setUploading(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Không thể tải ảnh lên');
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      // Update user (no password)
      const updateData: AdminUserUpdateRequest = {
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName || undefined,
        avatarUrl: formData.avatarUrl || undefined,
      };
      onSave(updateData);
    } else {
      // Create user (requires password)
      if (!formData.password) {
        alert('Vui lòng nhập mật khẩu');
        return;
      }
      const createData: AdminUserCreateRequest = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName || undefined,
        role: formData.role,
        avatarUrl: formData.avatarUrl || undefined,
      };
      onSave(createData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-6">
          {user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
              required
              minLength={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
              required
            />
          </div>

          {!user && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
                required
                minLength={6}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
            />
          </div>

          {!user && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-400"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Avatar</label>
            <div className="flex items-center space-x-4">
              {/* Avatar Preview */}
              <div className="flex-shrink-0 relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-20 h-20 object-cover rounded-full border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <label className="flex-1 flex flex-col items-center justify-center h-20 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {uploading ? 'Đang tải...' : 'Tải lên ảnh'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG (MAX. 5MB)</p>
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

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Đang tải ảnh...' : (user ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
