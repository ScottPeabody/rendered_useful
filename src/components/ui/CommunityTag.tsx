import { Link } from 'react-router-dom'
import { communities } from '../../data/content'

interface CommunityTagProps {
  slug: string
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  showIcon?: boolean
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
}

export default function CommunityTag({ 
  slug, 
  size = 'sm', 
  interactive = true,
  showIcon = true 
}: CommunityTagProps) {
  const community = communities.find((c) => c.slug === slug)
  
  if (!community) return null
  
  const baseClass = `inline-flex items-center gap-1.5 font-medium rounded-full transition-all ${sizeClasses[size]}`
  const colorStyle = {
    backgroundColor: `${community.color}20`,
    color: community.color,
    borderWidth: '1px',
    borderColor: `${community.color}40`,
  }
  
  const content = (
    <>
      {showIcon && <span>{community.icon}</span>}
      <span>{community.name}</span>
    </>
  )

  if (interactive) {
    return (
      <Link
        to={`/community/${slug}`}
        className={`${baseClass} hover:scale-105 hover:brightness-110`}
        style={colorStyle}
      >
        {content}
      </Link>
    )
  }

  return (
    <span className={baseClass} style={colorStyle}>
      {content}
    </span>
  )
}
