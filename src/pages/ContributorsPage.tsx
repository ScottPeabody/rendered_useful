import { motion } from 'framer-motion'
import { Users, GitPullRequest, Star } from 'lucide-react'
import AuthorCard from '../components/ui/AuthorCard'
import Button from '../components/ui/Button'
import { authors, articles, projects } from '../data/content'

export default function ContributorsPage() {
  // Calculate contribution stats for each author
  const authorStats = authors.map((author) => ({
    ...author,
    articleCount: articles.filter((a) => a.author === author.slug).length,
    projectCount: projects.filter((p) => p.author === author.slug).length,
  })).sort((a, b) => (b.articleCount + b.projectCount) - (a.articleCount + a.projectCount))

  const totalContributions = articles.length + projects.length

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            Contributors
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Meet the amazing people who make this platform possible. 
            Every article, project, and improvement comes from our community.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { icon: Users, label: 'Contributors', value: authors.length },
            { icon: GitPullRequest, label: 'Total Contributions', value: totalContributions },
            { icon: Star, label: 'GitHub Stars', value: '0' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-primary)]/10 flex items-center justify-center">
                <stat.icon className="text-[var(--color-accent-primary)]" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {stat.value}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Core Maintainers */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
            Core Maintainers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {authorStats
              .filter((a) => a.isCoreMaintainer)
              .map((author) => (
                <AuthorCard key={author.slug} author={author} size="lg" />
              ))}
          </div>
        </motion.section>

        {/* All Contributors */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
            All Contributors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {authorStats.map((author, index) => (
              <motion.div
                key={author.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <AuthorCard author={author} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center p-8 rounded-2xl bg-gradient-to-r from-[var(--color-accent-primary)]/10 to-[var(--color-accent-secondary)]/10 border border-[var(--color-accent-primary)]/20"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
            Become a Contributor
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-6 max-w-lg mx-auto">
            We welcome contributions from everyone! Share your projects, write articles, 
            or help improve the platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button to="/contribute">
              Contribution Guide
            </Button>
            <Button href="https://github.com/ScottPeabody/rendered_useful" variant="outline">
              View GitHub
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
