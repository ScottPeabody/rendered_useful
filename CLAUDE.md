# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint
npm run preview  # Preview production build
```

No test framework is configured.

## Architecture

This is a React + TypeScript + Vite site for articles and project showcases using MDX.

### Content System

Content uses a two-layer architecture:

1. **Metadata Registry** (`src/data/content.ts`): Static arrays of `authors`, `articles`, and `projects` with full metadata. Helper functions like `getArticle()`, `getArticlesByTag()`, `getFeaturedArticles()` provide lookups.

2. **MDX Loading** (`src/lib/mdx.ts`): Uses `import.meta.glob()` for lazy-loading MDX files from `/content/articles/*.mdx` and `/content/projects/*.mdx`. Functions `loadArticle(slug)` and `loadProject(slug)` return the component + frontmatter.

Listing pages read from the registry; detail pages load the MDX component dynamically.

### Routing

All page routes are lazy-loaded in `src/App.tsx` using `React.lazy()` with `<Suspense>`. Routes are wrapped in a `<Layout>` component providing Navbar/Footer.

### State Management

- **Zustand** (`src/store/index.ts`): `useSearchStore` for command palette (⌘K) state
- **React Context** (`src/context/ThemeContext.tsx`): Theme mode (dark/light/system) with localStorage persistence

### Styling

Uses Tailwind v4 with CSS custom properties in `src/index.css`. Theme variables: `--color-background`, `--color-surface`, `--color-accent-primary`, `--color-text-primary`, etc. Dark mode is default; light mode applies via `.light` class.

### MDX Components

Custom MDX components in `src/components/mdx/` are provided globally via `MDXProvider` in `main.tsx`. Available: `<Callout>`, `<TechStack>`, `<Image>`, `<Video>`, `<Audio>`, `<Todo>`, `<RubiksCube>`, `<TypingGame>`.

### Path Aliases

```typescript
'@'           → 'src/'
'@components' → 'src/components/'
'@content'    → 'content/'
```

### Key Dependencies

- React 19, React Router 7
- Framer Motion for animations
- Three.js + React Three Fiber for 3D (RubiksCube)
- KaTeX for LaTeX math rendering
- Highlight.js for syntax highlighting
- remark-gfm for GitHub Flavored Markdown
