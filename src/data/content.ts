import type { Author, Article, Project, TagInfo, Community, CommunityInfo, Series, SeriesInfo, Event, EventInfo, VersionInfo, Versionable, Concept, ConceptInfo, Language, LanguageInfo, Location, LocationInfo, Post, PostInfo, Feed, FeedInfo, Space, Notebook } from '../types'
import { compareDates, getEventStatus } from '../lib/time'

// ============================================
// SPACE FOUNDATION: Concepts, Languages, Locations
// ============================================

// Concepts - nodes in conceptual space
export const concepts: Concept[] = [
  // Current state management (latest)
  {
    slug: 'state-management',
    name: 'State Management',
    description: 'Patterns and techniques for managing application state, from local component state to global stores.',
    date: '2026-01-14T12:00:00',
    icon: '🔄',
    color: '#8b5cf6',
    related: ['reactivity', 'data-flow'],
    prerequisites: ['programming-basics'],
    versionGroup: 'state-management',
    version: 'Modern',
    versionNote: 'Signals, atoms, and fine-grained reactivity',
  },
  // Historical version: Redux era
  {
    slug: 'state-management-redux-era',
    name: 'State Management',
    description: 'Centralized stores with actions and reducers. Single source of truth, time-travel debugging, but significant boilerplate.',
    date: '2016-06-01T12:00:00',
    icon: '🔄',
    color: '#764abc',
    related: ['reactivity', 'data-flow'],
    prerequisites: ['programming-basics'],
    versionGroup: 'state-management',
    version: 'Redux Era',
    versionNote: 'Flux architecture, immutable updates, middleware patterns',
  },
  // Historical version: Hooks era
  {
    slug: 'state-management-hooks-era',
    name: 'State Management',
    description: 'React hooks and context API. useState, useReducer, and custom hooks for state logic.',
    date: '2019-02-06T12:00:00',
    icon: '🔄',
    color: '#61dafb',
    related: ['reactivity', 'data-flow'],
    prerequisites: ['programming-basics'],
    versionGroup: 'state-management',
    version: 'Hooks Era',
    versionNote: 'React 16.8 hooks, composition over inheritance',
  },
  {
    slug: 'reactivity',
    name: 'Reactivity',
    description: 'Systems that automatically update when their dependencies change. The foundation of modern UI frameworks.',
    date: '2026-01-14T12:00:00',
    icon: '⚡',
    color: '#f59e0b',
    related: ['state-management', 'data-flow'],
  },
  {
    slug: 'data-flow',
    name: 'Data Flow',
    description: 'How data moves through an application. Unidirectional, bidirectional, and event-driven patterns.',
    date: '2026-01-14T12:00:00',
    icon: '🌊',
    color: '#06b6d4',
    related: ['state-management', 'reactivity'],
  },
  {
    slug: 'game-development',
    name: 'Game Development',
    description: 'The art and science of creating interactive games. Encompasses design, programming, art, and sound.',
    date: '2026-01-14T12:00:00',
    icon: '🎮',
    color: '#ef4444',
    related: ['game-loops', 'collision-detection', '3d-graphics'],
  },
  {
    slug: 'game-loops',
    name: 'Game Loops',
    description: 'The heartbeat of a game - the cycle of input, update, and render that runs every frame.',
    date: '2026-01-14T12:00:00',
    icon: '🔁',
    color: '#22c55e',
    prerequisites: ['game-development'],
    related: ['collision-detection'],
  },
  {
    slug: 'collision-detection',
    name: 'Collision Detection',
    description: 'Determining when game objects intersect. From simple bounding boxes to complex physics systems.',
    date: '2026-01-14T12:00:00',
    icon: '💥',
    color: '#f472b6',
    prerequisites: ['game-loops'],
  },
  {
    slug: '3d-graphics',
    name: '3D Graphics',
    description: 'Rendering three-dimensional scenes. Meshes, textures, lighting, cameras, and shaders.',
    date: '2026-01-14T12:00:00',
    icon: '🎲',
    color: '#a855f7',
    related: ['game-development'],
  },
  {
    slug: 'platform-architecture',
    name: 'Platform Architecture',
    description: 'Designing systems that support communities, content, and connections. The foundation of rendered_useful.',
    date: '2026-01-14T12:00:00',
    icon: '🏗️',
    color: '#8b5cf6',
    related: ['content-systems', 'open-platforms'],
  },
  {
    slug: 'content-systems',
    name: 'Content Systems',
    description: 'How content is structured, versioned, and connected. MDX, metadata, and relationships.',
    date: '2026-01-14T12:00:00',
    icon: '📝',
    color: '#10b981',
    related: ['platform-architecture'],
  },
  {
    slug: 'open-platforms',
    name: 'Open Platforms',
    description: 'Building platforms that balance openness with safety. Moderation, federation, and community governance.',
    date: '2026-01-14T12:00:00',
    icon: '🌐',
    color: '#22d3ee',
    related: ['platform-architecture'],
  },
  {
    slug: 'space-as-context',
    name: 'Space as Context',
    description: 'Understanding how physical, virtual, conceptual, and linguistic spaces shape the meaning and relevance of content.',
    date: '2026-01-14T12:00:00',
    icon: '🌍',
    color: '#3b82f6',
    related: ['platform-architecture', 'content-systems'],
  },
  {
    slug: 'version-control',
    name: 'Version Control',
    description: 'Tracking changes over time. From git commits to content versions to conceptual evolution.',
    date: '2026-01-14T12:00:00',
    icon: '📜',
    color: '#f97316',
    related: ['temporal-modeling', 'content-systems'],
  },
  {
    slug: 'temporal-modeling',
    name: 'Temporal Modeling',
    description: 'Representing time in data systems. When things happened, how they evolved, and why timing matters.',
    date: '2026-01-14T12:00:00',
    icon: '⏳',
    color: '#ec4899',
    related: ['version-control', 'content-systems'],
  },
  {
    slug: 'identity',
    name: 'Identity',
    description: 'Your corner of the platform. A space that evolves with you.',
    date: '2026-01-14T12:00:00',
    icon: '🪪',
    color: '#6366f1',
    related: ['space-as-context', 'temporal-modeling'],
  },
]

// Languages - linguistic space (natural and programming)
export const languages: Language[] = [
  // Programming languages
  // Current TypeScript (latest)
  {
    slug: 'typescript',
    name: 'TypeScript',
    description: 'JavaScript with static types. The language of choice for large-scale web applications.',
    date: '2026-01-14T12:00:00',
    type: 'programming',
    icon: '🔷',
    color: '#3178c6',
    family: 'C-family',
    versionGroup: 'typescript',
    version: '5.x',
    versionNote: 'Decorators, const type parameters, satisfies operator',
  },
  // Historical version: TypeScript 4.x
  {
    slug: 'typescript-4',
    name: 'TypeScript',
    description: 'TypeScript with variadic tuple types, labeled tuples, and class property inference.',
    date: '2020-08-20T12:00:00',
    type: 'programming',
    icon: '🔷',
    color: '#235a97',
    family: 'C-family',
    versionGroup: 'typescript',
    version: '4.x',
    versionNote: 'Variadic tuples, labeled tuples, short-circuiting assignment',
  },
  {
    slug: 'javascript',
    name: 'JavaScript',
    description: 'The language of the web. Runs everywhere, from browsers to servers to IoT devices.',
    date: '2026-01-14T12:00:00',
    type: 'programming',
    icon: '🟨',
    color: '#f7df1e',
    family: 'C-family',
  },
  {
    slug: 'rust',
    name: 'Rust',
    description: 'Systems programming with safety guarantees. Memory safe without garbage collection.',
    date: '2026-01-14T12:00:00',
    type: 'programming',
    icon: '🦀',
    color: '#dea584',
    family: 'Systems',
  },
  {
    slug: 'python',
    name: 'Python',
    description: 'Readable, versatile, and beginner-friendly. From scripts to machine learning.',
    date: '2026-01-14T12:00:00',
    type: 'programming',
    icon: '🐍',
    color: '#3776ab',
    family: 'Dynamic',
  },
  // Natural languages
  {
    slug: 'english',
    name: 'English',
    description: 'The current lingua franca of technology and this platform. But not the only language that matters.',
    date: '2026-01-14T12:00:00',
    type: 'natural',
    icon: '🇬🇧',
    color: '#1e40af',
    family: 'Germanic',
  },
  {
    slug: 'japanese',
    name: '日本語',
    description: 'Japanese. A rich language with unique concepts like komorebi (sunlight through leaves).',
    date: '2026-01-14T12:00:00',
    type: 'natural',
    icon: '🇯🇵',
    color: '#dc2626',
    family: 'Japonic',
  },
  {
    slug: 'spanish',
    name: 'Español',
    description: 'Spanish. Spoken by over 500 million people. A bridge to Latin America and Spain.',
    date: '2026-01-14T12:00:00',
    type: 'natural',
    icon: '🇪🇸',
    color: '#fbbf24',
    family: 'Romance',
  },
  // Markup languages
  {
    slug: 'mdx',
    name: 'MDX',
    description: 'Markdown with JSX. Write content with embedded React components.',
    date: '2026-01-14T12:00:00',
    type: 'markup',
    icon: '📄',
    color: '#f9ac00',
    family: 'Markdown',
  },
]

// Locations - physical and virtual space
export const locations: Location[] = [
  // Physical locations
  {
    slug: 'united-states',
    name: 'United States',
    description: 'A large tech ecosystem spanning multiple time zones and cultures.',
    date: '2026-01-14T12:00:00',
    type: 'physical',
    icon: '🇺🇸',
    color: '#3b82f6',
    timezone: 'America/New_York',
  },
  {
    slug: 'san-francisco',
    name: 'San Francisco',
    description: 'Historic center of tech innovation. Silicon Valley adjacent.',
    date: '2026-01-14T12:00:00',
    type: 'physical',
    parent: 'united-states',
    icon: '🌉',
    color: '#f97316',
    coordinates: [37.7749, -122.4194],
    timezone: 'America/Los_Angeles',
  },
  {
    slug: 'austin',
    name: 'Austin',
    description: 'Growing tech hub in Texas. Music, BBQ, and startups.',
    date: '2026-01-14T12:00:00',
    type: 'physical',
    parent: 'united-states',
    icon: '🤠',
    color: '#84cc16',
    coordinates: [30.2672, -97.7431],
    timezone: 'America/Chicago',
  },
  {
    slug: 'tokyo',
    name: 'Tokyo',
    description: 'Japan\'s tech capital. Gaming, anime, and cutting-edge innovation.',
    date: '2026-01-14T12:00:00',
    type: 'physical',
    icon: '🗼',
    color: '#dc2626',
    coordinates: [35.6762, 139.6503],
    timezone: 'Asia/Tokyo',
  },
  {
    slug: 'lagos',
    name: 'Lagos',
    description: 'Nigeria\'s tech hub. A rapidly growing ecosystem with unique challenges and solutions.',
    date: '2026-01-14T12:00:00',
    type: 'physical',
    icon: '🌍',
    color: '#22c55e',
    coordinates: [6.5244, 3.3792],
    timezone: 'Africa/Lagos',
  },
  // Virtual locations
  {
    slug: 'discord',
    name: 'Discord',
    description: 'Voice and text chat platform. Home to countless developer communities.',
    date: '2026-01-14T12:00:00',
    type: 'virtual',
    icon: '💬',
    color: '#5865f2',
  },
  {
    slug: 'github',
    name: 'GitHub',
    description: 'The world\'s largest code hosting platform. Where open source lives.',
    date: '2026-01-14T12:00:00',
    type: 'virtual',
    icon: '🐙',
    color: '#333333',
  },
  // The Web - versioned history from 1991 to present
  // Web 3.0 / Semantic Web (current - machine-readable web)
  {
    slug: 'the-web',
    name: 'The Web',
    description: 'The Semantic Web: machine-readable data with RDF, OWL, and linked data. AI integration, decentralized apps, and the data web.',
    date: '2026-01-14T12:00:00',
    type: 'virtual',
    icon: '🌐',
    color: '#8b5cf6',
    versionGroup: 'the-web',
    version: '3.0',
    versionNote: 'Semantic Web, linked data, machine-readable, AI-powered',
  },
  // Web 2.0 - The Social/Participatory Web (2004-present)
  {
    slug: 'the-web-2',
    name: 'The Web',
    description: 'The participatory web. User-generated content, social networks, blogs, wikis, AJAX. "The Web as Platform" - coined by Tim O\'Reilly in 2004.',
    date: '2004-10-05T12:00:00',
    type: 'virtual',
    icon: '🌐',
    color: '#22c55e',
    versionGroup: 'the-web',
    version: '2.0',
    versionNote: 'Social media, user-generated content, AJAX, rich web apps',
  },
  // Web 1.0 - The Read-Only Web (1991-2004)
  {
    slug: 'the-web-1',
    name: 'The Web',
    description: 'The read-only web. Static HTML pages, hyperlinks, and directories. Content creators were few; most users were consumers. GeoCities, Tripod, guestbooks.',
    date: '1991-08-06T12:00:00',
    type: 'virtual',
    icon: '🌐',
    color: '#6b7280',
    versionGroup: 'the-web',
    version: '1.0',
    versionNote: 'Static HTML, hyperlinks, GeoCities, read-only content',
  },
]

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
    date: '2026-01-10T12:00:00',
    tags: ['mdx', 'guide', 'getting-started'],
    communities: ['rendered-useful', 'learners'],
    readingTime: 4,
    featured: true,
    concepts: ['content-systems'],
    languages: ['mdx', 'english'],
  },
  {
    slug: 'building-render-useful',
    title: 'Building rendered_useful: A Modern React Portfolio & Blog',
    description: 'The story behind this site - why I built it, the tech stack choices, design decisions, and how you can use it as a starting point for your own projects.',
    author: 'scott-peabody',
    date: '2026-01-10T12:00:00',
    tags: ['react', 'typescript', 'tailwind', 'web-dev', 'design'],
    communities: ['rendered-useful', 'opensource'],
    readingTime: 8,
    featured: true,
    relatedProject: 'render-useful',
    concepts: ['platform-architecture', 'content-systems'],
    languages: ['typescript', 'english'],
    locations: ['github', 'the-web'],
  },
  {
    slug: 'building-tetris-in-react',
    title: 'Building Tetris in React: A Step-by-Step Guide',
    description: 'Learn how to build a fully functional Tetris game using React hooks, including game state management, collision detection, and keyboard controls.',
    author: 'scott-peabody',
    date: '2026-01-10T12:00:00',
    tags: ['react', 'typescript', 'gamedev', 'tutorial'],
    communities: ['gamedev', 'learners'],
    readingTime: 12,
    featured: true,
    relatedProject: 'tetris-react',
    concepts: ['game-development', 'game-loops', 'collision-detection', 'state-management'],
    languages: ['typescript', 'english'],
  },
  {
    slug: 'building-open-platforms',
    title: 'Building Open Platforms Without Repeating History',
    description: 'Reflecting on what made early social media great, why it changed, and how we can build open platforms that balance freedom with security.',
    author: 'scott-peabody',
    date: '2026-01-11T12:00:00',
    tags: ['security', 'open-source', 'web-dev', 'opinion'],
    communities: ['opensource', 'rendered-useful'],
    readingTime: 10,
    featured: true,
    concepts: ['open-platforms', 'platform-architecture'],
    languages: ['english'],
  },
  {
    slug: 'building-personal-spaces',
    title: 'Building Personal Spaces: Identity and Aliases',
    description: 'How I built the personal spaces feature for rendered_useful, enabling authors to have their own feeds, themes, and even alternate identities.',
    author: 'scott-peabody',
    date: '2026-01-16T12:00:00',
    tags: ['react', 'typescript', 'features', 'design', 'open-source'],
    communities: ['rendered-useful', 'opensource'],
    readingTime: 10,
    featured: true,
    concepts: ['platform-architecture', 'identity', 'content-systems'],
    languages: ['typescript', 'english'],
  },
  {
    slug: 'building-code-playground',
    title: 'Building a Code Playground: Running User Code Safely',
    description: 'How to build a code playground that runs user code safely using sandboxed iframes, and why it matters for interactive content.',
    author: 'scott-peabody',
    date: '2026-01-17T12:00:00',
    tags: ['react', 'typescript', 'security', 'tutorial', 'features'],
    communities: ['rendered-useful', 'learners'],
    readingTime: 12,
    featured: true,
    concepts: ['platform-architecture', 'content-systems'],
    languages: ['typescript', 'javascript', 'english'],
  },
  {
    slug: 'building-mdx-editor',
    title: 'Editing MDX Files',
    description: 'How I integrated MDXEditor to let users write and edit MDX content with a rich text interface, while keeping the flexibility of markdown.',
    author: 'scott-peabody',
    date: '2026-01-17T12:00:00',
    tags: ['react', 'typescript', 'mdx', 'editor', 'features'],
    communities: ['rendered-useful', 'learners'],
    readingTime: 10,
    featured: true,
    series: 'platform-foundations',
    concepts: ['platform-architecture', 'content-systems'],
    languages: ['typescript', 'mdx', 'english'],
  },
  {
    slug: 'custom-themes-demo',
    title: 'Custom Themes System',
    description: 'Demonstrating the custom theme system that allows articles to completely override the site\'s visual style.',
    author: 'scott-peabody',
    date: '2026-01-11T12:00:00',
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
    date: '2026-01-11T12:00:00',
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
    date: '2026-01-12T12:00:00',
    tags: ['features', 'documentation', 'design', 'open-source'],
    communities: ['rendered-useful'],
    series: 'platform-foundations',
    seriesOrder: 1,
    event: 'preliminary-foundations-hackathon',
    readingTime: 8,
    featured: true,
    concepts: ['platform-architecture', 'content-systems'],
    languages: ['english'],
    locations: ['the-web'],
  },
  // Current version - includes Versions feature
  {
    slug: 'time-as-foundation-v2',
    title: 'Time as a Foundation',
    description: 'Why time needs to be more than a sort field. Exploring series, events, versions, and temporal collections as building blocks for how content connects and evolves.',
    author: 'scott-peabody',
    date: '2026-01-13T12:00:00',
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
    concepts: ['platform-architecture', 'content-systems'],
    languages: ['english', 'typescript'],
    locations: ['the-web'],
  },
  // Original version - before Versions feature
  {
    slug: 'time-as-foundation-v1',
    title: 'Time as a Foundation',
    description: 'Why time needs to be more than a sort field. Exploring series, events, and temporal collections as building blocks for how content connects and evolves.',
    author: 'scott-peabody',
    date: '2026-01-13T12:00:00',
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
    date: '2026-01-13T12:00:00',
    tags: ['features', 'mdx', 'documentation'],
    communities: ['rendered-useful'],
    event: 'preliminary-foundations-hackathon',
    readingTime: 3,
    featured: false,
    concepts: ['content-systems'],
    languages: ['javascript', 'mdx', 'english'],
    locations: ['the-web'],
  },
  // Exploration article on space/location concepts
  {
    slug: 'space-as-context',
    title: 'Space as Foundation',
    description: 'A deep exploration of what space means for content: physical geography, virtual places, conceptual landscapes, and the role of language in shaping the spaces we inhabit. Now implemented.',
    author: 'scott-peabody',
    date: '2026-01-14T12:00:00',
    tags: ['architecture', 'design', 'vision', 'exploration', 'philosophy'],
    communities: ['rendered-useful'],
    readingTime: 12,
    featured: false,
    series: 'platform-foundations',
    seriesOrder: 3,
    concepts: ['platform-architecture', 'content-systems'],
    languages: ['english', 'typescript', 'mdx'],
    locations: ['united-states', 'the-web', 'github'],
  },
  // Versioning space dimensions article
  {
    slug: 'versioning-space-dimensions',
    title: 'Versioning Space: Capturing How Concepts, Languages, and Locations Change',
    description: 'Exploring how to model the evolution of conceptual, linguistic, and physical spaces over time, because space isn\'t static, it transforms.',
    author: 'scott-peabody',
    date: '2026-01-14T12:00:00',
    tags: ['architecture', 'typescript', 'philosophy', 'foundations'],
    communities: ['rendered-useful'],
    readingTime: 8,
    featured: false,
    series: 'platform-foundations',
    seriesOrder: 4,
    concepts: ['space-as-context', 'version-control', 'temporal-modeling'],
    languages: ['typescript', 'mdx'],
    locations: ['github', 'the-web'],
  },
  // Personal spaces and feeds article
  {
    slug: 'personal-spaces-and-feeds',
    title: 'Personal Spaces: Your Corner of the Platform',
    description: 'Exploring how personal feeds, MDX posts, and customizable spaces could work within the Time and Space framework.',
    author: 'scott-peabody',
    date: '2026-01-15T12:00:00',
    tags: ['architecture', 'philosophy', 'foundations', 'social'],
    communities: ['rendered-useful'],
    readingTime: 10,
    featured: false,
    series: 'platform-foundations',
    seriesOrder: 5,
    concepts: ['identity', 'space-as-context', 'temporal-modeling'],
    languages: ['mdx'],
    locations: ['the-web'],
  },
  {
    slug: 'rust-in-browser',
    title: 'Running Rust in the Browser',
    description: 'Compile and run Rust code directly in MDX articles using the Rust Playground API. Learn Rust basics with interactive examples.',
    author: 'scott-peabody',
    date: '2026-01-20T12:00:00',
    tags: ['rust', 'wasm', 'webassembly', 'systems-programming', 'interactive'],
    communities: ['creative-coding', 'learners', 'opensource'],
    readingTime: 10,
    featured: true,
    concepts: ['code-execution'],
    languages: ['rust', 'english'],
    locations: ['the-web'],
  },
]

export const projects: Project[] = [
  {
    slug: 'rust-runner',
    title: 'Rust Runner',
    description: 'Compile and run Rust code directly in MDX articles using the Rust Playground API. Features syntax highlighting, fullscreen mode, and support for Rust 2015/2018/2021 editions.',
    author: 'scott-peabody',
    date: '2026-01-20T12:00:00',
    tags: ['rust', 'wasm', 'webassembly', 'interactive'],
    communities: ['creative-coding', 'opensource', 'learners'],
    techStack: ['React', 'TypeScript', 'Rust Playground API'],
    type: 'integration',
    status: 'completed',
    featured: true,
    concepts: ['code-execution'],
    languages: ['typescript', 'rust'],
    locations: ['github', 'the-web'],
  },
  {
    slug: 'python-in-mdx',
    title: 'Python in MDX',
    description: 'Run Python code directly in articles using Pyodide. Interactive examples with matplotlib visualizations. No server required.',
    author: 'scott-peabody',
    date: '2026-01-20T12:00:00',
    tags: ['python', 'data-science', 'visualization', 'integration'],
    communities: ['creative-coding', 'opensource', 'learners'],
    techStack: ['Pyodide', 'WebAssembly', 'Matplotlib', 'NumPy', 'React', 'TypeScript'],
    type: 'integration',
    status: 'completed',
    featured: true,
    concepts: ['reactivity'],
    languages: ['typescript', 'python'],
    locations: ['github', 'the-web'],
  },
  {
    slug: 'tetris-react',
    title: 'Tetris',
    description: 'A classic Tetris game built entirely in React with TypeScript. Features smooth controls, scoring system, levels, and a next piece preview.',
    author: 'scott-peabody',
    date: '2026-01-10T12:00:00',
    tags: ['react', 'typescript', 'gamedev', 'game'],
    communities: ['gamedev', 'opensource'],
    techStack: ['React', 'TypeScript', 'Tailwind CSS'],
    type: 'game',
    status: 'completed',
    featured: true,
    concepts: ['game-development', 'game-loops', 'collision-detection', 'state-management'],
    languages: ['typescript'],
    locations: ['github', 'the-web'],
  },
  {
    slug: 'rubiks-cube',
    title: "Rubik's Cube",
    description: 'An interactive 3D Rubik\'s Cube puzzle built with React Three Fiber. Features smooth animations, scramble, solve, and manual controls.',
    author: 'scott-peabody',
    date: '2026-01-10T12:00:00',
    tags: ['react', 'typescript', 'threejs', 'gamedev', 'game'],
    communities: ['gamedev', 'creative-coding', 'opensource'],
    techStack: ['React', 'Three.js', 'React Three Fiber', 'Drei', 'TypeScript'],
    type: 'game',
    status: 'completed',
    featured: true,
    concepts: ['game-development', '3d-graphics'],
    languages: ['typescript'],
    locations: ['github', 'the-web'],
  },
  {
    slug: 'typing-game',
    title: 'WikiType',
    description: 'A typing speed test that fetches random Wikipedia articles. Practice typing while learning something new.',
    author: 'scott-peabody',
    date: '2026-01-10T12:00:00',
    tags: ['react', 'typescript', 'gamedev', 'game'],
    communities: ['gamedev', 'learners', 'opensource'],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Wikipedia API'],
    type: 'game',
    status: 'completed',
    featured: true,
    concepts: ['game-development'],
    languages: ['typescript', 'english'],
    locations: ['github', 'the-web'],
  },
  {
    slug: 'strudel-integration',
    title: 'Strudel Integration',
    description: 'Live coding music patterns directly in MDX articles using Strudel, a web-based TidalCycles port.',
    author: 'scott-peabody',
    date: '2026-01-18T12:00:00',
    tags: ['music', 'live-coding', 'creative-coding', 'integration'],
    communities: ['creative-coding', 'opensource'],
    techStack: ['Strudel', 'Web Audio API', 'React', 'TypeScript'],
    type: 'integration',
    status: 'completed',
    featured: true,
    concepts: ['reactivity'],
    languages: ['typescript', 'javascript'],
    locations: ['codeberg', 'the-web'],
  },
  {
    slug: 'whiteboard-tools',
    title: 'Whiteboard Tools',
    description: 'Embed interactive whiteboards in MDX articles using Excalidraw. Draw, diagram, and collaborate directly in the browser.',
    author: 'scott-peabody',
    date: '2026-01-19T12:00:00',
    tags: ['drawing', 'whiteboard', 'diagrams', 'creative-coding', 'integration'],
    communities: ['creative-coding', 'opensource'],
    techStack: ['Excalidraw', 'React', 'TypeScript'],
    type: 'tool',
    status: 'completed',
    featured: true,
    concepts: ['reactivity'],
    languages: ['typescript', 'javascript'],
    locations: ['github', 'the-web'],
  },
  {
    slug: 'jupyter-notebooks',
    title: 'Jupyter Notebooks Integration',
    description: 'Run interactive Jupyter notebooks directly in MDX articles using JupyterLite. No server required, all in the browser via WebAssembly.',
    author: 'scott-peabody',
    date: '2026-01-19T12:00:00',
    tags: ['notebooks', 'data-science', 'python', 'integration'],
    communities: ['creative-coding', 'opensource', 'learners'],
    techStack: ['JupyterLite', 'Pyodide', 'WebAssembly', 'React', 'TypeScript'],
    type: 'integration',
    status: 'completed',
    featured: true,
    concepts: ['reactivity'],
    languages: ['typescript', 'python'],
    locations: ['github', 'the-web'],
  },
]

// ============================================
// NOTEBOOKS: Interactive Jupyter notebooks
// ============================================

export const notebooks: Notebook[] = [
  {
    slug: 'getting-started-python',
    title: 'Getting Started with Python',
    description: 'Learn Python basics in an interactive notebook. Variables, data types, loops, functions, and more. All running in your browser.',
    author: 'scott-peabody',
    date: '2026-01-19T12:00:00',
    tags: ['python', 'beginner', 'tutorial'],
    concepts: [],
    languages: ['python'],
    communities: ['learners'],
    kernelLanguage: 'python',
    notebookUrl: '/jupyterlite/files/getting-started-python/getting-started-python.ipynb',
    featured: true,
  },
  {
    slug: 'data-visualization-intro',
    title: 'Introduction to Data Visualization',
    description: 'Create beautiful charts and graphs with matplotlib and pandas. Explore data visualization fundamentals interactively.',
    author: 'scott-peabody',
    date: '2026-01-19T12:00:00',
    tags: ['python', 'data-science', 'visualization', 'matplotlib', 'pandas'],
    concepts: [],
    languages: ['python'],
    communities: ['learners'],
    kernelLanguage: 'python',
    notebookUrl: '/jupyterlite/files/data-visualization-intro/data-visualization-intro.ipynb',
    featured: true,
  },
  {
    slug: 'numpy-fundamentals',
    title: 'NumPy Fundamentals',
    description: 'Master NumPy arrays and operations. Essential for data science, machine learning, and scientific computing.',
    author: 'scott-peabody',
    date: '2026-01-19T12:00:00',
    tags: ['python', 'numpy', 'data-science'],
    concepts: [],
    languages: ['python'],
    communities: ['learners'],
    kernelLanguage: 'python',
    notebookUrl: '/jupyterlite/files/numpy-fundamentals/numpy-fundamentals.ipynb',
  },
]

// ============================================
// PERSONAL SPACES: Posts, Feeds, Spaces
// ============================================

// Feeds - named collections of posts with ordering rules
export const feeds: Feed[] = [
  {
    slug: 'main',
    name: 'Main Feed',
    description: 'All posts in chronological order',
    author: 'scott-peabody',
    ordering: 'chronological',
    visibility: 'public',
  },
  {
    slug: 'building',
    name: 'Building',
    description: 'Updates on projects and experiments',
    author: 'scott-peabody',
    ordering: 'chronological',
    visibility: 'public',
    icon: '🔨',
    color: '#f59e0b',
  },
  {
    slug: 'thinking',
    name: 'Thinking',
    description: 'Questions, observations, and half-formed ideas',
    author: 'scott-peabody',
    ordering: 'chronological',
    visibility: 'public',
    icon: '💭',
    color: '#8b5cf6',
  },
  {
    slug: 'gamedev',
    name: 'Game Dev',
    description: 'Retro games, pixel art, and coding experiments',
    author: 'scott-peabody',
    alias: 'pixel-wizard',
    ordering: 'chronological',
    visibility: 'public',
    icon: '🎮',
    color: '#00ff00',
  },
]

// Posts - lightweight content between tweets and articles
export const posts: Post[] = [
  {
    slug: 'excalidraw-fullscreen',
    title: 'Added Fullscreen Mode to Excalidraw',
    content: `Just shipped a small but useful feature: fullscreen mode for the Excalidraw editor.

The implementation is straightforward - fixed positioning with a z-index overlay:

\`\`\`typescript
const [isFullscreen, setIsFullscreen] = useState(false);

// Handle Escape key to exit
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isFullscreen) {
      setIsFullscreen(false);
    }
  };
  
  if (isFullscreen) {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
  }
  
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.body.style.overflow = '';
  };
}, [isFullscreen]);
\`\`\`

Key details:
- Uses Lucide icons (Maximize2/Minimize2) for the toggle button
- Escape key exits fullscreen
- Body scroll is locked when fullscreen
- Works in both edit and view-only modes
- New \`showFullscreen\` prop (defaults to true)

Small quality-of-life improvements like this make a big difference when you're actually using a tool.`,
    author: 'scott-peabody',
    date: '2026-01-19T23:30:00Z',
    tags: ['building', 'excalidraw', 'ux'],
    concepts: [],
    languages: ['typescript', 'react'],
    feeds: ['main', 'building'],
    visibility: 'public',
  },
  {
    slug: 'hello-world',
    title: 'Hello, World',
    content: `This is my first post. Testing out the new personal spaces feature.

Posts are like articles, but lighter. They don't need to be polished. They can be:
- A quick thought
- A code snippet
- A question I'm wrestling with
- A link with commentary

Let's see how this goes.`,
    author: 'scott-peabody',
    date: '2026-01-16T10:00:00Z',
    tags: ['meta'],
    concepts: ['identity'],
    feeds: ['main'],
    visibility: 'public',
    pinned: true,
  },
  {
    slug: 'working-on-spaces',
    title: 'Building Personal Spaces',
    content: `Started implementing the personal spaces feature today. The idea is simple: give everyone their own corner of the platform.

\`\`\`typescript
interface Post {
  slug: string
  title?: string  // optional - posts can be untitled
  content: string
  visibility: 'draft' | 'public' | 'unlisted'
  // ...
}
\`\`\`

The interesting part is how feeds work. You can have multiple feeds (Building, Learning, Thinking) and each post can appear in one or more of them.`,
    author: 'scott-peabody',
    date: '2026-01-16T14:30:00Z',
    tags: ['building', 'architecture'],
    concepts: ['identity', 'platform-architecture'],
    languages: ['typescript'],
    feeds: ['main', 'building'],
    visibility: 'public',
  },
  {
    slug: 'feed-ordering',
    content: `Question I'm working through: should feeds default to chronological or let users pick?

Chronological is simple and honest. No algorithm deciding what's "relevant."

But sometimes order matters. A learning journal reads better oldest-first. A project log might want pinned posts at the top.

Current thinking: chronological by default, but you control the algorithm. Your feed, your rules.`,
    author: 'scott-peabody',
    date: '2026-01-16T16:45:00Z',
    tags: ['thinking', 'design'],
    concepts: ['identity'],
    feeds: ['main', 'thinking'],
    visibility: 'public',
  },
  // pixel-wizard gamedev posts
  {
    slug: 'gamedev-journey',
    title: '> INIT GAMEDEV.EXE',
    content: `Welcome to my gamedev corner. This is where I dump experiments, half-baked ideas, and pixel art disasters.

\`\`\`
████████████████████████████████
█  PIXEL WIZARD'S GAME LAB    █
█  ========================   █
█  [1] Current Projects       █
█  [2] Devlogs               █
█  [3] Pixel Art             █
█  [4] Exit                  █
████████████████████████████████
\`\`\`

Currently obsessed with: recreating classic games in modern frameworks.`,
    author: 'scott-peabody',
    alias: 'pixel-wizard',
    date: '2026-01-15T09:00:00Z',
    tags: ['gamedev', 'intro'],
    concepts: ['game-development'],
    feeds: ['gamedev'],
    visibility: 'public',
    pinned: true,
  },
  {
    slug: 'tetris-collision-deep-dive',
    title: 'Collision Detection: The Hard Way',
    content: `Spent 3 hours debugging why pieces were clipping through walls. Turns out I was checking collision AFTER moving, not before.

\`\`\`typescript
// WRONG - check after move
piece.y += 1
if (checkCollision(piece, board)) {
  piece.y -= 1  // too late, damage done
}

// RIGHT - check before move
if (!checkCollision({...piece, y: piece.y + 1}, board)) {
  piece.y += 1
}
\`\`\`

Lesson learned: always simulate the move first, then commit if safe.

> "The bug is never where you think it is." - Ancient Proverb`,
    author: 'scott-peabody',
    alias: 'pixel-wizard',
    date: '2026-01-15T14:20:00Z',
    tags: ['gamedev', 'tetris', 'debugging'],
    concepts: ['collision-detection', 'game-loops'],
    languages: ['typescript'],
    feeds: ['gamedev'],
    visibility: 'public',
  },
  {
    slug: 'pixel-art-process',
    title: '8x8 Character Sprites',
    content: `Working on a tiny sprite sheet. Constraints breed creativity.

\`\`\`
Frame 1:    Frame 2:    Frame 3:
  ██          ██          ██  
 ████       ████        ████ 
  ██          ██          ██  
 ████       █  █        ████ 
 █  █       █  █         ██  
 █  █        ██         █  █ 
\`\`\`

At 8x8, every pixel matters. You can't hide behind detail - it's all about silhouette and animation.

Tools: Aseprite + way too much coffee.`,
    author: 'scott-peabody',
    alias: 'pixel-wizard',
    date: '2026-01-16T11:00:00Z',
    tags: ['pixel-art', 'gamedev', 'art'],
    concepts: ['game-development'],
    feeds: ['gamedev'],
    visibility: 'public',
  },
  {
    slug: 'rubiks-cube-render',
    title: 'Rendering a 3D Cube in CSS',
    content: `Can you build a working Rubik's cube with just CSS transforms? Yes. Should you? ...also yes.

\`\`\`css
.cube-face {
  position: absolute;
  width: 150px;
  height: 150px;
  transform-style: preserve-3d;
}

.front  { transform: translateZ(75px); }
.back   { transform: rotateY(180deg) translateZ(75px); }
.right  { transform: rotateY(90deg) translateZ(75px); }
// ...
\`\`\`

The math for rotation animations was... intense. But seeing those faces actually rotate around the correct axis? *chef's kiss*`,
    author: 'scott-peabody',
    alias: 'pixel-wizard',
    date: '2026-01-16T15:30:00Z',
    tags: ['gamedev', 'css', '3d'],
    concepts: ['3d-graphics', 'game-development'],
    languages: ['typescript'],
    feeds: ['gamedev'],
    visibility: 'public',
  },
]

// Spaces - user customization for their page
export const spaces: Space[] = [
  {
    author: 'scott-peabody',
    theme: undefined, // uses default
    layout: undefined, // uses default
    pinnedContent: [
      { type: 'post', slug: 'hello-world' },
    ],
    sections: ['feed', 'articles', 'projects'],
    feeds: ['main'],
    defaultFeed: 'main',
  },
  {
    author: 'scott-peabody',
    alias: 'pixel-wizard',
    bio: 'Retro game enthusiast and pixel art dabbler. Where I share gamedev experiments and nostalgia-fueled projects.',
    theme: 'terminal',
    layout: 'minimal',
    pinnedContent: [
      { type: 'post', slug: 'gamedev-journey' },
    ],
    sections: ['feed', 'projects'],
    feeds: ['gamedev'],
    defaultFeed: 'gamedev',
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

export const getNotebook = (slug: string): Notebook | undefined =>
  notebooks.find((n) => n.slug === slug)

export const getNotebooksByAuthor = (authorSlug: string): Notebook[] =>
  notebooks.filter((n) => n.author === authorSlug && !n.draft)

export const getNotebooksByTag = (tag: string): Notebook[] =>
  notebooks.filter((n) => n.tags?.includes(tag) && !n.draft)

export const getFeaturedNotebooks = (): Notebook[] =>
  notebooks.filter((n) => n.featured && !n.draft)

export const getRecentNotebooks = (count: number = 5): Notebook[] =>
  [...notebooks]
    .filter((n) => !n.draft)
    .sort((a, b) => compareDates(a.date, b.date))
    .slice(0, count)

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

// ============================================
// SPACE FOUNDATION HELPERS
// ============================================

// ============================================================================
// VERSIONING HELPERS FOR SPACE DIMENSIONS
// ============================================================================

// Concept versioning helpers
export const getConceptVersions = (versionGroup: string): Concept[] =>
  concepts
    .filter((c) => c.versionGroup === versionGroup)
    .sort((a, b) => compareDates(a.date, b.date))

export const getLatestConcept = (versionGroup: string): Concept | undefined => {
  const versions = getConceptVersions(versionGroup)
  return versions[0] // compareDates sorts newest first
}

export const filterLatestConcepts = (conceptList: Concept[] = concepts): Concept[] => {
  const latestByGroup = new Map<string, Concept>()
  const standalones: Concept[] = []

  for (const concept of conceptList) {
    if (concept.versionGroup) {
      const existing = latestByGroup.get(concept.versionGroup)
      // compareDates returns negative when first arg is newer (descending order)
      if (!existing || compareDates(concept.date, existing.date) < 0) {
        latestByGroup.set(concept.versionGroup, concept)
      }
    } else {
      standalones.push(concept)
    }
  }

  return [...latestByGroup.values(), ...standalones]
}

// Language versioning helpers
export const getLanguageVersions = (versionGroup: string): Language[] =>
  languages
    .filter((l) => l.versionGroup === versionGroup)
    .sort((a, b) => compareDates(a.date, b.date))

export const getLatestLanguage = (versionGroup: string): Language | undefined => {
  const versions = getLanguageVersions(versionGroup)
  return versions[0] // compareDates sorts newest first
}

export const filterLatestLanguages = (languageList: Language[] = languages): Language[] => {
  const latestByGroup = new Map<string, Language>()
  const standalones: Language[] = []

  for (const lang of languageList) {
    if (lang.versionGroup) {
      const existing = latestByGroup.get(lang.versionGroup)
      // compareDates returns negative when first arg is newer (descending order)
      if (!existing || compareDates(lang.date, existing.date) < 0) {
        latestByGroup.set(lang.versionGroup, lang)
      }
    } else {
      standalones.push(lang)
    }
  }

  return [...latestByGroup.values(), ...standalones]
}

// Location versioning helpers
export const getLocationVersions = (versionGroup: string): Location[] =>
  locations
    .filter((l) => l.versionGroup === versionGroup)
    .sort((a, b) => compareDates(a.date, b.date))

export const getLatestLocation = (versionGroup: string): Location | undefined => {
  const versions = getLocationVersions(versionGroup)
  return versions[0] // compareDates sorts newest first
}

export const filterLatestLocations = (locationList: Location[] = locations): Location[] => {
  const latestByGroup = new Map<string, Location>()
  const standalones: Location[] = []

  for (const loc of locationList) {
    if (loc.versionGroup) {
      const existing = latestByGroup.get(loc.versionGroup)
      // compareDates returns negative when first arg is newer (descending order)
      if (!existing || compareDates(loc.date, existing.date) < 0) {
        latestByGroup.set(loc.versionGroup, loc)
      }
    } else {
      standalones.push(loc)
    }
  }

  return [...latestByGroup.values(), ...standalones]
}

// ============================================================================
// CONCEPT, LANGUAGE, LOCATION INFO HELPERS
// ============================================================================

// Concept helpers
export const getConcept = (slug: string): Concept | undefined =>
  concepts.find((c) => c.slug === slug)

export const getAllConcepts = (): Concept[] => concepts

export const getConceptInfo = (slug: string): ConceptInfo | undefined => {
  const concept = concepts.find((c) => c.slug === slug)
  if (!concept) return undefined

  const latestArticles = filterLatestArticles(articles)
  const latestProjects = filterLatestProjects(projects)

  const conceptArticles = latestArticles
    .filter((a) => a.concepts?.includes(slug))
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      description: a.description,
      date: a.date,
      type: 'article' as const,
      author: a.author,
    }))

  const conceptProjects = latestProjects
    .filter((p) => p.concepts?.includes(slug))
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      type: 'project' as const,
      author: p.author,
    }))

  const items = [...conceptArticles, ...conceptProjects].sort((a, b) => compareDates(a.date, b.date))

  return {
    slug: concept.slug,
    name: concept.name,
    description: concept.description,
    icon: concept.icon,
    color: concept.color,
    related: concept.related,
    prerequisites: concept.prerequisites,
    itemCount: items.length,
    items,
  }
}

export const getAllConceptInfo = (): ConceptInfo[] =>
  filterLatestConcepts(concepts).map((c) => getConceptInfo(c.slug)!).filter(Boolean)

export const getArticlesByConcept = (conceptSlug: string): Article[] =>
  filterLatestArticles(articles.filter((a) => a.concepts?.includes(conceptSlug)))

export const getProjectsByConcept = (conceptSlug: string): Project[] =>
  filterLatestProjects(projects.filter((p) => p.concepts?.includes(conceptSlug)))

// Language helpers
export const getLanguage = (slug: string): Language | undefined =>
  languages.find((l) => l.slug === slug)

export const getAllLanguages = (): Language[] => languages

export const getProgrammingLanguages = (): Language[] =>
  languages.filter((l) => l.type === 'programming')

export const getNaturalLanguages = (): Language[] =>
  languages.filter((l) => l.type === 'natural')

export const getLanguageInfo = (slug: string): LanguageInfo | undefined => {
  const language = languages.find((l) => l.slug === slug)
  if (!language) return undefined

  const latestArticles = filterLatestArticles(articles)
  const latestProjects = filterLatestProjects(projects)

  const languageArticles = latestArticles
    .filter((a) => a.languages?.includes(slug))
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      description: a.description,
      date: a.date,
      type: 'article' as const,
      author: a.author,
    }))

  const languageProjects = latestProjects
    .filter((p) => p.languages?.includes(slug))
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      type: 'project' as const,
      author: p.author,
    }))

  const items = [...languageArticles, ...languageProjects].sort((a, b) => compareDates(a.date, b.date))

  return {
    slug: language.slug,
    name: language.name,
    description: language.description,
    type: language.type,
    icon: language.icon,
    color: language.color,
    family: language.family,
    itemCount: items.length,
    items,
  }
}

export const getAllLanguageInfo = (): LanguageInfo[] =>
  filterLatestLanguages(languages).map((l) => getLanguageInfo(l.slug)!).filter(Boolean)

export const getArticlesByLanguage = (languageSlug: string): Article[] =>
  filterLatestArticles(articles.filter((a) => a.languages?.includes(languageSlug)))

export const getProjectsByLanguage = (languageSlug: string): Project[] =>
  filterLatestProjects(projects.filter((p) => p.languages?.includes(languageSlug)))

// Location helpers
export const getLocation = (slug: string): Location | undefined =>
  locations.find((l) => l.slug === slug)

export const getAllLocations = (): Location[] => locations

export const getPhysicalLocations = (): Location[] =>
  locations.filter((l) => l.type === 'physical')

export const getVirtualLocations = (): Location[] =>
  locations.filter((l) => l.type === 'virtual')

export const getLocationInfo = (slug: string): LocationInfo | undefined => {
  const location = locations.find((l) => l.slug === slug)
  if (!location) return undefined

  const latestArticles = filterLatestArticles(articles)
  const latestProjects = filterLatestProjects(projects)

  const locationArticles = latestArticles
    .filter((a) => a.locations?.includes(slug))
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      description: a.description,
      date: a.date,
      type: 'article' as const,
      author: a.author,
    }))

  const locationProjects = latestProjects
    .filter((p) => p.locations?.includes(slug))
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      type: 'project' as const,
      author: p.author,
    }))

  const items = [...locationArticles, ...locationProjects].sort((a, b) => compareDates(a.date, b.date))

  return {
    slug: location.slug,
    name: location.name,
    description: location.description,
    type: location.type,
    parent: location.parent,
    icon: location.icon,
    color: location.color,
    itemCount: items.length,
    items,
  }
}

export const getAllLocationInfo = (): LocationInfo[] =>
  filterLatestLocations(locations).map((l) => getLocationInfo(l.slug)!).filter(Boolean)

export const getArticlesByLocation = (locationSlug: string): Article[] =>
  filterLatestArticles(articles.filter((a) => a.locations?.includes(locationSlug)))

export const getProjectsByLocation = (locationSlug: string): Project[] =>
  filterLatestProjects(projects.filter((p) => p.locations?.includes(locationSlug)))

// ============================================
// POST, FEED, AND SPACE HELPERS
// ============================================

// Post helpers
export const getPost = (slug: string): Post | undefined =>
  posts.find((p) => p.slug === slug)

export const getPostsByAuthor = (authorSlug: string, alias?: string | null): Post[] =>
  posts.filter((p) => {
    if (p.visibility === 'draft') return false
    if (p.author !== authorSlug) return false
    // If alias is provided, only return posts with that alias
    // If alias is null/undefined, only return posts without an alias (main author posts)
    if (alias) {
      return p.alias === alias
    } else {
      return !p.alias
    }
  })

export const getPostsByFeed = (feedSlug: string, authorSlug?: string, alias?: string | null): Post[] => {
  let feedPosts = posts.filter((p) => 
    p.feeds?.includes(feedSlug) && p.visibility !== 'draft'
  )
  if (authorSlug) {
    feedPosts = feedPosts.filter((p) => p.author === authorSlug)
  }
  // Filter by alias: if alias provided, match it; if null/undefined, only non-alias posts
  if (alias) {
    feedPosts = feedPosts.filter((p) => p.alias === alias)
  } else {
    feedPosts = feedPosts.filter((p) => !p.alias)
  }
  return feedPosts.sort((a, b) => compareDates(a.date, b.date))
}

export const getPostsByConcept = (conceptSlug: string): Post[] =>
  posts.filter((p) => p.concepts?.includes(conceptSlug) && p.visibility !== 'draft')

export const getPostsByTag = (tag: string): Post[] =>
  posts.filter((p) => p.tags?.includes(tag) && p.visibility !== 'draft')

export const getRecentPosts = (count: number = 10, authorSlug?: string, alias?: string | null): Post[] => {
  let allPosts = posts.filter((p) => p.visibility !== 'draft')
  if (authorSlug) {
    allPosts = allPosts.filter((p) => p.author === authorSlug)
  }
  // Filter by alias: if alias provided, match it; if null/undefined, only non-alias posts
  if (alias) {
    allPosts = allPosts.filter((p) => p.alias === alias)
  } else if (authorSlug) {
    // Only filter out alias posts if we're looking at a specific author
    allPosts = allPosts.filter((p) => !p.alias)
  }
  return allPosts.sort((a, b) => compareDates(a.date, b.date)).slice(0, count)
}

// Feed helpers
export const getFeed = (slug: string, authorSlug?: string, alias?: string | null): Feed | undefined => {
  if (authorSlug) {
    return feeds.find((f) => {
      if (f.slug !== slug || f.author !== authorSlug) return false
      if (alias) {
        return f.alias === alias
      } else {
        return !f.alias
      }
    })
  }
  return feeds.find((f) => f.slug === slug)
}

export const getFeedsByAuthor = (authorSlug: string, alias?: string | null): Feed[] =>
  feeds.filter((f) => {
    if (f.author !== authorSlug || f.visibility === 'private') return false
    // Filter by alias: if alias provided, match it; if null/undefined, only non-alias feeds
    if (alias) {
      return f.alias === alias
    } else {
      return !f.alias
    }
  })

export const getFeedInfo = (feedSlug: string, authorSlug: string, alias?: string | null): FeedInfo | undefined => {
  const feed = feeds.find((f) => {
    if (f.slug !== feedSlug || f.author !== authorSlug) return false
    if (alias) {
      return f.alias === alias
    } else {
      return !f.alias
    }
  })
  if (!feed) return undefined

  const feedPosts = getPostsByFeed(feedSlug, authorSlug, alias)
  const postInfos: PostInfo[] = feedPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.content.slice(0, 200) + (p.content.length > 200 ? '...' : ''),
    author: p.author,
    alias: p.alias,
    date: p.date,
    tags: p.tags || [],
    visibility: p.visibility,
  }))

  return {
    slug: feed.slug,
    name: feed.name,
    description: feed.description,
    author: feed.author,
    alias: feed.alias,
    ordering: feed.ordering,
    visibility: feed.visibility,
    icon: feed.icon,
    color: feed.color,
    postCount: postInfos.length,
    posts: postInfos,
  }
}

// Space helpers
export const getSpace = (authorSlug: string, alias?: string): Space | undefined => {
  if (alias) {
    return spaces.find((s) => s.author === authorSlug && s.alias === alias)
  }
  return spaces.find((s) => s.author === authorSlug && !s.alias)
}

export const getSpaceWithContent = (authorSlug: string, alias?: string): {
  space: Space | undefined
  author: Author | undefined
  feeds: FeedInfo[]
  pinnedPosts: Post[]
  recentPosts: Post[]
} => {
  const space = alias 
    ? spaces.find((s) => s.alias === alias)
    : spaces.find((s) => s.author === authorSlug && !s.alias)
  const author = getAuthor(authorSlug)
  
  // Get feeds for this specific space (alias or main)
  const authorFeeds = getFeedsByAuthor(authorSlug, alias || undefined)
    .map((f) => getFeedInfo(f.slug, authorSlug, alias || undefined)!)
    .filter(Boolean)
  
  const pinnedPosts = space?.pinnedContent
    ?.filter((c) => c.type === 'post')
    .map((c) => getPost(c.slug)!)
    .filter(Boolean) || []
  
  // Get recent posts for this specific space (alias or main)
  const recentPosts = getRecentPosts(10, authorSlug, alias || undefined)

  return {
    space,
    author,
    feeds: authorFeeds,
    pinnedPosts,
    recentPosts,
  }
}

// Get all spaces for an author (main + aliases)
export const getSpacesByAuthor = (authorSlug: string): Space[] =>
  spaces.filter((s) => s.author === authorSlug)

// Get a specific space by alias
export const getSpaceByAlias = (alias: string): Space | undefined =>
  spaces.find((s) => s.alias === alias)
