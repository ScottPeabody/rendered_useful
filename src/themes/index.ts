// Theme presets for articles and projects
// These override CSS variables when applied

export interface ThemePreset {
  name: string
  description: string
  variables: {
    // Background & surfaces
    '--color-background'?: string
    '--color-surface'?: string
    '--color-surface-elevated'?: string
    '--color-border'?: string
    '--color-border-subtle'?: string
    
    // Text
    '--color-text-primary'?: string
    '--color-text-secondary'?: string
    '--color-text-muted'?: string
    
    // Accents
    '--color-accent-primary'?: string
    '--color-accent-secondary'?: string
    '--color-accent-tertiary'?: string
    '--color-accent-success'?: string
    '--color-accent-warning'?: string
    '--color-accent-error'?: string
    
    // Gradients
    '--color-gradient-start'?: string
    '--color-gradient-middle'?: string
    '--color-gradient-end'?: string
    
    // Glass
    '--color-glass'?: string
    '--color-glass-border'?: string
    
    // Fonts
    '--font-display'?: string
    '--font-body'?: string
    '--font-mono'?: string
    
    // Shadows
    '--shadow-glow'?: string
    '--shadow-card'?: string
  }
  // Optional: force dark/light mode
  forcedMode?: 'dark' | 'light'
}

export const themes: Record<string, ThemePreset> = {
  // Cyberpunk - neon pink/cyan on dark purple
  cyberpunk: {
    name: 'Cyberpunk',
    description: 'Neon colors on dark purple',
    variables: {
      '--color-background': '#0d0221',
      '--color-surface': '#1a0533',
      '--color-surface-elevated': '#2d0a4e',
      '--color-border': '#ff00ff33',
      '--color-border-subtle': '#ff00ff22',
      '--color-text-primary': '#fff',
      '--color-text-secondary': '#e0b0ff',
      '--color-text-muted': '#9966cc',
      '--color-accent-primary': '#ff00ff',
      '--color-accent-secondary': '#00ffff',
      '--color-accent-tertiary': '#ff6ec7',
      '--color-gradient-start': '#ff00ff',
      '--color-gradient-middle': '#ff6ec7',
      '--color-gradient-end': '#00ffff',
      '--color-glass': 'rgba(255, 0, 255, 0.1)',
      '--color-glass-border': 'rgba(255, 0, 255, 0.2)',
      '--shadow-glow': '0 0 40px rgba(255, 0, 255, 0.3)',
    },
    forcedMode: 'dark',
  },

  // Terminal - green on black, monospace
  terminal: {
    name: 'Terminal',
    description: 'Classic green terminal aesthetic',
    variables: {
      '--color-background': '#0a0a0a',
      '--color-surface': '#111111',
      '--color-surface-elevated': '#1a1a1a',
      '--color-border': '#00ff0033',
      '--color-border-subtle': '#00ff0022',
      '--color-text-primary': '#00ff00',
      '--color-text-secondary': '#00cc00',
      '--color-text-muted': '#008800',
      '--color-accent-primary': '#00ff00',
      '--color-accent-secondary': '#00ff88',
      '--color-accent-tertiary': '#88ff00',
      '--color-gradient-start': '#00ff00',
      '--color-gradient-middle': '#00ff88',
      '--color-gradient-end': '#00ffff',
      '--color-glass': 'rgba(0, 255, 0, 0.05)',
      '--color-glass-border': 'rgba(0, 255, 0, 0.15)',
      '--font-display': "'JetBrains Mono', 'Fira Code', monospace",
      '--font-body': "'JetBrains Mono', 'Fira Code', monospace",
      '--shadow-glow': '0 0 40px rgba(0, 255, 0, 0.2)',
    },
    forcedMode: 'dark',
  },

  // Retro - warm oranges and browns, vintage feel
  retro: {
    name: 'Retro',
    description: 'Warm vintage aesthetic',
    variables: {
      '--color-background': '#1a1410',
      '--color-surface': '#2a2018',
      '--color-surface-elevated': '#3a3028',
      '--color-border': '#5a4a38',
      '--color-border-subtle': '#4a3a28',
      '--color-text-primary': '#f5e6d3',
      '--color-text-secondary': '#d4c4b0',
      '--color-text-muted': '#a89880',
      '--color-accent-primary': '#ff6b35',
      '--color-accent-secondary': '#f7c566',
      '--color-accent-tertiary': '#ff8c42',
      '--color-gradient-start': '#ff6b35',
      '--color-gradient-middle': '#f7c566',
      '--color-gradient-end': '#ff8c42',
      '--color-glass': 'rgba(255, 107, 53, 0.1)',
      '--color-glass-border': 'rgba(255, 107, 53, 0.2)',
      '--shadow-glow': '0 0 40px rgba(255, 107, 53, 0.15)',
    },
    forcedMode: 'dark',
  },

  // Ocean - deep blues and teals
  ocean: {
    name: 'Ocean',
    description: 'Deep sea blues and teals',
    variables: {
      '--color-background': '#0a1628',
      '--color-surface': '#0f2137',
      '--color-surface-elevated': '#152d4a',
      '--color-border': '#1e4976',
      '--color-border-subtle': '#163a5c',
      '--color-text-primary': '#e0f2fe',
      '--color-text-secondary': '#7dd3fc',
      '--color-text-muted': '#38bdf8',
      '--color-accent-primary': '#0ea5e9',
      '--color-accent-secondary': '#06b6d4',
      '--color-accent-tertiary': '#22d3ee',
      '--color-gradient-start': '#0ea5e9',
      '--color-gradient-middle': '#06b6d4',
      '--color-gradient-end': '#14b8a6',
      '--color-glass': 'rgba(14, 165, 233, 0.1)',
      '--color-glass-border': 'rgba(14, 165, 233, 0.2)',
      '--shadow-glow': '0 0 40px rgba(14, 165, 233, 0.2)',
    },
    forcedMode: 'dark',
  },

  // Paper - light mode, clean reading experience
  paper: {
    name: 'Paper',
    description: 'Clean light mode for comfortable reading',
    variables: {
      '--color-background': '#faf9f7',
      '--color-surface': '#ffffff',
      '--color-surface-elevated': '#f5f4f2',
      '--color-border': '#e5e4e2',
      '--color-border-subtle': '#eeede8',
      '--color-text-primary': '#1a1a1a',
      '--color-text-secondary': '#4a4a4a',
      '--color-text-muted': '#6a6a6a',
      '--color-accent-primary': '#2563eb',
      '--color-accent-secondary': '#7c3aed',
      '--color-accent-tertiary': '#0891b2',
      '--color-gradient-start': '#2563eb',
      '--color-gradient-middle': '#7c3aed',
      '--color-gradient-end': '#db2777',
      '--color-glass': 'rgba(0, 0, 0, 0.03)',
      '--color-glass-border': 'rgba(0, 0, 0, 0.08)',
      '--shadow-glow': '0 0 40px rgba(37, 99, 235, 0.1)',
      '--shadow-card': '0 4px 24px rgba(0, 0, 0, 0.08)',
    },
    forcedMode: 'light',
  },

  // Sunset - warm pinks and oranges
  sunset: {
    name: 'Sunset',
    description: 'Warm sunset gradients',
    variables: {
      '--color-background': '#1a0a14',
      '--color-surface': '#2a1420',
      '--color-surface-elevated': '#3d1e30',
      '--color-border': '#5a2d45',
      '--color-border-subtle': '#4a2438',
      '--color-text-primary': '#fff5f5',
      '--color-text-secondary': '#ffc0cb',
      '--color-text-muted': '#d4849a',
      '--color-accent-primary': '#ff6b9d',
      '--color-accent-secondary': '#ff8c42',
      '--color-accent-tertiary': '#ffd700',
      '--color-gradient-start': '#ff6b9d',
      '--color-gradient-middle': '#ff8c42',
      '--color-gradient-end': '#ffd700',
      '--color-glass': 'rgba(255, 107, 157, 0.1)',
      '--color-glass-border': 'rgba(255, 107, 157, 0.2)',
      '--shadow-glow': '0 0 40px rgba(255, 107, 157, 0.2)',
    },
    forcedMode: 'dark',
  },
}

export function getTheme(name: string): ThemePreset | undefined {
  return themes[name.toLowerCase()]
}

export function getThemeNames(): string[] {
  return Object.keys(themes)
}
