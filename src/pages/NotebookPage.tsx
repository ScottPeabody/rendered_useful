import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Download, Play, LayoutGrid } from 'lucide-react'
import Tag from '../components/ui/Tag'
import NotebookCard from '../components/ui/NotebookCard'
import PyodideNotebook from '../components/ui/PyodideNotebook'
import JupyterLiteEmbed from '../components/ui/JupyterLiteEmbed'
import { formatDate } from '../lib/time'
import { getNotebook, getAuthor, notebooks } from '../data/content'
import NotFoundPage from './NotFoundPage'

type ViewMode = 'rendered' | 'jupyterlab'

export default function NotebookPage() {
  const { slug } = useParams<{ slug: string }>()
  const notebook = slug ? getNotebook(slug) : undefined
  const author = notebook ? getAuthor(notebook.author) : undefined
  
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('notebookViewMode') as ViewMode) || 'rendered'
    }
    return 'rendered'
  })

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    localStorage.setItem('notebookViewMode', mode)
  }

  if (!notebook) {
    return <NotFoundPage />
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

  // Get related notebooks (same tags or kernel)
  const relatedNotebooks = notebooks
    .filter((n) => 
      n.slug !== notebook.slug && 
      !n.draft &&
      (n.kernelLanguage === notebook.kernelLanguage || 
       n.tags?.some((tag) => notebook.tags?.includes(tag)))
    )
    .slice(0, 3)

  const handleDownload = () => {
    if (notebook.notebookUrl) {
      const link = document.createElement('a')
      link.href = notebook.notebookUrl
      link.download = `${notebook.slug}.ipynb`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="pt-20 pb-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          {/* Back link */}
          <Link
            to="/notebooks"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Notebooks
          </Link>

          {/* Title and meta */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                {notebook.title}
              </h1>
              <span className="px-2.5 py-1 rounded-full bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] text-sm font-medium flex items-center gap-1.5">
                {getKernelIcon(notebook.kernelLanguage)} {notebook.kernelLanguage}
              </span>
              {notebook.featured && (
                <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                  Featured
                </span>
              )}
            </div>
            
            <p className="text-[var(--color-text-secondary)] mb-4">
              {notebook.description}
            </p>

            <div className="flex items-center flex-wrap gap-4 text-sm text-[var(--color-text-muted)]">
              {author && (
                <Link
                  to={`/author/${author.slug}`}
                  className="flex items-center gap-2 hover:text-[var(--color-text-primary)] transition-colors"
                >
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-6 h-6 rounded-full"
                  />
                  {author.name}
                </Link>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(notebook.date)}
              </span>
              {notebook.tags && notebook.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  {notebook.tags.map((tag) => (
                    <Tag key={tag} name={tag} size="sm" />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          {notebook.notebookUrl && (
            <div className="flex items-center gap-3 flex-wrap">
              {/* View Mode Toggle */}
              <div className="inline-flex rounded-lg border border-[var(--color-border)] overflow-hidden">
                <button
                  onClick={() => handleViewModeChange('rendered')}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'rendered'
                      ? 'bg-[var(--color-accent-primary)] text-white'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)]/50'
                  }`}
                  title="Run code interactively in browser with Pyodide"
                >
                  <Play size={16} />
                  Rendered
                </button>
                <button
                  onClick={() => handleViewModeChange('jupyterlab')}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-l border-[var(--color-border)] ${
                    viewMode === 'jupyterlab'
                      ? 'bg-[var(--color-accent-primary)] text-white'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)]/50'
                  }`}
                  title="Open in full JupyterLab interface"
                >
                  <LayoutGrid size={16} />
                  Jupyter Lab
                </button>
              </div>
              
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium text-sm hover:bg-[var(--color-border)]/50 transition-colors"
              >
                <Download size={16} />
                Download .ipynb
              </button>
            </div>
          )}
        </motion.div>
        
        {/* View mode description */}
        {viewMode === 'jupyterlab' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400"
          >
            <strong>Jupyter Lab:</strong> Full JupyterLab interface with file browser, multiple tabs, and all the familiar Jupyter tools. 
            Your notebook is automatically loaded.
          </motion.div>
        )}

        {/* Notebook content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          key={viewMode}
        >
          {notebook.notebookUrl ? (
            viewMode === 'rendered' ? (
              <PyodideNotebook notebookUrl={notebook.notebookUrl} />
            ) : (
              <JupyterLiteEmbed notebookUrl={notebook.notebookUrl} height="700px" />
            )
          ) : (
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center">
              <p className="text-[var(--color-text-muted)]">
                No notebook file available for this entry.
              </p>
            </div>
          )}
        </motion.div>

        {/* Related notebooks */}
        {relatedNotebooks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
              Related Notebooks
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedNotebooks.map((related) => (
                <NotebookCard
                  key={related.slug}
                  notebook={related}
                  variant="card"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
