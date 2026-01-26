import { useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MosaicFeed, CommentsSheet, mockComments, useHeartAnimation, HeartAnimation } from '../components/mosaic';
import type { Comment } from '../components/mosaic';
import { mockMosaics, getMosaicsByTag, getMosaicsByCommunity, getMosaicById } from '../data/mosaics';
import type { Mosaic } from '../types/mosaic';

export default function MosaicsPage() {
  const { id, tag, community } = useParams<{ id?: string; tag?: string; community?: string }>();
  const navigate = useNavigate();
  const [likedMosaics, setLikedMosaics] = useState<Set<string>>(new Set());
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const { showHeart, position, triggerHeart } = useHeartAnimation();

  // Determine which mosaics to show
  let mosaics: Mosaic[] = mockMosaics;
  let initialIndex = 0;

  if (tag) {
    mosaics = getMosaicsByTag(tag);
  } else if (community) {
    mosaics = getMosaicsByCommunity(community);
  }

  // If viewing a specific mosaic, find its index
  if (id) {
    const mosaic = getMosaicById(id);
    if (mosaic) {
      const idx = mosaics.findIndex((m) => m.id === id);
      if (idx >= 0) {
        initialIndex = idx;
      } else {
        // Mosaic not in current feed, prepend it
        mosaics = [mosaic, ...mosaics.filter((m) => m.id !== id)];
      }
    }
  }

  // Apply local like state
  const mosaicsWithLikes = mosaics.map((m) => ({
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
      {/* Heart animation overlay */}
      <HeartAnimation show={showHeart} x={position.x} y={position.y} />

      {/* Close button to exit mosaics */}
      <Link
        to="/"
        className="fixed top-4 left-4 z-50 w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        aria-label="Exit mosaics"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Link>

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

      <MosaicFeed
        mosaics={mosaicsWithLikes}
        initialIndex={initialIndex}
        onMosaicChange={handleMosaicChange}
        onLike={handleLike}
        onDoubleTap={handleDoubleTap}
        onComment={handleComment}
        onShare={handleShare}
        onAuthorClick={handleAuthorClick}
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
