import type { Author, Article, Project, TagInfo, Community, CommunityInfo } from '../types'

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
    slug: 'themes-and-layouts-guide',
    title: 'Themes & Layouts Guide',
    description: 'A complete guide to customizing the look and feel of your articles with themes and layouts.',
    author: 'scott-peabody',
    date: '2026-01-11',
    tags: ['documentation', 'customization', 'mdx'],
    communities: ['rendered-useful', 'learners'],
    readingTime: 3,
    featured: true,
  },
  {
    slug: 'tagging-system-guide',
    title: 'Tags, Search & Communities',
    description: 'How tags and communities work in rendered_useful—organizing content, connecting creators, and making everything discoverable.',
    author: 'scott-peabody',
    date: '2026-01-12',
    tags: ['features', 'documentation', 'design', 'open-source'],
    communities: ['rendered-useful'],
    readingTime: 8,
    featured: true,
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

export const generateTagInfo = (): TagInfo[] => {
  const tagCounts: Record<string, number> = {}
  
  ;[...articles, ...projects].forEach((item) => {
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
  articles.filter((a) => a.author === authorSlug)

export const getProjectsByAuthor = (authorSlug: string): Project[] =>
  projects.filter((p) => p.author === authorSlug)

export const getArticlesByTag = (tag: string): Article[] =>
  articles.filter((a) => a.tags.includes(tag))

export const getProjectsByTag = (tag: string): Project[] =>
  projects.filter((p) => p.tags.includes(tag))

export const getFeaturedArticles = (): Article[] =>
  articles.filter((a) => a.featured)

export const getFeaturedProjects = (): Project[] =>
  projects.filter((p) => p.featured)

export const getRecentArticles = (count: number = 5): Article[] =>
  [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, count)

export const getRecentProjects = (count: number = 5): Project[] =>
  [...projects].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, count)

// Community helpers
export const generateCommunityInfo = (): CommunityInfo[] => {
  const communityCounts: Record<string, number> = {}
  
  ;[...articles, ...projects].forEach((item) => {
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
  articles.filter((a) => a.communities?.includes(communitySlug))

export const getProjectsByCommunity = (communitySlug: string): Project[] =>
  projects.filter((p) => p.communities?.includes(communitySlug))
