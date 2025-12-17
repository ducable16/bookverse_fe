import { useParams } from 'react-router-dom';
import { Reader } from '../components/Reader';
import { mockBooks } from '@/features/books/data/mockBooks';

export const ReadBook = () => {
  const { id } = useParams<{ id: string }>();
  const book = mockBooks.find(b => b.id === id);

  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Book Not Found</h1>
          <p className="text-gray-600">The book you're trying to read doesn't exist.</p>
        </div>
      </div>
    );
  }

  return <Reader book={book} />;
};
