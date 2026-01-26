import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MosaicFeed } from '../components/mosaic';
import { mockMosaics, getMosaicsByTag, getMosaicsByCommunity, getMosaicById } from '../data/mosaics';
import type { Mosaic } from '../types/mosaic';

export default function MosaicsPage() {
  const { id, tag, community } = useParams<{ id?: string; tag?: string; community?: string }>();
  const navigate = useNavigate();
  const [likedMosaics, setLikedMosaics] = useState<Set<string>>(new Set());

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

  const handleComment = useCallback((mosaic: Mosaic) => {
    // TODO: Open comment sheet
    console.log('Open comments for:', mosaic.id);
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
    <MosaicFeed
      mosaics={mosaicsWithLikes}
      initialIndex={initialIndex}
      onMosaicChange={handleMosaicChange}
      onLike={handleLike}
      onComment={handleComment}
      onShare={handleShare}
      onAuthorClick={handleAuthorClick}
    />
  );
}
