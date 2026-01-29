import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CommandPalette from '../ui/CommandPalette'
import { useLayoutContext } from '../../hooks/useLayoutContext'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const layoutContext = useLayoutContext()
  const hideNavbar = layoutContext?.layoutOptions.hideNavbar ?? false
  const hideFooter = layoutContext?.layoutOptions.hideFooter ?? false
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      {!hideNavbar && <Navbar />}
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="flex-1"
      >
        {children}
      </motion.main>
      {!hideFooter && <Footer />}
      <CommandPalette />
    </div>
  )
}
