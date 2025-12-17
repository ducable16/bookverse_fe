import { Book } from '@/features/shared/types';
import { Link } from 'react-router-dom';

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  return (
    <Link 
      to={`/book/${book.id}`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 bg-white">
        <div className="aspect-[2/3] overflow-hidden">
          <img 
            src={book.coverUrl} 
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
      
      <div className="mt-3 px-1">
        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-coral-500 transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{book.author}</p>
      </div>
    </Link>
  );
};
