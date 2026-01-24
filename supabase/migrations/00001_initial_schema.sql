-- Supabase Schema for Rendered Useful
-- Run this after `supabase init` and `supabase start`

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- CORE TABLES
-- ============================================

-- Users (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  role TEXT,
  location TEXT,
  website TEXT,
  github TEXT,
  twitter TEXT,
  linkedin TEXT,
  is_core_maintainer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communities
CREATE TABLE public.communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Series
CREATE TABLE public.series (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('ongoing', 'completed', 'paused')) DEFAULT 'ongoing',
  community_id UUID REFERENCES public.communities(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  metadata JSONB DEFAULT '{}',
  version TEXT,
  version_group TEXT,
  version_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Concepts (conceptual space)
CREATE TABLE public.concepts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  metadata JSONB DEFAULT '{}',
  version TEXT,
  version_group TEXT,
  version_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Languages (linguistic space)
CREATE TABLE public.languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('natural', 'programming', 'markup', 'other')) NOT NULL,
  family TEXT,
  icon TEXT,
  color TEXT,
  version TEXT,
  version_group TEXT,
  version_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations (physical/virtual space)
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('physical', 'virtual', 'hybrid')) NOT NULL,
  parent_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  coordinates GEOGRAPHY(POINT, 4326),
  timezone TEXT,
  icon TEXT,
  color TEXT,
  version TEXT,
  version_group TEXT,
  version_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONTENT TABLES
-- ============================================

-- Articles
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  cover_image TEXT,
  reading_time INTEGER,
  featured BOOLEAN DEFAULT FALSE,
  draft BOOLEAN DEFAULT TRUE,
  version TEXT,
  version_group TEXT,
  version_note TEXT,
  related_project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  series_id UUID REFERENCES public.series(id) ON DELETE SET NULL,
  series_order INTEGER,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

-- Projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  cover_image TEXT,
  demo_url TEXT,
  github_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  type TEXT CHECK (type IN ('game', 'app', 'widget', 'tool', 'library', 'integration', 'other')) DEFAULT 'other',
  status TEXT CHECK (status IN ('active', 'completed', 'archived', 'wip')) DEFAULT 'wip',
  featured BOOLEAN DEFAULT FALSE,
  version TEXT,
  version_group TEXT,
  version_note TEXT,
  series_id UUID REFERENCES public.series(id) ON DELETE SET NULL,
  series_order INTEGER,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Add FK from articles to projects (after projects table exists)
ALTER TABLE public.articles 
  ADD CONSTRAINT fk_articles_related_project 
  FOREIGN KEY (related_project_id) REFERENCES public.projects(id) ON DELETE SET NULL;

-- Notebooks
CREATE TABLE public.notebooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  kernel_language TEXT CHECK (kernel_language IN ('python', 'javascript', 'r', 'julia')) DEFAULT 'python',
  notebook_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  draft BOOLEAN DEFAULT TRUE,
  version TEXT,
  version_group TEXT,
  version_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Aliases
CREATE TABLE public.aliases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  linked_to_main BOOLEAN DEFAULT FALSE,
  visibility TEXT CHECK (visibility IN ('public', 'unlisted')) DEFAULT 'public',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feeds
CREATE TABLE public.feeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  alias_id UUID REFERENCES public.aliases(id) ON DELETE SET NULL,
  ordering TEXT CHECK (ordering IN ('chronological', 'reverse-chronological', 'manual', 'by-series')) DEFAULT 'reverse-chronological',
  visibility TEXT CHECK (visibility IN ('public', 'unlisted', 'private')) DEFAULT 'public',
  icon TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(author_id, slug)
);

-- Posts
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  alias_id UUID REFERENCES public.aliases(id) ON DELETE SET NULL,
  visibility TEXT CHECK (visibility IN ('draft', 'public', 'unlisted')) DEFAULT 'draft',
  pinned BOOLEAN DEFAULT FALSE,
  manual_order INTEGER,
  version TEXT,
  version_group TEXT,
  version_note TEXT,
  series_id UUID REFERENCES public.series(id) ON DELETE SET NULL,
  series_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

-- Spaces
CREATE TABLE public.spaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  alias_id UUID REFERENCES public.aliases(id) ON DELETE SET NULL,
  theme TEXT,
  layout TEXT,
  bio TEXT,
  pinned_content JSONB DEFAULT '[]',
  sections TEXT[] DEFAULT ARRAY['feed', 'articles', 'projects', 'about'],
  default_feed_id UUID REFERENCES public.feeds(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- JUNCTION TABLES
-- ============================================

-- Article relations
CREATE TABLE public.article_tags (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE public.article_communities (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, community_id)
);

CREATE TABLE public.article_concepts (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, concept_id)
);

CREATE TABLE public.article_languages (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  language_id UUID NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, language_id)
);

CREATE TABLE public.article_locations (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, location_id)
);

-- Project relations
CREATE TABLE public.project_tags (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tag_id)
);

CREATE TABLE public.project_communities (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, community_id)
);

CREATE TABLE public.project_concepts (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, concept_id)
);

CREATE TABLE public.project_languages (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  language_id UUID NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, language_id)
);

CREATE TABLE public.project_locations (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, location_id)
);

-- Notebook relations
CREATE TABLE public.notebook_tags (
  notebook_id UUID NOT NULL REFERENCES public.notebooks(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (notebook_id, tag_id)
);

CREATE TABLE public.notebook_communities (
  notebook_id UUID NOT NULL REFERENCES public.notebooks(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  PRIMARY KEY (notebook_id, community_id)
);

CREATE TABLE public.notebook_concepts (
  notebook_id UUID NOT NULL REFERENCES public.notebooks(id) ON DELETE CASCADE,
  concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
  PRIMARY KEY (notebook_id, concept_id)
);

CREATE TABLE public.notebook_languages (
  notebook_id UUID NOT NULL REFERENCES public.notebooks(id) ON DELETE CASCADE,
  language_id UUID NOT NULL REFERENCES public.languages(id) ON DELETE CASCADE,
  PRIMARY KEY (notebook_id, language_id)
);

-- Post relations
CREATE TABLE public.post_tags (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE public.post_concepts (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, concept_id)
);

CREATE TABLE public.post_feeds (
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  feed_id UUID NOT NULL REFERENCES public.feeds(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, feed_id)
);

-- Event relations
CREATE TABLE public.event_communities (
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, community_id)
);

CREATE TABLE public.event_tags (
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (event_id, tag_id)
);

-- Series relations
CREATE TABLE public.series_tags (
  series_id UUID NOT NULL REFERENCES public.series(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (series_id, tag_id)
);

-- Concept relations (self-referential)
CREATE TABLE public.concept_relations (
  concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
  related_concept_id UUID NOT NULL REFERENCES public.concepts(id) ON DELETE CASCADE,
  relation_type TEXT CHECK (relation_type IN ('related', 'prerequisite')) DEFAULT 'related',
  PRIMARY KEY (concept_id, related_concept_id)
);

-- Space feeds
CREATE TABLE public.space_feeds (
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  feed_id UUID NOT NULL REFERENCES public.feeds(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  PRIMARY KEY (space_id, feed_id)
);

-- ============================================
-- USER FEATURE TABLES
-- ============================================

-- Bookmarks
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content_type TEXT CHECK (content_type IN ('article', 'project', 'notebook', 'post')) NOT NULL,
  content_id UUID NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_id)
);

-- Reading progress
CREATE TABLE public.reading_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content_type TEXT CHECK (content_type IN ('article', 'project', 'notebook', 'series')) NOT NULL,
  content_id UUID NOT NULL,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_id)
);

-- Comments
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type TEXT CHECK (content_type IN ('article', 'project', 'notebook', 'post')) NOT NULL,
  content_id UUID NOT NULL,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Reactions
CREATE TABLE public.reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content_type TEXT CHECK (content_type IN ('article', 'project', 'notebook', 'post', 'comment')) NOT NULL,
  content_id UUID NOT NULL,
  reaction_type TEXT CHECK (reaction_type IN ('like', 'love', 'clap', 'insightful', 'helpful')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_id, reaction_type)
);

-- Follows
CREATE TABLE public.follows (
  follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- User settings
CREATE TABLE public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  show_activity BOOLEAN DEFAULT TRUE,
  show_connections BOOLEAN DEFAULT TRUE,
  show_reading_list BOOLEAN DEFAULT FALSE,
  default_post_visibility TEXT CHECK (default_post_visibility IN ('draft', 'public', 'unlisted')) DEFAULT 'draft',
  muted_users UUID[] DEFAULT '{}',
  blocked_users UUID[] DEFAULT '{}',
  filtered_tags UUID[] DEFAULT '{}',
  filtered_concepts UUID[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Slug indexes (for URL lookups)
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_projects_slug ON public.projects(slug);
CREATE INDEX idx_notebooks_slug ON public.notebooks(slug);
CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_tags_slug ON public.tags(slug);
CREATE INDEX idx_communities_slug ON public.communities(slug);
CREATE INDEX idx_series_slug ON public.series(slug);
CREATE INDEX idx_events_slug ON public.events(slug);
CREATE INDEX idx_concepts_slug ON public.concepts(slug);
CREATE INDEX idx_languages_slug ON public.languages(slug);
CREATE INDEX idx_locations_slug ON public.locations(slug);

-- Author indexes
CREATE INDEX idx_articles_author ON public.articles(author_id);
CREATE INDEX idx_projects_author ON public.projects(author_id);
CREATE INDEX idx_notebooks_author ON public.notebooks(author_id);
CREATE INDEX idx_posts_author ON public.posts(author_id);

-- Featured/published indexes
CREATE INDEX idx_articles_featured ON public.articles(featured) WHERE featured = TRUE;
CREATE INDEX idx_articles_published ON public.articles(published_at) WHERE draft = FALSE AND deleted_at IS NULL;
CREATE INDEX idx_projects_featured ON public.projects(featured) WHERE featured = TRUE;

-- Full-text search
CREATE INDEX idx_articles_fts ON public.articles 
  USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));
CREATE INDEX idx_projects_fts ON public.projects 
  USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));

-- Comments indexes
CREATE INDEX idx_comments_content ON public.comments(content_type, content_id);
CREATE INDEX idx_comments_author ON public.comments(author_id);

-- ============================================
-- VIEWS
-- ============================================

-- Unified content feed
CREATE VIEW public.content_feed AS
SELECT 
  'article' as content_type,
  id,
  slug,
  title,
  description,
  author_id,
  created_at,
  published_at,
  featured
FROM public.articles 
WHERE draft = FALSE AND deleted_at IS NULL
UNION ALL
SELECT 
  'project' as content_type,
  id,
  slug,
  title,
  description,
  author_id,
  created_at,
  created_at as published_at,
  featured
FROM public.projects 
WHERE deleted_at IS NULL
UNION ALL
SELECT 
  'notebook' as content_type,
  id,
  slug,
  title,
  description,
  author_id,
  created_at,
  created_at as published_at,
  featured
FROM public.notebooks 
WHERE draft = FALSE AND deleted_at IS NULL
UNION ALL
SELECT 
  'post' as content_type,
  id,
  slug,
  title,
  LEFT(content, 200) as description,
  author_id,
  created_at,
  published_at,
  pinned as featured
FROM public.posts 
WHERE visibility = 'public' AND deleted_at IS NULL;

-- Tag counts
CREATE VIEW public.tag_counts AS
SELECT 
  t.id,
  t.slug,
  t.name,
  t.color,
  (
    SELECT COUNT(*) FROM public.article_tags WHERE tag_id = t.id
  ) + (
    SELECT COUNT(*) FROM public.project_tags WHERE tag_id = t.id
  ) + (
    SELECT COUNT(*) FROM public.notebook_tags WHERE tag_id = t.id
  ) + (
    SELECT COUNT(*) FROM public.post_tags WHERE tag_id = t.id
  ) as count
FROM public.tags t;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with updated_at column
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.notebooks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.communities
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.series
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.concepts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.languages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.locations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.aliases
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.feeds
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.spaces
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, slug, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Create default user settings
  INSERT INTO public.user_settings (user_id) VALUES (NEW.id);
  
  -- Create default space
  INSERT INTO public.spaces (author_id) VALUES (NEW.id);
  
  -- Create default feed
  INSERT INTO public.feeds (slug, name, author_id)
  VALUES ('main', 'Main Feed', NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;

-- Users: public read, own write
CREATE POLICY "Users are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Articles: public read (published), own write
CREATE POLICY "Published articles are viewable" ON public.articles 
  FOR SELECT USING (draft = FALSE AND deleted_at IS NULL);
CREATE POLICY "Own articles are viewable" ON public.articles 
  FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Authors can insert articles" ON public.articles 
  FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own articles" ON public.articles 
  FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own articles" ON public.articles 
  FOR DELETE USING (auth.uid() = author_id);

-- Projects: public read, own write
CREATE POLICY "Projects are viewable" ON public.projects 
  FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Authors can insert projects" ON public.projects 
  FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own projects" ON public.projects 
  FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Authors can delete own projects" ON public.projects 
  FOR DELETE USING (auth.uid() = author_id);

-- Notebooks: public read (published), own write
CREATE POLICY "Published notebooks are viewable" ON public.notebooks 
  FOR SELECT USING (draft = FALSE AND deleted_at IS NULL);
CREATE POLICY "Own notebooks are viewable" ON public.notebooks 
  FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Authors can insert notebooks" ON public.notebooks 
  FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own notebooks" ON public.notebooks 
  FOR UPDATE USING (auth.uid() = author_id);

-- Posts: visibility-based read, own write
CREATE POLICY "Public posts are viewable" ON public.posts 
  FOR SELECT USING (visibility = 'public' AND deleted_at IS NULL);
CREATE POLICY "Own posts are viewable" ON public.posts 
  FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Authors can insert posts" ON public.posts 
  FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own posts" ON public.posts 
  FOR UPDATE USING (auth.uid() = author_id);

-- Comments: public read, own write
CREATE POLICY "Comments are viewable" ON public.comments 
  FOR SELECT USING (deleted_at IS NULL);
CREATE POLICY "Users can insert comments" ON public.comments 
  FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors can update own comments" ON public.comments 
  FOR UPDATE USING (auth.uid() = author_id);

-- Bookmarks: own only
CREATE POLICY "Users can view own bookmarks" ON public.bookmarks 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON public.bookmarks 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks 
  FOR DELETE USING (auth.uid() = user_id);

-- Reading progress: own only
CREATE POLICY "Users can view own progress" ON public.reading_progress 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.reading_progress 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.reading_progress 
  FOR UPDATE USING (auth.uid() = user_id);

-- Reactions: public read, own write
CREATE POLICY "Reactions are viewable" ON public.reactions FOR SELECT USING (true);
CREATE POLICY "Users can insert own reactions" ON public.reactions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own reactions" ON public.reactions 
  FOR DELETE USING (auth.uid() = user_id);

-- Follows: public read, own write
CREATE POLICY "Follows are viewable" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can follow" ON public.follows 
  FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON public.follows 
  FOR DELETE USING (auth.uid() = follower_id);

-- User settings: own only
CREATE POLICY "Users can view own settings" ON public.user_settings 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON public.user_settings 
  FOR UPDATE USING (auth.uid() = user_id);

-- Aliases: public read, own write
CREATE POLICY "Public aliases are viewable" ON public.aliases 
  FOR SELECT USING (visibility = 'public');
CREATE POLICY "Own aliases are viewable" ON public.aliases 
  FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Users can insert own aliases" ON public.aliases 
  FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own aliases" ON public.aliases 
  FOR UPDATE USING (auth.uid() = author_id);

-- Feeds: visibility-based read, own write
CREATE POLICY "Public feeds are viewable" ON public.feeds 
  FOR SELECT USING (visibility IN ('public', 'unlisted'));
CREATE POLICY "Own feeds are viewable" ON public.feeds 
  FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Users can insert own feeds" ON public.feeds 
  FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own feeds" ON public.feeds 
  FOR UPDATE USING (auth.uid() = author_id);

-- Spaces: public read, own write
CREATE POLICY "Spaces are viewable" ON public.spaces FOR SELECT USING (true);
CREATE POLICY "Users can update own space" ON public.spaces 
  FOR UPDATE USING (auth.uid() = author_id);

-- Taxonomy tables: public read
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tags are viewable" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Communities are viewable" ON public.communities FOR SELECT USING (true);
CREATE POLICY "Series are viewable" ON public.series FOR SELECT USING (true);
CREATE POLICY "Events are viewable" ON public.events FOR SELECT USING (true);
CREATE POLICY "Concepts are viewable" ON public.concepts FOR SELECT USING (true);
CREATE POLICY "Languages are viewable" ON public.languages FOR SELECT USING (true);
CREATE POLICY "Locations are viewable" ON public.locations FOR SELECT USING (true);

-- Admin policies (for core maintainers)
CREATE POLICY "Admins can manage tags" ON public.tags FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_core_maintainer = TRUE));
CREATE POLICY "Admins can manage communities" ON public.communities FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_core_maintainer = TRUE));
CREATE POLICY "Admins can manage series" ON public.series FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_core_maintainer = TRUE));
CREATE POLICY "Admins can manage events" ON public.events FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_core_maintainer = TRUE));
CREATE POLICY "Admins can manage concepts" ON public.concepts FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_core_maintainer = TRUE));
CREATE POLICY "Admins can manage languages" ON public.languages FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_core_maintainer = TRUE));
CREATE POLICY "Admins can manage locations" ON public.locations FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_core_maintainer = TRUE));
