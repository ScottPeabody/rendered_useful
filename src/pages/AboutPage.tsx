import { motion } from 'framer-motion'
import { Github, Users, Heart, Code2, BookOpen } from 'lucide-react'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { authors } from '../data/content'

const techStack = [
  'React', 'TypeScript', 'Vite', 'Tailwind CSS', 'MDX',
  'Framer Motion', 'React Router', 'Zustand'
]

const stats = [
  { label: 'Contributors', value: authors.length.toString() },
  { label: 'Open Source', value: '100%' },
  { label: 'License', value: 'MIT' },
]

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] flex items-center justify-center">
              <Code2 className="text-white" size={40} />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            About <span className="gradient-text">rendered_useful</span>
          </h1>

          <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8">
            An open source, community-driven platform where developers share knowledge, 
            build projects, and grow together.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-[var(--color-accent-primary)]">{stat.value}</div>
                <div className="text-sm text-[var(--color-text-muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mission */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
            Our Mission
          </h2>
          <div className="prose max-w-none">
            <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4">
              rendered_useful is built on the belief that knowledge grows when shared. We provide a space 
              for developers to showcase their projects, write about their learnings, and collaborate 
              with others in the community.
            </p>
            <p className="text-[var(--color-text-secondary)] leading-relaxed">
              Whether you're building games, apps, tools, or exploring new technologies, 
              this is a place to document your journey, get feedback, and connect with 
              like-minded developers from around the world.
            </p>
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Code2,
                title: 'Share Projects',
                description: 'Showcase your games, apps, tools, and widgets with live demos and source code.',
              },
              {
                icon: BookOpen,
                title: 'Write Articles',
                description: 'Document your learnings, write tutorials, and share your developer journey.',
              },
              {
                icon: Heart,
                title: 'Collaborate',
                description: 'Submit PRs to add content. The community reviews and helps improve everything.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-primary)]/10 flex items-center justify-center mb-4">
                  <item.icon className="text-[var(--color-accent-primary)]" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
            Built With
          </h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Contributors Preview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Contributors
            </h2>
            <Link
              to="/contributors"
              className="text-sm text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {authors.slice(0, 6).map((author) => (
              <Link
                key={author.slug}
                to={`/author/${author.slug}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/50 transition-colors"
              >
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-[var(--color-text-primary)]">{author.name}</div>
                  <div className="text-xs text-[var(--color-text-muted)]">{author.role}</div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center p-8 rounded-2xl bg-gradient-to-r from-[var(--color-accent-primary)]/10 to-[var(--color-accent-secondary)]/10 border border-[var(--color-accent-primary)]/20"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
            Want to Contribute?
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-6 max-w-lg mx-auto">
            This platform is open source! Submit your articles, share your projects, 
            or help improve the codebase. Everyone is welcome.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href="https://github.com/ScottPeabody/render_useful" icon={<Github size={18} />}>
              View on GitHub
            </Button>
            <Button to="/contributors" variant="outline" icon={<Users size={18} />}>
              Meet Contributors
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
