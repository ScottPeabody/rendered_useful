# Mosaics Feature Specification

## Overview

**Mosaics** are full-screen, vertically-scrollable content units designed for mobile-first consumption. Think TikTok meets MDX - bite-sized, visually engaging content that users can swipe through endlessly while maintaining the rich content capabilities of the platform.

## Core Concepts

### What is a Mosaic?

A Mosaic is a single "card" of content that fills the viewport. Users swipe vertically to move between Mosaics (like TikTok) and can optionally scroll horizontally or tap to expand content within a Mosaic.

```
┌─────────────────────┐
│                     │
│    ┌───────────┐    │
│    │  MOSAIC   │    │  ← Full viewport height
│    │  CONTENT  │    │
│    │           │    │
│    └───────────┘    │
│                     │
│  ● ○ ○ ○  (pages)   │  ← Optional multi-page indicator
│                     │
│  [♥] [💬] [↗] [⋯]   │  ← Action bar
└─────────────────────┘
        ▼ swipe
┌─────────────────────┐
│    NEXT MOSAIC      │
└─────────────────────┘
```

### Mosaic Types

| Type | Description | Content |
|------|-------------|---------|
| **Post** | Quick text/thought | Short MDX, emoji, styled text |
| **Image** | Single image with caption | Image + optional MDX overlay/caption |
| **Gallery** | Multi-image carousel | Horizontal swipe through images |
| **Video** | Short-form video | Video player, auto-play, loop |
| **Code** | Code snippet showcase | Syntax-highlighted code, runnable |
| **Quote** | Styled quotation | Quote text + attribution + background |
| **Poll** | Interactive poll | Question + voting options |
| **Collage** | Multi-element layout | Grid of images/text/embeds |
| **Article Preview** | Teaser for full article | Excerpt + "Read More" link |
| **Project Spotlight** | Project showcase | Demo/screenshot + description |
| **Notebook Cell** | Single notebook output | Code + visualization |
| **Music** | Strudel/audio content | Waveform + playback |
| **Diagram** | Mermaid/Excalidraw | Interactive diagram |
| **Thread** | Multi-page story | Swipe horizontally through pages |

## Data Model

### Mosaic Table

```sql
CREATE TABLE mosaics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Content
  type TEXT NOT NULL CHECK (type IN (
    'post', 'image', 'gallery', 'video', 'code', 'quote', 
    'poll', 'collage', 'article_preview', 'project_spotlight',
    'notebook_cell', 'music', 'diagram', 'thread'
  )),
  content JSONB NOT NULL,  -- Type-specific content structure
  mdx_content TEXT,        -- Optional MDX for rich text
  
  -- Media
  media JSONB,             -- Array of media objects {url, type, alt, ...}
  thumbnail_url TEXT,      -- Preview image for feed
  
  -- Display
  background JSONB,        -- {type: 'color'|'gradient'|'image'|'video', value: ...}
  layout TEXT DEFAULT 'center', -- 'center', 'top', 'bottom', 'fill'
  theme TEXT DEFAULT 'auto',    -- 'light', 'dark', 'auto', or custom theme
  
  -- Linking (connect to existing content)
  linked_article_slug TEXT,
  linked_project_slug TEXT,
  linked_notebook_path TEXT,
  linked_post_id UUID REFERENCES posts(id),
  
  -- Engagement
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  
  -- Discovery
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  
  -- Metadata
  duration_seconds INTEGER,  -- For video/music, also suggested read time
  aspect_ratio TEXT DEFAULT '9:16', -- '9:16', '1:1', '4:5', '16:9'
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction tables for taxonomy
CREATE TABLE mosaic_tags (
  mosaic_id UUID REFERENCES mosaics(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (mosaic_id, tag_id)
);

CREATE TABLE mosaic_communities (
  mosaic_id UUID REFERENCES mosaics(id) ON DELETE CASCADE,
  community_id UUID REFERENCES communities(id) ON DELETE CASCADE,
  PRIMARY KEY (mosaic_id, community_id)
);

-- Thread pages (for multi-page mosaics)
CREATE TABLE mosaic_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mosaic_id UUID NOT NULL REFERENCES mosaics(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  content JSONB NOT NULL,
  mdx_content TEXT,
  media JSONB,
  background JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mosaic_id, page_number)
);

-- Mosaic interactions
CREATE TABLE mosaic_likes (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mosaic_id UUID REFERENCES mosaics(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, mosaic_id)
);

CREATE TABLE mosaic_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mosaic_id UUID NOT NULL REFERENCES mosaics(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES mosaic_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Poll votes
CREATE TABLE mosaic_poll_votes (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mosaic_id UUID REFERENCES mosaics(id) ON DELETE CASCADE,
  option_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, mosaic_id)
);
```

### Content JSONB Structures

```typescript
// Post
{
  text: string;
  fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  alignment?: 'left' | 'center' | 'right';
}

// Image
{
  url: string;
  alt: string;
  caption?: string;
  fit?: 'cover' | 'contain' | 'fill';
  position?: { x: number; y: number };
}

// Gallery
{
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  transition?: 'slide' | 'fade' | 'none';
}

// Video
{
  url: string;
  poster?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

// Code
{
  code: string;
  language: string;
  filename?: string;
  runnable?: boolean;
  runner?: 'python' | 'javascript' | 'sql' | 'strudel';
  highlightLines?: number[];
}

// Quote
{
  text: string;
  author?: string;
  source?: string;
  style?: 'minimal' | 'card' | 'large';
}

// Poll
{
  question: string;
  options: string[];
  allowMultiple?: boolean;
  endsAt?: string; // ISO date
}

// Collage
{
  layout: '2x2' | '1+2' | '2+1' | '3x3' | 'masonry' | 'custom';
  items: Array<{
    type: 'image' | 'text' | 'video';
    content: any;
    gridArea?: string; // For custom layouts
  }>;
}

// Article Preview
{
  slug: string;
  excerpt?: string; // Override article excerpt
  showImage?: boolean;
}

// Project Spotlight
{
  slug: string;
  showDemo?: boolean;
  demoUrl?: string;
}

// Notebook Cell
{
  notebookPath: string;
  cellIndex: number;
  showCode?: boolean;
  showOutput?: boolean;
}

// Music (Strudel)
{
  code: string;
  visualizer?: 'waveform' | 'bars' | 'circle' | 'none';
  autoplay?: boolean;
}

// Diagram
{
  type: 'mermaid' | 'excalidraw';
  content: string | object;
  interactive?: boolean;
}

// Thread (content in mosaic_pages table)
{
  pageCount: number;
  title?: string;
}
```

## UI Components

### MosaicFeed

The main vertical-scroll container:

```tsx
interface MosaicFeedProps {
  source: 'discover' | 'following' | 'tag' | 'community' | 'user' | 'search';
  sourceId?: string;
  initialMosaicId?: string;
}

// Features:
// - Vertical snap-scroll (one mosaic per viewport)
// - Preload adjacent mosaics
// - Virtual scrolling for performance
// - Pull-to-refresh
// - Infinite scroll with pagination
```

### MosaicCard

Individual mosaic renderer:

```tsx
interface MosaicCardProps {
  mosaic: Mosaic;
  isActive: boolean;  // Currently in viewport
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onAuthorClick: () => void;
}

// Features:
// - Type-specific content rendering
// - Background/theme handling
// - Gesture handling (double-tap to like)
// - Auto-pause video when not active
```

### MosaicActionBar

Bottom action bar:

```
┌─────────────────────────────────────┐
│ [♥ 1.2k] [💬 84] [↗ Share] [⋯ More] │
└─────────────────────────────────────┘
```

### MosaicComments

Slide-up comment sheet:

```
┌─────────────────────────────────────┐
│ ━━━ (drag handle)                   │
│ Comments (84)                       │
├─────────────────────────────────────┤
│ @user1: Great post! 👏              │
│ @user2: How did you do this?        │
│   └─ @author: Thanks! I used...     │
├─────────────────────────────────────┤
│ [Add a comment...            ] [➤]  │
└─────────────────────────────────────┘
```

### MosaicCreator

Creation flow:

```
Step 1: Choose Type
┌─────────────────────────────────────┐
│ Create Mosaic                       │
├─────────────────────────────────────┤
│ [📝 Post] [🖼 Image] [🎬 Video]     │
│ [💻 Code] [📊 Poll]  [🎨 Collage]  │
│ [📖 Article] [🚀 Project] [📓 Cell]│
│ [🎵 Music] [📐 Diagram] [📚 Thread]│
└─────────────────────────────────────┘

Step 2: Add Content (type-specific)

Step 3: Style
┌─────────────────────────────────────┐
│ Background                          │
│ [Solid] [Gradient] [Image] [Video]  │
│ ┌─────────────────────────────────┐ │
│ │ Color picker / Image upload     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Theme: [Light] [Dark] [Auto]        │
│ Layout: [Center] [Top] [Fill]       │
└─────────────────────────────────────┘

Step 4: Publish
┌─────────────────────────────────────┐
│ Add tags: [react] [tutorial] [+]    │
│ Community: [Select...]              │
│ Link to: [Article ▾] [None]         │
│                                     │
│ [Save Draft] [Publish]              │
└─────────────────────────────────────┘
```

## Navigation & Routes

```
/mosaics                    # Discover feed (default)
/mosaics/following          # Following feed
/mosaics/tag/:tag           # Mosaics by tag
/mosaics/community/:slug    # Community mosaics
/mosaics/:id                # Single mosaic (shareable link)
/mosaics/create             # Creation flow
/mosaics/create/:type       # Direct to specific type
/@:username/mosaics         # User's mosaics
```

## Integration with Existing Features

### From Articles → Mosaics
- "Create Mosaic" button on articles
- Auto-generate preview mosaic from article metadata
- Share key quotes/code blocks as mosaics
- Thread mosaic summarizing article

### From Projects → Mosaics
- Project spotlight mosaics with live demos
- Progress update mosaics
- Feature highlight mosaics

### From Notebooks → Mosaics
- Share individual cells as mosaics
- Visualization output as image/video mosaic
- Code walkthrough as thread

### From Posts → Mosaics
- Upgrade post to mosaic (adds styling/background)
- Cross-post: mosaic creates linked post

### Mosaic Series
- Group related mosaics into a series
- "Part 1 of 5" indicator
- Swipe to continue series

## Desktop Experience

On larger screens, mosaics adapt:

### Option 1: Centered Card
```
┌────────────────────────────────────────────────┐
│                                                │
│    ┌──────────────────────┐                    │
│    │                      │    Comments        │
│    │      MOSAIC          │    ────────        │
│    │      CONTENT         │    @user: wow!     │
│    │                      │    @user2: nice    │
│    │                      │                    │
│    └──────────────────────┘    [Add comment]   │
│                                                │
│    ← Previous    [● ○ ○ ○]    Next →           │
└────────────────────────────────────────────────┘
```

### Option 2: Multi-Column Feed
```
┌─────────────────────────────────────────────────┐
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ Mosaic  │  │ Mosaic  │  │ Mosaic  │         │
│  │   1     │  │   2     │  │   3     │         │
│  └─────────┘  └─────────┘  └─────────┘         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ Mosaic  │  │ Mosaic  │  │ Mosaic  │         │
│  │   4     │  │   5     │  │   6     │         │
│  └─────────┘  └─────────┘  └─────────┘         │
└─────────────────────────────────────────────────┘
Click to expand into full-screen view
```

### Option 3: Side-by-Side Scroll
```
┌─────────────────────────────────────────────────┐
│  Feed Navigation    │     Active Mosaic         │
│  ─────────────────  │     ──────────────        │
│  ┌───────────────┐  │  ┌─────────────────────┐  │
│  │ Mosaic thumb  │◄─┼──│                     │  │
│  └───────────────┘  │  │    FULL SCREEN      │  │
│  ┌───────────────┐  │  │    MOSAIC VIEW      │  │
│  │ Mosaic thumb  │  │  │                     │  │
│  └───────────────┘  │  │                     │  │
│  ┌───────────────┐  │  └─────────────────────┘  │
│  │ Mosaic thumb  │  │                           │
│  └───────────────┘  │  [♥] [💬] [↗] [⋯]        │
└─────────────────────────────────────────────────┘
```

## Mobile Gestures

| Gesture | Action |
|---------|--------|
| Swipe Up | Next mosaic |
| Swipe Down | Previous mosaic |
| Swipe Left | (on gallery) Next image |
| Swipe Right | (on gallery) Previous image |
| Double Tap | Like |
| Long Press | Share menu |
| Tap (on video) | Play/Pause |
| Tap bottom | Show comments |
| Tap author | Go to profile |

## Algorithm / Feed Curation

### Discover Feed
1. Mix of trending + new + personalized
2. Boost mosaics from followed users
3. Boost mosaics in joined communities
4. Boost mosaics with tags user engages with
5. Diversity: don't show same author twice in 5 mosaics

### Following Feed
- Chronological from followed users
- Include community mosaics from joined communities

### Engagement Signals
- View duration (% of mosaic visible time)
- Like
- Comment
- Share
- Profile visit after viewing
- Follow after viewing
- Link click (to full article/project)

## MDX in Mosaics

Mosaics support a subset of MDX for rich text:

```mdx
# Headings (auto-sized to fit)

**Bold**, *italic*, `code`

- Lists
- Work too

> Blockquotes with style

[Links](https://example.com) open in modal or new tab

<Emoji name="rocket" size="xl" />

<Highlight color="yellow">Highlighted text</Highlight>

<Gradient from="purple" to="pink">Gradient text</Gradient>
```

### Mosaic-Specific Components

```mdx
<!-- Animated text reveal -->
<TypeWriter speed="fast">Hello world!</TypeWriter>

<!-- Countdown timer -->
<Countdown to="2026-02-01" />

<!-- Progress bar -->
<Progress value={75} label="Course Progress" />

<!-- Interactive rating -->
<Rating value={4} max={5} />

<!-- Swipeable cards within mosaic -->
<CardStack>
  <Card>First</Card>
  <Card>Second</Card>
  <Card>Third</Card>
</CardStack>
```

## Exclusive Mosaic Features

### 1. Live Mosaics
Real-time updating content:
- Live poll results
- Live viewer count
- Live reactions floating up

### 2. Duet/Stitch
Respond to another mosaic:
- Side-by-side (duet)
- Your content after theirs (stitch)

### 3. Mosaic Challenges
- Community challenges with hashtag
- Submission gallery
- Voting/winner selection

### 4. Audio Overlay
- Add music to any mosaic type
- Strudel-generated audio
- Sync text animations to beat

### 5. AR/Filter Effects (future)
- Face filters for video mosaics
- Background effects
- Text animations

### 6. Collaboration
- Multiple authors on a thread
- Each person adds pages
- Collaborative collages

## File Structure

```
src/
  components/
    mosaic/
      MosaicFeed.tsx           # Main feed container
      MosaicCard.tsx           # Individual mosaic renderer
      MosaicActionBar.tsx      # Like/comment/share bar
      MosaicComments.tsx       # Comment sheet
      MosaicCreator.tsx        # Creation flow
      MosaicTypeSelector.tsx   # Type selection grid
      MosaicStyleEditor.tsx    # Background/theme editor
      MosaicPreview.tsx        # Live preview while creating
      types/
        PostMosaic.tsx
        ImageMosaic.tsx
        GalleryMosaic.tsx
        VideoMosaic.tsx
        CodeMosaic.tsx
        QuoteMosaic.tsx
        PollMosaic.tsx
        CollageMosaic.tsx
        ArticlePreviewMosaic.tsx
        ProjectSpotlightMosaic.tsx
        NotebookCellMosaic.tsx
        MusicMosaic.tsx
        DiagramMosaic.tsx
        ThreadMosaic.tsx
      gestures/
        useSwipeNavigation.ts
        useDoubleTap.ts
        useLongPress.ts
      hooks/
        useMosaicFeed.ts
        useMosaicActions.ts
        useMosaicCreator.ts
  pages/
    MosaicsPage.tsx            # /mosaics routes
    MosaicDetailPage.tsx       # Single mosaic view
    MosaicCreatePage.tsx       # Creation page
  types/
    mosaic.ts                  # TypeScript types
```

## Implementation Phases

### Phase 1: Foundation
- [ ] Basic MosaicCard component
- [ ] MosaicFeed with vertical scroll
- [ ] Post, Image, Quote types
- [ ] Basic creation flow

### Phase 2: Rich Content
- [ ] Gallery, Video, Code types
- [ ] MDX rendering in mosaics
- [ ] Background/theme customization
- [ ] Article/Project linking

### Phase 3: Engagement
- [ ] Like/comment system
- [ ] Share functionality
- [ ] Poll type with voting
- [ ] View tracking

### Phase 4: Integration
- [ ] Create mosaic from article
- [ ] Create mosaic from notebook cell
- [ ] Project spotlight mosaics
- [ ] Strudel music mosaics

### Phase 5: Advanced
- [ ] Thread (multi-page) mosaics
- [ ] Collage editor
- [ ] Duet/Stitch
- [ ] Feed algorithm tuning
- [ ] Desktop layouts

## Performance Considerations

1. **Virtual Scrolling**: Only render visible mosaics + 1 above/below
2. **Image Optimization**: Serve different sizes for mobile/desktop
3. **Video Preloading**: Preload next video while viewing current
4. **Lazy MDX Compilation**: Compile MDX on-demand, cache result
5. **Pagination**: Load 10 mosaics at a time, infinite scroll

## Accessibility

- Screen reader support for all content types
- Keyboard navigation (arrow keys for feed)
- Reduced motion option (disable auto-play, animations)
- High contrast mode support
- Alt text required for images
- Captions for videos

---

## Summary

Mosaics bring a modern, mobile-first content experience to Rendered Useful while leveraging the platform's unique MDX capabilities. Users can create quick, visually engaging content that links to deeper articles/projects, or consume the feed as a standalone experience.

The feature bridges casual social content with technical depth - a code snippet mosaic can link to a full tutorial, a project spotlight can lead to a live demo, and a notebook cell can spark interest in data science.
