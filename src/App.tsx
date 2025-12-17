import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './features/shared/components/layout/Layout';
import { Home } from './features/home/pages/Home';
import { BookDetails } from './features/books/pages/BookDetails';
import { ReadBook } from './features/reader/pages/ReadBook';
import { History } from './features/history/pages/History';
import { Saved } from './features/saved/pages/Saved';
import { Categories } from './features/categories/pages/Categories';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes with Layout */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/book/:id" element={<Layout><BookDetails /></Layout>} />
        <Route path="/history" element={<Layout><History /></Layout>} />
        <Route path="/saved" element={<Layout><Saved /></Layout>} />
        <Route path="/categories" element={<Layout><Categories /></Layout>} />
        <Route path="/library" element={<Layout><Home /></Layout>} />
        <Route path="/discover" element={<Layout><Home /></Layout>} />
        
        {/* Reader without Header (minimal UI) */}
        <Route path="/read/:id" element={<ReadBook />} />
      </Routes>
    </Router>
  );
}

export default App;
