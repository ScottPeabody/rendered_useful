import { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MosaicFeed, CommentsSheet, mockComments, useHeartAnimation, HeartAnimation, MosaicMeta } from '../components/mosaic';
import type { Comment } from '../components/mosaic';
import { mockMosaics, getMosaicsByTag, getMosaicsByCommunity, getMosaicById, getFeaturedMosaics } from '../data/mosaics';
import type { Mosaic, MosaicType } from '../types/mosaic';

type FeedTab = 'for-you' | 'following' | 'trending' | 'new';
type TypeFilter = MosaicType | 'all';

export default function MosaicsPage() {
  const { id, tag, community } = useParams<{ id?: string; tag?: string; community?: string }>();
  const navigate = useNavigate();
  const [likedMosaics, setLikedMosaics] = useState<Set<string>>(new Set());
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const { showHeart, position, triggerHeart } = useHeartAnimation();
  
  // Feed filtering state
  const [activeTab, setActiveTab] = useState<FeedTab>('for-you');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Video mute state (for future use with video player integration)
  const [, setIsMuted] = useState(true);
  
  // Current mosaic for meta tags
  const [currentMosaic, setCurrentMosaic] = useState<Mosaic | null>(null);

  // Filter mosaics based on tab and type
  const getFilteredMosaics = useCallback((): Mosaic[] => {
    let filtered: Mosaic[] = mockMosaics;

    // Apply tag/community filters from URL
    if (tag) {
      filtered = getMosaicsByTag(tag);
    } else if (community) {
      filtered = getMosaicsByCommunity(community);
    }

    // Apply tab filter
    switch (activeTab) {
      case 'trending':
        filtered = [...filtered].sort((a, b) => b.likeCount - a.likeCount);
        break;
      case 'new':
        filtered = [...filtered].sort((a, b) => 
          new Date(b.publishedAt || b.createdAt).getTime() - 
          new Date(a.publishedAt || a.createdAt).getTime()
        );
        break;
      case 'following':
        // Mock: show mosaics from specific authors (in real app, would be followed users)
        filtered = filtered.filter(m => m.author.id === '1');
        break;
      case 'for-you':
      default:
        // Mix of featured and recent
        const featured = getFeaturedMosaics();
        filtered = [...featured, ...filtered.filter(m => !m.isFeatured)];
        break;
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(m => m.type === typeFilter);
    }

    return filtered;
  }, [tag, community, activeTab, typeFilter]);

  // Memoize filtered mosaics
  const mosaics = useMemo(() => getFilteredMosaics(), [getFilteredMosaics]);

  let displayMosaics = mosaics;
  let initialIndex = 0;

  // If viewing a specific mosaic, find its index
  if (id) {
    const mosaic = getMosaicById(id);
    if (mosaic) {
      const idx = displayMosaics.findIndex((m) => m.id === id);
      if (idx >= 0) {
        initialIndex = idx;
      } else {
        // Mosaic not in current feed, prepend it
        displayMosaics = [mosaic, ...displayMosaics.filter((m) => m.id !== id)];
      }
    }
  }

  // Apply local like state
  const mosaicsWithLikes = displayMosaics.map((m) => ({
    ...m,
    isLiked: likedMosaics.has(m.id) ? true : m.isLiked,
    likeCount: likedMosaics.has(m.id) && !m.isLiked ? m.likeCount + 1 : m.likeCount,
  }));

  const handleLike = useCallback((mosaic: Mosaic) => {
    setLikedMosaics((prev) => {
      const next = new Set(prev);
      if (next.has(mosaic.id)) {
        next.delete(mosaic.id);
      } else {
        next.add(mosaic.id);
      }
      return next;
    });
  }, []);

  // Double-tap handler with heart animation
  const handleDoubleTap = useCallback((mosaic: Mosaic, x?: number, y?: number) => {
    if (!likedMosaics.has(mosaic.id)) {
      handleLike(mosaic);
      triggerHeart(x, y);
    }
  }, [likedMosaics, handleLike, triggerHeart]);

  const handleComment = useCallback((_mosaic: Mosaic) => {
    setCommentsOpen(true);
  }, []);

  const handleAddComment = useCallback((text: string, replyToId?: string) => {
    const newComment: Comment = {
      id: `new-${Date.now()}`,
      authorId: 'current-user',
      authorName: 'You',
      text,
      createdAt: new Date(),
      likeCount: 0,
      isLiked: false,
    };

    if (replyToId) {
      // Add as reply
      setComments(prev => prev.map(c => {
        if (c.id === replyToId) {
          return { ...c, replies: [...(c.replies || []), newComment] };
        }
        return c;
      }));
    } else {
      // Add as top-level comment
      setComments(prev => [newComment, ...prev]);
    }
  }, []);

  const handleLikeComment = useCallback((commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          isLiked: !c.isLiked,
          likeCount: c.isLiked ? c.likeCount - 1 : c.likeCount + 1,
        };
      }
      if (c.replies) {
        return {
          ...c,
          replies: c.replies.map(r => {
            if (r.id === commentId) {
              return {
                ...r,
                isLiked: !r.isLiked,
                likeCount: r.isLiked ? r.likeCount - 1 : r.likeCount + 1,
              };
            }
            return r;
          }),
        };
      }
      return c;
    }));
  }, []);

  const handleShare = useCallback((mosaic: Mosaic) => {
    const url = `${window.location.origin}/mosaics/${mosaic.id}`;
    if (navigator.share) {
      navigator.share({
        title: `Mosaic by ${mosaic.author.displayName}`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      // TODO: Show toast
      console.log('Link copied:', url);
    }
  }, []);

  const handleAuthorClick = useCallback((mosaic: Mosaic) => {
    navigate(`/@${mosaic.author.username}`);
  }, [navigate]);

  const handleMosaicChange = useCallback((mosaic: Mosaic) => {
    // Update URL without triggering navigation
    const newUrl = `/mosaics/${mosaic.id}`;
    window.history.replaceState(null, '', newUrl);
    // Update current mosaic for meta tags
    setCurrentMosaic(mosaic);
  }, []);

  const handleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  if (mosaicsWithLikes.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-xl mb-4">No mosaics found</p>
          {tag && <p className="text-sm opacity-50">Tag: #{tag}</p>}
          {community && <p className="text-sm opacity-50">Community: {community}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Meta tags for sharing */}
      {currentMosaic && <MosaicMeta mosaic={currentMosaic} />}

      {/* Heart animation overlay */}
      <HeartAnimation show={showHeart} x={position.x} y={position.y} />

      {/* Top navigation - Feed tabs */}
      <div className="fixed top-0 left-0 right-0 z-40 pt-4 pb-2 px-4 pointer-events-none">
        <div className="flex items-center justify-center gap-1 pointer-events-auto">
          {/* Close button */}
          <Link
            to="/"
            className="mr-auto w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            aria-label="Exit mosaics"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </Link>

          {/* Feed tabs */}
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur rounded-full p-1">
            {(['for-you', 'following', 'trending', 'new'] as FeedTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-white text-gray-900'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {tab === 'for-you' ? 'For You' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`ml-auto w-10 h-10 rounded-full backdrop-blur flex items-center justify-center transition-colors ${
              showFilters || typeFilter !== 'all' 
                ? 'bg-white text-gray-900' 
                : 'bg-black/50 text-white hover:bg-black/70'
            }`}
            aria-label="Filter by type"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
        </div>

        {/* Type filter dropdown */}
        {showFilters && (
          <div className="mt-2 flex justify-end pointer-events-auto">
            <div className="bg-black/80 backdrop-blur rounded-xl p-2 flex flex-wrap gap-1 max-w-md">
              {(['all', 'post', 'quote', 'image', 'gallery', 'video', 'code', 'poll', 'collage', 'diagram', 'thread'] as TypeFilter[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setTypeFilter(type);
                    setShowFilters(false);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    typeFilter === type
                      ? 'bg-white text-gray-900'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create button */}
      <Link
        to="/mosaics/create"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="Create mosaic"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </Link>

      {/* Keyboard shortcut hint */}
      <div className="fixed bottom-6 left-6 z-40 text-white/40 text-xs hidden md:block">
        Press <kbd className="px-1 py-0.5 bg-white/10 rounded">?</kbd> for shortcuts
      </div>

      <MosaicFeed
        mosaics={mosaicsWithLikes}
        initialIndex={initialIndex}
        onMosaicChange={handleMosaicChange}
        onLike={handleLike}
        onDoubleTap={handleDoubleTap}
        onComment={handleComment}
        onShare={handleShare}
        onAuthorClick={handleAuthorClick}
        onMute={handleMute}
      />

      {/* Comments sheet */}
      <CommentsSheet
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        comments={comments}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
      />
    </div>
  );
}
