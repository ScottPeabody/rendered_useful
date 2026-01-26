import { type ReactNode, useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import type {
  Mosaic,
  MosaicBackground,
  PostContent,
  ImageContent,
  QuoteContent,
  CodeContent,
  GalleryContent,
  VideoContent,
  PollContent,
  ArticlePreviewContent,
  ProjectSpotlightContent,
  NotebookCellContent,
  CollageContent,
  DiagramContent,
  ThreadContent,
} from '../../types/mosaic';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MosaicCardProps {
  mosaic: Mosaic;
  isActive?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onAuthorClick?: () => void;
  compact?: boolean;
  reducedMotion?: boolean;
}

// Background renderer
function MosaicBackground({ background, children }: { background?: MosaicBackground; children: ReactNode }) {
  const getBackgroundStyle = (): React.CSSProperties => {
    if (!background) {
      return { backgroundColor: '#1a1a2e' };
    }

    switch (background.type) {
      case 'solid':
        return { backgroundColor: background.color };
      case 'gradient': {
        const dir = background.direction || 'to-b';
        const cssDir = dir.replace('to-', 'to ').replace('-', ' ');
        return {
          background: `linear-gradient(${cssDir}, ${background.from}, ${background.to})`,
        };
      }
      case 'image':
        return {
          backgroundImage: `url(${background.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      case 'video':
        return {}; // Video handled separately
      default:
        return { backgroundColor: '#1a1a2e' };
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden" style={getBackgroundStyle()}>
      {background?.type === 'image' && background.overlay && (
        <div className="absolute inset-0" style={{ backgroundColor: background.overlay }} />
      )}
      {background?.type === 'image' && background.blur && (
        <div className="absolute inset-0 backdrop-blur" style={{ backdropFilter: `blur(${background.blur}px)` }} />
      )}
      {background?.type === 'video' && (
        <>
          <video
            src={background.url}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          {background.overlay && (
            <div className="absolute inset-0" style={{ backgroundColor: background.overlay }} />
          )}
        </>
      )}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

// Post content renderer
function PostMosaic({ content }: { content: PostContent }) {
  const fontSizeClass = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl',
  }[content.fontSize || 'lg'];

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[content.alignment || 'center'];

  return (
    <div className={`flex items-center justify-center h-full p-8 ${alignClass}`}>
      <p className={`${fontSizeClass} font-medium whitespace-pre-wrap leading-relaxed`}>
        {content.text}
      </p>
    </div>
  );
}

// Quote content renderer
function QuoteMosaic({ content }: { content: QuoteContent }) {
  const isLarge = content.style === 'large';
  
  return (
    <div className="flex items-center justify-center h-full p-8">
      <blockquote className="max-w-2xl">
        <p className={`${isLarge ? 'text-3xl' : 'text-xl'} font-serif italic leading-relaxed mb-6`}>
          "{content.text}"
        </p>
        {(content.author || content.source) && (
          <footer className="text-sm opacity-75">
            {content.author && <cite className="font-medium not-italic">— {content.author}</cite>}
            {content.source && <span className="ml-2 opacity-75">{content.source}</span>}
          </footer>
        )}
      </blockquote>
    </div>
  );
}

// Image content renderer
function ImageMosaic({ content }: { content: ImageContent }) {
  return (
    <div className="relative h-full">
      <img
        src={content.url}
        alt={content.alt}
        className="w-full h-full"
        style={{
          objectFit: content.fit || 'cover',
          objectPosition: content.position 
            ? `${content.position.x}% ${content.position.y}%` 
            : 'center',
        }}
      />
      {content.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white text-sm">{content.caption}</p>
        </div>
      )}
    </div>
  );
}

// Code content renderer with copy button
function CodeMosaic({ content }: { content: CodeContent }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [content.code]);

  return (
    <div className="flex flex-col h-full p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-2 px-3 py-1.5 bg-white/10 rounded-t-lg">
        <div className="flex items-center gap-2 text-xs font-mono">
          {content.filename && (
            <>
              <span className="opacity-75">📄</span>
              <span>{content.filename}</span>
            </>
          )}
          {!content.filename && (
            <span className="opacity-75">{content.language}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/20 transition-colors"
        >
          <span>{copied ? '✓' : '📋'}</span>
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div className="flex-1 overflow-auto rounded-b-lg">
        <SyntaxHighlighter
          language={content.language}
          style={oneDark}
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.85rem',
            background: 'rgba(0,0,0,0.3)',
            height: '100%',
          }}
          showLineNumbers
          wrapLines
          lineProps={(lineNumber) => ({
            style: content.highlightLines?.includes(lineNumber)
              ? { backgroundColor: 'rgba(255,255,0,0.1)', display: 'block' }
              : { display: 'block' },
          })}
        >
          {content.code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

// Gallery content renderer with swipe navigation
function GalleryMosaic({ content }: { content: GalleryContent }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Track scroll position to update active indicator
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const width = container.clientWidth;
      const newIndex = Math.round(scrollLeft / width);
      setActiveIndex(newIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const goToImage = useCallback((index: number) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
  }, []);

  const goNext = useCallback(() => {
    const nextIndex = Math.min(activeIndex + 1, content.images.length - 1);
    goToImage(nextIndex);
  }, [activeIndex, content.images.length, goToImage]);

  const goPrev = useCallback(() => {
    const prevIndex = Math.max(activeIndex - 1, 0);
    goToImage(prevIndex);
  }, [activeIndex, goToImage]);

  return (
    <div className="relative h-full">
      <div 
        ref={scrollRef}
        className="flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {content.images.map((image, index) => (
          <div key={index} className="flex-none w-full h-full snap-center relative">
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white text-sm">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation arrows (shown on hover) */}
      {content.images.length > 1 && (
        <>
          {activeIndex > 0 && (
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10"
            >
              <span className="text-white text-xl">‹</span>
            </button>
          )}
          {activeIndex < content.images.length - 1 && (
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10"
            >
              <span className="text-white text-xl">›</span>
            </button>
          )}
        </>
      )}

      {/* Page indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
        {content.images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex 
                ? 'bg-white w-4' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Counter */}
      {content.images.length > 1 && (
        <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-black/50 text-white text-xs z-10">
          {activeIndex + 1} / {content.images.length}
        </div>
      )}
    </div>
  );
}

// Video content renderer with controls
function VideoMosaic({ content, isActive }: { content: VideoContent; isActive?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(content.autoplay && isActive);
  const [isMuted, setIsMuted] = useState(content.muted ?? true);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  // Handle autoplay when becoming active
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isActive && content.autoplay) {
      videoRef.current.play().catch(() => {});
    } else if (!isActive) {
      videoRef.current.pause();
    }
  }, [isActive, content.autoplay]);

  // Sync playing state with video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  // Update progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    return () => video.removeEventListener('timeupdate', updateProgress);
  }, []);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = percent * videoRef.current.duration;
  }, []);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current);
    }
    hideControlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  return (
    <div 
      className="relative h-full bg-black"
      onClick={togglePlay}
      onMouseMove={showControlsTemporarily}
      onMouseEnter={showControlsTemporarily}
    >
      <video
        ref={videoRef}
        src={content.url}
        poster={content.poster}
        loop={content.loop}
        muted={isMuted}
        playsInline
        className="w-full h-full object-contain cursor-pointer"
      />
      
      {/* Play/Pause indicator */}
      <div 
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
          !isPlaying || showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center">
          <span className="text-4xl">{isPlaying ? '⏸️' : '▶️'}</span>
        </div>
      </div>

      {/* Bottom controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress bar */}
        <div 
          className="w-full h-1 bg-white/30 rounded-full mb-3 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleSeek(e);
          }}
        >
          <div 
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Mute button */}
        <div className="flex justify-end">
          <button
            onClick={toggleMute}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <span className="text-lg">{isMuted ? '🔇' : '🔊'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Poll content renderer
function PollMosaic({ content }: { content: PollContent }) {
  const hasVoted = content.userVote !== null && content.userVote !== undefined;
  const total = content.totalVotes || 0;

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <h3 className="text-2xl font-bold mb-8 text-center">{content.question}</h3>
      <div className="w-full max-w-md space-y-3">
        {content.options.map((option, index) => {
          const votes = content.votes?.[index] || 0;
          const percent = total > 0 ? Math.round((votes / total) * 100) : 0;
          const isSelected = content.userVote === index;

          return (
            <button
              key={index}
              className={`relative w-full p-4 rounded-xl text-left transition-all ${
                hasVoted
                  ? 'bg-white/10 cursor-default'
                  : 'bg-white/20 hover:bg-white/30 cursor-pointer'
              } ${isSelected ? 'ring-2 ring-white' : ''}`}
              disabled={hasVoted}
            >
              {hasVoted && (
                <div
                  className="absolute inset-0 bg-white/20 rounded-xl transition-all"
                  style={{ width: `${percent}%` }}
                />
              )}
              <span className="relative z-10 flex justify-between">
                <span>{option}</span>
                {hasVoted && <span className="font-medium">{percent}%</span>}
              </span>
            </button>
          );
        })}
      </div>
      {total > 0 && (
        <p className="mt-6 text-sm opacity-75">{total} votes</p>
      )}
    </div>
  );
}

// Article Preview content renderer
function ArticlePreviewMosaic({ content }: { content: ArticlePreviewContent }) {
  return (
    <div className="flex flex-col h-full">
      {/* Cover image */}
      {content.coverImage && content.showImage !== false && (
        <div className="h-1/2 overflow-hidden">
          <img
            src={content.coverImage}
            alt={content.title || 'Article cover'}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Content */}
      <div className={`flex-1 flex flex-col justify-center p-8 ${content.coverImage && content.showImage !== false ? '' : 'h-full'}`}>
        <div className="text-sm opacity-75 mb-2 flex items-center gap-2">
          <span>📄</span>
          <span>Article</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
          {content.title || 'Untitled Article'}
        </h2>
        {content.excerpt && (
          <p className="text-base md:text-lg opacity-80 line-clamp-3 mb-6">
            {content.excerpt}
          </p>
        )}
        <Link
          to={`/articles/${content.slug}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors w-fit"
        >
          Read Article
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

// Project Spotlight content renderer
function ProjectSpotlightMosaic({ content }: { content: ProjectSpotlightContent }) {
  return (
    <div className="flex flex-col h-full">
      {/* Thumbnail/Demo */}
      {content.thumbnail && (
        <div className="h-1/2 overflow-hidden relative">
          <img
            src={content.thumbnail}
            alt={content.title || 'Project thumbnail'}
            className="w-full h-full object-cover"
          />
          {content.showDemo && content.demoUrl && (
            <a
              href={content.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 px-4 py-2 bg-black/50 backdrop-blur rounded-full text-sm hover:bg-black/70 transition-colors"
            >
              ▶ Live Demo
            </a>
          )}
        </div>
      )}
      
      {/* Content */}
      <div className={`flex-1 flex flex-col justify-center p-8 ${content.thumbnail ? '' : 'h-full'}`}>
        <div className="text-sm opacity-75 mb-2 flex items-center gap-2">
          <span>🚀</span>
          <span>Project</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
          {content.title || 'Untitled Project'}
        </h2>
        {content.description && (
          <p className="text-base md:text-lg opacity-80 line-clamp-3 mb-6">
            {content.description}
          </p>
        )}
        <Link
          to={`/projects/${content.slug}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors w-fit"
        >
          View Project
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

// Notebook Cell content renderer
function NotebookCellMosaic({ content }: { content: NotebookCellContent }) {
  return (
    <div className="flex flex-col h-full p-6">
      <div className="text-sm opacity-75 mb-4 flex items-center gap-2">
        <span>📓</span>
        <span>Notebook Cell</span>
        <span className="opacity-50">• Cell {content.cellIndex + 1}</span>
      </div>
      
      {/* Code (if shown) */}
      {content.showCode && (
        <div className="mb-4 rounded-lg overflow-hidden bg-black/30 max-h-[30%]">
          <div className="px-3 py-1.5 bg-white/5 text-xs font-mono opacity-75">
            In [{content.cellIndex + 1}]:
          </div>
          <div className="p-3 text-sm font-mono overflow-auto">
            {/* Placeholder - would need actual cell content */}
            <span className="opacity-50">Code cell content...</span>
          </div>
        </div>
      )}
      
      {/* Output */}
      <div className="flex-1 rounded-lg overflow-hidden bg-white/5">
        <div className="px-3 py-1.5 bg-white/5 text-xs font-mono opacity-75">
          Out [{content.cellIndex + 1}]:
        </div>
        <div className="p-4 overflow-auto h-full">
          {content.outputSnapshot ? (
            <img
              src={content.outputSnapshot}
              alt="Cell output"
              className="max-w-full h-auto"
            />
          ) : (
            <div className="flex items-center justify-center h-full opacity-50">
              <p>Output preview not available</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Link to notebook */}
      <div className="mt-4">
        <Link
          to={`/notebooks/${content.notebookPath.replace(/\.ipynb$/, '')}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors"
        >
          Open Notebook
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

// Collage content renderer
function CollageMosaic({ content }: { content: CollageContent }) {
  const getGridClass = () => {
    switch (content.layout) {
      case '2x2':
        return 'grid-cols-2 grid-rows-2';
      case '1+2':
        return 'grid-cols-2 grid-rows-2';
      case '2+1':
        return 'grid-cols-2 grid-rows-2';
      case '3x3':
        return 'grid-cols-3 grid-rows-3';
      case 'masonry':
        return 'grid-cols-2 auto-rows-auto';
      default:
        return 'grid-cols-2 grid-rows-2';
    }
  };

  const getItemClass = (index: number) => {
    if (content.layout === '1+2' && index === 0) {
      return 'row-span-2';
    }
    if (content.layout === '2+1' && index === 2) {
      return 'col-span-2';
    }
    return '';
  };

  return (
    <div className={`h-full w-full grid ${getGridClass()} gap-1`}>
      {content.items.slice(0, content.layout === '3x3' ? 9 : 4).map((item, index) => (
        <div
          key={index}
          className={`overflow-hidden ${getItemClass(index)}`}
        >
          {item.type === 'image' && (
            <img
              src={(item.content as ImageContent).url}
              alt={(item.content as ImageContent).alt}
              className="w-full h-full object-cover"
            />
          )}
          {item.type === 'text' && (
            <div className="w-full h-full flex items-center justify-center p-4 bg-white/5">
              <p className="text-sm text-center">
                {(item.content as PostContent).text}
              </p>
            </div>
          )}
          {item.type === 'video' && (
            <video
              src={(item.content as VideoContent).url}
              muted
              loop
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Diagram content renderer
function DiagramMosaic({ content }: { content: DiagramContent }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="relative h-full w-full overflow-hidden" ref={containerRef}>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          −
        </button>
        <button
          onClick={handleReset}
          className="px-3 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors text-xs"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          +
        </button>
      </div>

      <div
        className="h-full w-full flex items-center justify-center p-8"
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        {content.type === 'mermaid' ? (
          <div className="bg-white/10 rounded-lg p-6 max-w-full overflow-auto">
            <div className="text-sm opacity-75 mb-2 flex items-center gap-2">
              <span>📊</span>
              <span>Mermaid Diagram</span>
            </div>
            {/* Mermaid would need dynamic rendering - showing placeholder */}
            <pre className="text-xs font-mono opacity-75 whitespace-pre-wrap">
              {content.content}
            </pre>
          </div>
        ) : (
          <div className="bg-white/10 rounded-lg p-6">
            <div className="text-sm opacity-75 mb-2 flex items-center gap-2">
              <span>✏️</span>
              <span>Excalidraw Diagram</span>
            </div>
            {/* Excalidraw would need @excalidraw/excalidraw */}
            <p className="text-sm opacity-50">Interactive diagram preview</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Thread content renderer (multi-page horizontal scroll)
function ThreadMosaic({ content }: { content: ThreadContent }) {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const goToPage = useCallback((page: number) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({ left: width * page, behavior: 'smooth' });
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const width = container.clientWidth;
      const newPage = Math.round(scrollLeft / width);
      setCurrentPage(newPage);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate placeholder pages based on pageCount
  const pages = Array.from({ length: content.pageCount }, (_, i) => i);

  return (
    <div className="relative h-full">
      {/* Title */}
      {content.title && (
        <div className="absolute top-4 left-4 right-4 z-10">
          <h2 className="text-lg font-semibold">{content.title}</h2>
        </div>
      )}

      {/* Scrollable pages */}
      <div
        ref={scrollRef}
        className="h-full w-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {pages.map((pageIndex) => (
          <div
            key={pageIndex}
            className="flex-none w-full h-full snap-center flex items-center justify-center p-8"
          >
            <div className="text-center">
              <p className="text-2xl font-medium mb-2">Page {pageIndex + 1}</p>
              <p className="text-sm opacity-50">Thread content would go here</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      {content.pageCount > 1 && (
        <>
          {currentPage > 0 && (
            <button
              onClick={() => goToPage(currentPage - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors z-10"
            >
              ‹
            </button>
          )}
          {currentPage < content.pageCount - 1 && (
            <button
              onClick={() => goToPage(currentPage + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors z-10"
            >
              ›
            </button>
          )}
        </>
      )}

      {/* Page indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
        {pages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToPage(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentPage
                ? 'bg-white w-6'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Page counter */}
      <div className="absolute bottom-4 right-4 px-2 py-1 rounded-full bg-black/50 text-xs z-10">
        {currentPage + 1} / {content.pageCount}
      </div>
    </div>
  );
}

// Content renderer based on type
function MosaicContent({ mosaic, isActive }: { mosaic: Mosaic; isActive?: boolean }) {
  switch (mosaic.type) {
    case 'post':
      return <PostMosaic content={mosaic.content as PostContent} />;
    case 'quote':
      return <QuoteMosaic content={mosaic.content as QuoteContent} />;
    case 'image':
      return <ImageMosaic content={mosaic.content as ImageContent} />;
    case 'code':
      return <CodeMosaic content={mosaic.content as CodeContent} />;
    case 'gallery':
      return <GalleryMosaic content={mosaic.content as GalleryContent} />;
    case 'video':
      return <VideoMosaic content={mosaic.content as VideoContent} isActive={isActive} />;
    case 'poll':
      return <PollMosaic content={mosaic.content as PollContent} />;
    case 'article-preview':
      return <ArticlePreviewMosaic content={mosaic.content as ArticlePreviewContent} />;
    case 'project-spotlight':
      return <ProjectSpotlightMosaic content={mosaic.content as ProjectSpotlightContent} />;
    case 'notebook-cell':
      return <NotebookCellMosaic content={mosaic.content as NotebookCellContent} />;
    case 'collage':
      return <CollageMosaic content={mosaic.content as CollageContent} />;
    case 'diagram':
      return <DiagramMosaic content={mosaic.content as DiagramContent} />;
    case 'thread':
      return <ThreadMosaic content={mosaic.content as ThreadContent} />;
    default:
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-lg opacity-50">Unsupported mosaic type: {mosaic.type}</p>
        </div>
      );
  }
}

// Author info overlay
function AuthorOverlay({ mosaic, onAuthorClick }: { mosaic: Mosaic; onAuthorClick?: () => void }) {
  return (
    <div className="absolute top-4 left-4 right-4 flex items-center gap-3 z-20">
      <button
        onClick={onAuthorClick}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        {mosaic.author.avatarUrl ? (
          <img
            src={mosaic.author.avatarUrl}
            alt={mosaic.author.displayName}
            className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-medium">
            {mosaic.author.displayName[0]}
          </div>
        )}
        <div className="text-left">
          <p className="font-medium text-sm">{mosaic.author.displayName}</p>
          <p className="text-xs opacity-75">@{mosaic.author.username}</p>
        </div>
      </button>
    </div>
  );
}

// Action bar
function ActionBar({
  mosaic,
  onLike,
  onComment,
  onShare,
  reducedMotion = false,
}: {
  mosaic: Mosaic;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  reducedMotion?: boolean;
}) {
  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const hoverClass = reducedMotion ? '' : 'hover:scale-110 transition-transform';

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-4 z-20">
      <button
        onClick={onLike}
        className={`flex flex-col items-center gap-1 ${hoverClass}`}
        aria-label={mosaic.isLiked ? 'Unlike' : 'Like'}
        aria-pressed={mosaic.isLiked}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          mosaic.isLiked ? 'bg-red-500' : 'bg-white/20'
        }`}>
          <span className="text-xl">{mosaic.isLiked ? '❤️' : '🤍'}</span>
        </div>
        <span className="text-xs font-medium">{formatCount(mosaic.likeCount)}</span>
      </button>

      <button
        onClick={onComment}
        className={`flex flex-col items-center gap-1 ${hoverClass}`}
        aria-label={`${mosaic.commentCount} comments`}
      >
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-xl">💬</span>
        </div>
        <span className="text-xs font-medium">{formatCount(mosaic.commentCount)}</span>
      </button>

      <button
        onClick={onShare}
        className={`flex flex-col items-center gap-1 ${hoverClass}`}
        aria-label="Share"
      >
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-xl">↗️</span>
        </div>
        <span className="text-xs font-medium">{formatCount(mosaic.shareCount)}</span>
      </button>
    </div>
  );
}

// Main MosaicCard component
export function MosaicCard({
  mosaic,
  isActive = false,
  onLike,
  onComment,
  onShare,
  onAuthorClick,
  compact = false,
  reducedMotion = false,
}: MosaicCardProps) {
  const themeClass = mosaic.theme === 'light' ? 'text-gray-900' : 'text-white';

  // Compact mode for grid view - minimal UI
  if (compact) {
    return (
      <div className={`relative w-full h-full ${themeClass}`}>
        <MosaicBackground background={mosaic.background}>
          <MosaicContent mosaic={mosaic} isActive={false} />
        </MosaicBackground>
        
        {/* Minimal overlay for grid */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium truncate">@{mosaic.author.username}</span>
            <div className="flex items-center gap-2 text-xs">
              <span>❤️ {mosaic.likeCount}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${themeClass}`}>
      <MosaicBackground background={mosaic.background}>
        <MosaicContent mosaic={mosaic} isActive={isActive} />
      </MosaicBackground>
      
      <AuthorOverlay mosaic={mosaic} onAuthorClick={onAuthorClick} />
      <ActionBar
        mosaic={mosaic}
        onLike={onLike}
        onComment={onComment}
        onShare={onShare}
        reducedMotion={reducedMotion}
      />

      {/* Tags */}
      {mosaic.tags && mosaic.tags.length > 0 && (
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-20 max-w-[60%]">
          {mosaic.tags.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 text-xs rounded-full bg-white/20 backdrop-blur"
            >
              #{tag.slug}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default MosaicCard;
