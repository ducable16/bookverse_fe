import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './features/shared/components/layout/Layout';
import { Home } from './features/home/pages/Home';
import { BookDetails } from './features/books/pages/BookDetails';
import { AllBooks } from './features/books/pages/AllBooks';
import { ReadBook } from './features/reader/pages/ReadBook';
import { History } from './features/history/pages/History';
import { Saved } from './features/saved/pages/Saved';
import { Categories } from './features/categories/pages/Categories';
import { SearchResults } from './features/search/pages/SearchResults';
import { Unauthorized } from './pages/Unauthorized';

// Admin imports
import { AdminLayout } from './features/admin/components/AdminLayout';
import { UserManagement } from './features/admin/pages/UserManagement';
import { BookManagement } from './features/admin/pages/BookManagement';
import { AuthorManagement } from './features/admin/pages/AuthorManagement';
import { ChapterManagement } from './features/admin/pages/ChapterManagement';

// Auth imports
import { Login } from './features/auth/pages/Login';
import { Register } from './features/auth/pages/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/book/:id" element={<Layout><BookDetails /></Layout>} />
          <Route path="/all-books" element={<Layout><AllBooks /></Layout>} />
          <Route path="/search" element={<Layout><SearchResults /></Layout>} />
          <Route path="/history" element={<Layout><History /></Layout>} />
          <Route path="/saved" element={<Layout><Saved /></Layout>} />
          <Route path="/categories" element={<Layout><Categories /></Layout>} />

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
                <AdminLayout><UserManagement /></AdminLayout>
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
