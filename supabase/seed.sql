-- Seed Data for Rendered Useful
-- Simple examples for local development

-- ============================================
-- TAXONOMY: Tags, Communities, Concepts, etc.
-- ============================================

-- Tags
INSERT INTO public.tags (slug, name, color) VALUES
  ('react', 'React', '#61dafb'),
  ('typescript', 'TypeScript', '#3178c6'),
  ('python', 'Python', '#3776ab'),
  ('rust', 'Rust', '#dea584'),
  ('gamedev', 'Game Dev', '#ef4444'),
  ('tutorial', 'Tutorial', '#22c55e'),
  ('data', 'Data', '#8b5cf6'),
  ('wasm', 'WebAssembly', '#654ff0');

-- Communities
INSERT INTO public.communities (slug, name, description, icon, color) VALUES
  ('general', 'General', 'General discussion and content', '💬', '#6b7280'),
  ('gamedev', 'Game Development', 'Building games of all kinds', '🎮', '#ef4444'),
  ('creative-coding', 'Creative Coding', 'Where code meets art', '🎨', '#f472b6'),
  ('learners', 'Learners', 'A supportive space for learning', '📚', '#10b981');

-- Series
INSERT INTO public.series (slug, title, description, status) VALUES
  ('getting-started', 'Getting Started', 'Introduction to the platform', 'ongoing'),
  ('game-tutorials', 'Game Tutorials', 'Step-by-step game development guides', 'ongoing');

-- Events
INSERT INTO public.events (slug, title, description, start_date, end_date) VALUES
  ('launch-week', 'Launch Week', 'Celebrating our public launch!', '2026-02-01', '2026-02-07');

-- Concepts
INSERT INTO public.concepts (slug, name, description, icon, color) VALUES
  ('state-management', 'State Management', 'Managing application state', '🔄', '#8b5cf6'),
  ('game-loops', 'Game Loops', 'The heartbeat of games', '🔁', '#22c55e'),
  ('data-visualization', 'Data Visualization', 'Making data visual', '📊', '#3b82f6');

-- Languages
INSERT INTO public.languages (slug, name, description, type, color) VALUES
  ('typescript', 'TypeScript', 'JavaScript with types', 'programming', '#3178c6'),
  ('python', 'Python', 'General purpose programming', 'programming', '#3776ab'),
  ('rust', 'Rust', 'Systems programming language', 'programming', '#dea584'),
  ('sql', 'SQL', 'Query language for databases', 'programming', '#336791'),
  ('english', 'English', 'Natural language', 'natural', '#6b7280');

-- Locations
INSERT INTO public.locations (slug, name, description, type) VALUES
  ('the-web', 'The Web', 'The world wide web', 'virtual'),
  ('github', 'GitHub', 'Code hosting platform', 'virtual');

-- ============================================
-- Create a test user (matches Supabase auth user)
-- In real usage, this is created by the auth trigger
-- ============================================

-- First create a fake auth user for testing
-- Note: In production, users are created via Supabase Auth
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'demo@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);

-- Create the public user profile
INSERT INTO public.users (id, slug, name, avatar_url, bio, role, is_core_maintainer) VALUES
  ('00000000-0000-0000-0000-000000000001', 'demo-user', 'Demo User', 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo', 'A demo user for testing', 'Developer', true);

-- User settings
INSERT INTO public.user_settings (user_id) VALUES
  ('00000000-0000-0000-0000-000000000001');

-- Default feed
INSERT INTO public.feeds (slug, name, author_id, ordering, visibility) VALUES
  ('main', 'Main Feed', '00000000-0000-0000-0000-000000000001', 'reverse-chronological', 'public');

-- Default space
INSERT INTO public.spaces (author_id, sections) VALUES
  ('00000000-0000-0000-0000-000000000001', ARRAY['feed', 'articles', 'projects', 'about']);

-- ============================================
-- CONTENT: Articles, Projects, Notebooks, Posts
-- ============================================

-- Articles
INSERT INTO public.articles (slug, title, description, content, author_id, reading_time, featured, draft, published_at) VALUES
  ('hello-world', 'Hello World', 'Welcome to the platform!', '# Hello World\n\nThis is your first article.', '00000000-0000-0000-0000-000000000001', 2, true, false, NOW()),
  ('getting-started-react', 'Getting Started with React', 'Learn React basics', '# React Basics\n\nReact is a JavaScript library for building user interfaces.', '00000000-0000-0000-0000-000000000001', 5, true, false, NOW()),
  ('intro-to-python', 'Introduction to Python', 'Python for beginners', '# Python\n\nPython is a versatile programming language.', '00000000-0000-0000-0000-000000000001', 4, false, false, NOW());

-- Article tags
INSERT INTO public.article_tags (article_id, tag_id)
SELECT a.id, t.id FROM public.articles a, public.tags t 
WHERE a.slug = 'getting-started-react' AND t.slug IN ('react', 'typescript', 'tutorial');

INSERT INTO public.article_tags (article_id, tag_id)
SELECT a.id, t.id FROM public.articles a, public.tags t 
WHERE a.slug = 'intro-to-python' AND t.slug IN ('python', 'tutorial');

-- Article communities
INSERT INTO public.article_communities (article_id, community_id)
SELECT a.id, c.id FROM public.articles a, public.communities c 
WHERE a.slug = 'getting-started-react' AND c.slug = 'learners';

-- Projects
INSERT INTO public.projects (slug, title, description, author_id, tech_stack, type, status, featured) VALUES
  ('my-first-game', 'My First Game', 'A simple browser game', '00000000-0000-0000-0000-000000000001', ARRAY['React', 'TypeScript'], 'game', 'completed', true),
  ('data-dashboard', 'Data Dashboard', 'Interactive data visualization', '00000000-0000-0000-0000-000000000001', ARRAY['React', 'D3.js', 'Python'], 'app', 'wip', false);

-- Project tags
INSERT INTO public.project_tags (project_id, tag_id)
SELECT p.id, t.id FROM public.projects p, public.tags t 
WHERE p.slug = 'my-first-game' AND t.slug IN ('react', 'typescript', 'gamedev');

INSERT INTO public.project_tags (project_id, tag_id)
SELECT p.id, t.id FROM public.projects p, public.tags t 
WHERE p.slug = 'data-dashboard' AND t.slug IN ('react', 'python', 'data');

-- Project communities
INSERT INTO public.project_communities (project_id, community_id)
SELECT p.id, c.id FROM public.projects p, public.communities c 
WHERE p.slug = 'my-first-game' AND c.slug = 'gamedev';

-- Notebooks
INSERT INTO public.notebooks (slug, title, description, author_id, kernel_language, featured, draft) VALUES
  ('python-basics', 'Python Basics', 'Learn Python fundamentals', '00000000-0000-0000-0000-000000000001', 'python', true, false),
  ('data-analysis-101', 'Data Analysis 101', 'Introduction to data analysis', '00000000-0000-0000-0000-000000000001', 'python', false, false);

-- Posts
INSERT INTO public.posts (slug, title, content, author_id, visibility, published_at) VALUES
  ('first-post', 'First Post', 'Hello! This is my first post on the platform. Excited to be here! 🎉', '00000000-0000-0000-0000-000000000001', 'public', NOW()),
  ('working-on-something', NULL, 'Working on something cool... stay tuned! 👀', '00000000-0000-0000-0000-000000000001', 'public', NOW() - interval '1 day'),
  ('draft-idea', 'Draft Idea', 'This is a draft post, not visible to others.', '00000000-0000-0000-0000-000000000001', 'draft', NULL);

-- Post feeds
INSERT INTO public.post_feeds (post_id, feed_id)
SELECT p.id, f.id FROM public.posts p, public.feeds f 
WHERE p.visibility = 'public' AND f.slug = 'main';

-- ============================================
-- SOCIAL: Bookmarks, Reactions, Comments
-- ============================================

-- Bookmark an article
INSERT INTO public.bookmarks (user_id, content_type, content_id, notes)
SELECT '00000000-0000-0000-0000-000000000001', 'article', id, 'Great intro!'
FROM public.articles WHERE slug = 'getting-started-react';

-- React to content
INSERT INTO public.reactions (user_id, content_type, content_id, reaction_type)
SELECT '00000000-0000-0000-0000-000000000001', 'article', id, 'like'
FROM public.articles WHERE slug = 'hello-world';

-- Comment on an article
INSERT INTO public.comments (content_type, content_id, author_id, body)
SELECT 'article', id, '00000000-0000-0000-0000-000000000001', 'Great article! Thanks for sharing.'
FROM public.articles WHERE slug = 'getting-started-react';

-- ============================================
-- CONCEPT RELATIONS
-- ============================================

INSERT INTO public.concept_relations (concept_id, related_concept_id, relation_type)
SELECT c1.id, c2.id, 'related'
FROM public.concepts c1, public.concepts c2
WHERE c1.slug = 'state-management' AND c2.slug = 'game-loops';
