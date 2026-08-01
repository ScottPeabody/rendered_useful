# rendered_useful — Site Overview & Ethos

> Snapshot of the site as it stands today (July 2026), written as a baseline reference
> before the structural overhaul. Covers what exists, what's real vs. speculative,
> the current design direction, and the tensions the overhaul needs to resolve.

---

## 1. Ethos

### Stated (README / marketing copy)
A collaborative article and project showcase platform. Developers share projects,
write articles, and build together. Multi-author, GitHub-based, PR-driven.

### Actual identity (what the code rewards)
A **developer publication with a lab attached**:

- Content is **files in git** (`content/*.mdx`, `.ipynb`) — publishing is a pull request.
- The distinctive value is **executable content**: articles can embed live Python,
  Rust, SQL, shaders, p5, three.js, music, diagrams — not just prose.
- Community features (profiles, feeds, engagement) are aspirational, not real.

### Design direction (post-restyle, July 2026)
"Editorial dev journal" — deliberately *not* the AI-default look:

- Warm ink dark mode / warm paper light mode (no purple-tinted neutrals)
- Single **ember** accent (`#d9764a` dark / `#b5502a` light) — no gradient trio
- Type: **Newsreader** (serif display) + **Inter** (body) + **JetBrains Mono** (meta/labels/wordmark)
- Flat surfaces, hairline borders, tight radii, quiet hovers — no glassmorphism,
  glows, blobs, or lift-and-scale effects
- Wordmark: monospace `rendered_useful` with only the underscore in accent color

### Removed features (in git history if ever needed)
- **Mosaics** (`ef5a731`, 2026-01-26) — TikTok-style full-screen swipe feed with
  hearts/comments/polls. ~5,600 lines. Removed because social-app engagement
  mechanics fought the git/PR publication identity.

---

## 2. Site Map

### Routes — real content behind them

| Route | Page | Notes |
|---|---|---|
| `/` | HomePage | Hero, article/project/notebook streams, contributors, CTA |
| `/articles`, `/articles/:slug` | ArticlesPage / ArticlePage | **21 articles** (MDX) |
| `/projects`, `/projects/:slug` | ProjectsPage / ProjectPage | **12 projects** (MDX) |
| `/notebooks`, `/notebooks/:slug` | NotebooksPage / NotebookPage | **3 notebooks** (JupyterLite) |
| `/lab` | JupyterLabPage | Full in-browser JupyterLab |
| `/tag/:tag` | TagPage | Unified tags across content types |
| `/contributors` | ContributorsPage | Author roster |
| `/author/:slug` | AuthorPage | Per-author content |
| `/about` | AboutPage | |
| `/contribute` | ContributePage | Explains the PR workflow |

### Routes — speculative / demo-data only

All backed by hand-written arrays in `src/data/content.ts` (~2,260 lines), **not**
by real content files:

| Route | Page | What it pretends to be |
|---|---|---|
| `/concepts`, `/concepts/:slug` | ConceptsPage | "Conceptual space" nodes w/ versioned eras |
| `/languages`, `/languages/:slug` | LanguagesPage | Linguistic navigation dimension |
| `/locations`, `/locations/:slug` | LocationsPage | Physical/virtual places dimension |
| `/communities`, `/community/:slug` | CommunitiesPage / CommunityPage | Interest groups |
| `/events`, `/events/:slug` | EventsPage | Upcoming/past events |
| `/series`, `/series/:slug` | SeriesPage | Multi-part collections (could be real via frontmatter) |
| `/:username` | SpacePage | Personal user spaces |
| `/:username/posts/:slug` | PostPage | Lightweight posts (tweet-to-article scale) |
| `/:username/feeds/:feedSlug` | FeedPage | Per-user feeds |
| `/edit`, `/edit/:slug` | EditPage | In-browser MDX editor (competes with PR flow) |

### Navigation structure

- **Navbar (primary):** Home · Projects · Articles · Notebooks
- **Navbar "Explore" dropdown:** Series · Events · Communities · Concepts · Languages · Locations
- **Navbar (more):** Contributors · About
- **Navbar actions:** Search (⌘K command palette) · GitHub · theme toggle
- **Footer:** Explore (Projects, Articles, Contributors, Tags) · Resources (About, Uses, Contribute, RSS)
- Navbar supports per-page styles via layout context: `default` / `transparent` / `minimal`

---

## 3. Content Model

### Real content (source of truth: files)
```
content/
├── articles/     # 21 × MDX with frontmatter (title, description, tags, author, date,
│                 #   optional: series, theme, layout, coverImage, featured)
├── projects/     # 12 × MDX (adds: type, techStack, demoUrl, githubUrl)
└── notebooks/    # 3 × Jupyter notebooks
```

### Data layer (`src/data/content.ts`, `src/types/index.ts`)
- Real content is registered/wrapped here alongside **hardcoded demo data** for:
  concepts, languages, locations, events, series, communities, feeds, posts, spaces.
- Types file (~416 lines) defines the full speculative taxonomy incl. versioning
  (`VersionInfo` / `Versionable` for "eras" of a concept).
- **Key overhaul question:** everything user-visible should be *derivable* from
  `content/` + a contributors file; nothing hand-authored in TS.

### Backend (`supabase/`)
- Config, migrations, seed, and a SPEC for a full platform backend (profiles,
  posts, engagement). **Essentially unused by the running site** — the app is a
  static Vite SPA deployed to GitHub Pages (SPA-redirect shim in `index.html`).

---

## 4. The Lab — interactive/executable content (the differentiator)

MDX components available inside any article/project (`src/components/mdx/`):

| Category | Components |
|---|---|
| Code execution | `CodePlayground` (JS/HTML/CSS/C++ via CodeMirror), `PythonRunner` (Pyodide), `RustRunner`, `SQLiteRunner`, `DuckDBRunner` |
| Notebooks | `JupyterLiteEmbed`, `PyodideNotebook`, full `/lab` JupyterLab |
| Visuals | `NivoChart` (20+ chart types), `D3Runner`, `Mermaid`, `ExcalidrawEditor` |
| Creative coding | `P5Runner` (p5.js), `ThreeRunner` (three.js), `ShaderCanvas` / `ShaderPlayground` (GLSL) |
| Media | `Audio`, `Video`, `Image`, `Strudel` (live-coded music) |
| Prose | `Callout`, `TechStack`, `Todo`, KaTeX math, syntax highlighting |
| Meta | `ThemeSelector`, `LayoutSelector` (per-article theme/layout overrides) |
| Games (embeddable) | `Tetris`, `TypingGame`, `RubiksCube`, `DosRunner` |

Editor tooling also exists (`src/components/editor/`): MDXEditor wrapper, live
preview, diff viewer — used by the in-browser `/edit` page.

---

## 5. Design System (current tokens)

Defined in `src/index.css` via Tailwind v4 `@theme`; consumed as
`var(--color-*)` throughout. Dark is default (`<html class="dark">`).

| Token | Dark | Light |
|---|---|---|
| `--color-background` | `#131312` | `#f6f3ec` |
| `--color-surface` | `#1a1a18` | `#fbf9f4` |
| `--color-surface-elevated` | `#232320` | `#efebe2` |
| `--color-border` / `-subtle` | `#2e2d29` / `#252420` | `#ddd7ca` / `#e7e2d6` |
| `--color-text-primary` | `#ebe8e1` | `#211f1a` |
| `--color-text-secondary` | `#a8a49a` | `#55524a` |
| `--color-text-muted` | `#7d786e` | `#7d786c` |
| `--color-accent-primary` | `#d9764a` | `#b5502a` |
| `--color-accent-secondary` (hover) | `#e28f66` | `#96421f` |
| `--color-accent-contrast` (text on accent fills) | `#16130f` | `#ffffff` |
| `--color-accent-tertiary` | `#7ba49b` (sage) | `#47756c` |
| success / warning / error | `#8fb573` / `#d4a24e` / `#d16a5d` | same |

- **Fonts:** `--font-display` Newsreader · `--font-body` Inter · `--font-mono` JetBrains Mono
  (loaded via Google Fonts in `index.html`)
- **Shadows:** flat elevation only (`--shadow-card`, `--shadow-glow` repurposed as soft ambient)
- **Utilities:** `.card-hover` (border/elevation shift), `.gradient-text` (now a tonal
  accent ramp; kept for theme-preset compatibility), `.glass` (legacy, avoid),
  fade/slide/stagger animations, `.bento-grid` (legacy, avoid)
- **Per-article theme presets** (`src/themes/index.ts`, opt-in via frontmatter):
  cyberpunk · terminal · retro · ocean · paper · sunset — these override CSS vars
  and are intentionally loud; they are *not* the site default.

---

## 6. Tech Stack

- **Build:** Vite + TypeScript (strict), React 19, React Router (SPA)
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` config), CSS variables for theming
- **Content:** MDX v3 (`@mdx-js/rollup`), frontmatter-driven
- **Motion:** framer-motion (used sparingly post-restyle)
- **State:** zustand (`src/store`), React context for theme/layout
- **Heavy deps:** JupyterLite/Pyodide, DuckDB-WASM, Excalidraw, Nivo (full suite),
  CodeMirror 6, MDXEditor, three.js, p5 — bundle is large (>500 kB chunks warning)
- **Deploy:** static, GitHub Pages (SPA redirect shim)

---

## 7. Known Tensions (inputs to the overhaul)

1. **Platform vs. publication.** Nav promises a bustling multi-dimensional community;
   reality is 36 pieces of content by a small set of authors. Demo-data pages read
   as fake and dilute trust in the real work.
2. **Two publishing paths.** The PR workflow (identity-defining) vs. the in-browser
   `/edit` page + unused Supabase backend (a second, contradictory model).
3. **Derived vs. authored data.** ~1,800 lines of hand-written TS "content" for
   speculative features; the real content model is files + frontmatter.
4. **The lab is buried.** Executable content is the genuine differentiator but is
   presented as embedded features rather than a first-class section.
5. **Catch-all route risk.** `/:username` swallows unknown paths, complicating
   routing and 404 behavior for a feature with no real users.
6. **Bundle weight.** Every visitor pays for Jupyter/DuckDB/Excalidraw-scale deps
   regardless of what they read; code-splitting is not yet aggressive.
