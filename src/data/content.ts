import type { Author, Article, Project, TagInfo, Community, CommunityInfo, Series, SeriesInfo, Event, EventInfo, VersionInfo, Versionable } from '../types'
import { compareDates, getEventStatus } from '../lib/time'

// Events definitions (game jams, hackathons, challenges)
export const events: Event[] = [
  {
    slug: 'preliminary-foundations-hackathon',
    title: 'Preliminary Foundations Hackathon',
    description: 'A focused week of building core features for rendered_useful. Series, events, versioning, and more. Document your progress, share what you learn.',
    startDate: '2026-01-13',
    endDate: '2026-01-20',
    communities: ['rendered-useful', 'opensource'],
    tags: ['open-source', 'architecture', 'challenge'],
    metadata: {
      theme: {
        value: 'Foundations',
        display: 'hero',
        icon: 'blocks',
        color: '#8b5cf6',
      },
      goals: {
        value: `- Build one foundational feature (series, events, versions, etc.)
- Write about what you're building as you go
- Share progress in the community`,
        display: 'markdown',
        title: 'Goals',
        icon: 'target',
      },
      difficulty: {
        value: 'All levels welcome',
        display: 'badge',
        icon: 'users',
      },
      format: {
        value: 'Self Paced',
        display: 'inline',
      },
    },
  },
]

// Series definitions
export const series: Series[] = [
  {
    slug: 'platform-foundations',
    title: 'Platform Foundations',
    description: 'Building the core concepts of rendered_useful: tags, communities, time, and beyond.',
    status: 'ongoing',
    community: 'rendered-useful',
    tags: ['architecture', 'design', 'vision'],
    createdDate: '2026-01-12',
  },
]

export const communities: Community[] = [
  {
    slug: 'rendered-useful',
    name: 'rendered_useful',
    description: 'The official community for rendered_useful platform development, features, and meta discussions.',
    icon: '🏠',
    color: '#8b5cf6',
    createdDate: '2026-01-10',
  },
  {
    slug: 'gamedev',
    name: 'Game Development',
    description: 'For anyone building games - from simple browser games to complex 3D experiences. Share progress, get feedback, and learn together.',
    icon: '🎮',
    color: '#ef4444',
    createdDate: '2026-01-10',
  },
  {
    slug: 'opensource',
    name: 'Open Source',
    description: 'Contributors and maintainers of open source projects. Discuss best practices, share your projects, and find collaborators.',
    icon: '🌐',
    color: '#22d3ee',
    createdDate: '2026-01-10',
  },
  {
    slug: 'learners',
    name: 'Learners',
    description: 'A supportive space for people learning new skills. Share your journey, ask questions, and celebrate progress.',
    icon: '📚',
    color: '#10b981',
    createdDate: '2026-01-10',
  },
  {
    slug: 'creative-coding',
    name: 'Creative Coding',
    description: 'Where code meets art. Generative art, interactive experiences, visualizations, and creative experiments.',
    icon: '🎨',
    color: '#f472b6',
    createdDate: '2026-01-10',
  },
]

export const authors: Author[] = [
  {
    slug: 'scott-peabody',
    name: 'Scott Peabody',
    avatar: 'https://avatars.githubusercontent.com/u/88902054?v=4',
    bio: 'I like to build things, and hopefully some day make a positive impact in the world through technology and open source.',
    role: 'Creator',
    location: 'United States',
    github: 'ScottPeabody',
    linkedin: 'scott-peabody-60554573',
    joinedDate: '2021-01-01',
    isCoreMaintainer: true,
  },
]

export const articles: Article[] = [
  {
    slug: 'welcome-to-mdx',
    title: 'Writing Articles with MDX',
    description: 'A guide to the formatting options and components available when writing articles on rendered_useful.',
    author: 'scott-peabody',
    date: '2026-01-10',
    tags: ['mdx', 'guide', 'getting-started'],
    communities: ['rendered-useful', 'learners'],
    readingTime: 4,
    featured: true,
  },
  {
    slug: 'building-render-useful',
    title: 'Building rendered_useful: A Modern React Portfolio & Blog',
    description: 'The story behind this site - why I built it, the tech stack choices, design decisions, and how you can use it as a starting point for your own projects.',
    author: 'scott-peabody',
    date: '2026-01-10',
    tags: ['react', 'typescript', 'tailwind', 'web-dev', 'design'],
    communities: ['rendered-useful', 'opensource'],
    readingTime: 8,
    featured: true,
    relatedProject: 'render-useful',
  },
  {
    slug: 'building-tetris-in-react',
    title: 'Building Tetris in React: A Step-by-Step Guide',
    description: 'Learn how to build a fully functional Tetris game using React hooks, including game state management, collision detection, and keyboard controls.',
    author: 'scott-peabody',
    date: '2026-01-10',
    tags: ['react', 'typescript', 'gamedev', 'tutorial'],
    communities: ['gamedev', 'learners'],
    readingTime: 12,
    featured: true,
    relatedProject: 'tetris-react',
  },
  {
    slug: 'building-open-platforms',
    title: 'Building Open Platforms Without Repeating History',
    description: 'Reflecting on what made early social media great, why it changed, and how we can build open platforms that balance freedom with security.',
    author: 'scott-peabody',
    date: '2026-01-11',
    tags: ['security', 'open-source', 'web-dev', 'opinion'],
    communities: ['opensource', 'rendered-useful'],
    readingTime: 10,
    featured: true,
  },
  {
    slug: 'custom-themes-demo',
    title: 'Custom Themes System',
    description: 'Demonstrating the custom theme system that allows articles to completely override the site\'s visual style.',
    author: 'scott-peabody',
    date: '2026-01-11',
    tags: ['features', 'design', 'customization'],
    communities: ['rendered-useful'],
    readingTime: 3,
    featured: true,
  },
  {
    slug: 'custom-layouts-demo',
    title: 'Custom Layouts System',
    description: 'Demonstrating the custom layout system that allows articles to control page structure and display options.',
    author: 'scott-peabody',
    date: '2026-01-11',
    tags: ['features', 'design', 'customization'],
    communities: ['rendered-useful'],
    readingTime: 4,
    featured: true,
  },
  {
    slug: 'tagging-system-guide',
    title: 'Tags, Search & Communities',
    description: 'How tags and communities work in rendered_useful: organizing content, connecting creators, and making everything discoverable.',
    author: 'scott-peabody',
    date: '2026-01-12',
    tags: ['features', 'documentation', 'design', 'open-source'],
    communities: ['rendered-useful'],
    series: 'platform-foundations',
    seriesOrder: 1,
    event: 'preliminary-foundations-hackathon',
    readingTime: 8,
    featured: true,
  },
  // Current version - includes Versions feature
  {
    slug: 'time-as-foundation-v2',
    title: 'Time as a Foundation',
    description: 'Why time needs to be more than a sort field. Exploring series, events, versions, and temporal collections as building blocks for how content connects and evolves.',
    author: 'scott-peabody',
    date: '2026-01-13',
    tags: ['architecture', 'design', 'vision', 'open-source'],
    communities: ['rendered-useful'],
    series: 'platform-foundations',
    seriesOrder: 2,
    event: 'preliminary-foundations-hackathon',
    readingTime: 7,
    featured: true,
    version: '2.0',
    versionGroup: 'time-as-foundation',
    versionNote: 'Added Versions section',
  },
  // Original version - before Versions feature
  {
    slug: 'time-as-foundation-v1',
    title: 'Time as a Foundation',
    description: 'Why time needs to be more than a sort field. Exploring series, events, and temporal collections as building blocks for how content connects and evolves.',
    author: 'scott-peabody',
    date: '2026-01-13',
    tags: ['architecture', 'design', 'vision', 'open-source'],
    communities: ['rendered-useful'],
    series: 'platform-foundations',
    seriesOrder: 2,
    event: 'preliminary-foundations-hackathon',
    readingTime: 6,
    featured: false,
    version: '1.0',
    versionGroup: 'time-as-foundation',
    versionNote: 'Initial release - Series & Events',
  },
  // Supporting article for Mermaid diagrams
  {
    slug: 'mermaid-diagrams',
    title: 'Adding Mermaid Diagrams to MDX',
    description: 'How I added Mermaid diagram support to rendered_useful for visualizing concepts, flows, and relationships in articles.',
    author: 'scott-peabody',
    date: '2026-01-13',
    tags: ['features', 'mdx', 'documentation'],
    communities: ['rendered-useful'],
    event: 'preliminary-foundations-hackathon',
    readingTime: 3,
    featured: false,
  },
]

export const projects: Project[] = [
  {
    slug: 'tetris-react',
    title: 'Tetris',
    description: 'A classic Tetris game built entirely in React with TypeScript. Features smooth controls, scoring system, levels, and a next piece preview.',
    author: 'scott-peabody',
    date: '2026-01-10',
    tags: ['react', 'typescript', 'gamedev', 'game'],
    communities: ['gamedev', 'opensource'],
    techStack: ['React', 'TypeScript', 'Tailwind CSS'],
    type: 'game',
    status: 'completed',
    featured: true,
  },
  {
    slug: 'rubiks-cube',
    title: "Rubik's Cube",
    description: 'An interactive 3D Rubik\'s Cube puzzle built with React Three Fiber. Features smooth animations, scramble, solve, and manual controls.',
    author: 'scott-peabody',
    date: '2026-01-10',
    tags: ['react', 'typescript', 'threejs', 'gamedev', 'game'],
    communities: ['gamedev', 'creative-coding', 'opensource'],
    techStack: ['React', 'Three.js', 'React Three Fiber', 'Drei', 'TypeScript'],
    type: 'game',
    status: 'completed',
    featured: true,
  },
  {
    slug: 'typing-game',
    title: 'WikiType',
    description: 'A typing speed test that fetches random Wikipedia articles. Practice typing while learning something new.',
    author: 'scott-peabody',
    date: '2026-01-10',
    tags: ['react', 'typescript', 'gamedev', 'game'],
    communities: ['gamedev', 'learners', 'opensource'],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Wikipedia API'],
    type: 'game',
    status: 'completed',
    featured: true,
  },
]

// Helper to filter articles to only latest versions
const filterLatestArticles = (articleList: Article[]): Article[] => {
  const seen = new Set<string>()
  return articleList.filter((a) => {
    if (!a.versionGroup) return true // Not versioned, include it
    if (seen.has(a.versionGroup)) return false // Already saw this group
    // Check if this is the latest version
    const allInGroup = articles
      .filter((x) => x.versionGroup === a.versionGroup)
      .sort((x, y) => compareDates(x.date, y.date))
    if (allInGroup[0]?.slug === a.slug) {
      seen.add(a.versionGroup)
      return true
    }
    return false
  })
}

// Helper to filter projects to only latest versions
const filterLatestProjects = (projectList: Project[]): Project[] => {
  const seen = new Set<string>()
  return projectList.filter((p) => {
    if (!p.versionGroup) return true
    if (seen.has(p.versionGroup)) return false
    const allInGroup = projects
      .filter((x) => x.versionGroup === p.versionGroup)
      .sort((x, y) => compareDates(x.date, y.date))
    if (allInGroup[0]?.slug === p.slug) {
      seen.add(p.versionGroup)
      return true
    }
    return false
  })
}

export const generateTagInfo = (): TagInfo[] => {
  const tagCounts: Record<string, number> = {}
  
  // Only count latest versions of versioned content
  const latestArticles = filterLatestArticles(articles)
  const latestProjects = filterLatestProjects(projects)
  
  ;[...latestArticles, ...latestProjects].forEach((item) => {
    item.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  
  const tagColors: Record<string, string> = {
    react: '#61dafb',
    javascript: '#f7df1e',
    typescript: '#3178c6',
    gamedev: '#ff6b6b',
    design: '#a855f7',
    tutorial: '#10b981',
    tool: '#06b6d4',
    rust: '#dea584',
    wasm: '#654ff0',
    accessibility: '#22c55e',
    threejs: '#000000',
    game: '#ef4444',
    security: '#f59e0b',
    'open-source': '#22d3ee',
    'web-dev': '#818cf8',
    opinion: '#f472b6',
  }
  
  return Object.entries(tagCounts)
    .map(([name, count]) => ({
      name,
      count,
      color: tagColors[name],
    }))
    .sort((a, b) => b.count - a.count)
}

export const tags = generateTagInfo()

export const getAuthor = (slug: string): Author | undefined => 
  authors.find((a) => a.slug === slug)

export const getArticle = (slug: string): Article | undefined =>
  articles.find((a) => a.slug === slug)

export const getProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug)

export const getArticlesByAuthor = (authorSlug: string): Article[] =>
  filterLatestArticles(articles.filter((a) => a.author === authorSlug))

export const getProjectsByAuthor = (authorSlug: string): Project[] =>
  filterLatestProjects(projects.filter((p) => p.author === authorSlug))

export const getArticlesByTag = (tag: string): Article[] =>
  filterLatestArticles(articles.filter((a) => a.tags.includes(tag)))

export const getProjectsByTag = (tag: string): Project[] =>
  filterLatestProjects(projects.filter((p) => p.tags.includes(tag)))

export const getFeaturedArticles = (): Article[] =>
  filterLatestArticles(articles.filter((a) => a.featured))

export const getFeaturedProjects = (): Project[] =>
  filterLatestProjects(projects.filter((p) => p.featured))

export const getRecentArticles = (count: number = 5): Article[] =>
  filterLatestArticles([...articles].sort((a, b) => compareDates(a.date, b.date))).slice(0, count)

export const getRecentProjects = (count: number = 5): Project[] =>
  filterLatestProjects([...projects].sort((a, b) => compareDates(a.date, b.date))).slice(0, count)

// Community helpers
export const generateCommunityInfo = (): CommunityInfo[] => {
  const communityCounts: Record<string, number> = {}
  
  // Only count latest versions of versioned content
  const latestArticles = filterLatestArticles(articles)
  const latestProjects = filterLatestProjects(projects)
  
  ;[...latestArticles, ...latestProjects].forEach((item) => {
    item.communities?.forEach((community) => {
      communityCounts[community] = (communityCounts[community] || 0) + 1
    })
  })
  
  return communities
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      count: communityCounts[c.slug] || 0,
      color: c.color,
      icon: c.icon,
    }))
    .sort((a, b) => b.count - a.count)
}

export const communityInfo = generateCommunityInfo()

export const getCommunity = (slug: string): Community | undefined =>
  communities.find((c) => c.slug === slug)

export const getArticlesByCommunity = (communitySlug: string): Article[] =>
  filterLatestArticles(articles.filter((a) => a.communities?.includes(communitySlug)))

export const getProjectsByCommunity = (communitySlug: string): Project[] =>
  filterLatestProjects(projects.filter((p) => p.communities?.includes(communitySlug)))

// Series helpers
export const getSeries = (slug: string): Series | undefined =>
  series.find((s) => s.slug === slug)

export const getSeriesInfo = (slug: string): SeriesInfo | undefined => {
  const s = getSeries(slug)
  if (!s) return undefined

  // Gather all items in this series, filtering to latest version only
  const articlesInSeries = articles.filter((a) => a.series === slug)
  
  // Group by versionGroup and keep only latest, or keep non-versioned articles
  const latestArticles = articlesInSeries.filter((a) => {
    if (!a.versionGroup) return true // Not versioned, include it
    const latest = getLatestArticleVersion(a.versionGroup)
    return latest?.slug === a.slug // Only include if this is the latest version
  })
  
  const seriesArticles = latestArticles.map((a) => ({ 
      slug: a.slug, 
      title: a.title, 
      description: a.description,
      order: a.seriesOrder || 0, 
      type: 'article' as const,
      tags: a.tags,
    }))
  
  // Same for projects
  const projectsInSeries = projects.filter((p) => p.series === slug)
  
  const latestProjects = projectsInSeries.filter((p) => {
    if (!p.versionGroup) return true
    const latest = getLatestProjectVersion(p.versionGroup)
    return latest?.slug === p.slug
  })
  
  const seriesProjects = latestProjects.map((p) => ({ 
      slug: p.slug, 
      title: p.title, 
      description: p.description,
      order: p.seriesOrder || 0, 
      type: 'project' as const,
      tags: p.tags,
    }))

  const items = [...seriesArticles, ...seriesProjects].sort((a, b) => a.order - b.order)

  return {
    slug: s.slug,
    title: s.title,
    description: s.description,
    status: s.status,
    itemCount: items.length,
    items,
  }
}

export const getSeriesNavigation = (seriesSlug: string, currentSlug: string) => {
  const info = getSeriesInfo(seriesSlug)
  if (!info) return null

  const currentIndex = info.items.findIndex((item) => item.slug === currentSlug)
  if (currentIndex === -1) return null

  return {
    series: info,
    currentIndex,
    currentPosition: currentIndex + 1,
    totalItems: info.items.length,
    prev: currentIndex > 0 ? info.items[currentIndex - 1] : null,
    next: currentIndex < info.items.length - 1 ? info.items[currentIndex + 1] : null,
  }
}

export const getAllSeries = (): SeriesInfo[] =>
  series.map((s) => getSeriesInfo(s.slug)!).filter(Boolean)

// Event helpers
export const getEvent = (slug: string): Event | undefined =>
  events.find((e) => e.slug === slug)

export const getEventInfo = (slug: string): EventInfo | undefined => {
  const e = getEvent(slug)
  if (!e) return undefined

  const status = getEventStatus(e.startDate, e.endDate)

  // Gather all items submitted to this event, filtering to latest version only
  const articlesInEvent = articles.filter((a) => a.event === slug)
  
  // Group by versionGroup and keep only latest, or keep non-versioned articles
  const latestArticles = articlesInEvent.filter((a) => {
    if (!a.versionGroup) return true
    const latest = getLatestArticleVersion(a.versionGroup)
    return latest?.slug === a.slug
  })
  
  const eventArticles = latestArticles.map((a) => ({
      slug: a.slug,
      title: a.title,
      description: a.description,
      date: a.date,
      type: 'article' as const,
      author: a.author,
    }))

  const projectsInEvent = projects.filter((p) => p.event === slug)
  
  const latestProjects = projectsInEvent.filter((p) => {
    if (!p.versionGroup) return true
    const latest = getLatestProjectVersion(p.versionGroup)
    return latest?.slug === p.slug
  })
  
  const eventProjects = latestProjects.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      type: 'project' as const,
      author: p.author,
    }))

  // Sort by date (newest first)
  const items = [...eventArticles, ...eventProjects].sort((a, b) => compareDates(a.date, b.date))

  return {
    slug: e.slug,
    title: e.title,
    description: e.description,
    startDate: e.startDate,
    endDate: e.endDate,
    status,
    communities: e.communities,
    metadata: e.metadata,
    itemCount: items.length,
    items,
  }
}

export const getAllEvents = (): EventInfo[] =>
  events.map((e) => getEventInfo(e.slug)!).filter(Boolean)

export const getUpcomingEvents = (): EventInfo[] =>
  getAllEvents().filter((e) => e.status === 'upcoming')

export const getActiveEvents = (): EventInfo[] =>
  getAllEvents().filter((e) => e.status === 'active')

export const getEndedEvents = (): EventInfo[] =>
  getAllEvents().filter((e) => e.status === 'ended')

// Version helpers
// Get the version group for an item (defaults to slug if not specified)
const getVersionGroup = <T extends Versionable & { slug: string }>(item: T): string =>
  item.versionGroup || item.slug

// Get all versions of an article (by version group)
export const getArticleVersions = (slugOrGroup: string): Article[] => {
  // First try to find the article by slug
  const article = articles.find((a) => a.slug === slugOrGroup)
  const group = article ? getVersionGroup(article) : slugOrGroup
  
  // Find all articles in this version group
  return articles
    .filter((a) => getVersionGroup(a) === group)
    .sort((a, b) => compareDates(a.date, b.date)) // newest first
}

// Get all versions of a project (by version group)
export const getProjectVersions = (slugOrGroup: string): Project[] => {
  const project = projects.find((p) => p.slug === slugOrGroup)
  const group = project ? getVersionGroup(project) : slugOrGroup
  
  return projects
    .filter((p) => getVersionGroup(p) === group)
    .sort((a, b) => compareDates(a.date, b.date))
}

// Get all versions of an event (by version group)
export const getEventVersions = (slugOrGroup: string): Event[] => {
  const event = events.find((e) => e.slug === slugOrGroup)
  const group = event ? getVersionGroup(event) : slugOrGroup
  
  return events
    .filter((e) => getVersionGroup(e) === group)
    .sort((a, b) => compareDates(a.startDate, b.startDate))
}

// Get the latest version of an article
export const getLatestArticleVersion = (slugOrGroup: string): Article | undefined => {
  const versions = getArticleVersions(slugOrGroup)
  return versions[0] // already sorted newest first
}

// Get the latest version of a project
export const getLatestProjectVersion = (slugOrGroup: string): Project | undefined => {
  const versions = getProjectVersions(slugOrGroup)
  return versions[0]
}

// Get the latest version of an event
export const getLatestEventVersion = (slugOrGroup: string): Event | undefined => {
  const versions = getEventVersions(slugOrGroup)
  return versions[0]
}

// Get a specific version of an article
export const getArticleByVersion = (slugOrGroup: string, version: string): Article | undefined => {
  const versions = getArticleVersions(slugOrGroup)
  return versions.find((a) => a.version === version)
}

// Get a specific version of a project
export const getProjectByVersion = (slugOrGroup: string, version: string): Project | undefined => {
  const versions = getProjectVersions(slugOrGroup)
  return versions.find((p) => p.version === version)
}

// Get a specific version of an event
export const getEventByVersion = (slugOrGroup: string, version: string): Event | undefined => {
  const versions = getEventVersions(slugOrGroup)
  return versions.find((e) => e.version === version)
}

// Get version info list for display (works with any versionable content type)
export const getVersionInfoList = <T extends Versionable & { slug: string; date: string }>(
  items: T[],
  currentSlug: string
): VersionInfo[] => {
  if (items.length <= 1) return []
  
  return items.map((item, index) => ({
    version: item.version || `v${items.length - index}`,
    slug: item.slug,
    date: item.date,
    note: item.versionNote,
    isCurrent: item.slug === currentSlug,
  }))
}

// Convenience: get version info for an article
export const getArticleVersionInfo = (slug: string): VersionInfo[] => {
  const versions = getArticleVersions(slug)
  return getVersionInfoList(versions, slug)
}

// Convenience: get version info for a project
export const getProjectVersionInfo = (slug: string): VersionInfo[] => {
  const versions = getProjectVersions(slug)
  return getVersionInfoList(versions, slug)
}

// Convenience: get version info for an event
export const getEventVersionInfo = (slug: string): VersionInfo[] => {
  const versions = getEventVersions(slug)
  // Events use startDate instead of date
  return versions.length <= 1 ? [] : versions.map((item, index) => ({
    version: item.version || `v${versions.length - index}`,
    slug: item.slug,
    date: item.startDate,
    note: item.versionNote,
    isCurrent: item.slug === slug,
  }))
}
