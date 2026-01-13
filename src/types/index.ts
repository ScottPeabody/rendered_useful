export interface Author {
  slug: string
  name: string
  avatar: string
  bio: string
  role?: string
  location?: string
  website?: string
  github?: string
  twitter?: string
  linkedin?: string
  joinedDate: string
  isCoreMaintainer?: boolean
}

export interface Article {
  slug: string
  title: string
  description: string
  author: string // author slug
  date: string
  tags: string[]
  communities?: string[] // community slugs
  readingTime: number
  coverImage?: string
  relatedProject?: string // project slug
  featured?: boolean
  draft?: boolean
}

export interface Project {
  slug: string
  title: string
  description: string
  author: string // author slug
  date: string
  tags: string[]
  communities?: string[] // community slugs
  coverImage?: string
  demoUrl?: string
  githubUrl?: string
  techStack: string[]
  featured?: boolean
  type: 'game' | 'app' | 'widget' | 'tool' | 'library' | 'other'
  status: 'active' | 'completed' | 'archived' | 'wip'
}

export interface TagInfo {
  name: string
  count: number
  color?: string
}

export interface Community {
  slug: string
  name: string
  description: string
  icon: string  // emoji or icon name
  color: string // hex color
  createdDate: string
}

export interface CommunityInfo {
  slug: string
  name: string
  count: number
  color: string
  icon: string
}
