import { useState, useEffect, useRef, useCallback } from 'react';
import { MosaicCard } from './MosaicCard';
import { useDoubleTap } from './useDoubleTap';
import type { Mosaic } from '../../types/mosaic';

interface MosaicFeedProps {
  mosaics: Mosaic[];
  initialIndex?: number;
  onMosaicChange?: (mosaic: Mosaic, index: number) => void;
  onLike?: (mosaic: Mosaic) => void;
  onDoubleTap?: (mosaic: Mosaic, x?: number, y?: number) => void;
  onComment?: (mosaic: Mosaic) => void;
  onShare?: (mosaic: Mosaic) => void;
  onAuthorClick?: (mosaic: Mosaic) => void;
}

export function MosaicFeed({
  mosaics,
  initialIndex = 0,
  onMosaicChange,
  onLike,
  onDoubleTap,
  onComment,
  onShare,
  onAuthorClick,
}: MosaicFeedProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  // Handle scroll snap end
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isScrollingRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);

    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < mosaics.length) {
      setActiveIndex(newIndex);
      onMosaicChange?.(mosaics[newIndex], newIndex);
    }
  }, [activeIndex, mosaics, onMosaicChange]);

  // Debounced scroll handler
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const onScroll = () => {
      isScrollingRef.current = true;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrollingRef.current = false;
        handleScroll();
      }, 100);
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', onScroll);
      clearTimeout(scrollTimeout);
    };
  }, [handleScroll]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const itemHeight = container.clientHeight;

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        const nextIndex = Math.min(activeIndex + 1, mosaics.length - 1);
        container.scrollTo({ top: nextIndex * itemHeight, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        const prevIndex = Math.max(activeIndex - 1, 0);
        container.scrollTo({ top: prevIndex * itemHeight, behavior: 'smooth' });
      } else if (e.key === 'l') {
        // Like shortcut
        onLike?.(mosaics[activeIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, mosaics, onLike]);

  // Scroll to initial index on mount
  useEffect(() => {
    if (containerRef.current && initialIndex > 0) {
      const itemHeight = containerRef.current.clientHeight;
      containerRef.current.scrollTo({ top: initialIndex * itemHeight, behavior: 'instant' });
    }
  }, [initialIndex]);

  if (mosaics.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p className="text-lg opacity-50">No mosaics to display</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
      style={{ scrollSnapType: 'y mandatory' }}
    >
      {mosaics.map((mosaic, index) => (
        <MosaicItemWrapper
          key={mosaic.id}
          mosaic={mosaic}
          isActive={index === activeIndex}
          onLike={() => onLike?.(mosaic)}
          onDoubleTap={(x, y) => onDoubleTap?.(mosaic, x, y)}
          onComment={() => onComment?.(mosaic)}
          onShare={() => onShare?.(mosaic)}
          onAuthorClick={() => onAuthorClick?.(mosaic)}
        />
      ))}

      {/* Progress indicator */}
      <div className="fixed top-1/2 right-2 -translate-y-1/2 flex flex-col gap-1 z-30">
        {mosaics.map((_, index) => (
          <div
            key={index}
            className={`w-1 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'h-6 bg-white'
                : 'h-1.5 bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Wrapper component for double-tap handling
function MosaicItemWrapper({
  mosaic,
  isActive,
  onLike,
  onDoubleTap,
  onComment,
  onShare,
  onAuthorClick,
}: {
  mosaic: Mosaic;
  isActive: boolean;
  onLike: () => void;
  onDoubleTap: (x?: number, y?: number) => void;
  onComment: () => void;
  onShare: () => void;
  onAuthorClick: () => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleDoubleTap = useDoubleTap({
    onDoubleTap: () => {
      // Get center of element for heart animation
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        const x = 50; // center
        const y = ((rect.height / 2) / window.innerHeight) * 100;
        onDoubleTap(x, y);
      } else {
        onDoubleTap();
      }
    },
  });

  return (
    <div
      ref={wrapperRef}
      className="h-screen w-full snap-start snap-always"
      style={{ scrollSnapAlign: 'start' }}
      onClick={handleDoubleTap}
    >
      <MosaicCard
        mosaic={mosaic}
        isActive={isActive}
        onLike={onLike}
        onComment={onComment}
        onShare={onShare}
        onAuthorClick={onAuthorClick}
      />
    </div>
  );
}

export default MosaicFeed;
