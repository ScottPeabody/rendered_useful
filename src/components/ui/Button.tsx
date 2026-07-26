import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  to?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

const variantClasses = {
  primary: 'bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-secondary)] !text-[var(--color-accent-contrast)]',
  secondary: 'bg-[var(--color-surface-elevated)] hover:bg-[var(--color-border)] text-[var(--color-text-primary)]',
  ghost: 'hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
  outline: 'border border-[var(--color-border)] hover:border-[var(--color-accent-primary)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)]',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-3 text-lg gap-2.5',
}

const motionProps = {
  whileTap: { scale: 0.98 },
}

const disabledMotionProps = {
  whileTap: { scale: 1 },
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  to,
  onClick,
  disabled,
  className = '',
  icon,
  iconPosition = 'left',
}: ButtonProps) {
  const baseClass = `inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  } ${className}`

  const content = (
    <>
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </>
  )

  const animationProps = disabled ? disabledMotionProps : motionProps

  if (to) {
    return (
      <motion.span {...animationProps} className="inline-flex">
        <Link to={to} className={baseClass}>
          {content}
        </Link>
      </motion.span>
    )
  }

  if (href) {
    return (
      <motion.span {...animationProps} className="inline-flex">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClass}
        >
          {content}
        </a>
      </motion.span>
    )
  }

  return (
    <motion.span {...animationProps} className="inline-flex">
      <button onClick={onClick} disabled={disabled} className={baseClass}>
        {content}
      </button>
    </motion.span>
  )
}
