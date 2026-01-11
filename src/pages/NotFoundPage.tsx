import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="pt-24 pb-16 min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        {/* 404 */}
        <div className="text-[8rem] md:text-[12rem] font-bold leading-none gradient-text mb-4">
          404
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)] mb-4">
          Page Not Found
        </h1>

        <p className="text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button to="/" icon={<Home size={18} />}>
            Go Home
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            icon={<ArrowLeft size={18} />}
          >
            Go Back
          </Button>
        </div>

        {/* Suggestions */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border)]">
          <p className="text-sm text-[var(--color-text-muted)] mb-4">
            You might be looking for:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Projects', href: '/projects' },
              { label: 'Articles', href: '/articles' },
              { label: 'Contributors', href: '/contributors' },
              { label: 'About', href: '/about' },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 rounded-lg bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/30 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
