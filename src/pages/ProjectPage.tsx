import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, type ComponentType } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Github, Calendar, AlertTriangle } from 'lucide-react'
import Button from '../components/ui/Button'
import Tag from '../components/ui/Tag'
import VersionSelector from '../components/ui/VersionSelector'
import { formatDate } from '../lib/time'
import { TechStack } from '../components/mdx'
import MDXContentProvider from '../components/MDXContentProvider'
import { getProject, getAuthor, getArticlesByTag, getProjectVersionInfo, getLatestProjectVersion } from '../data/content'
import { loadProject, hasProjectMDX, type ProjectFrontmatter } from '../lib/mdx'
import { useArticleTheme } from '../hooks/useArticleTheme'
import Card from '../components/ui/Card'
import NotFoundPage from './NotFoundPage'

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProject(slug) : undefined
  const author = project ? getAuthor(project.author) : undefined
  
  // Version support
  const versionInfo = slug ? getProjectVersionInfo(slug) : []
  const latestVersion = slug ? getLatestProjectVersion(slug) : undefined
  const isLatestVersion = !latestVersion || project?.slug === latestVersion.slug
  const hasVersions = versionInfo.length > 1
  
  // State for MDX content and frontmatter
  const [MDXContent, setMDXContent] = useState<ComponentType | null>(null)
  const [frontmatter, setFrontmatter] = useState<ProjectFrontmatter | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Check if this project has MDX content
  const hasMDX = slug ? hasProjectMDX(slug) : false
  
  // Apply custom theme from frontmatter
  useArticleTheme({ theme: frontmatter?.theme })
  
  // Load MDX content if available
  useEffect(() => {
    if (!slug || !hasMDX) {
      setIsLoading(false) // eslint-disable-line react-hooks/set-state-in-effect
      return
    }
    
    setIsLoading(true)
    loadProject(slug).then((result) => {
      if (result) {
        setMDXContent(() => result.Content)
        setFrontmatter(result.frontmatter)
      }
      setIsLoading(false)
    })
  }, [slug, hasMDX])

  if (!project) {
    return <NotFoundPage />
  }

  // Get related articles based on project tags
  const relatedArticles = project.tags
    .flatMap((tag) => getArticlesByTag(tag))
    .filter((article, index, self) => 
      self.findIndex((a) => a.slug === article.slug) === index
    )
    .slice(0, 3)

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Older version banner */}
          {hasVersions && !isLatestVersion && latestVersion && (
            <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300">
              <AlertTriangle size={20} />
              <div className="flex-1">
                <p className="font-medium">You're viewing an older version</p>
                <p className="text-sm opacity-80">
                  This is version {project.version || 'unknown'}. 
                  <Link 
                    to={`/projects/${latestVersion.slug}`}
                    className="underline hover:no-underline ml-1"
                  >
                    View the latest version →
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              project.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
              project.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
              project.status === 'wip' ? 'bg-amber-500/20 text-amber-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {project.status.toUpperCase()}
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--color-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
              {project.type}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            {project.title}
          </h1>

          <p className="text-xl text-[var(--color-text-secondary)] mb-6">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <Tag key={tag} name={tag} />
            ))}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--color-text-muted)] mb-8">
            {author && (
              <Link
                to={`/author/${author.slug}`}
                className="flex items-center gap-2 hover:text-[var(--color-text-primary)] transition-colors"
              >
                <img src={author.avatar} alt={author.name} className="w-6 h-6 rounded-full" />
                <span>{author.name}</span>
              </Link>
            )}
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              {formatDate(project.date)}
            </span>
            {/* Version selector */}
            {hasVersions && (
              <VersionSelector versions={versionInfo} basePath="/projects" />
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-12">
            {project.demoUrl && (
              <Button href={project.demoUrl} icon={<ExternalLink size={18} />}>
                View Demo
              </Button>
            )}
            {project.githubUrl && (
              <Button href={project.githubUrl} variant="secondary" icon={<Github size={18} />}>
                View Source
              </Button>
            )}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
            Tech Stack
          </h2>
          <TechStack items={project.techStack} size="lg" />
        </motion.section>

        {/* Project Content */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose max-w-none mb-12"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-accent-primary)]"></div>
            </div>
          ) : MDXContent ? (
            <MDXContentProvider>
              <MDXContent />
            </MDXContentProvider>
          ) : (
            <div className="p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
              <p className="text-[var(--color-text-muted)]">
                No content file found for this project.
                <br />
                Create <code className="px-1.5 py-0.5 bg-[var(--color-surface-elevated)] rounded text-sm">content/projects/{slug}.mdx</code> to add content.
              </p>
            </div>
          )}
        </motion.section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedArticles.map((article) => (
                <Card
                  key={article.slug}
                  contentType="article"
                  {...article}
                  authorSlug={article.author}
                />
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
}
