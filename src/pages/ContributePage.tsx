import { motion } from 'framer-motion'
import { Github, Heart, Code2, FileText, MessageSquare, Mail, Sparkles } from 'lucide-react'
import Button from '../components/ui/Button'

const contributionWays = [
  {
    icon: Code2,
    title: 'Add a Project',
    description: 'Share your games, apps, tools, or widgets. Add a project page with a live demo to showcase your work.',
  },
  {
    icon: FileText,
    title: 'Write an Article',
    description: 'Document your learnings, write tutorials, share insights, or tell the story behind your projects.',
  },
  {
    icon: Github,
    title: 'Improve the Platform',
    description: 'Found a bug? Have a feature idea? Contributions to the codebase are always welcome.',
  },
  {
    icon: MessageSquare,
    title: 'Give Feedback',
    description: "Share your thoughts on what's working, what could be better, or what you'd like to see added.",
  },
]

const steps = [
  {
    number: '1',
    title: 'Clone the Repository',
    description: 'Start by cloning the render_useful repository to your local machine.',
  },
  {
    number: '2',
    title: 'Create Your Content',
    description: 'Add your project or article in the content/ directory using MDX format.',
  },
  {
    number: '3',
    title: 'Add Your Author Profile',
    description: 'Add yourself to the authors list in src/data/content.ts with your details.',
  },
  {
    number: '4',
    title: 'Submit a Pull Request',
    description: "Push your changes and open a PR. We'll review it and get it merged!",
  },
]

export default function ContributePage() {
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
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[var(--color-accent-primary)] to-[var(--color-accent-tertiary)] flex items-center justify-center">
              <Heart className="text-white" size={40} />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            Contribute to <span className="gradient-text">rendered_useful</span>
          </h1>

          <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            This project is open source and community driven. We'd love your help making it better!
          </p>
        </motion.div>

        {/* Early Stage Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16 p-6 rounded-2xl bg-gradient-to-r from-[var(--color-accent-primary)]/10 to-[var(--color-accent-tertiary)]/10 border border-[var(--color-accent-primary)]/20"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-[var(--color-accent-primary)]/20">
              <Sparkles className="text-[var(--color-accent-primary)]" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                We're Just Getting Started!
              </h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                This site is still in its early stages, and there's a lot of room to grow. 
                Whether you want to contribute content, suggest features, report bugs, or just 
                share your thoughts, I'd love to hear from you. Feel free to reach out if you 
                want to get involved or have any feedback!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Ways to Contribute */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
            Ways to Contribute
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contributionWays.map((way) => (
              <div
                key={way.title}
                className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/50 transition-colors"
              >
                <way.icon className="text-[var(--color-accent-primary)] mb-4" size={28} />
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                  {way.title}
                </h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  {way.description}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Getting Started Steps */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
            Getting Started
          </h2>
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex gap-4 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--color-accent-primary)] flex items-center justify-center text-white font-bold">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Content Guidelines */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">
            Content Guidelines
          </h2>
          <div className="p-6 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <ul className="space-y-3 text-[var(--color-text-secondary)]">
              <li className="flex items-start gap-3">
                <span className="text-[var(--color-accent-primary)]">✓</span>
                <span>Original content that you have the rights to share</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--color-accent-primary)]">✓</span>
                <span>Developer-focused projects, tutorials, or insights</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--color-accent-primary)]">✓</span>
                <span>Well-documented code with clear explanations</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[var(--color-accent-primary)]">✓</span>
                <span>Respectful, inclusive, and constructive content</span>
              </li>
            </ul>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="p-8 rounded-2xl bg-gradient-to-r from-[var(--color-accent-primary)]/10 via-[var(--color-accent-secondary)]/10 to-[var(--color-accent-tertiary)]/10 border border-[var(--color-border)]">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
              Ready to Contribute?
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6 max-w-lg mx-auto">
              Check out the repository to get started, or reach out if you have any questions!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                href="https://github.com/ScottPeabody/rendered_useful"
                icon={<Github size={20} />}
              >
                View on GitHub
              </Button>
              <Button
                href="mailto:scott@renderuseful.com"
                variant="outline"
                icon={<Mail size={20} />}
              >
                Get in Touch
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
