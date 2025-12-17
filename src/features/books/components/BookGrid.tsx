import { Book } from '@/features/shared/types';
import { BookCard } from './BookCard';
import { Link } from 'react-router-dom';

interface BookGridProps {
  books: Book[];
  title?: string;
  viewAllLink?: string;
}

export const BookGrid = ({ books, title, viewAllLink }: BookGridProps) => {
  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900">{title}</h2>
          {viewAllLink && (
            <Link 
              to={viewAllLink}
              className="text-sm text-gray-600 hover:text-coral-500 transition-colors underline"
            >
              (view all)
            </Link>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-5">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No books found</p>
        </div>
      )}
    </div>
  );
};
