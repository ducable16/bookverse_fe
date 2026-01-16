import type { SearchResult } from '@/types/search.types';
import { SearchResultCard } from './SearchResultCard';

interface SearchResultGridProps {
  results: SearchResult[];
}

export const SearchResultGrid = ({ results }: SearchResultGridProps) => {
  return (
    <div className="space-y-4">
      {results.map((result) => (
        <SearchResultCard key={result.bookId} result={result} />
      ))}
    </div>
  );
};
