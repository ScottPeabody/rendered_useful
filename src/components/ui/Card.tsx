import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink, Github, Calendar, Clock } from 'lucide-react'
import Tag from './Tag'
import { getAuthor } from '../../data/content'
import { formatDate } from '../../lib/time'

interface CardProps {
  contentType: 'article' | 'project' | 'notebook'
  variant?: 'card' | 'list'
  title: string
  description: string
  slug: string
  tags: string[]
  authorSlug: string
  date: string
  coverImage?: string
  featured?: boolean
  readingTime?: number
  demoUrl?: string
  githubUrl?: string
  techStack?: string[]
  className?: string
  // Allow project's type field to pass through without error
  type?: 'game' | 'app' | 'widget' | 'tool' | 'library' | 'integration' | 'other'
}

export default function Card({
  contentType,
  variant = 'card',
  title,
  description,
  slug,
  tags,
  authorSlug,
  date,
  coverImage,
  featured,
  readingTime,
  demoUrl,
  githubUrl,
  techStack,
  className = '',
}: CardProps) {
  const author = getAuthor(authorSlug)
  const linkTo = contentType === 'article' 
    ? `/articles/${slug}` 
    : contentType === 'notebook'
    ? `/notebooks/${slug}`
    : `/projects/${slug}`

  // List variant
  if (variant === 'list') {
    return (
      <motion.article
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
        className={`group relative flex items-start gap-4 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] card-hover ${className}`}
      >
        {/* Cover Image (smaller for list) */}
        {coverImage && (
          <Link to={linkTo} className="shrink-0 w-24 h-24 rounded-lg overflow-hidden">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Top row: Title + Featured badge */}
          <div className="flex items-start gap-2 mb-1">
            <Link to={linkTo} className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors truncate">
                {title}
              </h3>
            </Link>
            {featured && (
              <span className="shrink-0 px-2 py-0.5 text-xs font-medium bg-[var(--color-accent-primary)] text-white rounded-full">
                Featured
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-[var(--color-text-muted)] line-clamp-1 mb-2">
            {description}
          </p>

          {/* Tags & Meta row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Tags */}
            <div className="flex items-center gap-1.5">
              {tags.slice(0, 2).map((tag) => (
                <Tag key={tag} name={tag} size="sm" />
              ))}
              {tags.length > 2 && (
                <span className="text-xs text-[var(--color-text-muted)]">+{tags.length - 2}</span>
              )}
            </div>

            {/* Divider */}
            <span className="text-[var(--color-border)]">•</span>

            {/* Meta Info */}
            <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
              {author && (
                <Link
                  to={`/author/${author.slug}`}
                  className="flex items-center gap-1.5 hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <img src={author.avatar} alt={author.name} className="w-4 h-4 rounded-full" />
                  <span>{author.name}</span>
                </Link>
              )}
              {readingTime !== undefined && readingTime > 0 && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {readingTime} min
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(date, { format: 'monthDay' })}
              </span>
            </div>

            {/* Project Links (inline for list) */}
            {(demoUrl || githubUrl) && (
              <>
                <span className="text-[var(--color-border)]">•</span>
                <div className="flex items-center gap-2">
                  {demoUrl && (
                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-[var(--color-accent-primary)] hover:underline"
                    >
                      <ExternalLink size={12} />
                      Demo
                    </a>
                  )}
                  {githubUrl && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                    >
                      <Github size={12} />
                      Code
                    </a>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.article>
    )
  }

  // Card variant (default)
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex flex-col bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden card-hover ${className}`}
    >
      {/* Cover Image */}
      {coverImage && (
        <Link to={linkTo} className="block aspect-video overflow-hidden relative">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Featured Badge - on cover image if present */}
          {featured && (
            <div className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-[var(--color-accent-primary)] text-white rounded-full">
              Featured
            </div>
          )}
        </Link>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col p-6">
        {/* Tags row with Featured badge if no cover image */}
        <div className="flex items-start gap-2 mb-3">
          <div className="flex flex-wrap gap-2 flex-1">
            {tags.slice(0, 3).map((tag) => (
              <Tag key={tag} name={tag} size="sm" />
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-[var(--color-text-muted)]">+{tags.length - 3}</span>
            )}
          </div>
          {/* Featured Badge - inline if no cover image */}
          {featured && !coverImage && (
            <span className="shrink-0 px-2 py-1 text-xs font-medium bg-[var(--color-accent-primary)] text-white rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <Link to={linkTo}>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="mt-2 text-sm text-[var(--color-text-muted)] line-clamp-2 flex-1">
          {description}
        </p>

        {/* Tech Stack (for projects) */}
        {techStack && techStack.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs text-[var(--color-text-secondary)] bg-[var(--color-surface-elevated)] rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Meta & Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-border)]">
          {/* Author */}
          {author && (
            <Link
              to={`/author/${author.slug}`}
              className="flex items-center gap-2 group/author"
            >
              <img
                src={author.avatar}
                alt={author.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-[var(--color-text-muted)] group-hover/author:text-[var(--color-text-primary)] transition-colors">
                {author.name}
              </span>
            </Link>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
            {readingTime !== undefined && readingTime > 0 && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {readingTime} min
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Project Links */}
        {(demoUrl || githubUrl) && (
          <div className="flex items-center gap-2 mt-4">
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium !text-white bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-secondary)] rounded-lg transition-colors"
              >
                <ExternalLink size={14} />
                Demo
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface-elevated)] hover:bg-[var(--color-border)] rounded-lg transition-colors"
              >
                <Github size={14} />
                Code
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  )
}
