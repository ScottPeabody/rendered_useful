import type { ComponentType } from 'react'

export interface ArticleFrontmatter {
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  featured?: boolean
  readingTime?: number
  coverImage?: string
  // Theme customization
  theme?: string // preset name: 'cyberpunk', 'terminal', 'retro', etc.
  // Layout customization
  layout?: string // preset name: 'default', 'minimal', 'docs', 'showcase', etc.
  // Individual layout overrides
  hideNavbar?: boolean
  hideFooter?: boolean
  contentWidth?: 'narrow' | 'default' | 'wide' | 'full'
  showTableOfContents?: boolean
}

export interface ProjectFrontmatter {
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  type: 'game' | 'app' | 'widget' | 'tool' | 'library' | 'other'
  status: 'active' | 'completed' | 'wip' | 'archived'
  techStack: string[]
  demoUrl?: string
  githubUrl?: string
  coverImage?: string
  featured?: boolean
  // Theme customization
  theme?: string // preset name
  // Layout customization  
  layout?: string // preset name
  // Individual layout overrides
  hideNavbar?: boolean
  hideFooter?: boolean
  contentWidth?: 'narrow' | 'default' | 'wide' | 'full'
}

export interface SpacePageFrontmatter {
  title: string
  description?: string
  author?: string         // author slug — page attribution (mainly for group spaces)
  date?: string
  // Theme customization — overrides the space's theme for this page
  theme?: string
  // Layout customization — overrides the space's layout for this page
  layout?: string
  // Individual layout overrides
  hideNavbar?: boolean
  hideFooter?: boolean
  contentWidth?: 'narrow' | 'default' | 'wide' | 'full'
  verticalSpacing?: 'compact' | 'default' | 'relaxed'
  showSpaceHeader?: boolean // default true; false = immersive page without the profile header
}

export interface MDXModule<T> {
  default: ComponentType
  frontmatter?: T
}

const articleModules = import.meta.glob<MDXModule<ArticleFrontmatter>>(
  '/content/articles/*.mdx',
  { eager: false }
)

const projectModules = import.meta.glob<MDXModule<ProjectFrontmatter>>(
  '/content/projects/*.mdx',
  { eager: false }
)

// Space pages live exactly one directory deep: content/spaces/<space>/<page>.mdx
const spacePageModules = import.meta.glob<MDXModule<SpacePageFrontmatter>>(
  '/content/spaces/*/*.mdx',
  { eager: false }
)

export async function loadArticle(slug: string): Promise<{
  Content: ComponentType
  frontmatter: ArticleFrontmatter
} | null> {
  const path = `/content/articles/${slug}.mdx`
  const loader = articleModules[path]
  
  if (!loader) {
    return null
  }
  
  try {
    const module = await loader()
    return {
      Content: module.default,
      frontmatter: module.frontmatter || {} as ArticleFrontmatter,
    }
  } catch (error) {
    console.error(`Failed to load article: ${slug}`, error)
    return null
  }
}

export async function loadProject(slug: string): Promise<{
  Content: ComponentType
  frontmatter: ProjectFrontmatter
} | null> {
  const path = `/content/projects/${slug}.mdx`
  const loader = projectModules[path]
  
  if (!loader) {
    return null
  }
  
  try {
    const module = await loader()
    return {
      Content: module.default,
      frontmatter: module.frontmatter || {} as ProjectFrontmatter,
    }
  } catch (error) {
    console.error(`Failed to load project: ${slug}`, error)
    return null
  }
}

export async function loadSpacePage(spaceSlug: string, pageSlug: string): Promise<{
  Content: ComponentType
  frontmatter: SpacePageFrontmatter
} | null> {
  const path = `/content/spaces/${spaceSlug}/${pageSlug}.mdx`
  const loader = spacePageModules[path]

  if (!loader) {
    return null
  }

  try {
    const module = await loader()
    return {
      Content: module.default,
      frontmatter: module.frontmatter || {} as SpacePageFrontmatter,
    }
  } catch (error) {
    console.error(`Failed to load space page: ${spaceSlug}/${pageSlug}`, error)
    return null
  }
}

// Check if an article MDX file exists
export function hasArticleMDX(slug: string): boolean {
  return `/content/articles/${slug}.mdx` in articleModules
}

// Check if a project MDX file exists
export function hasProjectMDX(slug: string): boolean {
  return `/content/projects/${slug}.mdx` in projectModules
}

// Check if a space page MDX file exists
export function hasSpacePageMDX(spaceSlug: string, pageSlug: string): boolean {
  return `/content/spaces/${spaceSlug}/${pageSlug}.mdx` in spacePageModules
}
