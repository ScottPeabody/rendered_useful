import { motion } from 'framer-motion'
import { Monitor, Code2, Terminal, Palette, Coffee } from 'lucide-react'

const categories = [
  {
    title: 'Hardware',
    icon: Monitor,
    items: [
      { name: 'MacBook Pro 16" M3 Max', description: 'Main development machine' },
      { name: 'LG 27" 4K Monitor', description: 'External display' },
      { name: 'Keychron K3', description: 'Low-profile mechanical keyboard' },
      { name: 'Logitech MX Master 3', description: 'Mouse' },
      { name: 'Sony WH-1000XM5', description: 'Noise-cancelling headphones' },
    ],
  },
  {
    title: 'Editor & Terminal',
    icon: Code2,
    items: [
      { name: 'VS Code', description: 'Primary code editor' },
      { name: 'Neovim', description: 'For quick edits and config files' },
      { name: 'Warp', description: 'Modern terminal' },
      { name: 'Oh My Zsh', description: 'Shell framework' },
      { name: 'Starship', description: 'Cross-shell prompt' },
    ],
  },
  {
    title: 'Development',
    icon: Terminal,
    items: [
      { name: 'React & Next.js', description: 'Frontend framework' },
      { name: 'TypeScript', description: 'Type-safe JavaScript' },
      { name: 'Tailwind CSS', description: 'Utility-first CSS' },
      { name: 'Node.js', description: 'JavaScript runtime' },
      { name: 'PostgreSQL', description: 'Primary database' },
      { name: 'Docker', description: 'Containerization' },
    ],
  },
  {
    title: 'Design',
    icon: Palette,
    items: [
      { name: 'Figma', description: 'UI/UX design' },
      { name: 'Excalidraw', description: 'Quick diagrams and wireframes' },
      { name: 'SF Pro & Inter', description: 'Primary fonts' },
      { name: 'Phosphor Icons', description: 'Icon library' },
    ],
  },
  {
    title: 'Productivity',
    icon: Coffee,
    items: [
      { name: 'Raycast', description: 'Launcher and productivity tool' },
      { name: 'Linear', description: 'Issue tracking' },
      { name: 'Notion', description: 'Notes and documentation' },
      { name: 'Arc Browser', description: 'Web browser' },
      { name: '1Password', description: 'Password manager' },
    ],
  },
]

export default function UsesPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] mb-4">
            Uses
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)]">
            A living document of the tools, software, and hardware I use daily 
            for development, design, and productivity.
          </p>
        </motion.div>

        {/* Categories */}
        <div className="space-y-12">
          {categories.map((category, categoryIndex) => (
            <motion.section
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent-primary)]/10 flex items-center justify-center">
                  <category.icon className="text-[var(--color-accent-primary)]" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {category.title}
                </h2>
              </div>

              <div className="grid gap-4">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/30 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-[var(--color-text-primary)]">
                        {item.name}
                      </h3>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Last Updated */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-[var(--color-text-muted)] mt-12"
        >
          Last updated: January 2026
        </motion.p>
      </div>
    </div>
  )
}
