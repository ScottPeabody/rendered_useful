import type { ReactNode } from 'react'
import { Info, AlertTriangle, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react'

type CalloutType = 'info' | 'warning' | 'error' | 'success' | 'tip' | 'danger'

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: ReactNode
}

const typeConfig = {
  info: {
    icon: Info,
    bgClass: 'bg-blue-500/10 border-blue-500/30',
    iconClass: 'text-blue-400',
    titleClass: 'text-blue-400',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-amber-500/10 border-amber-500/30',
    iconClass: 'text-amber-400',
    titleClass: 'text-amber-400',
  },
  error: {
    icon: AlertCircle,
    bgClass: 'bg-red-500/10 border-red-500/30',
    iconClass: 'text-red-400',
    titleClass: 'text-red-400',
  },
  success: {
    icon: CheckCircle,
    bgClass: 'bg-emerald-500/10 border-emerald-500/30',
    iconClass: 'text-emerald-400',
    titleClass: 'text-emerald-400',
  },
  tip: {
    icon: Lightbulb,
    bgClass: 'bg-purple-500/10 border-purple-500/30',
    iconClass: 'text-purple-400',
    titleClass: 'text-purple-400',
  },
}

export default function Callout({ type = 'info', title, children }: CalloutProps) {
  // Handle invalid or 'danger' type (map danger to error)
  const normalizedType = type === 'danger' ? 'error' : type
  const config = typeConfig[normalizedType] || typeConfig.info
  const Icon = config.icon

  return (
    <div className={`my-6 p-4 rounded-xl border ${config.bgClass}`}>
      <div className="flex items-start gap-3">
        <Icon className={`${config.iconClass} mt-0.5 flex-shrink-0`} size={20} />
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className={`font-semibold mb-1 ${config.titleClass}`}>{title}</h4>
          )}
          <div className="text-sm text-[var(--color-text-secondary)] [&>p]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
