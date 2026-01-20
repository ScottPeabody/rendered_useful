import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Grid, List } from 'lucide-react'
import Card from '../components/ui/Card'
import Tag from '../components/ui/Tag'
import { articles, tags } from '../data/content'

type ViewMode = 'grid' | 'list'

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
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

  const filteredArticles = useMemo(() => {
    return articles
      .filter((article) => {
        // Search filter
        const matchesSearch =
          !searchQuery ||
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase())

        // Tag filter
        const matchesTags =
          selectedTags.length === 0 ||
          selectedTags.some((tag) => article.tags.includes(tag))

        return matchesSearch && matchesTags
      })
      // Sort by date (newest first)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [searchQuery, selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const articleTags = useMemo(() => {
    const tagSet = new Set<string>()
    articles.forEach((a) => a.tags.forEach((t) => tagSet.add(t)))
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
            Articles
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl">
            Articles, tutorials, and devlogs from our community of developers.
            Learn, share, and grow together.
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
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)] focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-[var(--color-accent-primary)] text-white'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-[var(--color-accent-primary)] text-white'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2">
            {articleTags.map((tag) => (
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
        </motion.div>

        {/* Results Count */}
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          Showing {filteredArticles.length} of {articles.length} articles
        </p>

        {/* Articles Grid/List */}
        {filteredArticles.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-4'
            }
          >
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  contentType="article"
                  variant={viewMode === 'list' ? 'list' : 'card'}
                  {...article}
                  authorSlug={article.author}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-muted)]">
              No articles found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
