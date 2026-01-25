// Mosaic Types
// Full-screen, vertically-scrollable content cards

export type MosaicType =
  | 'post'
  | 'image'
  | 'gallery'
  | 'video'
  | 'code'
  | 'quote'
  | 'poll'
  | 'collage'
  | 'article-preview'
  | 'project-spotlight'
  | 'notebook-cell'
  | 'music'
  | 'diagram'
  | 'thread';

// Background types
export interface SolidBackground {
  type: 'solid';
  color: string;
}

export interface GradientBackground {
  type: 'gradient';
  from: string;
  to: string;
  direction?: 'to-b' | 'to-r' | 'to-br' | 'to-bl' | 'to-t' | 'to-l' | 'to-tr' | 'to-tl';
}

export interface ImageBackground {
  type: 'image';
  url: string;
  blur?: number;
  overlay?: string; // color with opacity, e.g. "rgba(0,0,0,0.5)"
}

export interface VideoBackground {
  type: 'video';
  url: string;
  overlay?: string;
}

export type MosaicBackground =
  | SolidBackground
  | GradientBackground
  | ImageBackground
  | VideoBackground;

// Content types for each mosaic type
export interface PostContent {
  text: string;
  fontSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  alignment?: 'left' | 'center' | 'right';
}

export interface ImageContent {
  url: string;
  alt: string;
  caption?: string;
  fit?: 'cover' | 'contain' | 'fill';
  position?: { x: number; y: number };
}

export interface GalleryContent {
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  transition?: 'slide' | 'fade' | 'none';
}

export interface VideoContent {
  url: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export interface CodeContent {
  code: string;
  language: string;
  filename?: string;
  runnable?: boolean;
  runner?: 'python' | 'javascript' | 'sql' | 'strudel';
  highlightLines?: number[];
}

export interface QuoteContent {
  text: string;
  author?: string;
  source?: string;
  style?: 'minimal' | 'card' | 'large';
}

export interface PollContent {
  question: string;
  options: string[];
  allowMultiple?: boolean;
  endsAt?: string; // ISO date
  votes?: number[]; // Vote counts per option (for display)
  totalVotes?: number;
  userVote?: number | null; // Index of user's vote
}

export interface CollageItem {
  type: 'image' | 'text' | 'video';
  content: ImageContent | PostContent | VideoContent;
  gridArea?: string; // For custom layouts
}

export interface CollageContent {
  layout: '2x2' | '1+2' | '2+1' | '3x3' | 'masonry' | 'custom';
  items: CollageItem[];
}

export interface ArticlePreviewContent {
  slug: string;
  title?: string; // Override
  excerpt?: string; // Override
  coverImage?: string;
  showImage?: boolean;
}

export interface ProjectSpotlightContent {
  slug: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  showDemo?: boolean;
  demoUrl?: string;
}

export interface NotebookCellContent {
  notebookPath: string;
  cellIndex: number;
  showCode?: boolean;
  showOutput?: boolean;
  outputSnapshot?: string; // Rendered output as image/html
}

export interface MusicContent {
  code: string; // Strudel code
  visualizer?: 'waveform' | 'bars' | 'circle' | 'none';
  autoplay?: boolean;
}

export interface DiagramContent {
  type: 'mermaid' | 'excalidraw';
  content: string; // Mermaid code or Excalidraw JSON string
  interactive?: boolean;
}

export interface ThreadContent {
  pageCount: number;
  title?: string;
}

// Union of all content types
export type MosaicContent =
  | PostContent
  | ImageContent
  | GalleryContent
  | VideoContent
  | CodeContent
  | QuoteContent
  | PollContent
  | CollageContent
  | ArticlePreviewContent
  | ProjectSpotlightContent
  | NotebookCellContent
  | MusicContent
  | DiagramContent
  | ThreadContent;

// Author type (matches profile structure)
export interface MosaicAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

// Tag type
export interface MosaicTag {
  id: string;
  name: string;
  slug: string;
}

// Community type
export interface MosaicCommunity {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
}

// Comment type
export interface MosaicComment {
  id: string;
  mosaicId: string;
  author: MosaicAuthor;
  content: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  replies?: MosaicComment[];
}

// Page type (for threads)
export interface MosaicPage {
  id: string;
  mosaicId: string;
  pageNumber: number;
  content: MosaicContent;
  mdxContent?: string;
  background?: MosaicBackground;
}

// Main Mosaic type
export interface Mosaic {
  id: string;
  author: MosaicAuthor;
  
  // Content
  type: MosaicType;
  content: MosaicContent;
  mdxContent?: string; // Optional MDX for rich text overlay
  
  // Display
  background?: MosaicBackground;
  layout?: 'center' | 'top' | 'bottom' | 'fill';
  theme?: 'light' | 'dark' | 'auto';
  aspectRatio?: '9:16' | '1:1' | '4:5' | '16:9';
  
  // Linking
  linkedArticleSlug?: string;
  linkedProjectSlug?: string;
  linkedNotebookPath?: string;
  
  // Taxonomy
  tags?: MosaicTag[];
  communities?: MosaicCommunity[];
  
  // Engagement
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLiked?: boolean; // Current user's like status
  
  // Pages (for threads)
  pages?: MosaicPage[];
  
  // Metadata
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  durationSeconds?: number; // For video/music, or suggested read time
}

// Feed types
export type MosaicFeedSource = 
  | 'discover'
  | 'following'
  | 'tag'
  | 'community'
  | 'user'
  | 'search';

export interface MosaicFeedParams {
  source: MosaicFeedSource;
  sourceId?: string; // tag slug, community slug, user id, search query
  limit?: number;
  offset?: number;
}

// Creation types
export interface CreateMosaicInput {
  type: MosaicType;
  content: MosaicContent;
  mdxContent?: string;
  background?: MosaicBackground;
  layout?: Mosaic['layout'];
  theme?: Mosaic['theme'];
  aspectRatio?: Mosaic['aspectRatio'];
  linkedArticleSlug?: string;
  linkedProjectSlug?: string;
  linkedNotebookPath?: string;
  tagIds?: string[];
  communityIds?: string[];
  pages?: Omit<MosaicPage, 'id' | 'mosaicId'>[];
}

// Type guards for content
export function isPostContent(content: MosaicContent): content is PostContent {
  return 'text' in content && !('author' in content);
}

export function isImageContent(content: MosaicContent): content is ImageContent {
  return 'url' in content && 'alt' in content && !('images' in content);
}

export function isGalleryContent(content: MosaicContent): content is GalleryContent {
  return 'images' in content && Array.isArray((content as GalleryContent).images);
}

export function isVideoContent(content: MosaicContent): content is VideoContent {
  return 'url' in content && ('poster' in content || 'autoplay' in content || 'loop' in content);
}

export function isCodeContent(content: MosaicContent): content is CodeContent {
  return 'code' in content && 'language' in content;
}

export function isQuoteContent(content: MosaicContent): content is QuoteContent {
  return 'text' in content && ('author' in content || 'source' in content || 'style' in content);
}

export function isPollContent(content: MosaicContent): content is PollContent {
  return 'question' in content && 'options' in content;
}

export function isCollageContent(content: MosaicContent): content is CollageContent {
  return 'layout' in content && 'items' in content;
}

export function isArticlePreviewContent(content: MosaicContent): content is ArticlePreviewContent {
  return 'slug' in content && !('notebookPath' in content) && !('demoUrl' in content);
}

export function isProjectSpotlightContent(content: MosaicContent): content is ProjectSpotlightContent {
  return 'slug' in content && ('showDemo' in content || 'demoUrl' in content || 'thumbnail' in content);
}

export function isNotebookCellContent(content: MosaicContent): content is NotebookCellContent {
  return 'notebookPath' in content && 'cellIndex' in content;
}

export function isMusicContent(content: MosaicContent): content is MusicContent {
  return 'code' in content && ('visualizer' in content || !('language' in content));
}

export function isDiagramContent(content: MosaicContent): content is DiagramContent {
  return 'type' in content && ('mermaid' === (content as DiagramContent).type || 'excalidraw' === (content as DiagramContent).type);
}

export function isThreadContent(content: MosaicContent): content is ThreadContent {
  return 'pageCount' in content;
}
