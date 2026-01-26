import { useState, useEffect, useRef, useCallback } from 'react';
import { MosaicCard } from './MosaicCard';
import { useDoubleTap } from './useDoubleTap';
import type { Mosaic } from '../../types/mosaic';

type LayoutMode = 'mobile' | 'centered' | 'grid';

interface MosaicFeedProps {
  mosaics: Mosaic[];
  initialIndex?: number;
  onMosaicChange?: (mosaic: Mosaic, index: number) => void;
  onLike?: (mosaic: Mosaic) => void;
  onDoubleTap?: (mosaic: Mosaic, x?: number, y?: number) => void;
  onComment?: (mosaic: Mosaic) => void;
  onShare?: (mosaic: Mosaic) => void;
  onAuthorClick?: (mosaic: Mosaic) => void;
  onMute?: () => void;
}

// Hook for detecting desktop vs mobile
function useResponsiveLayout(): { isDesktop: boolean; layoutMode: LayoutMode; setLayoutMode: (mode: LayoutMode) => void } {
  const [isDesktop, setIsDesktop] = useState(false);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('mobile');

  useEffect(() => {
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      // Auto-switch to centered on desktop if currently mobile
      if (desktop && layoutMode === 'mobile') {
        setLayoutMode('centered');
      } else if (!desktop) {
        setLayoutMode('mobile');
      }
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, [layoutMode]);

  return { isDesktop, layoutMode, setLayoutMode };
}

// Hook for reduced motion preference
function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(() => {
    // Initialize with current value on first render
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
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
  onMute,
}: MosaicFeedProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  
  const { isDesktop, layoutMode, setLayoutMode } = useResponsiveLayout();
  const reducedMotion = useReducedMotion();

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

  // Keyboard navigation with expanded shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (!containerRef.current) return;

      const container = containerRef.current;
      const itemHeight = container.clientHeight;
      const scrollBehavior = reducedMotion ? 'instant' : 'smooth';

      switch (e.key) {
        case 'ArrowDown':
        case 'j': {
          e.preventDefault();
          const nextIndex = Math.min(activeIndex + 1, mosaics.length - 1);
          if (layoutMode === 'grid') {
            setActiveIndex(nextIndex);
            onMosaicChange?.(mosaics[nextIndex], nextIndex);
          } else {
            container.scrollTo({ top: nextIndex * itemHeight, behavior: scrollBehavior });
          }
          break;
        }
        case 'ArrowUp':
        case 'k': {
          e.preventDefault();
          const prevIndex = Math.max(activeIndex - 1, 0);
          if (layoutMode === 'grid') {
            setActiveIndex(prevIndex);
            onMosaicChange?.(mosaics[prevIndex], prevIndex);
          } else {
            container.scrollTo({ top: prevIndex * itemHeight, behavior: scrollBehavior });
          }
          break;
        }
        case 'l':
          // Like shortcut
          onLike?.(mosaics[activeIndex]);
          break;
        case 'c':
          // Comment shortcut
          onComment?.(mosaics[activeIndex]);
          break;
        case 'm':
          // Mute/unmute shortcut
          onMute?.();
          break;
        case 's':
          // Share shortcut
          onShare?.(mosaics[activeIndex]);
          break;
        case '?':
          // Toggle shortcuts help
          setShowShortcutsHelp(prev => !prev);
          break;
        case 'Escape':
          // Close shortcuts help
          setShowShortcutsHelp(false);
          break;
        case 'g':
          // Toggle grid layout (desktop only)
          if (isDesktop) {
            setLayoutMode(layoutMode === 'grid' ? 'centered' : 'grid');
          }
          break;
        case ' ':
          // Space to like (like double-tap)
          e.preventDefault();
          if (!mosaics[activeIndex].isLiked) {
            onDoubleTap?.(mosaics[activeIndex], 50, 50);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, mosaics, onLike, onComment, onShare, onMute, onDoubleTap, reducedMotion, isDesktop, layoutMode, setLayoutMode, onMosaicChange]);

  // Scroll to initial index on mount
  useEffect(() => {
    if (containerRef.current && initialIndex > 0) {
      const itemHeight = containerRef.current.clientHeight;
      containerRef.current.scrollTo({ top: initialIndex * itemHeight, behavior: 'instant' });
    }
  }, [initialIndex]);

  if (mosaics.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white" role="status">
        <p className="text-lg opacity-50">No mosaics to display</p>
      </div>
    );
  }

  // Grid layout for desktop
  if (layoutMode === 'grid') {
    return (
      <div className="min-h-screen bg-gray-900 p-4 pt-20">
        {/* Layout toggle (desktop only) */}
        {isDesktop && (
          <div className="fixed top-16 right-4 z-40 flex gap-2">
            <button
              onClick={() => setLayoutMode('centered')}
              className="p-2 rounded-lg transition-colors bg-white/10 text-white hover:bg-white/20"
              aria-label="Centered layout"
              title="Centered layout (G)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="3" width="12" height="18" rx="2" />
              </svg>
            </button>
            <button
              onClick={() => setLayoutMode('grid')}
              className="p-2 rounded-lg transition-colors bg-white text-gray-900"
              aria-label="Grid layout"
              title="Grid layout (G)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
          </div>
        )}

        {/* Keyboard shortcuts help */}
        {showShortcutsHelp && <ShortcutsHelp onClose={() => setShowShortcutsHelp(false)} />}

        <div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto"
          role="feed"
          aria-label="Mosaics grid"
        >
          {mosaics.map((mosaic, index) => (
            <button
              key={mosaic.id}
              onClick={() => {
                setActiveIndex(index);
                setLayoutMode('centered');
              }}
              className={`aspect-[9/16] rounded-xl overflow-hidden relative group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 ${
                index === activeIndex ? 'ring-2 ring-white' : ''
              }`}
              aria-label={`Mosaic by ${mosaic.author.displayName}, ${mosaic.likeCount} likes`}
            >
              <MosaicCard mosaic={mosaic} isActive={false} compact />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Centered or mobile layout (scroll-snap feed)
  return (
    <div className={layoutMode === 'centered' ? 'bg-gray-900' : ''}>
      {/* Layout toggle (desktop only) */}
      {isDesktop && (
        <div className="fixed top-16 right-4 z-40 flex gap-2">
          <button
            onClick={() => setLayoutMode('centered')}
            className={`p-2 rounded-lg transition-colors ${
              layoutMode === 'centered' ? 'bg-white text-gray-900' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            aria-label="Centered layout"
            title="Centered layout (G)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="6" y="3" width="12" height="18" rx="2" />
            </svg>
          </button>
          <button
            onClick={() => setLayoutMode('grid')}
            className="p-2 rounded-lg transition-colors bg-white/10 text-white hover:bg-white/20"
            aria-label="Grid layout"
            title="Grid layout (G)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>
      )}

      {/* Keyboard shortcuts help */}
      {showShortcutsHelp && <ShortcutsHelp onClose={() => setShowShortcutsHelp(false)} />}

      <div
        ref={containerRef}
        className={`h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide ${
          layoutMode === 'centered' ? 'max-w-md mx-auto' : 'w-full'
        }`}
        style={{ scrollSnapType: 'y mandatory' }}
        role="feed"
        aria-label="Mosaics feed"
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
            reducedMotion={reducedMotion}
          />
        ))}

        {/* Progress indicator */}
        <div 
          className="fixed top-1/2 right-2 -translate-y-1/2 flex flex-col gap-1 z-30"
          role="progressbar"
          aria-valuenow={activeIndex + 1}
          aria-valuemin={1}
          aria-valuemax={mosaics.length}
          aria-label={`Mosaic ${activeIndex + 1} of ${mosaics.length}`}
        >
          {mosaics.map((_, index) => (
            <div
              key={index}
              className={`w-1 rounded-full transition-all ${reducedMotion ? '' : 'duration-300'} ${
                index === activeIndex
                  ? 'h-6 bg-white'
                  : 'h-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Keyboard shortcuts help modal
function ShortcutsHelp({ onClose }: { onClose: () => void }) {
  const shortcuts = [
    { key: '↑/k', action: 'Previous mosaic' },
    { key: '↓/j', action: 'Next mosaic' },
    { key: 'L', action: 'Like' },
    { key: 'Space', action: 'Like with heart animation' },
    { key: 'C', action: 'Open comments' },
    { key: 'S', action: 'Share' },
    { key: 'M', action: 'Mute/unmute video' },
    { key: 'G', action: 'Toggle grid view (desktop)' },
    { key: '?', action: 'Show/hide shortcuts' },
    { key: 'Esc', action: 'Close dialogs' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div 
        className="bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="space-y-2">
          {shortcuts.map(({ key, action }) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-white/70">{action}</span>
              <kbd className="px-2 py-1 bg-gray-700 rounded text-white font-mono text-xs">
                {key}
              </kbd>
            </div>
          ))}
        </div>
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
  reducedMotion,
}: {
  mosaic: Mosaic;
  isActive: boolean;
  onLike: () => void;
  onDoubleTap: (x?: number, y?: number) => void;
  onComment: () => void;
  onShare: () => void;
  onAuthorClick: () => void;
  reducedMotion: boolean;
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
      role="article"
      aria-label={`Mosaic by ${mosaic.author.displayName}`}
      tabIndex={isActive ? 0 : -1}
    >
      <MosaicCard
        mosaic={mosaic}
        isActive={isActive}
        onLike={onLike}
        onComment={onComment}
        onShare={onShare}
        onAuthorClick={onAuthorClick}
        reducedMotion={reducedMotion}
      />
    </div>
  );
}

export default MosaicFeed;
