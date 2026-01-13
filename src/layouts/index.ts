// Layout presets for articles and projects
// These control page structure without allowing arbitrary HTML/CSS

export interface LayoutPreset {
  name: string
  description: string
  options: {
    // Content width
    contentWidth: 'narrow' | 'default' | 'wide' | 'full'
    
    // Header options
    showHeader: boolean
    headerStyle: 'default' | 'minimal' | 'hero' | 'centered'
    
    // Metadata display
    showAuthor: boolean
    showDate: boolean
    showReadingTime: boolean
    showTags: boolean
    
    // Navigation
    showBackLink: boolean
    showTableOfContents: boolean
    tocPosition: 'left' | 'right' | 'none'
    
    // Footer/related content
    showRelatedArticles: boolean
    showAuthorCard: boolean
    
    // Chrome
    hideNavbar: boolean
    hideFooter: boolean
    navbarStyle: 'default' | 'transparent' | 'minimal'
    
    // Spacing
    verticalSpacing: 'compact' | 'default' | 'relaxed'
  }
}

export const layouts: Record<string, LayoutPreset> = {
  // Default article layout
  default: {
    name: 'Default',
    description: 'Standard article layout with all features',
    options: {
      contentWidth: 'default',
      showHeader: true,
      headerStyle: 'default',
      showAuthor: true,
      showDate: true,
      showReadingTime: true,
      showTags: true,
      showBackLink: true,
      showTableOfContents: false,
      tocPosition: 'none',
      showRelatedArticles: true,
      showAuthorCard: true,
      hideNavbar: false,
      hideFooter: false,
      navbarStyle: 'default',
      verticalSpacing: 'default',
    },
  },

  // Minimal - clean reading experience
  minimal: {
    name: 'Minimal',
    description: 'Clean, distraction-free reading',
    options: {
      contentWidth: 'narrow',
      showHeader: true,
      headerStyle: 'minimal',
      showAuthor: false,
      showDate: true,
      showReadingTime: false,
      showTags: false,
      showBackLink: true,
      showTableOfContents: false,
      tocPosition: 'none',
      showRelatedArticles: false,
      showAuthorCard: false,
      hideNavbar: false,
      hideFooter: false,
      navbarStyle: 'minimal',
      verticalSpacing: 'relaxed',
    },
  },

  // Documentation - with table of contents
  docs: {
    name: 'Documentation',
    description: 'Documentation style with table of contents',
    options: {
      contentWidth: 'wide',
      showHeader: true,
      headerStyle: 'minimal',
      showAuthor: false,
      showDate: true,
      showReadingTime: true,
      showTags: true,
      showBackLink: true,
      showTableOfContents: true,
      tocPosition: 'right',
      showRelatedArticles: true,
      showAuthorCard: false,
      hideNavbar: false,
      hideFooter: false,
      navbarStyle: 'default',
      verticalSpacing: 'default',
    },
  },

  // Showcase - full width for visual content
  showcase: {
    name: 'Showcase',
    description: 'Full-width layout for visual projects',
    options: {
      contentWidth: 'full',
      showHeader: true,
      headerStyle: 'hero',
      showAuthor: true,
      showDate: true,
      showReadingTime: false,
      showTags: true,
      showBackLink: true,
      showTableOfContents: false,
      tocPosition: 'none',
      showRelatedArticles: true,
      showAuthorCard: true,
      hideNavbar: false,
      hideFooter: false,
      navbarStyle: 'transparent',
      verticalSpacing: 'default',
    },
  },

  // Immersive - minimal chrome, focus on content
  immersive: {
    name: 'Immersive',
    description: 'Full immersion with hidden navigation',
    options: {
      contentWidth: 'wide',
      showHeader: true,
      headerStyle: 'hero',
      showAuthor: false,
      showDate: false,
      showReadingTime: false,
      showTags: false,
      showBackLink: false,
      showTableOfContents: false,
      tocPosition: 'none',
      showRelatedArticles: false,
      showAuthorCard: false,
      hideNavbar: true,
      hideFooter: true,
      navbarStyle: 'transparent',
      verticalSpacing: 'relaxed',
    },
  },

  // Centered - elegant centered layout
  centered: {
    name: 'Centered',
    description: 'Elegant centered content layout',
    options: {
      contentWidth: 'narrow',
      showHeader: true,
      headerStyle: 'centered',
      showAuthor: true,
      showDate: true,
      showReadingTime: true,
      showTags: true,
      showBackLink: true,
      showTableOfContents: false,
      tocPosition: 'none',
      showRelatedArticles: false,
      showAuthorCard: true,
      hideNavbar: false,
      hideFooter: false,
      navbarStyle: 'minimal',
      verticalSpacing: 'relaxed',
    },
  },
}

export function getLayout(name: string): LayoutPreset | undefined {
  return layouts[name]
}

export function getLayoutNames(): string[] {
  return Object.keys(layouts)
}

export function getLayoutOptions(name: string): LayoutPreset['options'] | undefined {
  return layouts[name]?.options
}

// Get CSS classes for content width
export function getContentWidthClass(width: LayoutPreset['options']['contentWidth']): string {
  switch (width) {
    case 'narrow':
      return 'max-w-2xl'
    case 'default':
      return 'max-w-4xl'
    case 'wide':
      return 'max-w-6xl'
    case 'full':
      return 'max-w-full px-4'
  }
}

// Get CSS classes for vertical spacing
export function getSpacingClass(spacing: LayoutPreset['options']['verticalSpacing']): string {
  switch (spacing) {
    case 'compact':
      return 'space-y-4'
    case 'default':
      return 'space-y-8'
    case 'relaxed':
      return 'space-y-12'
  }
}
