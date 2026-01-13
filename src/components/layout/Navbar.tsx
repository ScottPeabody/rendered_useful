import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, Moon, Sun, Command, Github } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useSearchStore } from '../../store'
import { useLayoutContext } from '../../hooks/useLayoutContext'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Articles', href: '/articles' },
  { label: 'Communities', href: '/communities' },
  { label: 'Contributors', href: '/contributors' },
  { label: 'About', href: '/about' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { resolvedTheme, toggleTheme } = useTheme()
  const { openSearch } = useSearchStore()
  const location = useLocation()
  
  // Get navbar style from layout context
  const layoutContext = useLayoutContext()
  const navbarStyle = layoutContext?.layoutOptions.navbarStyle ?? 'default'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false) // eslint-disable-line react-hooks/set-state-in-effect
  }, [location])

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        openSearch()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openSearch])

  // Determine header classes based on navbar style
  const getHeaderClasses = () => {
    const base = 'fixed top-0 left-0 right-0 z-50 transition-all duration-300'
    
    if (navbarStyle === 'transparent') {
      return `${base} ${
        isScrolled
          ? 'bg-[var(--color-background)]/80 backdrop-blur-xl shadow-lg border-b border-[var(--color-border)]'
          : 'bg-transparent'
      }`
    }
    
    if (navbarStyle === 'minimal') {
      return `${base} ${
        isScrolled
          ? 'bg-[var(--color-background)]/95 backdrop-blur-sm border-b border-[var(--color-border)]/50'
          : 'bg-[var(--color-background)]/50 backdrop-blur-sm'
      }`
    }
    
    // Default style
    return `${base} ${
      isScrolled
        ? 'bg-[var(--color-background)]/95 backdrop-blur-xl shadow-lg border-b border-[var(--color-border)]'
        : 'bg-transparent'
    }`
  }

  // Minimal navbar shows fewer items
  const displayedNavItems = navbarStyle === 'minimal' 
    ? navItems.filter(item => ['/', '/articles', '/projects'].includes(item.href))
    : navItems

  return (
    <header className={getHeaderClasses()}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between ${navbarStyle === 'minimal' ? 'h-12' : 'h-16'}`}>
          {/* Logo */}
          <Link
            to="/"
            className={`flex items-center gap-2 font-bold text-[var(--color-text-primary)] hover:text-[var(--color-accent-primary)] transition-colors ${
              navbarStyle === 'minimal' ? 'text-lg' : 'text-xl'
            }`}
          >
            <span className="gradient-text">rendered_useful</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {displayedNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === item.href
                    ? 'text-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={openSearch}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-all"
            >
              <Search size={18} />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-[var(--color-surface)] rounded border border-[var(--color-border)]">
                <Command size={10} />K
              </kbd>
            </button>

            {/* GitHub Link */}
            <a
              href="https://github.com/ScottPeabody/rendered_useful"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-all"
              aria-label="View on GitHub"
            >
              <Github size={20} />
            </a>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-all"
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-all"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[var(--color-background)] border-t border-[var(--color-border)] shadow-lg"
          >
            <div className="px-4 py-4 space-y-2">
              {displayedNavItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block px-4 py-3 rounded-xl font-medium transition-all border ${
                    location.pathname === item.href
                      ? 'text-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/15 border-[var(--color-accent-primary)]/30'
                      : 'text-[var(--color-text-secondary)] bg-[var(--color-surface)] border-[var(--color-border)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] hover:border-[var(--color-accent-primary)]/20'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
