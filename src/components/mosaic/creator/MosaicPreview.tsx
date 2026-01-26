import { MosaicCard } from '../MosaicCard';
import type { Mosaic, MosaicType, MosaicBackground, MosaicContent } from '../../../types/mosaic';

interface MosaicPreviewProps {
  type: MosaicType;
  content: MosaicContent;
  background: MosaicBackground;
  theme: 'light' | 'dark';
}

// Default author for preview
const previewAuthor = {
  id: 'preview',
  username: 'you',
  displayName: 'You',
};

export function MosaicPreview({ type, content, background, theme }: MosaicPreviewProps) {
  // Create a preview mosaic
  const previewMosaic: Mosaic = {
    id: 'preview',
    type,
    content,
    background,
    theme,
    author: previewAuthor,
    createdAt: new Date(),
    updatedAt: new Date(),
    likeCount: 0,
    commentCount: 0,
    shareCount: 0,
    viewCount: 0,
    isLiked: false,
    isBookmarked: false,
  };

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl">
      <MosaicCard
        mosaic={previewMosaic}
        isActive={true}
        onLike={() => {}}
        onComment={() => {}}
        onShare={() => {}}
        onAuthorClick={() => {}}
      />
      {/* Preview badge */}
      <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 backdrop-blur rounded-full text-xs">
        Preview
      </div>
    </div>
  );
}

export default MosaicPreview;
