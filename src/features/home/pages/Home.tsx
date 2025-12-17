import { BookGrid } from '@/features/books/components/BookGrid';
import { mockBooks } from '@/features/books/data/mockBooks';

export const Home = () => {
  const latestBooks = mockBooks.slice(0, 7);
  const recommendedBooks = mockBooks.slice(0, 7);

  return (
    <div className="px-8 py-6 space-y-12">
      {/* Latest Section */}
      <BookGrid 
        books={latestBooks} 
        title="Latest" 
        viewAllLink="/library"
      />

      {/* Recommended Section */}
      <BookGrid 
        books={recommendedBooks} 
        title="Recommended Books" 
        viewAllLink="/discover"
      />
    </div>
  );
};
