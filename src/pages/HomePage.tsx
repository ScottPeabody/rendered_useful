import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button'
import Tag from '../components/ui/Tag'
import AuthorCard from '../components/ui/AuthorCard'
import ContentList from '../components/ui/ContentList'
import {
  articles,
  authors,
  tags,
  projects,
  notebooks,
} from '../data/content'

export default function HomePage() {

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-28 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl"
          >
            <p className="font-mono text-sm text-[var(--color-accent-primary)] mb-6">
              ~/rendered_useful — a working developers' journal
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl mb-6">
              Make cool things.
              <br />
              Share what matters.
            </h1>

            <p className="text-lg text-[var(--color-text-secondary)] mb-10 max-w-xl">
              Write-ups of projects people actually built — the code, the notebooks,
              and the lessons learned along the way. Open source, written by the community.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button to="/projects" size="lg">
                Explore projects
              </Button>
              <Button to="/articles" variant="outline" size="lg">
                Read articles
              </Button>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-12 font-mono text-sm text-[var(--color-text-muted)]">
              <span className="whitespace-nowrap">{authors.length} contributors</span>
              <span aria-hidden="true">·</span>
              <span className="whitespace-nowrap">{projects.length} projects</span>
              <span aria-hidden="true">·</span>
              <span className="whitespace-nowrap">{articles.length} articles</span>
              <span aria-hidden="true">·</span>
              <span className="whitespace-nowrap">{notebooks.length} notebooks</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-[var(--color-text-primary)]">Articles</h2>
          <Link
            to="/articles"
            className="flex items-center gap-1 text-sm text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] transition-colors"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <ContentList
          items={articles}
          contentType="article"
          pageSize={6}
          showPagination={true}
          showViewToggle={true}
          viewModeStorageKey="homeArticleViewMode"
        />
      </section>

      {/* Projects Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-[var(--color-text-primary)]">Projects</h2>
          <Link
            to="/projects"
            className="flex items-center gap-1 text-sm text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] transition-colors"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <ContentList
          items={projects}
          contentType="project"
          pageSize={6}
          showPagination={true}
          showViewToggle={true}
          viewModeStorageKey="homeProjectViewMode"
        />
      </section>

      {/* Notebooks Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl text-[var(--color-text-primary)]">Notebooks</h2>
          <Link
            to="/notebooks"
            className="flex items-center gap-1 text-sm text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] transition-colors"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <ContentList
          items={notebooks}
          contentType="notebook"
          pageSize={6}
          showPagination={true}
          showViewToggle={true}
          viewModeStorageKey="homeNotebookViewMode"
        />
      </section>

      {/* Community Info Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Currently Working On */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[var(--color-accent-success)] animate-pulse" />
              <span className="text-sm font-medium text-[var(--color-text-muted)]">Currently Working On</span>
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Site design and future features
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-2">
              We're continuously improving rendered_useful with new features, better design, 
              and enhanced community tools. Stay tuned for updates!
            </p>
          </motion.div>

          {/* Popular Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]"
          >
            <h3 className="text-sm font-medium text-[var(--color-text-muted)] mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 12).map((tag) => (
                <Tag key={tag.name} name={tag.name} count={tag.count} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contributors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl text-[var(--color-text-primary)]">Top Contributors</h2>
          <Link
            to="/contributors"
            className="flex items-center gap-1 text-sm text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] transition-colors"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-animation">
          {authors.slice(0, 3).map((author) => (
            <AuthorCard key={author.slug} author={author} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 md:p-12">
          <div className="max-w-2xl">
            <p className="font-mono text-sm text-[var(--color-accent-primary)] mb-3">
              git checkout -b your-first-post
            </p>
            <h2 className="text-3xl md:text-4xl mb-4">
              Want to contribute?
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)] mb-8">
              This is an open-source project. Submit an article, share a project,
              and become part of a growing community of developers.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                href="https://github.com/ScottPeabody/rendered_useful"
                size="lg"
              >
                View on GitHub
              </Button>
              <Button to="/contribute" variant="outline" size="lg">
                Learn how to contribute
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
