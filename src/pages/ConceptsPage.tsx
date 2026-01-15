import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Lightbulb, ChevronRight, Sparkles, History } from 'lucide-react'
import { getAllConceptInfo, getConceptInfo, getConcept, getConceptVersions } from '../data/content'
import NotFoundPage from './NotFoundPage'

// Individual concept view
function ConceptDetailView({ slug }: { slug: string }) {
  const conceptInfo = getConceptInfo(slug)
  const concept = getConcept(slug)
  
  if (!conceptInfo || !concept) {
    return <NotFoundPage />
  }

  // Get other versions if this concept is part of a version group
  const versions = concept.versionGroup ? getConceptVersions(concept.versionGroup) : []
  const hasMultipleVersions = versions.length > 1

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to="/concepts"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          All Concepts
        </Link>

        {/* Concept header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            {concept.icon && (
              <span 
                className="text-4xl p-3 rounded-xl"
                style={{ backgroundColor: `${concept.color}20` }}
              >
                {concept.icon}
              </span>
            )}
            <div>
              <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">
                {conceptInfo.name}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--color-text-muted)]">
                  {conceptInfo.itemCount} {conceptInfo.itemCount === 1 ? 'item' : 'items'}
                </span>
                {concept.version && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)]">
                    v{concept.version}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <p className="text-lg text-[var(--color-text-secondary)]">
            {conceptInfo.description}
          </p>

          {concept.versionNote && (
            <p className="mt-2 text-sm text-[var(--color-text-muted)] italic">
              {concept.versionNote}
            </p>
          )}

          {/* Version history */}
          {hasMultipleVersions && (
            <div className="mt-6 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
              <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
                <History size={16} />
                Version History
              </h3>
              <div className="flex flex-wrap gap-2">
                {versions.map((v) => {
                  const isActive = v.slug === slug
                  return (
                    <Link
                      key={v.slug}
                      to={`/concepts/${v.slug}`}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-[var(--color-accent-primary)]'
                          : 'bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/50'
                      }`}
                    >
                      <span className={isActive ? 'text-white font-medium' : 'text-gray-200 hover:text-white'}>
                        {v.version || v.name}
                      </span>
                      <span className={`ml-2 ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                        {v.date.slice(0, 4)}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Related concepts */}
          {concept.related && concept.related.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-2">Related Concepts</h3>
              <div className="flex flex-wrap gap-2">
                {concept.related.map((relatedSlug) => {
                  const related = getConcept(relatedSlug)
                  if (!related) return null
                  return (
                    <Link
                      key={relatedSlug}
                      to={`/concepts/${relatedSlug}`}
                      className="px-3 py-1.5 rounded-lg text-sm bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/50 transition-colors"
                    >
                      {related.icon} {related.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Prerequisites */}
          {concept.prerequisites && concept.prerequisites.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-2">Prerequisites</h3>
              <div className="flex flex-wrap gap-2">
                {concept.prerequisites.map((prereqSlug) => {
                  const prereq = getConcept(prereqSlug)
                  if (!prereq) return null
                  return (
                    <Link
                      key={prereqSlug}
                      to={`/concepts/${prereqSlug}`}
                      className="px-3 py-1.5 rounded-lg text-sm bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
                    >
                      {prereq.icon} {prereq.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Content items */}
        {conceptInfo.items.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-4">
              Content about {conceptInfo.name}
            </h2>
            {conceptInfo.items.map((item) => {
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
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center py-12 px-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]"
          >
            <Sparkles size={48} className="mx-auto text-[var(--color-text-muted)] mb-4" />
            <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
              No content yet
            </h3>
            <p className="text-[var(--color-text-muted)]">
              Be the first to write about {conceptInfo.name}!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// All concepts listing
function AllConceptsView() {
  const allConcepts = getAllConceptInfo()

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
            <Lightbulb size={32} className="text-[var(--color-accent-primary)]" />
          </div>
          
          <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            Concepts
          </h1>
          
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Navigate the landscape of ideas. Concepts are nodes in conceptual space that help you find and connect related knowledge.
          </p>
        </motion.div>

        {/* Concepts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allConcepts.map((concept, index) => (
            <motion.div
              key={concept.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/concepts/${concept.slug}`}
                className="block p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/50 hover:shadow-lg transition-all group h-full"
              >
                <div className="flex items-start gap-4">
                  {concept.icon && (
                    <span 
                      className="text-2xl p-2 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${concept.color}20` }}
                    >
                      {concept.icon}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors mb-1">
                      {concept.name}
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-2">
                      {concept.description}
                    </p>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {concept.itemCount} {concept.itemCount === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ConceptsPage() {
  const { slug } = useParams<{ slug?: string }>()
  
  if (slug) {
    return <ConceptDetailView slug={slug} />
  }
  
  return <AllConceptsView />
}
