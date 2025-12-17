import { BookGrid } from '@/features/books/components/BookGrid';
import { mockBooks } from '@/features/books/data/mockBooks';

export const Categories = () => {
  // Get unique genres
  const genres = [...new Set(mockBooks.map(book => book.genre))];

  return (
    <div className="px-8 py-6 space-y-12">
      <h1 className="text-lg font-bold uppercase tracking-wide text-gray-900">Categories</h1>
      
      {genres.map(genre => {
        const genreBooks = mockBooks.filter(book => book.genre === genre);
        return (
          <BookGrid 
            key={genre}
            books={genreBooks} 
            title={genre}
          />
        );
      })}
    </div>
  );
};

