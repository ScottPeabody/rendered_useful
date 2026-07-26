import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Grid, List } from 'lucide-react'
import Card from '../components/ui/Card'
import Tag from '../components/ui/Tag'
import { projects, tags } from '../data/content'

type ViewMode = 'grid' | 'list'
type ProjectType = 'all' | 'game' | 'app' | 'widget' | 'tool' | 'library' | 'other'

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<ProjectType>('all')
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

  const projectTypes: { value: ProjectType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'game', label: 'Games' },
    { value: 'app', label: 'Apps' },
    { value: 'tool', label: 'Tools' },
    { value: 'widget', label: 'Widgets' },
    { value: 'library', label: 'Libraries' },
  ]

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        // Search filter
        const matchesSearch =
          !searchQuery ||
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase())

        // Tag filter
        const matchesTags =
          selectedTags.length === 0 ||
          selectedTags.some((tag) => project.tags.includes(tag))

        // Type filter
        const matchesType = selectedType === 'all' || project.type === selectedType

        return matchesSearch && matchesTags && matchesType
      })
      // Sort by date (newest first)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [searchQuery, selectedTags, selectedType])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const projectTags = useMemo(() => {
    const tagSet = new Set<string>()
    projects.forEach((p) => p.tags.forEach((t) => tagSet.add(t)))
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
            Projects
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl">
            Explore games, apps, tools, and widgets built by our community. 
            Each project includes demos, source code, and related articles.
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
                placeholder="Search projects..."
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
                      ? 'bg-[var(--color-accent-primary)] text-[var(--color-accent-contrast)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-[var(--color-accent-primary)] text-[var(--color-accent-contrast)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="text-[var(--color-text-muted)]" />
            {projectTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === type.value
                    ? 'bg-[var(--color-accent-primary)] text-[var(--color-accent-contrast)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border)]'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Tag Filter */}
          <div className="flex flex-wrap gap-2">
            {projectTags.slice(0, 10).map((tag) => (
              <button
                key={tag.name}
                onClick={() => toggleTag(tag.name)}
                className={`transition-all ${
                  selectedTags.includes(tag.name) ? 'ring-2 ring-[var(--color-accent-primary)] ring-offset-2 ring-offset-[var(--color-background)]' : ''
                }`}
              >
                <Tag name={tag.name} interactive={false} />
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
          Showing {filteredProjects.length} of {projects.length} projects
        </p>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-4'
            }
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  contentType="project"
                  variant={viewMode === 'list' ? 'list' : 'card'}
                  {...project}
                  authorSlug={project.author}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-muted)]">
              No projects found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
