import { Link } from 'react-router-dom'

interface TagProps {
  name: string
  count?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  color?: string
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
}

// Generate consistent color from tag name
function getTagColor(name: string): string {
  const colors = [
    'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'bg-rose-500/20 text-rose-400 border-rose-500/30',
    'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ]
  
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

export default function Tag({ name, count, size = 'sm', interactive = true }: TagProps) {
  const colorClass = getTagColor(name)
  const baseClass = `inline-flex items-center gap-1.5 font-medium rounded-full border transition-all ${sizeClasses[size]} ${colorClass}`
  
  const content = (
    <>
      <span>#{name}</span>
      {count !== undefined && (
        <span className="opacity-60">{count}</span>
      )}
    </>
  )

  if (interactive) {
    return (
      <Link
        to={`/tag/${name}`}
        className={`${baseClass} hover:scale-105 hover:brightness-110`}
      >
        {content}
      </Link>
    )
  }

  return <span className={baseClass}>{content}</span>
}
