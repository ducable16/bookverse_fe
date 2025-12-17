# BookVerse - Front-End

A modern, beautiful book reading website built with React, TypeScript, and Tailwind CSS using a **Feature-Based Architecture**.

## Features

- 📚 Browse extensive book library
- 🔍 Search and filter books by genre, author, or title
- 📖 Built-in book reader with customizable settings
- ⭐ Book ratings and reviews
- 📱 Fully responsive design
- 🎨 Modern UI with smooth animations
- 🚀 Fast performance with Vite

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Architecture: Feature-Based Structure

This project follows a **feature-based architecture** where code is organized by business domain rather than technical type. This approach provides better:

- **Scalability** - Easy to add new features without affecting existing ones
- **Maintainability** - Related code is co-located, making it easier to understand and modify
- **Team Collaboration** - Different teams can work on different features independently
- **Code Reusability** - Shared components and utilities are clearly separated

### Project Structure

```
src/
├── features/              # Feature modules (organized by domain)
│   ├── books/            # Book browsing and details
│   │   ├── components/   # BookCard, BookGrid, BookHero
│   │   ├── pages/        # Library, BookDetails
│   │   └── data/         # Mock books data
│   │
│   ├── reader/           # Reading experience
│   │   ├── components/   # Reader component
│   │   └── pages/        # ReadBook page
│   │
│   ├── library/          # User's personal library
│   │   └── pages/        # MyBooks page
│   │
│   ├── discover/         # Discovery and recommendations
│   │   └── pages/        # Discover page
│   │
│   ├── home/             # Home/landing page
│   │   └── pages/        # Home page
│   │
│   └── shared/           # Shared across features
│       ├── components/   # Layout, UI components
│       │   ├── layout/   # Header, Footer, Container, Layout
│       │   └── ui/       # Button, etc.
│       ├── types/        # Shared TypeScript types
│       └── utils/        # Utility functions
│
├── App.tsx              # Main app with routing
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Features Overview

### 1. Books Feature (`features/books/`)
- Browse library with search and filters
- View detailed book information
- See related books and reviews
- **Pages**: Library, BookDetails
- **Components**: BookCard, BookGrid, BookHero

### 2. Reader Feature (`features/reader/`)
- Full-screen reading interface
- Adjustable font size
- Page navigation
- Reading progress tracking
- **Pages**: ReadBook
- **Components**: Reader

### 3. Library Feature (`features/library/`)
- Personal book collection management
- Currently Reading, Want to Read, Finished tabs
- Track reading progress
- **Pages**: MyBooks

### 4. Discover Feature (`features/discover/`)
- Curated book recommendations
- Browse by genre
- Personalized suggestions
- **Pages**: Discover

### 5. Home Feature (`features/home/`)
- Landing page
- Featured books
- Trending and top-rated sections
- **Pages**: Home

### 6. Shared Feature (`features/shared/`)
- Common layouts (Header, Footer, Container)
- Reusable UI components (Button, etc.)
- Shared TypeScript types
- Utility functions

## Import Conventions

With the feature-based structure, imports follow these patterns:

```typescript
// Importing from shared
import { Layout } from '@/features/shared/components/layout/Layout';
import { Book } from '@/features/shared/types';
import { cn } from '@/features/shared/utils/cn';

// Importing from another feature
import { BookGrid } from '@/features/books/components/BookGrid';
import { mockBooks } from '@/features/books/data/mockBooks';

// Importing within the same feature
import { BookCard } from '../components/BookCard';
```

## Pages

- **Home** (`/`) - Landing page with featured books and categories
- **Library** (`/library`) - Browse all books with search and filters
- **Discover** (`/discover`) - Curated book recommendations by genre
- **My Books** (`/my-books`) - Personal reading list
- **Book Details** (`/book/:id`) - Detailed view with reviews
- **Reader** (`/read/:id`) - Full-screen reading interface

## Customization

### Colors

Edit the color scheme in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Customize your primary colors
      }
    }
  }
}
```

### Fonts

Update fonts in `tailwind.config.js` and `src/index.css`.

## Adding New Features

To add a new feature to the project:

1. Create a new folder under `src/features/` (e.g., `features/auth/`)
2. Organize by domain concerns:
   ```
   features/auth/
   ├── components/    # Feature-specific components
   ├── pages/         # Feature pages
   ├── hooks/         # Feature-specific hooks (if needed)
   ├── types/         # Feature-specific types (if needed)
   └── utils/         # Feature-specific utilities (if needed)
   ```
3. Add routes in `App.tsx`
4. Import shared components from `features/shared/`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to be deployed to any static hosting service.

## Benefits of Feature-Based Architecture

1. **Better Code Organization** - Related code stays together
2. **Easier Navigation** - Find feature code in one place
3. **Reduced Coupling** - Features are loosely coupled
4. **Parallel Development** - Multiple developers can work on different features
5. **Easier Testing** - Test features in isolation
6. **Clear Boundaries** - Feature responsibilities are well-defined

## Future Enhancements

- User authentication feature
- Backend API integration
- User profile feature
- Social features (following, sharing)
- Advanced search feature
- Recommendation engine
- Dark mode (shared feature)
- Offline reading support
- Bookmarks and notes feature

## License

MIT License - feel free to use this project for your own purposes.
