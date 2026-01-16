# Search Feature Documentation

## Overview

The search feature provides comprehensive book search functionality using backend API endpoints. It supports multiple search types, filters, and pagination.

## Search Types

### 1. **All (Combined Search)** - Default
- Endpoint: `GET /api/search/books/all`
- Searches across title first, then content if no results
- Best for general searches

### 2. **Title Search**
- Endpoint: `GET /api/search/books/by-title`
- Searches specifically in book titles
- Fast and precise for known book names

### 3. **Author Search**
- Endpoint: `GET /api/search/books/by-author`
- Searches in author names
- Returns all books by matching authors

### 4. **Content Search**
- Endpoint: `GET /api/search/books/by-content`
- Full-text search in chapter content
- Useful for finding books by plot elements or quotes
- Returns matched chapter information

### 5. **Category Search**
- Endpoint: `GET /api/search/books/by-category/{categoryId}`
- Filters books by category
- Can be combined with keyword search

## Components

### SearchFilterBar
**Location:** `src/features/home/components/SearchFilterBar.tsx`

Main search input component with filters:
- Text search input
- Category dropdown
- Author dropdown
- Active filter chips
- Clear filters functionality

**Usage:**
```tsx
<SearchFilterBar 
  onSearch={(params) => navigate(`/search?q=${params.query}`)}
  defaultValues={{ query: 'harry potter', categoryId: '1' }}
/>
```

### SearchResults Page
**Location:** `src/features/search/pages/SearchResults.tsx`

Main search results page with:
- URL-based search parameters
- Search type selector (All/Title/Author/Content)
- Pagination
- Loading and error states
- Empty state

**URL Parameters:**
- `q` - Search query
- `category` - Category ID filter
- `author` - Author ID filter (UI only, not used in API)
- `type` - Search type (all/title/author/content)

### SearchResultCard
**Location:** `src/features/search/components/SearchResultCard.tsx`

Individual search result card showing:
- Book cover image
- Title
- Author
- Categories
- Total chapters
- Search snippet with highlighted matches
- Match type badge (Title/Author/Category/Content)
- Matched chapter information (for content searches)

### SearchResultGrid
**Location:** `src/features/search/components/SearchResultGrid.tsx`

Grid layout for search results using SearchResultCard components.

### EmptyState
**Location:** `src/features/search/components/EmptyState.tsx`

No results state with:
- Clear messaging
- Action buttons (Clear filters, Go home)
- Search suggestions

## Search Service

**Location:** `src/services/search.service.ts`

Provides methods for all search endpoints:
- `searchAll(params)` - Combined search
- `searchByTitle(params)` - Title search
- `searchByAuthor(params)` - Author search
- `searchByContent(params)` - Content search
- `searchByCategory(categoryId, params)` - Category search

**Example:**
```typescript
import { searchService } from '@/services';

const results = await searchService.searchAll({
  keyword: 'harry potter',
  categoryId: 1,
  sortBy: 'relevance',
  page: 0,
  size: 20
});
```

## Types

**Location:** `src/types/search.types.ts`

```typescript
interface SearchResult {
  bookId: number;
  title: string;
  slug: string;
  coverImage: string;
  authorName: string;
  categoryNames: string[];
  snippet: string;
  matchType: 'TITLE' | 'AUTHOR' | 'CATEGORY' | 'CONTENT';
  totalChapters: number;
  matchedChapterId: number | null;
  matchedChapterTitle: string | null;
}

interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  query: string;
}
```

## Features

### ✅ Implemented

1. **Multiple Search Types** - Users can switch between All/Title/Author/Content searches
2. **Filter Chips** - Visual representation of active filters with individual removal
3. **Highlighted Snippets** - Search matches are highlighted in results
4. **Pagination** - Navigate through multiple pages of results
5. **Match Type Badges** - Visual indicators showing where the match occurred
6. **Chapter Context** - For content searches, shows which chapter contained the match
7. **URL-based State** - Shareable search URLs, browser back/forward support
8. **Responsive Design** - Works on mobile and desktop
9. **Loading States** - Proper feedback during searches
10. **Empty States** - Helpful guidance when no results found

### 🎯 Search Flow

1. User enters search query on Home page
2. Clicks Search or presses Enter
3. Navigates to `/search?q=query&category=1`
4. SearchResults page calls appropriate API endpoint
5. Results displayed with SearchResultGrid
6. User can refine search using filters or search type selector
7. User can paginate through results

### 📊 Search Result Display

Each result shows:
- **Badge** indicating match type (Title/Author/Category/Content)
- **Cover image** with fallback
- **Title** with hover effect
- **Author name** with icon
- **Categories** as comma-separated list
- **Chapter count**
- **Snippet** with **highlighted** matches
- **Chapter reference** (for content matches)

### 🎨 Styling

Highlighted search terms use:
```css
.search-snippet strong,
.search-snippet b {
  @apply font-bold text-accent-teal bg-teal-50 px-1 rounded;
}
```

## Future Enhancements

### Suggested Features

1. **Search Autocomplete** - Suggest books/authors as user types
2. **Recent Searches** - Show user's recent search history
3. **Popular Searches** - Display trending search terms
4. **Advanced Filters**
   - Sort by: Latest, Oldest, A-Z, Views
   - Filter by year
   - Filter by status (completed, ongoing)
   - Filter by rating
5. **Search Analytics** - Track popular searches for insights
6. **Save Searches** - Allow users to bookmark search queries
7. **Search Within Results** - Narrow down existing results
8. **Infinite Scroll** - Alternative to pagination
9. **Voice Search** - Speech-to-text search input
10. **Smart Suggestions** - "Did you mean..." for typos

## Testing

### Manual Test Cases

- [ ] Search by book title (exact match)
- [ ] Search by book title (partial match)
- [ ] Search by author name
- [ ] Search by content/quote
- [ ] Filter by category only
- [ ] Combine text search + category filter
- [ ] Switch between search types
- [ ] Clear individual filter chips
- [ ] Clear all filters
- [ ] Paginate through results
- [ ] Empty search shows empty state
- [ ] No results shows empty state
- [ ] Highlighted text appears in snippets
- [ ] URL parameters update correctly
- [ ] Browser back/forward navigation works
- [ ] Responsive on mobile
- [ ] Loading states display properly
- [ ] Error states display properly

## Performance Considerations

1. **Pagination** - Results are paginated (20 per page) to avoid loading too much data
2. **Debouncing** - Can be added to search input to reduce API calls
3. **Caching** - Consider caching recent search results
4. **Lazy Loading** - Images load lazily for better performance
5. **API Optimization** - Backend returns only necessary fields

## Security

1. **Input Sanitization** - Search queries are URL-encoded
2. **XSS Prevention** - Snippets use `dangerouslySetInnerHTML` carefully (backend should sanitize)
3. **Rate Limiting** - Backend should implement rate limiting for search endpoints

## Accessibility

1. **Keyboard Navigation** - Enter key triggers search
2. **ARIA Labels** - Add to form elements (future improvement)
3. **Focus Management** - Proper focus states on interactive elements
4. **Screen Reader Support** - Semantic HTML structure
