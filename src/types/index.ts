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
  type: 'game' | 'app' | 'widget' | 'tool' | 'library' | 'integration' | 'other'
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

// ============================================
// PERSONAL SPACES: Posts, Feeds, Spaces
// ============================================

// Post: A lightweight content type between a tweet and an article
export interface Post extends Versionable {
  slug: string
  title?: string          // optional - posts can be untitled
  content: string         // MDX content (for data-defined posts) or path to MDX file
  author: string          // author slug
  alias?: string          // alias slug (if posted under an alias)
  date: string            // ISO 8601 timestamp
  tags?: string[]
  concepts?: string[]     // concept slugs
  languages?: string[]    // language slugs
  locations?: string[]    // location slugs
  
  // Organization
  series?: string         // series slug
  seriesOrder?: number    // position in series
  feeds?: string[]        // which of the author's feeds this appears in
  pinned?: boolean        // pinned to top of feed
  manualOrder?: number    // for manual feed ordering
  
  // Visibility & Distribution
  visibility: 'draft' | 'public' | 'unlisted'
  distribution?: string[] // external feeds to flow into (future: community feeds, topic feeds)
}

export interface PostInfo {
  slug: string
  title?: string
  excerpt: string         // first ~200 chars of content
  author: string
  alias?: string          // alias slug (if posted under an alias)
  date: string
  tags?: string[]
  visibility: 'draft' | 'public' | 'unlisted'
  pinned?: boolean
  series?: string
  seriesOrder?: number
}

// Feed: A named collection of posts with its own ordering rules
export interface Feed {
  slug: string
  name: string
  description?: string
  author: string          // author slug (owner of this feed)
  alias?: string          // alias slug (if this feed belongs to an alias)
  ordering: 'chronological' | 'reverse-chronological' | 'manual' | 'by-series'
  visibility: 'public' | 'unlisted' | 'private'
  icon?: string
  color?: string
}

export interface FeedInfo extends Feed {
  postCount: number
  posts: PostInfo[]
}

// Space: A user's customizable page
export interface Space extends Versionable {
  author: string          // author slug
  alias?: string          // alias slug (if this is an alias space)
  theme?: string          // theme slug
  layout?: string         // layout slug
  bio?: string            // space-specific bio (can differ from author bio)
  pinnedContent?: Array<{
    type: 'article' | 'project' | 'post'
    slug: string
  }>
  sections?: string[]     // ordered list of sections to show: 'feed', 'articles', 'projects', 'about'
  feeds?: string[]        // which feeds to show (if multiple)
  defaultFeed?: string    // which feed to show by default
}

// Alias: An alternate identity under the same account
export interface Alias {
  slug: string            // unique alias identifier
  author: string          // parent author slug
  displayName: string
  avatar?: string
  bio?: string
  linkedToMain: boolean   // whether this alias is publicly connected to main identity
  visibility: 'public' | 'unlisted'
  createdDate: string
}

// Privacy settings: What others see about you
export interface PrivacySettings {
  showActivity: boolean           // show last active / post frequency
  showConnections: boolean        // show followers/following (future)
  showReadingList: boolean        // show what you've bookmarked (future)
  defaultPostVisibility: 'draft' | 'public' | 'unlisted'
}

// View settings: What you see from others
export interface ViewSettings {
  mutedUsers: string[]            // author slugs
  blockedUsers: string[]          // author slugs
  filteredTags: string[]          // tags to hide
  filteredConcepts: string[]      // concepts to hide
}

// Extended author with space features
export interface AuthorWithSpace extends Author {
  space?: Space
  feeds?: Feed[]
  aliases?: Alias[]
  privacy?: PrivacySettings
  viewSettings?: ViewSettings
}

// ============================================
// NOTEBOOKS: Interactive Jupyter notebooks
// ============================================

// Notebook represents a JupyterLite notebook
export interface Notebook extends Versionable {
  slug: string
  title: string
  description: string
  author: string          // author slug
  date: string            // ISO 8601 timestamp
  tags?: string[]
  concepts?: string[]     // concept slugs
  languages?: string[]    // language slugs (e.g., 'python', 'javascript')
  locations?: string[]    // location slugs
  communities?: string[]  // community slugs
  
  // Notebook-specific
  kernelLanguage: 'python' | 'javascript' | 'r' | 'julia'
  notebookUrl?: string    // URL to .ipynb file (if external)
  featured?: boolean
  draft?: boolean
}

export interface NotebookInfo {
  slug: string
  title: string
  description: string
  author: string
  date: string
  tags?: string[]
  kernelLanguage: 'python' | 'javascript' | 'r' | 'julia'
  featured?: boolean
}
