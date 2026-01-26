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

// Heart animation component
interface HeartAnimationProps {
  show: boolean;
  x?: number;
  y?: number;
}

export function HeartAnimation({ show, x = 50, y = 50 }: HeartAnimationProps) {
  return (
    <div
      className={`absolute pointer-events-none z-30 transition-all duration-700 ${
        show ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) ${show ? 'scale(1)' : 'scale(0.5)'}`,
      }}
    >
      <div className={`text-7xl ${show ? 'animate-bounce' : ''}`}>
        ❤️
      </div>
    </div>
  );
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

export default useDoubleTap;
