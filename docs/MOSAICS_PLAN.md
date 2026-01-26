# Mosaics Implementation Plan

## Overview

This plan breaks down the Mosaics feature into implementable phases. Each phase builds on the previous and delivers working functionality.

**Note:** Database integration deferred. Building frontend-first with mock data, consistent with current app architecture.

---

## Phase 1: Foundation (Week 1-2)

### 1.1 TypeScript Types
- [x] Create `src/types/mosaic.ts`
  - `MosaicType` enum
  - `Mosaic` interface
  - `MosaicPage` interface
  - Content type interfaces (PostContent, ImageContent, etc.)
  - `MosaicBackground` type
  - `MosaicComment` interface

### 1.2 Mock Data
- [x] Create `src/data/mosaics.ts`
  - Sample mosaics of each type
  - Mock authors (link to existing profile structure)
  - Sample comments
  - Sample tags/communities

### 1.3 Basic Components
- [x] `MosaicCard.tsx` - renders single mosaic
  - Accept mosaic data prop
  - Render based on type
  - Handle background/theme
  - Show author info
- [x] `MosaicFeed.tsx` - vertical scroll container
  - Snap scroll behavior
  - Track active mosaic
  - Keyboard navigation (desktop)

### 1.4 Routes
- [x] Add routes to App.tsx
  - `/mosaics` - main feed
  - `/mosaics/:id` - single mosaic view
- [x] Create `MosaicsPage.tsx`
- [ ] Create `MosaicDetailPage.tsx`

### 1.5 Initial Mosaic Types
- [x] `PostMosaic.tsx` - text content
- [x] `ImageMosaic.tsx` - single image
- [x] `QuoteMosaic.tsx` - styled quote

### 1.6 Full-Screen Experience
- [x] Mosaics render outside main Layout (no header/footer)
- [x] Exit button to return to main site

**Deliverable:** Basic feed with post/image/quote mosaics, vertical scroll, using mock data ✅

---

## Phase 2: Content Types (Week 3-4)

### 2.1 Media Mosaics
- [x] `GalleryMosaic.tsx` - horizontal image carousel
  - [x] Dot indicators with active tracking
  - [x] Swipe/scroll navigation
  - [x] Navigation arrows (hover)
  - [x] Image counter
  - [ ] Preload adjacent images
- [x] `VideoMosaic.tsx` - video player
  - [x] Auto-play when active
  - [x] Pause when scrolled away
  - [x] Tap to play/pause
  - [x] Progress bar with seeking
  - [x] Mute toggle
  - [x] Auto-hide controls

### 2.2 Code Mosaics
- [x] `CodeMosaic.tsx` - syntax highlighted code
  - [x] Language detection
  - [x] Copy button with feedback
  - [ ] Optional "Run" button
  - [ ] Connect to existing runners (Python, JS, SQL)

### 2.3 MDX Support
- [ ] Add MDX compilation for mosaic content
- [ ] Create mosaic-specific MDX components
  - `<TypeWriter>` - animated text
  - `<Highlight>` - text highlight
  - `<Gradient>` - gradient text
- [ ] Handle MDX errors gracefully

### 2.4 Backgrounds
- [x] `MosaicBackground.tsx` component
  - Solid color
  - CSS gradient
  - Image (with blur/overlay options)
  - Video (looping, muted)
- [x] Theme support (light/dark/auto)

**Deliverable:** Gallery, video, code mosaics with custom backgrounds

---

## Phase 3: Engagement (Week 5-6)

### 3.1 Actions
- [x] `MosaicActionBar.tsx`
  - [x] Like button with count
  - [x] Comment button with count
  - [x] Share button
  - [ ] More menu (report, copy link, etc.)
- [x] Like state management in MosaicsPage
  - [x] Local state for likes
  - [x] Optimistic updates
  - Ready for backend later

### 3.2 Comments
- [x] `CommentsSheet.tsx` - slide-up sheet
  - [x] Comment list with nested replies
  - [x] Add comment form (local state)
  - [x] Reply to comment
  - [x] Like comments
  - [x] Mock data display
  - [x] Keyboard/click-outside to close

### 3.3 Gestures
- [x] `useDoubleTap.ts` - double tap to like
- [ ] `useLongPress.ts` - long press for share menu
- [x] `HeartAnimation` component on double-tap
- [x] `useHeartAnimation` hook for state management

### 3.4 Polls
- [x] `PollMosaic.tsx` (basic)
  - [x] Render options
  - [ ] Vote handling (local state)
  - [x] Results display (after voting)
  - [ ] Optional end time

**Deliverable:** Full engagement UI with likes, comments, polls (local state, ready for backend) ✅

---

## Phase 4: Creation (Week 7-8)

### 4.1 Creator Flow
- [x] `MosaicCreator.tsx` - main creation component (4-step wizard)
- [x] `MosaicTypeSelector.tsx` - type grid (8 types)
- [x] `MosaicStyleEditor.tsx` - background/theme picker
- [x] `MosaicPreview.tsx` - live preview

### 4.2 Type-Specific Editors
- [x] Post editor (font size, alignment)
- [x] Image editor (URL, alt, caption, fit)
- [ ] Gallery editor (multi-image) - placeholder
- [ ] Video upload - placeholder
- [x] Code editor (language, filename, highlight lines)
- [x] Quote editor (author, source, style)
- [x] Poll editor (question, options, multiple choice)

### 4.3 Publishing
- [ ] Tag selection (from existing tags)
- [ ] Community selection
- [ ] Link to article/project (optional)
- [ ] Export mosaic as JSON
- [ ] Add to mock data (dev mode)

### 4.4 Routes
- [x] `/mosaics/create` - creation page
- [ ] `/mosaics/create/:type` - direct to type
- [ ] `/mosaics/:id/edit` - edit existing
- [x] Floating + button on MosaicsPage

**Deliverable:** Full creation flow for basic mosaic types ✅

---

## Phase 5: Integration (Week 9-10)

### 5.1 Article Integration
- [ ] `ArticlePreviewMosaic.tsx`
  - Fetch article metadata
  - Show cover image
  - Excerpt text
  - "Read More" link
- [ ] "Create Mosaic" button on ArticlePage
- [ ] Share quote/code block as mosaic

### 5.2 Project Integration
- [ ] `ProjectSpotlightMosaic.tsx`
  - Project thumbnail/demo
  - Description
  - "View Project" link
- [ ] "Create Mosaic" on ProjectPage

### 5.3 Notebook Integration
- [ ] `NotebookCellMosaic.tsx`
  - Render cell output
  - Optional code display
  - Link to full notebook
- [ ] "Share Cell" button in NotebookPage

### 5.4 Music Integration
- [ ] `MusicMosaic.tsx`
  - Strudel code + visualizer
  - Play/pause
  - Link to create remix

**Deliverable:** Mosaics created from existing content

---

## Phase 6: Advanced Features (Week 11-12)

### 6.1 Threads
- [ ] `ThreadMosaic.tsx`
  - Horizontal page navigation
  - Page indicators
  - Page creation UI
- [ ] Multi-page editor

### 6.2 Collages
- [ ] `CollageMosaic.tsx`
  - Layout templates (2x2, 1+2, etc.)
  - Custom grid layout
  - Drag-and-drop editor

### 6.3 Diagrams
- [ ] `DiagramMosaic.tsx`
  - Mermaid rendering
  - Excalidraw rendering
  - Interactive zoom/pan

### 6.4 Feed Logic
- [ ] View tracking (local)
- [ ] Filter by tag/community
- [ ] "For You" vs "Following" feeds (mock)
- [ ] Sort options

**Deliverable:** All mosaic types, feed filtering

---

## Phase 7: Polish (Week 13-14)

### 7.1 Desktop Experience
- [ ] Responsive layout detection
- [ ] Centered card view
- [ ] Multi-column grid view
- [ ] Side-by-side scroll view
- [ ] Keyboard shortcuts

### 7.2 Performance
- [ ] Virtual scrolling for feed
- [ ] Image lazy loading
- [ ] Video preloading
- [ ] MDX compilation caching

### 7.3 Accessibility
- [ ] Screen reader support
- [ ] Keyboard navigation
- [ ] Reduced motion mode
- [ ] Focus management

### 7.4 Sharing
- [ ] Share sheet (native mobile)
- [ ] Copy link
- [ ] Open Graph meta tags
- [ ] Twitter/social cards

**Deliverable:** Production-ready feature

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        User Actions                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    React Components                          │
│  MosaicFeed → MosaicCard → [TypeMosaic] → MosaicActionBar   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Custom Hooks                            │
│  useMosaicFeed    useMosaicActions    useMosaicCreator      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Mock Data Layer                           │
│  src/data/mosaics.ts    (local state for interactions)      │
└─────────────────────────────────────────────────────────────┘
                              │
                      (Future: Database?)
```

---

## File Structure (Final)

```
src/
  components/
    mosaic/
      index.ts                    # Exports
      MosaicFeed.tsx              # Main feed
      MosaicCard.tsx              # Card wrapper
      MosaicActionBar.tsx         # Actions
      MosaicComments.tsx          # Comments sheet
      MosaicBackground.tsx        # Background renderer
      MosaicCreator/
        index.tsx                 # Main creator
        TypeSelector.tsx          # Type grid
        StyleEditor.tsx           # Background/theme
        Preview.tsx               # Live preview
        editors/
          PostEditor.tsx
          ImageEditor.tsx
          GalleryEditor.tsx
          VideoEditor.tsx
          CodeEditor.tsx
          QuoteEditor.tsx
          PollEditor.tsx
          CollageEditor.tsx
          ThreadEditor.tsx
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
  data/
    mosaics.ts                    # Mock mosaic data
  hooks/
    mosaic/
      useMosaicFeed.ts            # Feed data fetching
      useMosaicActions.ts         # Like/comment actions (local state)
      useMosaicCreator.ts         # Creation state
      useSwipeNavigation.ts       # Swipe gestures
      useDoubleTap.ts             # Double tap gesture
      useLongPress.ts             # Long press gesture
  pages/
    MosaicsPage.tsx               # /mosaics
    MosaicDetailPage.tsx          # /mosaics/:id
    MosaicCreatePage.tsx          # /mosaics/create
  types/
    mosaic.ts                     # TypeScript types
  lib/
    mosaic.ts                     # Helper functions
```

---

## Dependencies to Add

```json
{
  "dependencies": {
    "framer-motion": "^11.x",              // Animations
    "@use-gesture/react": "^10.x",         // Touch gestures
    "react-intersection-observer": "^9.x", // Viewport detection
    "vaul": "^0.9.x"                        // Drawer/sheet component
  }
}
```

---

## Future: Database Integration

When ready to add database:
1. Add mosaic tables to migration (schema in MOSAICS_SPEC.md)
2. Replace mock data imports with database queries
3. Connect hooks to real mutations
4. Add realtime subscriptions for comments

---

## Next Steps

1. **Create types** - `src/types/mosaic.ts`
2. **Create mock data** - `src/data/mosaics.ts`
3. **Build MosaicCard** - Basic rendering
4. **Build MosaicFeed** - Scroll container
5. **Add routes** - Wire up pages

Ready to start implementing?
