# Supabase Specification for Rendered Useful

## Overview

This document outlines the database schema and features for the Rendered Useful platform backend.

## Current Application Features (from codebase analysis)

### Content Types
- **Articles** - Blog posts with MDX content, versioning, tags, series
- **Projects** - Portfolio items (games, apps, widgets, tools, libraries, integrations)
- **Notebooks** - JupyterLite interactive notebooks
- **Posts** - Lightweight content (between tweet and article)

### Organization/Taxonomy
- **Tags** - Flat tagging system
- **Communities** - Named groups with icon/color
- **Series** - Ordered collections of articles/projects
- **Events** - Time-bounded containers (game jams, hackathons)
- **Concepts** - Nodes in conceptual space (e.g., "state-management")
- **Languages** - Natural and programming languages
- **Locations** - Physical/virtual places

### User Features
- **Authors** - Creator profiles with social links
- **Spaces** - User's customizable page
- **Feeds** - Named collections of posts with ordering rules
- **Aliases** - Alternate identities under same account

### Interactive Components (client-side)
- PythonRunner (Pyodide)
- DuckDBRunner
- SQLiteRunner
- D3Runner
- RustRunner
- ExcalidrawEditor
- Games (Tetris, Rubik's Cube, DOS emulator)

## Database Schema

### Core Philosophy
1. **UUIDs for IDs** - Better for distributed systems
2. **Slugs for URLs** - Human-readable, SEO-friendly
3. **Timestamps everywhere** - created_at, updated_at for all tables
4. **Soft deletes** - deleted_at column instead of hard deletes
5. **Versioning** - version_group, version, version_note for versionable content

---

## Tables

### users
Extends Supabase auth.users with profile data.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | FK to auth.users |
| slug | text | Unique, URL-friendly |
| name | text | Display name |
| avatar_url | text | |
| bio | text | |
| role | text | |
| location | text | |
| website | text | |
| github | text | |
| twitter | text | |
| linkedin | text | |
| is_core_maintainer | boolean | Default false |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### articles

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| slug | text | Unique |
| title | text | |
| description | text | |
| content | text | MDX content or path |
| author_id | uuid | FK to users |
| cover_image | text | |
| reading_time | integer | Minutes |
| featured | boolean | |
| draft | boolean | |
| version | text | e.g., "1.0" |
| version_group | text | Groups versions together |
| version_note | text | What changed |
| related_project_id | uuid | FK to projects |
| series_id | uuid | FK to series |
| series_order | integer | |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| published_at | timestamptz | |
| deleted_at | timestamptz | Soft delete |

### projects

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| slug | text | Unique |
| title | text | |
| description | text | |
| content | text | MDX content or path |
| author_id | uuid | FK to users |
| cover_image | text | |
| demo_url | text | |
| github_url | text | |
| tech_stack | text[] | Array |
| type | text | game, app, widget, tool, library, integration, other |
| status | text | active, completed, archived, wip |
| featured | boolean | |
| version | text | |
| version_group | text | |
| version_note | text | |
| series_id | uuid | FK to series |
| series_order | integer | |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | |

### notebooks

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| slug | text | Unique |
| title | text | |
| description | text | |
| author_id | uuid | FK to users |
| kernel_language | text | python, javascript, r, julia |
| notebook_url | text | URL to .ipynb |
| featured | boolean | |
| draft | boolean | |
| version | text | |
| version_group | text | |
| version_note | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | |

### posts

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| slug | text | Unique |
| title | text | Optional |
| content | text | MDX content |
| author_id | uuid | FK to users |
| alias_id | uuid | FK to aliases (optional) |
| visibility | text | draft, public, unlisted |
| pinned | boolean | |
| manual_order | integer | For manual feed ordering |
| version | text | |
| version_group | text | |
| version_note | text | |
| series_id | uuid | FK to series |
| series_order | integer | |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| published_at | timestamptz | |
| deleted_at | timestamptz | |

### tags

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| slug | text | Unique |
| name | text | |
| color | text | Hex color |
| created_at | timestamptz | |

### communities

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| slug | text | Unique |
| name | text | |
| description | text | |
| icon | text | Emoji or icon name |
| color | text | Hex color |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### series

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| slug | text | Unique |
| title | text | |
| description | text | |
| status | text | ongoing, completed, paused |
| community_id | uuid | FK to communities |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### events

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| slug | text | Unique |
| title | text | |
| description | text | |
| cover_image | text | |
| start_date | timestamptz | |
| end_date | timestamptz | |
| metadata | jsonb | Flexible event data |
| version | text | |
| version_group | text | |
| version_note | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### concepts

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| slug | text | Unique |
| name | text | |
| description | text | |
| icon | text | |
| color | text | |
| metadata | jsonb | |
| version | text | |
| version_group | text | |
| version_note | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### languages

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| slug | text | Unique |
| name | text | |
| description | text | |
| type | text | natural, programming, markup, other |
| family | text | e.g., "C-family", "Romance" |
| icon | text | |
| color | text | |
| version | text | |
| version_group | text | |
| version_note | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### locations

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| slug | text | Unique |
| name | text | |
| description | text | |
| type | text | physical, virtual, hybrid |
| parent_id | uuid | FK to locations |
| coordinates | point | PostGIS point |
| timezone | text | |
| icon | text | |
| color | text | |
| version | text | |
| version_group | text | |
| version_note | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### feeds

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| slug | text | Unique per author |
| name | text | |
| description | text | |
| author_id | uuid | FK to users |
| alias_id | uuid | FK to aliases |
| ordering | text | chronological, reverse-chronological, manual, by-series |
| visibility | text | public, unlisted, private |
| icon | text | |
| color | text | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### aliases

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| slug | text | Unique |
| author_id | uuid | FK to users |
| display_name | text | |
| avatar_url | text | |
| bio | text | |
| linked_to_main | boolean | Public connection to main identity |
| visibility | text | public, unlisted |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### spaces

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| author_id | uuid | FK to users (unique) |
| alias_id | uuid | FK to aliases |
| theme | text | Theme slug |
| layout | text | Layout slug |
| bio | text | Space-specific bio |
| pinned_content | jsonb | Array of {type, slug} |
| sections | text[] | Ordered sections |
| default_feed_id | uuid | FK to feeds |
| created_at | timestamptz | |
| updated_at | timestamptz | |

---

## Junction Tables (Many-to-Many)

### article_tags
| Column | Type |
|--------|------|
| article_id | uuid |
| tag_id | uuid |

### article_communities
| Column | Type |
|--------|------|
| article_id | uuid |
| community_id | uuid |

### article_concepts
| Column | Type |
|--------|------|
| article_id | uuid |
| concept_id | uuid |

### article_languages
| Column | Type |
|--------|------|
| article_id | uuid |
| language_id | uuid |

### article_locations
| Column | Type |
|--------|------|
| article_id | uuid |
| location_id | uuid |

### project_tags
| Column | Type |
|--------|------|
| project_id | uuid |
| tag_id | uuid |

### project_communities
| Column | Type |
|--------|------|
| project_id | uuid |
| community_id | uuid |

### project_concepts
| Column | Type |
|--------|------|
| project_id | uuid |
| concept_id | uuid |

### project_languages
| Column | Type |
|--------|------|
| project_id | uuid |
| language_id | uuid |

### project_locations
| Column | Type |
|--------|------|
| project_id | uuid |
| location_id | uuid |

### notebook_tags
| Column | Type |
|--------|------|
| notebook_id | uuid |
| tag_id | uuid |

### notebook_communities
| Column | Type |
|--------|------|
| notebook_id | uuid |
| community_id | uuid |

### notebook_concepts
| Column | Type |
|--------|------|
| notebook_id | uuid |
| concept_id | uuid |

### notebook_languages
| Column | Type |
|--------|------|
| notebook_id | uuid |
| language_id | uuid |

### post_tags
| Column | Type |
|--------|------|
| post_id | uuid |
| tag_id | uuid |

### post_concepts
| Column | Type |
|--------|------|
| post_id | uuid |
| concept_id | uuid |

### post_feeds
| Column | Type |
|--------|------|
| post_id | uuid |
| feed_id | uuid |

### event_communities
| Column | Type |
|--------|------|
| event_id | uuid |
| community_id | uuid |

### event_tags
| Column | Type |
|--------|------|
| event_id | uuid |
| tag_id | uuid |

### series_tags
| Column | Type |
|--------|------|
| series_id | uuid |
| tag_id | uuid |

### concept_relations
| Column | Type | Notes |
|--------|------|-------|
| concept_id | uuid | |
| related_concept_id | uuid | |
| relation_type | text | related, prerequisite |

### space_feeds
| Column | Type |
|--------|------|
| space_id | uuid |
| feed_id | uuid |
| order | integer |

---

## Future Tables (User Features)

### bookmarks
User-saved content for later.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK to users |
| content_type | text | article, project, notebook, post |
| content_id | uuid | |
| notes | text | User's private notes |
| created_at | timestamptz | |

### reading_progress
Track user progress in articles/series.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK to users |
| content_type | text | |
| content_id | uuid | |
| progress | integer | Percentage or scroll position |
| completed | boolean | |
| updated_at | timestamptz | |

### comments
Discussion on content.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| content_type | text | article, project, notebook, post |
| content_id | uuid | |
| author_id | uuid | FK to users |
| parent_id | uuid | FK to comments (for threading) |
| body | text | Markdown |
| created_at | timestamptz | |
| updated_at | timestamptz | |
| deleted_at | timestamptz | |

### reactions
Lightweight feedback on content.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK to users |
| content_type | text | article, project, notebook, post, comment |
| content_id | uuid | |
| reaction_type | text | like, bookmark, clap, etc. |
| created_at | timestamptz | |

### follows
User following relationships.

| Column | Type | Notes |
|--------|------|-------|
| follower_id | uuid | FK to users |
| following_id | uuid | FK to users |
| created_at | timestamptz | |

### user_settings

| Column | Type | Notes |
|--------|------|-------|
| user_id | uuid | FK to users, PK |
| show_activity | boolean | |
| show_connections | boolean | |
| show_reading_list | boolean | |
| default_post_visibility | text | |
| muted_users | uuid[] | |
| blocked_users | uuid[] | |
| filtered_tags | uuid[] | |
| filtered_concepts | uuid[] | |
| updated_at | timestamptz | |

---

## Row Level Security (RLS) Policies

### Public Read
- articles, projects, notebooks: WHERE draft = false AND deleted_at IS NULL
- posts: WHERE visibility = 'public' AND deleted_at IS NULL
- tags, communities, series, events, concepts, languages, locations: All public read

### Authenticated Write
- Users can only edit their own content (author_id = auth.uid())
- Users can only manage their own bookmarks, settings, etc.

### Admin Override
- Core maintainers can edit any content

---

## Indexes

```sql
-- Slugs (unique lookups)
CREATE UNIQUE INDEX idx_users_slug ON users(slug);
CREATE UNIQUE INDEX idx_articles_slug ON articles(slug);
CREATE UNIQUE INDEX idx_projects_slug ON projects(slug);
-- etc.

-- Foreign keys
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_series ON articles(series_id);
-- etc.

-- Filtering
CREATE INDEX idx_articles_featured ON articles(featured) WHERE featured = true;
CREATE INDEX idx_articles_published ON articles(published_at) WHERE draft = false;

-- Full-text search
CREATE INDEX idx_articles_search ON articles USING gin(to_tsvector('english', title || ' ' || description));
```

---

## Views

### content_feed
Unified view of all content types for feeds.

```sql
CREATE VIEW content_feed AS
SELECT 
  'article' as type, id, slug, title, description, author_id, created_at, published_at
FROM articles WHERE draft = false AND deleted_at IS NULL
UNION ALL
SELECT 
  'project' as type, id, slug, title, description, author_id, created_at, created_at as published_at
FROM projects WHERE deleted_at IS NULL
UNION ALL
SELECT 
  'post' as type, id, slug, title, content as description, author_id, created_at, published_at
FROM posts WHERE visibility = 'public' AND deleted_at IS NULL
ORDER BY published_at DESC;
```

---

## Storage Buckets

- **avatars** - User profile images (public)
- **covers** - Article/project cover images (public)
- **uploads** - User-uploaded media in content (public)
- **notebooks** - .ipynb files (public)
- **excalidraw** - Saved drawings (public or private per user)

---

## Edge Functions (Future)

- **og-image** - Generate Open Graph images for content
- **send-notification** - Email/push for follows, comments
- **import-notebook** - Import .ipynb from URL
- **export-content** - Export user's content as MDX/JSON

