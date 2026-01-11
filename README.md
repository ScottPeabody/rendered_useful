# render_useful

A modern, collaborative article and project showcase platform built with React, TypeScript, and MDX. Designed for developers to share projects, write articles, and build together.

## ✨ Features

- **🌙 Dark Mode First** - Beautiful dark UI with optional light mode
- **📝 MDX Support** - Write content with React components inside Markdown
- **🎮 Interactive Projects** - Embed playable games, tools, and widgets
- **👥 Multi-Author** - GitHub-based collaboration with PR workflow
- **🏷️ Tagging System** - Unified tags across articles and projects
- **⌨️ Command Palette** - Quick search with ⌘K
- **🎨 Modern Design** - Glass morphism, animations, bento grids
- **📱 Fully Responsive** - Mobile-first design

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
render_useful/
├── content/                 # MDX content files
│   ├── articles/           # Articles (MDX)
│   └── projects/           # Project showcases (MDX)
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── games/          # Interactive game components (Tetris, Rubik's Cube, WikiType)
│   │   ├── layout/         # Layout components (Navbar, Footer)
│   │   ├── mdx/            # MDX components for content
│   │   └── ui/             # Reusable UI components
│   ├── context/            # React context providers (Theme)
│   ├── data/               # Content registry (authors, articles, projects)
│   ├── pages/              # Page components
│   ├── types/              # TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── CONTRIBUTING.md
└── README.md
```

## 📝 Content Management

### Adding an Author

Add your author profile to `src/data/content.ts`:

```typescript
{
  slug: 'your-name',
  name: 'Your Name',
  avatar: 'https://github.com/yourusername.png',
  bio: 'A brief bio about yourself',
  location: 'City, Country',
  github: 'yourusername',
  twitter: 'yourhandle',
  joinedDate: '2026-01-01',
}
```

### Writing an Article

Create a file in `content/articles/your-article.mdx`:

```mdx
---
title: Your Article Title
description: A brief description
author: your-name
date: 2026-01-10
tags: [react, tutorial]
readingTime: 10
---

Your content here...

<Callout type="tip">
  You can use custom components!
</Callout>
```

### Adding a Project

Create a folder in `content/projects/your-project/`:

```
your-project/
├── index.mdx           # Project content
├── GameComponent.tsx   # Custom components (optional)
└── assets/            # Project assets
```

## 🧩 MDX Components

The following components are available in all MDX files:

| Component | Description |
|-----------|-------------|
| `<Callout>` | Styled callout boxes (info, warning, tip, error, success) |
| `<TechStack>` | Display tech stack with icons |
| `<Image>` | Images with captions and sizing options |
| `<Video>` | Embed YouTube or native video |
| `<Audio>` | Embed audio files with player controls |
| `<Todo>` | Interactive checklist component |
| `<RubiksCube>` | Interactive 3D Rubik's Cube |
| `<TypingGame>` | WikiType typing game with Wikipedia articles and LaTeX equations |

## 🎨 Design System

### Colors

The site uses CSS custom properties for theming:

- `--color-background` - Page background
- `--color-surface` - Card/component backgrounds
- `--color-accent-primary` - Primary accent (indigo)
- `--color-accent-secondary` - Secondary accent (purple)
- `--color-text-primary` - Main text color
- `--color-text-secondary` - Secondary text
- `--color-text-muted` - Muted/subtle text

### Components

All UI components are in `src/components/ui/`:

- `Button` - Multi-variant button component
- `Card` - Article/Project cards
- `Tag` - Tag pills with consistent colors
- `AuthorCard` - Author profile cards
- `CommandPalette` - Quick search (⌘K)
- `LoadingSpinner` - Loading indicator

## 🤝 Contributing

We're actively looking for contributors! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Quick Contribution Steps

1. Clone the repository
2. Create a branch for your changes
3. Add your content (article/project) or feature
4. Submit a Pull Request
5. We'll review and merge!

## 📜 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Credits

Built with:
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [MDX](https://mdxjs.com)
- [Framer Motion](https://www.framer.com/motion)
- [Three.js](https://threejs.org) / [React Three Fiber](https://r3f.docs.pmnd.rs)
- [KaTeX](https://katex.org) - Math typesetting
- [Lucide Icons](https://lucide.dev)

---

Made with ❤️ by the community
