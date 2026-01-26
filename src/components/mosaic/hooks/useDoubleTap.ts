import { useRef, useCallback, useState } from 'react';

interface UseDoubleTapOptions {
  onDoubleTap: () => void;
  onSingleTap?: () => void;
  delay?: number;
}

export function useDoubleTap({ onDoubleTap, onSingleTap, delay = 300 }: UseDoubleTapOptions) {
  const lastTap = useRef<number>(0);
  const tapTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleTap = useCallback(() => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTap.current;

    if (timeSinceLastTap < delay && timeSinceLastTap > 0) {
      // Double tap detected
      if (tapTimeout.current) {
        clearTimeout(tapTimeout.current);
        tapTimeout.current = null;
      }
      lastTap.current = 0;
      onDoubleTap();
    } else {
      // Potential first tap
      lastTap.current = now;
      
      if (onSingleTap) {
        tapTimeout.current = setTimeout(() => {
          onSingleTap();
          tapTimeout.current = null;
        }, delay);
      }
    }
  }, [onDoubleTap, onSingleTap, delay]);

  return handleTap;
}

// Hook to manage heart animation state
export function useHeartAnimation() {
  const [showHeart, setShowHeart] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const triggerHeart = useCallback((x = 50, y = 50) => {
    setPosition({ x, y });
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  }, []);

  return { showHeart, position, triggerHeart };
}
