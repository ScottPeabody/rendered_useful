// Tech stack icons mapping - simplified version using emojis/texts will enhance later

const techIcons: Record<string, { icon: string; color: string }> = {
  react: { icon: '⚛️', color: '#61dafb' },
  typescript: { icon: 'TS', color: '#3178c6' },
  javascript: { icon: 'JS', color: '#f7df1e' },
  nodejs: { icon: '🟢', color: '#339933' },
  python: { icon: '🐍', color: '#3776ab' },
  rust: { icon: '🦀', color: '#dea584' },
  go: { icon: 'Go', color: '#00add8' },
  'tailwind css': { icon: '🎨', color: '#06b6d4' },
  tailwind: { icon: '🎨', color: '#06b6d4' },
  nextjs: { icon: '▲', color: '#ffffff' },
  vite: { icon: '⚡', color: '#646cff' },
  docker: { icon: '🐳', color: '#2496ed' },
  graphql: { icon: '◈', color: '#e10098' },
  postgresql: { icon: '🐘', color: '#4169e1' },
  mongodb: { icon: '🍃', color: '#47a248' },
  redis: { icon: '🔴', color: '#dc382d' },
  aws: { icon: '☁️', color: '#ff9900' },
  firebase: { icon: '🔥', color: '#ffca28' },
  supabase: { icon: '⚡', color: '#3ecf8e' },
  wasm: { icon: '🔮', color: '#654ff0' },
  webassembly: { icon: '🔮', color: '#654ff0' },
  'html5 canvas': { icon: '🖼️', color: '#e34f26' },
  canvas: { icon: '🖼️', color: '#e34f26' },
  threejs: { icon: '🎲', color: '#ffffff' },
  'web audio api': { icon: '🔊', color: '#ff6b6b' },
}

interface TechStackProps {
  items: string[]
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs gap-1',
  md: 'px-3 py-1.5 text-sm gap-1.5',
  lg: 'px-4 py-2 text-base gap-2',
}

export default function TechStack({ items, size = 'md' }: TechStackProps) {
  return (
    <div className="flex flex-wrap gap-2 my-4">
      {items.map((tech) => {
        const normalizedTech = tech.toLowerCase()
        const config = techIcons[normalizedTech] || { icon: '📦', color: '#6366f1' }
        
        return (
          <span
            key={tech}
            className={`inline-flex items-center rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] font-medium ${sizeClasses[size]}`}
            style={{ color: config.color }}
          >
            <span>{config.icon}</span>
            <span className="text-[var(--color-text-secondary)]">{tech}</span>
          </span>
        )
      })}
    </div>
  )
}
