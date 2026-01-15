import { useState, useEffect } from 'react';

export interface Bookmark {
  id: string;
  bookId: string;
  chapterId: number;
  chapterNumber: number;
  chapterTitle: string;
  pageNumber: number;
  content: string; // preview text
  createdAt: string;
}

const STORAGE_KEY = 'bookverse_bookmarks';

export const useBookmarks = (bookId: string) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    loadBookmarks();
  }, [bookId]);

  const loadBookmarks = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allBookmarks: Bookmark[] = JSON.parse(stored);
        const bookBookmarks = allBookmarks.filter((b) => b.bookId === bookId);
        setBookmarks(bookBookmarks);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const saveBookmarks = (newBookmarks: Bookmark[]) => {
    try {
      // Load all bookmarks
      const stored = localStorage.getItem(STORAGE_KEY);
      const allBookmarks: Bookmark[] = stored ? JSON.parse(stored) : [];
      
      // Remove old bookmarks for this book
      const otherBookmarks = allBookmarks.filter((b) => b.bookId !== bookId);
      
      // Add new bookmarks
      const updatedBookmarks = [...otherBookmarks, ...newBookmarks];
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookmarks));
      setBookmarks(newBookmarks);
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  };

  const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: `${bookmark.bookId}_${bookmark.chapterId}_${bookmark.pageNumber}_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    const updatedBookmarks = [...bookmarks, newBookmark];
    saveBookmarks(updatedBookmarks);
  };

  const removeBookmark = (bookmarkId: string) => {
    const updatedBookmarks = bookmarks.filter((b) => b.id !== bookmarkId);
    saveBookmarks(updatedBookmarks);
  };

  const isBookmarked = (chapterId: number, pageNumber: number): boolean => {
    return bookmarks.some(
      (b) => b.chapterId === chapterId && b.pageNumber === pageNumber
    );
  };

  const getBookmark = (chapterId: number, pageNumber: number): Bookmark | undefined => {
    return bookmarks.find(
      (b) => b.chapterId === chapterId && b.pageNumber === pageNumber
    );
  };

  const toggleBookmark = (
    chapterId: number,
    chapterNumber: number,
    chapterTitle: string,
    pageNumber: number,
    content: string
  ) => {
    const existing = getBookmark(chapterId, pageNumber);
    if (existing) {
      removeBookmark(existing.id);
    } else {
      addBookmark({
        bookId,
        chapterId,
        chapterNumber,
        chapterTitle,
        pageNumber,
        content,
      });
    }
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    getBookmark,
    toggleBookmark,
  };
};
