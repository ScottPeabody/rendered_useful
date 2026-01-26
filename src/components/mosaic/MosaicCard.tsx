import { type ReactNode } from 'react';
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

// Code content renderer
function CodeMosaic({ content }: { content: CodeContent }) {
  return (
    <div className="flex flex-col h-full p-4 overflow-hidden">
      {content.filename && (
        <div className="flex items-center gap-2 mb-2 px-3 py-1.5 bg-white/10 rounded-t-lg text-xs font-mono">
          <span className="opacity-75">📄</span>
          <span>{content.filename}</span>
        </div>
      )}
      <div className="flex-1 overflow-auto rounded-lg">
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

// Gallery content renderer (simplified - horizontal scroll)
function GalleryMosaic({ content }: { content: GalleryContent }) {
  return (
    <div className="relative h-full">
      <div className="flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide">
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
      {/* Page indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
        {content.images.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-white' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}

// Video content renderer
function VideoMosaic({ content, isActive }: { content: VideoContent; isActive?: boolean }) {
  return (
    <div className="relative h-full bg-black">
      <video
        src={content.url}
        poster={content.poster}
        autoPlay={content.autoplay && isActive}
        loop={content.loop}
        muted={content.muted}
        playsInline
        className="w-full h-full object-contain"
      />
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
}: {
  mosaic: Mosaic;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}) {
  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-4 z-20">
      <button
        onClick={onLike}
        className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
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
        className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
      >
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-xl">💬</span>
        </div>
        <span className="text-xs font-medium">{formatCount(mosaic.commentCount)}</span>
      </button>

      <button
        onClick={onShare}
        className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
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
}: MosaicCardProps) {
  const themeClass = mosaic.theme === 'light' ? 'text-gray-900' : 'text-white';

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
