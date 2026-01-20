import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Maximize2, Minimize2, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

interface JupyterLiteEmbedProps {
  /** URL to the notebook file to open (e.g., /notebooks/numpy-fundamentals.ipynb) */
  notebookUrl?: string
  /** Height of the embedded frame */
  height?: string
  /** Whether to show in full-screen mode */
  fullScreen?: boolean
  /** Use 'notebook' for single-document view, 'lab' for full JupyterLab with file browser */
  mode?: 'notebook' | 'lab'
}

// Self-hosted JupyterLite - built with our notebooks bundled in
const JUPYTERLITE_BASE = '/jupyterlite'

export function JupyterLiteEmbed({ 
  notebookUrl, 
  height = '700px',
  fullScreen = false,
  mode = 'notebook' // Default to single-notebook view (no tabs, no file browser leak)
}: JupyterLiteEmbedProps) {
  const [loading, setLoading] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(fullScreen)

  // Build the JupyterLite URL
  // Notebooks are organized in subfolders: content/notebooks/{name}/{name}.ipynb
  let jupyterUrl = `${JUPYTERLITE_BASE}/lab/index.html`
  let storageKey = 'default' // Used for iframe key to force remount
  
  if (notebookUrl) {
    // Extract the notebook name from URL
    const filename = notebookUrl.split('/').pop() || ''
    const notebookName = filename.replace('.ipynb', '')
    storageKey = notebookName
    
    // Path to notebook in its subfolder: {name}/{name}.ipynb
    const notebookPath = `${notebookName}/${filename}`
    
    if (mode === 'lab') {
      // Lab interface - has tabs that persist in storage (can leak between notebooks)
      jupyterUrl = `${JUPYTERLITE_BASE}/lab/index.html?path=${encodeURIComponent(notebookPath)}`
    } else {
      // Notebooks interface - single document, no tabs, clean isolated view
      jupyterUrl = `${JUPYTERLITE_BASE}/notebooks/index.html?path=${encodeURIComponent(notebookPath)}`
    }
  }

  const containerClasses = isFullScreen
    ? 'fixed inset-0 z-50 bg-[var(--color-background)]'
    : 'relative rounded-xl overflow-hidden border border-[var(--color-border)]'

  return (
    <div className={containerClasses} style={{ height: isFullScreen ? '100vh' : height }}>
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2 bg-[var(--color-surface)]/90 backdrop-blur-sm border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[var(--color-text-primary)]">
            JupyterLite
          </span>
          {loading && (
            <span className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <Loader2 size={12} className="animate-spin" />
              Loading Jupyter environment...
            </span>
          )}
          {!loading && (
            <span className="text-xs text-green-400">
              ● Ready
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <a
            href={jupyterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg hover:bg-[var(--color-border)]/50 transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            title="Open in new tab"
          >
            <ExternalLink size={16} />
          </a>
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-2 rounded-lg hover:bg-[var(--color-border)]/50 transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            title={isFullScreen ? 'Exit full screen' : 'Full screen'}
          >
            {isFullScreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-background)] z-5">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-[var(--color-accent-primary)]" />
            <div className="text-center">
              <p className="text-[var(--color-text-primary)] font-medium">Loading JupyterLite</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Full Jupyter Lab environment running in your browser
              </p>
            </div>
          </div>
        </div>
      )}

      {/* JupyterLite iframe - key forces remount when switching notebooks */}
      {/* sandbox prevents iframe from manipulating browser history */}
      <iframe
        key={storageKey}
        src={jupyterUrl}
        className="w-full h-full border-0 pt-10"
        onLoad={() => setLoading(false)}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-downloads"
        title={`JupyterLite - ${storageKey}`}
      />
    </div>
  )
}

export function JupyterLabPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <div className="pt-20 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to="/notebooks"
            className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            ← Back to Notebooks
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mt-2">
            Jupyter Lab
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Full JupyterLite environment running entirely in your browser. Create, edit, and run notebooks with no installation required.
          </p>
        </motion.div>
      </div>

      {/* JupyterLite embed */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <JupyterLiteEmbed height="calc(100vh - 180px)" mode="lab" />
        </motion.div>
      </div>
    </div>
  )
}

export default JupyterLiteEmbed
