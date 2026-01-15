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

// Version fields shared by versionable content types
export interface Versionable {
  version?: string        // e.g., "1.0", "2.0", "2026-01-13"
  versionGroup?: string   // groups versions together (defaults to slug if not set)
  versionNote?: string    // what changed in this version
}

export interface Article extends Versionable {
  slug: string
  title: string
  description: string
  author: string // author slug
  date: string
  tags: string[]
  communities?: string[] // community slugs
  series?: string // series slug
  seriesOrder?: number // position in series (1-indexed)
  event?: string // event slug
  concepts?: string[] // concept slugs (conceptual space)
  languages?: string[] // language slugs (linguistic space)
  locations?: string[] // location slugs (physical/virtual space)
  readingTime: number
  coverImage?: string
  relatedProject?: string // project slug
  featured?: boolean
  draft?: boolean
}

export interface Project extends Versionable {
  slug: string
  title: string
  description: string
  author: string // author slug
  date: string
  tags: string[]
  communities?: string[] // community slugs
  series?: string // series slug
  seriesOrder?: number // position in series (1-indexed)
  event?: string // event slug
  concepts?: string[] // concept slugs (conceptual space)
  languages?: string[] // language slugs (linguistic space)
  locations?: string[] // location slugs (physical/virtual space)
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

export interface Series {
  slug: string
  title: string
  description: string
  status: 'ongoing' | 'completed' | 'paused'
  community?: string // community slug
  tags?: string[]
  createdDate: string
}

export interface SeriesInfo {
  slug: string
  title: string
  description: string
  status: 'ongoing' | 'completed' | 'paused'
  itemCount: number
  items: Array<{
    slug: string
    title: string
    description: string
    order: number
    type: 'article' | 'project'
    tags?: string[]
  }>
}

// Metadata item with display control
export interface MetadataItem {
  value: string | number | boolean | string[]
  display?: 'hero' | 'card' | 'inline' | 'badge' | 'markdown' | 'list'
  title?: string  // custom title (otherwise auto-generated from key)
  icon?: string   // lucide icon name
  color?: string  // accent color
}

// Events are time-bounded containers (game jams, hackathons, challenges)
export interface Event extends Versionable {
  slug: string
  title: string
  description: string
  startDate: string // UTC ISO 8601
  endDate: string   // UTC ISO 8601
  communities?: string[] // community slugs
  tags?: string[]
  coverImage?: string
  metadata?: Record<string, MetadataItem | string | number | boolean | string[]> // flexible event-specific data
}

export type EventStatus = 'upcoming' | 'active' | 'ended'

export interface EventInfo {
  slug: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: EventStatus
  communities?: string[]
  metadata?: Record<string, unknown>
  itemCount: number
  items: Array<{
    slug: string
    title: string
    description: string
    date: string
    type: 'article' | 'project'
    author: string
  }>
}

// Version information for content
export interface VersionInfo {
  version: string
  slug: string
  date: string
  note?: string
  isCurrent: boolean
}

// Space Foundation: Concepts, Languages, Locations

// Concept represents a node in conceptual space
export interface Concept extends Versionable {
  slug: string
  name: string
  description: string
  date: string            // when this concept was added/updated
  icon?: string           // lucide icon or emoji
  color?: string          // accent color
  related?: string[]      // related concept slugs
  prerequisites?: string[] // concepts needed to understand this
  metadata?: Record<string, MetadataItem | string | number | boolean | string[]>
}

export interface ConceptInfo {
  slug: string
  name: string
  description: string
  icon?: string
  color?: string
  related?: string[]
  prerequisites?: string[]
  itemCount: number
  items: Array<{
    slug: string
    title: string
    description: string
    date: string
    type: 'article' | 'project'
    author: string
  }>
}

// Language represents linguistic space (natural and programming)
export interface Language extends Versionable {
  slug: string
  name: string
  description: string
  date: string            // when this language entry was added/updated
  type: 'natural' | 'programming' | 'markup' | 'other'
  icon?: string
  color?: string
  family?: string         // e.g., "Romance", "C-family", "ML-family"
  metadata?: Record<string, MetadataItem | string | number | boolean | string[]>
}

export interface LanguageInfo {
  slug: string
  name: string
  description: string
  type: 'natural' | 'programming' | 'markup' | 'other'
  icon?: string
  color?: string
  family?: string
  itemCount: number
  items: Array<{
    slug: string
    title: string
    description: string
    date: string
    type: 'article' | 'project'
    author: string
  }>
}

// Location represents physical/virtual space
export interface Location extends Versionable {
  slug: string
  name: string
  description: string
  date: string            // when this location entry was added/updated
  type: 'physical' | 'virtual' | 'hybrid'
  parent?: string         // e.g., "california" -> "united-states"
  coordinates?: [number, number] // latitude, longitude
  icon?: string
  color?: string
  timezone?: string
  metadata?: Record<string, MetadataItem | string | number | boolean | string[]>
}

export interface LocationInfo {
  slug: string
  name: string
  description: string
  type: 'physical' | 'virtual' | 'hybrid'
  parent?: string
  icon?: string
  color?: string
  itemCount: number
  items: Array<{
    slug: string
    title: string
    description: string
    date: string
    type: 'article' | 'project'
    author: string
  }>
}
