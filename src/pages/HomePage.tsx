import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Code2, Users, BookOpen, Folder, FileCode } from 'lucide-react'
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
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent-primary)]/10 via-transparent to-transparent" />
        
        {/* Animated blob */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] rounded-full opacity-20 blur-3xl animate-morph" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-[var(--color-accent-tertiary)] to-[var(--color-accent-primary)] rounded-full opacity-10 blur-3xl animate-float" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto px-2"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[var(--color-accent-primary)]/10 border border-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] text-xs sm:text-sm font-medium mb-6 text-center"
            >
              <Sparkles size={16} className="shrink-0" />
              <span>Make cool things. Share what matters. Build with the community.</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="gradient-text">rendered_useful</span>
            </h1>

            <p className="text-xl text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto">
              A collaborative platform where developers share projects, write articles, 
              and build amazing things together. Powered by the community.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button to="/projects" size="lg" icon={<Code2 size={20} />}>
                Explore Projects
              </Button>
              <Button to="/articles" variant="outline" size="lg" icon={<BookOpen size={20} />}>
                Read Articles
              </Button>
            </div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-8 mt-12 text-sm text-[var(--color-text-muted)]"
            >
              <div className="flex items-center gap-2">
                <Users size={18} className="text-[var(--color-accent-primary)]" />
                <span>{authors.length} Contributors</span>
              </div>
              <div className="flex items-center gap-2">
                <Folder size={18} className="text-[var(--color-accent-tertiary)]" />
                <span>{projects.length} Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-[var(--color-accent-secondary)]" />
                <span>{articles.length} Articles</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCode size={18} className="text-[var(--color-accent-primary)]" />
                <span>{notebooks.length} Notebooks</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Articles</h2>
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
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Projects</h2>
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
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Notebooks</h2>
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
            className="p-6 rounded-2xl bg-gradient-to-br from-[var(--color-accent-primary)]/20 to-[var(--color-accent-secondary)]/20 border border-[var(--color-accent-primary)]/20"
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
            className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]"
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
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Top Contributors</h2>
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] p-8 md:p-12">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          
          <div className="relative text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Want to contribute?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              This is an open-source project. Submit your articles, share your projects, 
              and become part of our growing community of developers.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                href="https://github.com/ScottPeabody/rendered_useful"
                variant="secondary"
                size="lg"
              >
                View on GitHub
              </Button>
              <Button 
                to="/contribute" 
                variant="outline" 
                size="lg" 
                className="!border-white/40 !text-white hover:!bg-white/10 hover:!border-white/60"
              >
                Learn How to Contribute
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
