import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import Tag from './Tag'
import { getAuthor } from '../../data/content'
import { formatDate } from '../../lib/time'
import type { Notebook } from '../../types'

interface NotebookCardProps {
  notebook: Notebook
  variant?: 'card' | 'list'
  className?: string
}

// Get kernel icon
const getKernelIcon = (kernel: string) => {
  switch (kernel) {
    case 'python': return '🐍'
    case 'javascript': return '📜'
    case 'r': return '📊'
    case 'julia': return '🔮'
    default: return '📓'
  }
}

export default function NotebookCard({ notebook, variant = 'card', className = '' }: NotebookCardProps) {
  const author = getAuthor(notebook.author)
  const linkTo = `/notebooks/${notebook.slug}`

  // List variant
  if (variant === 'list') {
    return (
      <motion.article
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
        className={`group relative flex items-start gap-4 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] card-hover ${className}`}
      >
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Top row: Title + Kernel badge */}
          <div className="flex items-start gap-2 mb-1">
            <Link to={linkTo} className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors truncate">
                {notebook.title}
              </h3>
            </Link>
            <span className="shrink-0 px-2 py-0.5 text-xs font-medium bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] rounded-full flex items-center gap-1">
              {getKernelIcon(notebook.kernelLanguage)} {notebook.kernelLanguage}
            </span>
            {notebook.featured && (
              <span className="shrink-0 px-2 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-full">
                Featured
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-[var(--color-text-muted)] line-clamp-1 mb-2">
            {notebook.description}
          </p>

          {/* Tags & Meta row */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Tags */}
            {notebook.tags && notebook.tags.length > 0 && (
              <div className="flex items-center gap-1.5">
                {notebook.tags.slice(0, 2).map((tag) => (
                  <Tag key={tag} name={tag} size="sm" />
                ))}
                {notebook.tags.length > 2 && (
                  <span className="text-xs text-[var(--color-text-muted)]">+{notebook.tags.length - 2}</span>
                )}
              </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
              <Calendar size={12} />
              {formatDate(notebook.date)}
            </div>

            {/* Author */}
            {author && (
              <Link
                to={`/author/${author.slug}`}
                className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <img src={author.avatar} alt={author.name} className="w-4 h-4 rounded-full" />
                {author.name}
              </Link>
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
      className={`group relative bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden card-hover ${className}`}
    >
      {/* Header with kernel badge */}
      <div className="p-4 pb-0">
        <div className="flex items-center justify-between mb-3">
          <span className="px-2 py-0.5 text-xs font-medium bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] rounded-full flex items-center gap-1">
            {getKernelIcon(notebook.kernelLanguage)} {notebook.kernelLanguage}
          </span>
          {notebook.featured && (
            <span className="px-2 py-0.5 text-xs font-medium bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-full">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-0">
        <Link to={linkTo}>
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors mb-2 line-clamp-2">
            {notebook.title}
          </h3>
        </Link>

        <p className="text-sm text-[var(--color-text-muted)] mb-4 line-clamp-2">
          {notebook.description}
        </p>

        {/* Tags */}
        {notebook.tags && notebook.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {notebook.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} name={tag} size="sm" />
            ))}
            {notebook.tags.length > 3 && (
              <span className="text-xs text-[var(--color-text-muted)]">+{notebook.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
          {author && (
            <Link
              to={`/author/${author.slug}`}
              className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <img src={author.avatar} alt={author.name} className="w-5 h-5 rounded-full" />
              {author.name}
            </Link>
          )}
          <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
            <Calendar size={12} />
            {formatDate(notebook.date)}
          </div>
        </div>
      </div>
    </motion.article>
  )
}
