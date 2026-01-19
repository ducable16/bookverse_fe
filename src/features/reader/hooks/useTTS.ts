import { useState, useRef, useCallback } from 'react';
import { ttsService } from '@/services';
import toast from 'react-hot-toast';

export const useTTS = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const speak = useCallback(async (text: string) => {
    try {
      // Clean up previous audio
      cleanup();

      setIsLoading(true);
      
      // Get audio blob from API
      const audioBlob = await ttsService.speak(text);
      
      // Create audio URL and element
      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      // Set up event listeners
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => {
        setIsPlaying(false);
        cleanup();
      };
      audio.onerror = () => {
        toast.error('Lỗi phát âm thanh');
        cleanup();
      };

      // Play audio
      await audio.play();
      setIsLoading(false);
    } catch (error) {
      console.error('TTS Error:', error);
      toast.error('Không thể chuyển đổi văn bản thành giọng nói');
      setIsLoading(false);
      cleanup();
    }
  }, [cleanup]);

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, []);

  const resume = useCallback(async () => {
    if (audioRef.current && audioRef.current.paused) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error('Resume error:', error);
      }
    }
  }, []);

  const stop = useCallback(() => {
    cleanup();
  }, [cleanup]);

  return {
    speak,
    pause,
    resume,
    stop,
    isPlaying,
    isLoading,
  };
};

