import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface D3RunnerProps {
  children: string
  height?: number
  width?: number
  showCode?: boolean
  title?: string
}

export function D3Runner({
  children,
  height = 400,
  width: propWidth,
  showCode = true,
  title,
}: D3RunnerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [codeVisible, setCodeVisible] = useState(showCode)
  const [containerWidth, setContainerWidth] = useState(propWidth || 700)

  // Update width on resize
  useEffect(() => {
    if (propWidth) {
      setContainerWidth(propWidth)
      return
    }

    const updateWidth = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerWidth(Math.floor(rect.width) - 32) // Account for padding
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [propWidth, isFullscreen])

  const runCode = useCallback(() => {
    if (!containerRef.current) return

    // Clear previous content
    const container = containerRef.current.querySelector('.d3-output')
    if (container) {
      container.innerHTML = ''
    }

    setError(null)

    try {
      // Create a function that runs the D3 code with access to d3 and container
      const code = children.trim()
      
      // Provide useful variables to the code
      const currentHeight = isFullscreen ? window.innerHeight - 120 : height
      const currentWidth = isFullscreen ? window.innerWidth - 48 : containerWidth

      const fn = new Function(
        'd3',
        'container',
        'width',
        'height',
        `
        "use strict";
        ${code}
        `
      )

      fn(d3, container, currentWidth, currentHeight)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }, [children, height, containerWidth, isFullscreen])

  // Run code when dependencies change
  useEffect(() => {
    runCode()
  }, [runCode])

  // Handle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFullscreen])

  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-50 bg-slate-900 p-6 overflow-auto'
    : 'my-6 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden'

  return (
    <div ref={containerRef} className={containerClasses}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div className="flex items-center gap-3">
          {title && (
            <span className="text-white font-semibold">{title}</span>
          )}
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
            D3.js
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCodeVisible(!codeVisible)}
            className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            {codeVisible ? 'Hide Code' : 'Show Code'}
          </button>
          <button
            onClick={() => runCode()}
            className="text-xs px-2 py-1 rounded bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
          >
            Run
          </button>
          <button
            onClick={toggleFullscreen}
            className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Code Panel */}
      {codeVisible && (
        <div className="border-b border-slate-700 overflow-x-auto">
          <SyntaxHighlighter
            language="javascript"
            style={oneDark}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.875rem',
              borderRadius: 0,
            }}
            codeTagProps={{
              style: {
                background: 'transparent',
              }
            }}
            showLineNumbers
            lineNumberStyle={{
              minWidth: '2.5em',
              paddingRight: '1em',
              color: '#6b7280',
              userSelect: 'none',
            }}
          >
            {children.trim()}
          </SyntaxHighlighter>
        </div>
      )}

      {/* Output */}
      <div 
        className="d3-output p-4 flex justify-center items-center"
        style={{ minHeight: isFullscreen ? 'calc(100vh - 180px)' : height }}
      />

      {/* Error Display */}
      {error && (
        <div className="mx-4 mb-4 p-3 rounded bg-red-900/50 border border-red-700 text-red-300 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  )
}

export default D3Runner
