import { useMemo } from 'react'
import { diffLines } from 'diff'
import type { Change } from 'diff'

interface DiffViewerProps {
  original: string
  current: string
  className?: string
}

export function DiffViewer({ original, current, className = '' }: DiffViewerProps) {
  const diff = useMemo(() => {
    return diffLines(original, current)
  }, [original, current])

  const stats = useMemo(() => {
    let additions = 0
    let deletions = 0
    
    diff.forEach((part: Change) => {
      const lines = part.value.split('\n').filter(Boolean).length
      if (part.added) additions += lines
      if (part.removed) deletions += lines
    })
    
    return { additions, deletions }
  }, [diff])

  const hasChanges = stats.additions > 0 || stats.deletions > 0

  if (!hasChanges) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
        <div className="text-4xl mb-4">✨</div>
        <p className="text-[var(--color-text-muted)]">No changes from original</p>
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Stats header */}
      <div className="flex items-center gap-4 p-3 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <span className="text-sm text-[var(--color-text-muted)]">Changes:</span>
        <span className="text-sm text-green-500">+{stats.additions} additions</span>
        <span className="text-sm text-red-500">-{stats.deletions} deletions</span>
      </div>
      
      {/* Diff content */}
      <div className="flex-1 overflow-auto">
        <pre className="p-4 text-sm font-mono leading-relaxed">
          {diff.map((part: Change, index: number) => {
            const lines = part.value.split('\n')
            
            return lines.map((line, lineIndex) => {
              // Skip the last empty line from split
              if (lineIndex === lines.length - 1 && line === '') return null
              
              let bgColor = ''
              let textColor = 'text-[var(--color-text-secondary)]'
              let prefix = '  '
              
              if (part.added) {
                bgColor = 'bg-green-500/10'
                textColor = 'text-green-400'
                prefix = '+ '
              } else if (part.removed) {
                bgColor = 'bg-red-500/10'
                textColor = 'text-red-400'
                prefix = '- '
              }
              
              return (
                <div
                  key={`${index}-${lineIndex}`}
                  className={`${bgColor} ${textColor} px-2 -mx-2`}
                >
                  <span className="select-none opacity-50 mr-2">{prefix}</span>
                  {line || ' '}
                </div>
              )
            })
          })}
        </pre>
      </div>
    </div>
  )
}

export default DiffViewer
