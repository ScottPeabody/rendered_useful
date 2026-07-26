import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Grid, List, BookOpen } from 'lucide-react'
import NotebookCard from '../components/ui/NotebookCard'
import Tag from '../components/ui/Tag'
import { notebooks, tags } from '../data/content'

type ViewMode = 'grid' | 'list'
type KernelFilter = 'all' | 'python' | 'javascript' | 'r' | 'julia'

export default function NotebooksPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedKernel, setSelectedKernel] = useState<KernelFilter>('all')
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('viewMode') as ViewMode) || 'grid'
    }
    return 'grid'
  })

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode)
    localStorage.setItem('viewMode', mode)
  }

  const kernelOptions: { value: KernelFilter; label: string; icon?: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'javascript', label: 'JavaScript', icon: '📜' },
    { value: 'r', label: 'R', icon: '📊' },
    { value: 'julia', label: 'Julia', icon: '🔮' },
  ]

  const filteredNotebooks = useMemo(() => {
    return notebooks
      .filter((notebook) => {
        // Don't show drafts
        if (notebook.draft) return false
        
        // Search filter
        const matchesSearch =
          !searchQuery ||
          notebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notebook.description.toLowerCase().includes(searchQuery.toLowerCase())

        // Tag filter
        const matchesTags =
          selectedTags.length === 0 ||
          selectedTags.some((tag) => notebook.tags?.includes(tag))

        // Kernel filter
        const matchesKernel = selectedKernel === 'all' || notebook.kernelLanguage === selectedKernel

        return matchesSearch && matchesTags && matchesKernel
      })
      // Sort by date (newest first)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [searchQuery, selectedTags, selectedKernel])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const notebookTags = useMemo(() => {
    const tagSet = new Set<string>()
    notebooks.forEach((n) => n.tags?.forEach((t) => tagSet.add(t)))
    return tags.filter((t) => tagSet.has(t.name))
  }, [])

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            Notebooks
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl">
            Interactive Jupyter notebooks that run entirely in your browser. 
            Explore data science, machine learning, and coding tutorials. No installation required.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search and View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                size={20}
              />
              <input
                type="text"
                placeholder="Search notebooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[var(--color-accent-primary)] text-[var(--color-accent-contrast)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
                aria-label="Grid view"
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[var(--color-accent-primary)] text-[var(--color-accent-contrast)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
                aria-label="List view"
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Kernel filter */}
          <div className="flex flex-wrap gap-2">
            {kernelOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedKernel(option.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedKernel === option.value
                    ? 'bg-[var(--color-accent-primary)] text-[var(--color-accent-contrast)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]'
                }`}
              >
                {option.icon && <span className="mr-1">{option.icon}</span>}
                {option.label}
              </button>
            ))}
          </div>

          {/* Tags */}
          {notebookTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {notebookTags.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => toggleTag(tag.name)}
                  className={`transition-all ${
                    selectedTags.includes(tag.name) ? 'ring-2 ring-[var(--color-accent-primary)] ring-offset-2 ring-offset-[var(--color-background)]' : ''
                  }`}
                >
                  <Tag name={tag.name} count={tag.count} interactive={false} />
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="px-3 py-1 text-sm text-[var(--color-accent-error)] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* Results count */}
        <p className="text-sm text-[var(--color-text-muted)] mb-4">
          {filteredNotebooks.length} notebook{filteredNotebooks.length !== 1 ? 's' : ''} found
        </p>

        {/* Notebooks Grid/List */}
        {filteredNotebooks.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={
              viewMode === 'grid'
                ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
                : 'space-y-4'
            }
          >
            {filteredNotebooks.map((notebook, index) => (
              <motion.div
                key={notebook.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <NotebookCard
                  notebook={notebook}
                  variant={viewMode === 'list' ? 'list' : 'card'}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-muted)]" />
            <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
              No notebooks found
            </h3>
            <p className="text-[var(--color-text-secondary)]">
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
