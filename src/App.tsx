import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './features/shared/components/layout/Layout';
import { Home } from './features/home/pages/Home';
import { BookDetails } from './features/books/pages/BookDetails';
import { ReadBook } from './features/reader/pages/ReadBook';
import { History } from './features/history/pages/History';
import { Saved } from './features/saved/pages/Saved';
import { Categories } from './features/categories/pages/Categories';
import { Unauthorized } from './pages/Unauthorized';

// Admin imports
import { AdminLayout } from './features/admin/components/AdminLayout';
import { Dashboard } from './features/admin/pages/Dashboard';
import { UserManagement } from './features/admin/pages/UserManagement';
import { BookManagement } from './features/admin/pages/BookManagement';
import { AuthorManagement } from './features/admin/pages/AuthorManagement';
import { EditorDemo } from './features/admin/pages/EditorDemo';
import { ChapterManagement } from './features/admin/pages/ChapterManagement';

// Auth imports
import { Login } from './features/auth/pages/Login';
import { Register } from './features/auth/pages/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/book/:id" element={<Layout><BookDetails /></Layout>} />
          <Route path="/history" element={<Layout><History /></Layout>} />
          <Route path="/saved" element={<Layout><Saved /></Layout>} />
          <Route path="/categories" element={<Layout><Categories /></Layout>} />
          <Route path="/library" element={<Layout><Home /></Layout>} />
          <Route path="/discover" element={<Layout><Home /></Layout>} />

          {/* Reader without Header (minimal UI) */}
          <Route path="/read/:id" element={<ReadBook />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Admin Routes - Require Admin Role */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><Dashboard /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><UserManagement /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/books"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><BookManagement /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/authors"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><AuthorManagement /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/chapters/:bookId"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><ChapterManagement /></AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/editor"
            element={
              <ProtectedRoute requireAdmin>
                <AdminLayout><EditorDemo /></AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
