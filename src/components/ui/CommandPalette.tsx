import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FileText, Folder, User, Hash, ArrowRight, Command, Users, List, Calendar } from 'lucide-react'
import { useSearchStore } from '../../store'
import { articles, projects, authors, tags, communities, getAllSeries, getAllEvents } from '../../data/content'

interface SearchItem {
  type: 'article' | 'project' | 'author' | 'tag' | 'community' | 'series' | 'event'
  title: string
  description?: string
  slug: string
  icon: typeof FileText
}

export default function CommandPalette() {
  const { isOpen, closeSearch, query, setQuery } = useSearchStore()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const searchItems: SearchItem[] = useMemo(() => [
    ...articles.map((a) => ({
      type: 'article' as const,
      title: a.title,
      description: a.description,
      slug: `/articles/${a.slug}`,
      icon: FileText,
    })),
    ...projects.map((p) => ({
      type: 'project' as const,
      title: p.title,
      description: p.description,
      slug: `/projects/${p.slug}`,
      icon: Folder,
    })),
    ...authors.map((a) => ({
      type: 'author' as const,
      title: a.name,
      description: a.bio,
      slug: `/author/${a.slug}`,
      icon: User,
    })),
    ...tags.slice(0, 10).map((t) => ({
      type: 'tag' as const,
      title: t.name,
      description: `${t.count} items`,
      slug: `/tag/${t.name}`,
      icon: Hash,
    })),
    ...communities.map((c) => ({
      type: 'community' as const,
      title: c.name,
      description: c.description,
      slug: `/community/${c.slug}`,
      icon: Users,
    })),
    ...getAllSeries().map((s) => ({
      type: 'series' as const,
      title: s.title,
      description: `${s.itemCount} parts - ${s.description}`,
      slug: `/series/${s.slug}`,
      icon: List,
    })),
    ...getAllEvents().map((e) => ({
      type: 'event' as const,
      title: e.title,
      description: `${e.status} - ${e.description}`,
      slug: `/events/${e.slug}`,
      icon: Calendar,
    })),
  ], [])

  const results = useMemo(() => {
    if (!query.trim()) return searchItems.slice(0, 8)
    
    const lowerQuery = query.toLowerCase()
    return searchItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.description?.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 8)
  }, [query, searchItems])

  useEffect(() => {
    setSelectedIndex(0) // eslint-disable-line react-hooks/set-state-in-effect
  }, [results])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((i) => (i + 1) % results.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((i) => (i - 1 + results.length) % results.length)
          break
        case 'Enter':
          e.preventDefault()
          if (results[selectedIndex]) {
            navigate(results[selectedIndex].slug)
            closeSearch()
          }
          break
        case 'Escape':
          closeSearch()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, navigate, closeSearch])

  const typeLabels = {
    article: 'Article',
    project: 'Project',
    author: 'Author',
    tag: 'Tag',
    community: 'Community',
    series: 'Series',
    event: 'Event',
  }

  const typeColors = {
    article: 'text-[var(--color-accent-primary)]',
    project: 'text-[var(--color-accent-tertiary)]',
    author: 'text-[var(--color-accent-secondary)]',
    tag: 'text-[var(--color-accent-success)]',
    community: 'text-purple-400',
    series: 'text-orange-400',
    event: 'text-cyan-400',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4"
          >
            <div className="bg-[var(--color-surface)] rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--color-border)]">
                <Search className="text-[var(--color-text-muted)]" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles, projects, authors..."
                  className="flex-1 bg-transparent text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none"
                />
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-elevated)] rounded border border-[var(--color-border)]">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto py-2">
                {results.length === 0 ? (
                  <div className="px-4 py-8 text-center text-[var(--color-text-muted)]">
                    No results found for "{query}"
                  </div>
                ) : (
                  results.map((item, index) => (
                    <button
                      key={`${item.type}-${item.slug}`}
                      onClick={() => {
                        navigate(item.slug)
                        closeSearch()
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        index === selectedIndex
                          ? 'bg-[var(--color-surface-elevated)]'
                          : 'hover:bg-[var(--color-surface-elevated)]'
                      }`}
                    >
                      <item.icon className={typeColors[item.type]} size={20} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[var(--color-text-primary)] truncate">
                            {item.title}
                          </span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${typeColors[item.type]} bg-[var(--color-surface)]`}>
                            {typeLabels[item.type]}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-[var(--color-text-muted)] truncate">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {index === selectedIndex && (
                        <ArrowRight className="text-[var(--color-text-muted)]" size={16} />
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-[var(--color-surface-elevated)] rounded">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-[var(--color-surface-elevated)] rounded">↵</kbd>
                    Select
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Command size={12} />K to search
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
