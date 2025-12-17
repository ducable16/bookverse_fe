import { BookGrid } from '@/features/books/components/BookGrid';
import { mockBooks } from '@/features/books/data/mockBooks';

export const Saved = () => {
  const savedBooks = mockBooks.filter(book => book.isSaved);

  return (
    <div className="px-8 py-6">
      <h1 className="text-lg font-bold uppercase tracking-wide text-gray-900 mb-6">Saved Books</h1>
      
      {savedBooks.length > 0 ? (
        <BookGrid books={savedBooks} />
      ) : (
        <div className="text-center py-12 text-gray-500">
          No saved books yet
        </div>
      )}
    </div>
  );
};

