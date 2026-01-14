import { useEffect, useRef, useState, useId } from 'react'
import mermaid from 'mermaid'

interface MermaidProps {
  chart: string
  className?: string
}

// Initialize mermaid with theme settings
mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    // Use CSS variables for theming
    primaryColor: '#8b5cf6',
    primaryTextColor: '#fff',
    primaryBorderColor: '#7c3aed',
    lineColor: '#6b7280',
    secondaryColor: '#1e1b4b',
    tertiaryColor: '#312e81',
    background: 'transparent',
    mainBkg: '#1e1b4b',
    secondBkg: '#312e81',
    border1: '#4c1d95',
    border2: '#5b21b6',
    arrowheadColor: '#8b5cf6',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    fontSize: '14px',
    textColor: '#e5e7eb',
    nodeTextColor: '#f3f4f6',
  },
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
  },
})

export default function Mermaid({ chart, className = '' }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const reactId = useId()
  const renderCount = useRef(0)

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current) return

      try {
        // Clear any previous error
        setError(null)
        
        // Generate unique ID for this render
        const uniqueId = `mermaid-${reactId.replace(/:/g, '')}-${renderCount.current++}`
        
        // Render the chart
        const { svg } = await mermaid.render(uniqueId, chart.trim())
        setSvg(svg)
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError(err instanceof Error ? err.message : 'Failed to render diagram')
      }
    }

    renderChart()
  }, [chart, reactId])

  if (error) {
    return (
      <div className={`my-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 ${className}`}>
        <p className="text-red-400 text-sm font-medium mb-2">Diagram Error</p>
        <pre className="text-xs text-red-300 overflow-x-auto">{error}</pre>
        <details className="mt-2">
          <summary className="text-xs text-red-400 cursor-pointer">Show source</summary>
          <pre className="mt-2 text-xs text-[var(--color-text-muted)] overflow-x-auto">{chart}</pre>
        </details>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={`my-6 flex justify-center overflow-x-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
