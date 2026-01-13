---
title: "Tags, Search & Communities"
description: "How tags and communities work in rendered_useful to organize content, connecting people, and making everything discoverable."
date: "2026-01-12"
author: "scott-peabody"
tags: ["features", "documentation", "design", "open-source"]
communities: ["rendered-useful"]
readingTime: 8
---

# Tags, Search & Communities

Tags are one of the simplest yet most powerful organizational tools on the web. In **rendered_useful**, they serve as the connective tissue between articles, projects, and the people who create them. 

But we wanted something more. Tags describe *what* content is about. **Communities** describe *who* it's for.

**Today, alongside this article, we're shipping communities.** It's a first pass—rough around the edges—but it's real and it works. This article covers both the tagging system we've had and the community system we just built.

Whether you're a developer, artist, writer, musician, maker, or just someone with ideas to share—tags and communities help your work get discovered by the right people.

---

## How Tags Work

Every article and project in rendered_useful can have multiple tags. These are simple strings defined in the frontmatter:

```yaml
tags: ["react", "typescript", "gamedev", "tutorial"]
```

### Tag Generation

Tags aren't pre-defined in a database—they emerge organically from the content itself. Our `generateTagInfo` function scans all articles and projects to build the tag index:

```typescript
export const generateTagInfo = (): TagInfo[] => {
  const tagCounts: Record<string, number> = {}
  
  ;[...articles, ...projects].forEach((item) => {
    item.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  
  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count, color: tagColors[name] }))
    .sort((a, b) => b.count - a.count)
}
```

This approach means:
- **No maintenance overhead** - tags appear as content uses them
- **Natural weighting** - popular tags rise to the top by count
- **Zero configuration** - contributors just add tags they think fit

### Tag Colors

Tags get consistent colors based on a hash of their name:

```typescript
function getTagColor(name: string): string {
  const colors = [
    'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    'bg-purple-500/20 text-purple-400 border-purple-500/30',
    // ... more color options
  ]
  
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}
```

Some special tags like `react`, `typescript`, and `rust` have explicit color mappings to match their brand colors.

---

## Tags in the Search Bar

The Command Palette (accessible via `⌘K` or `Ctrl+K`) includes tags as first-class search results. When you search, you're not just searching articles and projects—you're also searching tags themselves.

<Callout type="tip" title="Pro Tip">
Try pressing `⌘K` and typing a technology name. You'll see both content that mentions it *and* the tag itself, which takes you to a dedicated tag page.
</Callout>

### How Tag Search Works

The search system creates searchable items from tags:

```typescript
const searchItems: SearchItem[] = useMemo(() => [
  // Articles...
  // Projects...
  // Authors...
  ...tags.slice(0, 10).map((t) => ({
    type: 'tag' as const,
    title: t.name,
    description: `${t.count} items`,
    slug: `/tag/${t.name}`,
    icon: Hash,
  })),
], [])
```

Tags are limited to the top 10 by count to keep results manageable, but you can always navigate directly to any tag via `/tag/{tag-name}`.

### Tag Pages

Each tag has its own dedicated page at `/tag/{name}` that shows:
- All articles with that tag
- All projects with that tag
- Related tags (tags that commonly appear alongside this one)

The related tags feature helps discovery—if you're interested in `react`, you might also care about `typescript` or `gamedev`.

---

## Filtering with Tags

On the Blog and Projects pages, tags act as filters. You can click multiple tags to narrow down content:

```typescript
const filteredArticles = useMemo(() => {
  return articles.filter((article) => {
    const matchesSearch = !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some((tag) => article.tags.includes(tag))
    
    return matchesSearch && matchesTags
  })
}, [searchQuery, selectedTags])
```

Notice that tag filtering uses `some()` not `every()`—selecting multiple tags shows content that has **any** of the selected tags, not all of them. This is a deliberate UX choice that makes exploration easier.

---

## Communities: A New Tag Type

Here's the key insight: **communities are tags**. They're just tags with more metadata.

A basic tag like `react` is a simple string. It describes content. That's it.

A community tag like `gamedev` is *also* a string that describes content—but it carries additional data: an icon (🎮), a color, a description, and represents a group of people with shared interests.

```typescript
// Basic tag: just a string
tags: ["react", "typescript", "tutorial"]

// Community tag: string that maps to richer metadata
communities: ["gamedev", "learners"]
```

Both are categorization. Both help discovery. Communities are just **"rich tags"**—tags that know more about themselves.

### The Tag Types Concept

This opens up an interesting direction. What if we thought of *everything* as tag types?

| Tag Type | What it is | Metadata |
|----------|------------|----------|
| **Basic** | Simple strings | None (just the name) |
| **Community** | Interest groups | Icon, color, description |
| **Content** *(future)* | Articles, projects | Title, author, date, body... |

Today, "articles" and "projects" are separate content types with their own data structures. But conceptually? They're just tags with a lot of metadata attached.

An article is a tag that has a title, author, date, body, reading time. A project is a tag that has a title, tech stack, demo URL, status.

We're not changing this now—articles and projects work fine as they are. But as rendered_useful evolves, we might explore a more unified model where everything is a tag type, and the differences are just in what metadata each type carries.

### Why This Matters

Thinking in tag types means:
- **Extensibility** - Want a new content type? Define a new tag type with its metadata
- **Consistency** - Everything uses the same discovery and search patterns
- **Flexibility** - Content can belong to multiple types, blur boundaries

For now, communities are our first "rich tag type." They prove the concept. Where we take it from here depends on what the platform needs.

---

## How Communities Work Today

Communities are defined with a name, description, icon, and color:

```typescript
export interface Community {
  slug: string
  name: string
  description: string
  icon: string   // emoji
  color: string  // hex color
  createdDate: string
}
```

Articles and projects can belong to multiple communities via frontmatter:

```yaml
---
title: "Building Tetris in React"
tags: ["react", "typescript", "gamedev", "tutorial"]
communities: ["gamedev", "learners"]
---
```

This article is tagged with technical topics (`react`, `typescript`) but also belongs to the **Game Development** community (for game builders) and **Learners** community (because it's educational).

### Current Communities

We've launched with five starter communities:

| Community | Icon | For... |
|-----------|------|--------|
| [**rendered_useful**](/community/rendered-useful) | 🏠 | Platform features, meta discussions, docs |
| [**Game Development**](/community/gamedev) | 🎮 | Anyone building games |
| [**Open Source**](/community/opensource) | 🌐 | Open source contributors |
| [**Learners**](/community/learners) | 📚 | People learning new skills |
| [**Creative Coding**](/community/creative-coding) | 🎨 | Art, generative design, interactive experiences |

Browse all communities at [/communities](/communities).

### Tags vs Communities (For Now)

| Aspect | Basic Tags | Community Tags |
|--------|------------|----------------|
| **Data** | Just a string | String + icon, color, description |
| **Purpose** | Describe content | Connect people around interests |
| **Creation** | Organic, from content | Curated, intentional |
| **Examples** | `react`, `typescript`, `tutorial` | Game Development, Learners |
| **Routes** | `/tag/{name}` | `/community/{slug}` |

Use both! A project might be tagged `react`, `threejs`, `gamedev` (basic tags) and belong to **Game Development** and **Creative Coding** (community tags).

---

## Search: Finding Everything

The Command Palette (`⌘K` or `Ctrl+K`) searches across everything:
- Articles
- Projects  
- Authors
- Tags
- **Communities**

<Callout type="tip" title="Try It">
Press `⌘K` and type "game". You'll see the Tetris article, game-tagged projects, the `gamedev` tag, *and* the Game Development community.
</Callout>

Communities appear in search with their icons, making them easy to spot.

---

## Future Communities

As rendered_useful grows, we'll add more communities:

**Creative & Arts:**
- **Writers** - Fiction, non-fiction, poetry, screenwriting
- **Musicians** - Producers, composers, instrumentalists
- **Visual Artists** - Illustrators, photographers, 3D artists
- **Filmmakers** - Directors, editors, cinematographers

**Learning & Growth:**
- **Mentors** - Experienced folks helping others grow
- **Career Changers** - People pivoting into new fields

**Interest-Based:**
- **Sustainability** - Eco-focused projects
- **Education** - Teachers, course creators
- **Makers** - Hardware, DIY, crafts, 3D printing
- **Entrepreneurs** - Building businesses and startups

Have an idea for a community? Let us know!

---

## What We Just Built

<Callout type="warning" title="Shipping Today">
This is a first pass at communities, introduced alongside this article. The implementation will change—maybe a lot. But the direction feels right, and shipping something real is better than endless planning.
</Callout>

We just shipped the foundation:

<Todo items={[
  { text: "Add communities field to Article and Project types", done: true },
  { text: "Create Community type definition", done: true },
  { text: "Build /communities browse page", done: true },
  { text: "Add communities to search results", done: true },
  { text: "Create individual community pages", done: true },
  { text: "Show communities on article/project pages", done: false },
  { text: "Add 'Join Community' functionality", done: false },
  { text: "Community activity feeds", done: false },
]} />

You can browse communities at [/communities](/communities). You can search for them with `⌘K`. Each community has its own page showing related content.

It's simple. It works. It's a start.

---

## The Vision

Here's where we want to take this:

### Cross-Pollination

A musician writing about building a custom audio plugin gets exposure to both the **Musicians** community and the **Game Development** community. A writer documenting their self-publishing journey reaches both **Writers** and **Entrepreneurs**. Ideas flow between domains.

This is the magic of multi-community tagging. Content finds multiple audiences. People discover things outside their usual bubble.

### Mentorship Networks

Pairing **Learners** with **Mentors** creates natural mentorship opportunities—and this works across any field. An experienced illustrator can browse Learners content and offer guidance to aspiring artists.

### Events & Collaboration

Communities could organize:
- Game jams & hackathons
- Writing sprints & NaNoWriMo groups
- Art challenges & Inktober collectives
- Music collaborations & remix exchanges
- Study groups & skill shares

### Collective Projects

What if communities had shared projects? The **Filmmakers** community might collaborate on a short film. The **Musicians** community could create a compilation album. The **Writers** community could build an anthology.

---

## What Needs to Happen

To get there, we need:

1. **User accounts** - So people can actually join communities
2. **More contributors** - Communities need people
3. **More content types** - Not just tech articles
4. **Activity feeds** - See what's happening in your communities
5. **Better discovery** - Surface communities where they're relevant

Some of this is straightforward. Some requires rethinking how the platform works.

---

## This Will Change

Let's be honest: this first version is rough. The communities are hand-picked. The UI is basic. There's no membership, no feeds, no real "community" yet beyond shared content.

But it's moving in the right direction.

Tags gave us organization. Communities give us connection. The tools exist now. As more people contribute, as we add features, as we learn what works—this will evolve.

The best platforms grow with their communities. rendered_useful is no different. This is version 0.1 of communities. Version 1.0 will look different. And that's okay.

---

<Callout type="info" title="Explore & Contribute">
Check out [/communities](/communities) to see what exists. Tag your content with communities that fit. And if you have ideas for how this should work—or communities we should add—let us know.

We're building this together.
</Callout>
