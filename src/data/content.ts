import type { Author, Article, Project, TagInfo } from '../types'

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
    readingTime: 12,
    featured: true,
    relatedProject: 'tetris-react',
  },
  {
    slug: 'the-freedom-security-tradeoff',
    title: 'The Freedom-Security Tradeoff: Lessons from Social Media for Open Platforms',
    description: 'Reflecting on what made early social media great, why it changed, and how we can build open platforms that balance freedom with security.',
    author: 'scott-peabody',
    date: '2026-01-11',
    tags: ['security', 'open-source', 'web-dev', 'opinion'],
    readingTime: 10,
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
