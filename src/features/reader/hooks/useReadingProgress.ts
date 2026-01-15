interface ReadingProgress {
  chapterId: number;
  normalizedProgress: number; // 0..1
  timestamp: number;
}

export const useReadingProgress = (bookId: string) => {
  const saveProgress = (chapterId: number, progress: number) => {
    const state: ReadingProgress = {
      chapterId,
      normalizedProgress: Math.min(1, Math.max(0, progress)),
      timestamp: Date.now(),
    };
    
    const key = `reading_progress_${bookId}`;
    localStorage.setItem(key, JSON.stringify(state));
  };
  
  const loadProgress = (): ReadingProgress | null => {
    const key = `reading_progress_${bookId}`;
    const saved = localStorage.getItem(key);
    
    if (!saved) return null;
    
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  };
  
  return { saveProgress, loadProgress };
};
