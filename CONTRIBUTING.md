# Contributing to render_useful

Thank you for your interest in contributing! This document outlines how to submit content and code to the platform.

**We're actively looking for contributors!** Whether you want to share a tutorial, showcase a project, or improve the site itself - we'd love your help. This is an early-stage project and every contribution makes a difference.

## 📋 Table of Contents

- [Types of Contributions](#types-of-contributions)
- [Getting Started](#getting-started)
- [Content Guidelines](#content-guidelines)
- [Submitting Content](#submitting-content)
- [Code Contributions](#code-contributions)
- [Pull Request Process](#pull-request-process)

## 🎯 Types of Contributions

### Content Contributions

- **Articles** - Tutorials, guides, devlogs, thoughts
- **Projects** - Games, apps, tools, widgets, libraries
- **Author Profiles** - Your contributor profile

### Code Contributions

- Bug fixes
- New features
- UI/UX improvements
- Documentation updates

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/ScottPeabody/rendered_useful.git
cd rendered_useful
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a Branch

```bash
git checkout -b content/my-new-article
# or
git checkout -b feature/my-new-feature
```

### 4. Start Development Server

```bash
npm run dev
```

## 📝 Content Guidelines

### Writing Style

- Write in a friendly, conversational tone
- Be clear and concise
- Include code examples where helpful
- Add images/diagrams for complex concepts

### Article Requirements

- **Title**: Clear, descriptive (50-60 characters ideal)
- **Description**: One sentence summary (150-160 characters)
- **Tags**: 2-5 relevant tags
- **Reading Time**: Estimate based on word count

### Project Requirements

- **Working Demo**: If possible, include a live demo
- **Source Code**: Link to GitHub repository
- **Documentation**: Explain how to use/run the project
- **Tech Stack**: List technologies used

## 📄 Submitting Content

### Adding Your Author Profile

First-time contributors must add an author profile:

1. Create `content/authors/your-slug.md`

```yaml
---
slug: your-slug          # URL-friendly identifier
name: Your Name          # Display name
avatar: URL_TO_AVATAR    # Profile picture URL
bio: >
  A brief bio about yourself (1-3 sentences).
  What do you work on? What are you interested in?
role: Contributor        # Your role
location: City, Country  # Optional
website: https://...     # Optional
github: username         # GitHub username
twitter: handle          # Optional
joinedDate: 2026-01-10   # Date of first contribution
---
```

### Submitting an Article

1. Create `content/articles/your-article-slug.mdx`

```mdx
---
title: "Your Article Title"
description: "A compelling description of your article."
author: your-slug        # Must match your author slug
date: 2026-01-10
tags: [react, tutorial, beginner]
readingTime: 10          # Estimated reading time in minutes
relatedProject: optional-project-slug  # If related to a project
featured: false          # Core team sets this
---

Your article content here...

## Introduction

Start with a hook - why should readers care?

## Main Content

Use headings to organize your content.

### Use MDX Components

<Callout type="info">
  Highlight important information with callouts.
</Callout>

```js
const greeting = "Hello, World!";
console.log(greeting);
```

## Conclusion

Summarize key takeaways.
```

### Submitting a Project

1. Create `content/projects/your-project/index.mdx`

```mdx
---
slug: your-project
title: "Your Project Name"
description: "What does your project do?"
author: your-slug
date: 2026-01-10
tags: [gamedev, react, tool]
techStack: [React, TypeScript, Canvas API]
type: game              # game | app | tool | widget | library
status: active          # active | completed | wip | archived
demoUrl: /projects/your-project/demo  # Optional
githubUrl: https://github.com/...     # Optional
featured: false
---

## About

Describe what your project does and why you built it.

## How It Works

Explain the interesting technical details.

## Getting Started

How can others use or contribute to your project?
```

2. (Optional) Add custom components:

```
content/projects/your-project/
├── index.mdx
├── MyGameComponent.tsx
└── assets/
    └── screenshot.png
```

## 💻 Code Contributions

### Development Setup

1. Follow "Getting Started" steps above
2. Make your changes
3. Test thoroughly
4. Ensure no TypeScript errors: `npm run build`

### Code Style

- Use TypeScript
- Follow existing code patterns
- Use meaningful variable/function names
- Add comments for complex logic

### Component Guidelines

- Keep components small and focused
- Use composition over inheritance
- Prefer named exports
- Include proper TypeScript types

## 🔄 Pull Request Process

### 1. Prepare Your Changes

```bash
# Make sure you're up to date
git pull origin main
git rebase main

# Commit your changes
git add .
git commit -m "feat: add article about React hooks"
# or
git commit -m "fix: resolve navigation bug on mobile"
```

### Commit Message Format

- `feat:` - New feature/content
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Formatting, no code change
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### 2. Push and Create PR

```bash
git push origin your-branch-name
```

Then create a Pull Request on GitHub.

### 3. PR Description Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] New article
- [ ] New project
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update

## Checklist
- [ ] I've added my author profile (first-time contributors)
- [ ] Content follows the style guidelines
- [ ] Images are optimized and properly attributed
- [ ] No broken links
- [ ] Builds without errors
```

### 4. Review Process

- A maintainer will review your PR
- We may suggest changes or ask questions
- Once approved, we'll merge your contribution
- Your content will be live on the next deploy!

## ❓ Questions?

- Open an issue for questions
- Join our Discord (coming soon)
- Tag maintainers on your PR

## 🎉 Thank You!

Every contribution makes this platform better. We appreciate your time and effort!

---

*Remember: Be kind, be helpful, be curious.*
