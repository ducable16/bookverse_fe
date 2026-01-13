import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './features/shared/components/layout/Layout';
import { Home } from './features/home/pages/Home';
import { BookDetails } from './features/books/pages/BookDetails';
import { ReadBook } from './features/reader/pages/ReadBook';
import { History } from './features/history/pages/History';
import { Saved } from './features/saved/pages/Saved';
import { Categories } from './features/categories/pages/Categories';

// Admin imports
import { AdminLayout } from './features/admin/components/AdminLayout';
import { Dashboard } from './features/admin/pages/Dashboard';
import { UserManagement } from './features/admin/pages/UserManagement';
import { BookManagement } from './features/admin/pages/BookManagement';
import { AuthorManagement } from './features/admin/pages/AuthorManagement';

function App() {
  return (
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

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
        <Route path="/admin/books" element={<AdminLayout><BookManagement /></AdminLayout>} />
        <Route path="/admin/authors" element={<AdminLayout><AuthorManagement /></AdminLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
