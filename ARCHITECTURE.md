# BookVerse Architecture

## Feature-Based Architecture Overview

This document describes the feature-based architecture used in the BookVerse application.

## Architecture Principles

### 1. Feature-First Organization
Code is organized by **business domain** (features) rather than technical type (components, pages, etc.).

### 2. Colocation
Related code lives together within feature folders, making it easier to understand and modify.

### 3. Clear Boundaries
Each feature has well-defined responsibilities and minimal coupling with other features.

### 4. Shared Resources
Common functionality is centralized in the `shared` feature to avoid duplication.

## Feature Map

```
┌─────────────────────────────────────────────────────────────┐
│                         Application                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Home     │  │   Books    │  │  Discover  │            │
│  │  Feature   │  │  Feature   │  │  Feature   │            │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘            │
│         │                │                │                   │
│         └────────────────┼────────────────┘                   │
│                          │                                    │
│  ┌────────────┐  ┌──────▼─────┐  ┌────────────┐            │
│  │  Library   │  │   Shared   │  │   Reader   │            │
│  │  Feature   │  │  Feature   │  │  Feature   │            │
│  └──────┬─────┘  └────────────┘  └──────┬─────┘            │
│         │                                 │                   │
│         └─────────────────────────────────┘                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Feature Details

### Books Feature
**Domain**: Book browsing, searching, and details

**Responsibilities**:
- Display book catalog
- Search and filter functionality
- Show book details, reviews, and recommendations
- Manage book data

**Structure**:
```
features/books/
├── components/
│   ├── BookCard.tsx       # Display single book card
│   ├── BookGrid.tsx       # Grid layout for books
│   └── BookHero.tsx       # Hero section for book details
├── pages/
│   ├── Library.tsx        # Browse all books
│   └── BookDetails.tsx    # Single book view
└── data/
    └── mockBooks.ts       # Mock book data
```

### Reader Feature
**Domain**: Reading experience

**Responsibilities**:
- Provide reading interface
- Page navigation
- Reading customization (font size, etc.)
- Track reading progress

**Structure**:
```
features/reader/
├── components/
│   └── Reader.tsx         # Main reader component
└── pages/
    └── ReadBook.tsx       # Reader page
```

### Library Feature
**Domain**: User's personal book collection

**Responsibilities**:
- Manage personal reading lists
- Track reading progress
- Organize books by status (reading, want to read, finished)

**Structure**:
```
features/library/
└── pages/
    └── MyBooks.tsx        # Personal library page
```

### Discover Feature
**Domain**: Book discovery and recommendations

**Responsibilities**:
- Curate book recommendations
- Display books by genre
- Personalized suggestions

**Structure**:
```
features/discover/
└── pages/
    └── Discover.tsx       # Discovery page
```

### Home Feature
**Domain**: Landing page and marketing

**Responsibilities**:
- Welcome users
- Showcase featured books
- Display trending and top-rated books
- Call-to-action sections

**Structure**:
```
features/home/
└── pages/
    └── Home.tsx           # Landing page
```

### Shared Feature
**Domain**: Common functionality across all features

**Responsibilities**:
- Provide layout components (Header, Footer, etc.)
- Reusable UI components
- Shared types and interfaces
- Common utilities

**Structure**:
```
features/shared/
├── components/
│   ├── layout/
│   │   ├── Header.tsx     # App header with navigation
│   │   ├── Footer.tsx     # App footer
│   │   ├── Container.tsx  # Content container
│   │   └── Layout.tsx     # Main layout wrapper
│   └── ui/
│       └── Button.tsx     # Reusable button component
├── types/
│   └── index.ts           # Shared TypeScript types
└── utils/
    └── cn.ts              # Utility functions
```

## Data Flow

```
┌──────────────┐
│     User     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│    Pages     │  (Feature-specific pages)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Components  │  (Feature-specific components)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Mock Data   │  (In real app: API calls)
└──────────────┘
```

## Cross-Feature Communication

Features can communicate through:

1. **Shared Types** - Common interfaces from `features/shared/types`
2. **Shared Data** - Mock data can be imported across features
3. **React Router** - Navigation between features via routes
4. **Shared Components** - UI components from `features/shared/components`

Example:
```typescript
// Library feature using Books feature data
import { mockBooks } from '@/features/books/data/mockBooks';
import { BookGrid } from '@/features/books/components/BookGrid';
import { Book } from '@/features/shared/types';
```

## Routing Structure

```
App.tsx
├── / (Home)              → features/home/pages/Home.tsx
├── /library              → features/books/pages/Library.tsx
├── /book/:id             → features/books/pages/BookDetails.tsx
├── /discover             → features/discover/pages/Discover.tsx
├── /my-books             → features/library/pages/MyBooks.tsx
└── /read/:id             → features/reader/pages/ReadBook.tsx
```

## Import Path Aliases

The project uses TypeScript path aliases for clean imports:

```typescript
// Instead of: import { Book } from '../../../shared/types'
import { Book } from '@/features/shared/types';

// Instead of: import { cn } from '../../../shared/utils/cn'
import { cn } from '@/features/shared/utils/cn';
```

Configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Scaling Guidelines

### Adding New Features

1. Create feature folder: `src/features/[feature-name]/`
2. Add subfolders as needed:
   - `components/` - Feature-specific components
   - `pages/` - Feature pages
   - `hooks/` - Custom hooks
   - `types/` - Feature-specific types
   - `utils/` - Feature utilities
   - `services/` - API calls (when backend is added)

3. Update `App.tsx` with new routes
4. Import shared resources from `features/shared/`

### Moving to Shared

Move code to `features/shared/` when:
- Used by 3+ features
- Represents core functionality
- Should be standardized across app

### Feature Independence

Keep features independent by:
- Minimizing direct imports between features
- Using shared types for communication
- Preferring composition over inheritance
- Keeping feature-specific logic internal

## Benefits

✅ **Easier to Navigate** - Find all code related to a feature in one place  
✅ **Faster Development** - Clear structure speeds up feature development  
✅ **Better Testing** - Test features in isolation  
✅ **Reduced Conflicts** - Teams work on separate features  
✅ **Easier Onboarding** - New developers understand domain quickly  
✅ **Maintainable** - Changes to one feature rarely affect others  
✅ **Scalable** - Easy to add new features without restructuring  

## Comparison: Traditional vs Feature-Based

### Traditional (Type-Based)
```
src/
├── components/     # ALL components mixed together
├── pages/          # ALL pages mixed together
├── types/          # ALL types mixed together
└── utils/          # ALL utilities mixed together
```
❌ Hard to find related code  
❌ Files far apart  
❌ Unclear feature boundaries  

### Feature-Based
```
src/
└── features/
    ├── books/      # Everything about books
    ├── reader/     # Everything about reading
    └── shared/     # Common code
```
✅ Related code together  
✅ Clear feature scope  
✅ Easy to understand  

## Conclusion

This feature-based architecture provides a solid foundation for building scalable, maintainable applications. As the project grows, new features can be added independently without affecting existing code, and teams can work in parallel with minimal conflicts.

