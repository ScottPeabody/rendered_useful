import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { communities, communityInfo } from '../data/content'

export default function CommunitiesPage() {
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
            Communities
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl">
            Communities connect creators around shared interests. Find your people, 
            discover content, and collaborate on projects.
          </p>
        </motion.div>

        {/* Community Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {communities.map((community, index) => {
            const info = communityInfo.find((c) => c.slug === community.slug)
            const count = info?.count || 0
            
            return (
              <motion.div
                key={community.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Link
                  to={`/community/${community.slug}`}
                  className="block p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/50 transition-all hover:shadow-lg hover:shadow-[var(--color-accent-primary)]/5 group"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${community.color}20` }}
                    >
                      {community.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1 group-hover:text-[var(--color-accent-primary)] transition-colors">
                        {community.name}
                      </h2>
                      <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 mb-3">
                        {community.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                        <Users size={14} />
                        <span>{count} {count === 1 ? 'item' : 'items'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center p-8 rounded-2xl bg-gradient-to-br from-[var(--color-accent-primary)]/10 to-[var(--color-accent-secondary)]/10 border border-[var(--color-border)]"
        >
          <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
            More Communities Coming Soon
          </h3>
          <p className="text-[var(--color-text-secondary)] max-w-md mx-auto">
            As rendered_useful grows, we'll add more communities for writers, musicians, 
            visual artists, educators, and more. Have an idea? Let us know!
          </p>
        </motion.div>
      </div>
    </div>
  )
}
