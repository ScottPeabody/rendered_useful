import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, ChevronRight, List } from 'lucide-react'
import { getAllSeries, getSeriesInfo } from '../data/content'
import NotFoundPage from './NotFoundPage'

// Individual series view
function SeriesDetailView({ slug }: { slug: string }) {
  const seriesInfo = getSeriesInfo(slug)
  
  if (!seriesInfo) {
    return <NotFoundPage />
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/series"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          All Series
        </Link>

        {/* Series header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
              seriesInfo.status === 'completed' 
                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
            }`}>
              {seriesInfo.status === 'completed' ? 'Complete' : 'Ongoing'}
            </span>
            <span className="text-sm text-[var(--color-text-muted)]">
              {seriesInfo.itemCount} {seriesInfo.itemCount === 1 ? 'part' : 'parts'}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            {seriesInfo.title}
          </h1>
          
          <p className="text-lg text-[var(--color-text-secondary)]">
            {seriesInfo.description}
          </p>
        </motion.div>

        {/* Series items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {seriesInfo.items.map((item, index) => {
            const path = item.type === 'article' 
              ? `/articles/${item.slug}` 
              : `/projects/${item.slug}`
            
            return (
              <Link
                key={item.slug}
                to={path}
                className="block p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/50 transition-all group"
              >
                <div className="flex items-start gap-4">
                  {/* Order number */}
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] font-semibold">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]">
                        {item.type}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors mb-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">
                      {item.description}
                    </p>
                    
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.tags.slice(0, 4).map(tag => (
                          <span 
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <ChevronRight 
                    size={20} 
                    className="flex-shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-primary)] transition-colors" 
                  />
                </div>
              </Link>
            )
          })}
        </motion.div>

        {/* Ongoing notice */}
        {seriesInfo.status === 'ongoing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-center"
          >
            <p className="text-sm text-blue-600 dark:text-blue-400">
              This series is ongoing. More parts will be added over time.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// All series listing
function AllSeriesView() {
  const allSeries = getAllSeries()

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-accent-primary)]/10 mb-6">
            <List size={32} className="text-[var(--color-accent-primary)]" />
          </div>
          
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            Series
          </h1>
          
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Structured collections of related content. Follow along as we explore topics in depth, one part at a time.
          </p>
        </motion.div>

        {/* Series list */}
        <div className="space-y-6">
          {allSeries.map((series, index) => (
            <motion.div
              key={series.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/series/${series.slug}`}
                className="block p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/50 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        series.status === 'completed' 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}>
                        {series.status === 'completed' ? 'Complete' : 'Ongoing'}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors">
                      {series.title}
                    </h2>
                  </div>
                  
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-surface-elevated)]">
                    <BookOpen size={16} className="text-[var(--color-text-muted)]" />
                    <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                      {series.itemCount} {series.itemCount === 1 ? 'part' : 'parts'}
                    </span>
                  </div>
                </div>
                
                <p className="text-[var(--color-text-muted)] mb-4">
                  {series.description}
                </p>

                {/* Preview of items */}
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  {series.items.slice(0, 3).map((item, i) => (
                    <span key={item.slug} className="flex items-center gap-1">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--color-surface-elevated)] text-xs">
                        {i + 1}
                      </span>
                      <span className="truncate max-w-[120px]">{item.title}</span>
                      {i < Math.min(series.items.length - 1, 2) && (
                        <span className="mx-1 text-[var(--color-border)]">→</span>
                      )}
                    </span>
                  ))}
                  {series.items.length > 3 && (
                    <span className="text-[var(--color-text-muted)]">
                      +{series.items.length - 3} more
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {allSeries.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-[var(--color-text-muted)]">
              No series yet. Check back soon!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function SeriesPage() {
  const { slug } = useParams<{ slug: string }>()

  if (slug) {
    return <SeriesDetailView slug={slug} />
  }

  return <AllSeriesView />
}
