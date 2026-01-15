import { useState, useEffect } from 'react';

export type HighlightColor = 'yellow' | 'green' | 'blue' | 'pink';

export interface Highlight {
  id: string;
  bookId: string;
  chapterId: number;
  pageNumber: number;
  text: string;
  color: HighlightColor;
  startOffset: number;
  endOffset: number;
  createdAt: string;
}

const STORAGE_KEY = 'bookverse_highlights';

export const useHighlights = (bookId: string) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  // Load highlights from localStorage on mount
  useEffect(() => {
    loadHighlights();
  }, [bookId]);

  const loadHighlights = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allHighlights: Highlight[] = JSON.parse(stored);
        const bookHighlights = allHighlights.filter((h) => h.bookId === bookId);
        setHighlights(bookHighlights);
      }
    } catch (error) {
      console.error('Error loading highlights:', error);
    }
  };

  const saveHighlights = (newHighlights: Highlight[]) => {
    try {
      // Load all highlights
      const stored = localStorage.getItem(STORAGE_KEY);
      const allHighlights: Highlight[] = stored ? JSON.parse(stored) : [];
      
      // Remove old highlights for this book
      const otherHighlights = allHighlights.filter((h) => h.bookId !== bookId);
      
      // Add new highlights
      const updatedHighlights = [...otherHighlights, ...newHighlights];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHighlights));
      setHighlights(newHighlights);
    } catch (error) {
      console.error('Error saving highlights:', error);
    }
  };

  const addHighlight = (highlight: Omit<Highlight, 'id' | 'createdAt'>) => {
    const newHighlight: Highlight = {
      ...highlight,
      id: `${highlight.bookId}_${highlight.chapterId}_${highlight.startOffset}_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    const updatedHighlights = [...highlights, newHighlight];
    saveHighlights(updatedHighlights);
    return newHighlight;
  };

  const removeHighlight = (highlightId: string) => {
    const updatedHighlights = highlights.filter((h) => h.id !== highlightId);
    saveHighlights(updatedHighlights);
  };

  const getHighlightsForPage = (chapterId: number, pageNumber: number): Highlight[] => {
    return highlights.filter(
      (h) => h.chapterId === chapterId && h.pageNumber === pageNumber
    );
  };

  const updateHighlightColor = (highlightId: string, color: HighlightColor) => {
    const updatedHighlights = highlights.map((h) =>
      h.id === highlightId ? { ...h, color } : h
    );
    saveHighlights(updatedHighlights);
  };

  return {
    highlights,
    addHighlight,
    removeHighlight,
    getHighlightsForPage,
    updateHighlightColor,
  };
};

// Utility to get highlight color class
export const getHighlightColorClass = (color: HighlightColor): string => {
  const colorMap = {
    yellow: 'bg-yellow-200/70 dark:bg-yellow-500/30',
    green: 'bg-green-200/70 dark:bg-green-500/30',
    blue: 'bg-blue-200/70 dark:bg-blue-500/30',
    pink: 'bg-pink-200/70 dark:bg-pink-500/30',
  };
  return colorMap[color];
};
