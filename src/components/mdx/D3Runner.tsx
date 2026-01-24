import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react'
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
  const outputRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [codeVisible, setCodeVisible] = useState(showCode)
  const [runCounter, setRunCounter] = useState(0)
  const lastErrorRef = useRef<string | null>(null)

  // Run D3 code - this mutates the DOM directly
  // useLayoutEffect is appropriate for synchronous DOM manipulation
  useLayoutEffect(() => {
    const container = outputRef.current
    if (!container) return

    // Clear previous content
    container.innerHTML = ''

    // Calculate dimensions
    const getCurrentWidth = () => {
      if (propWidth) return propWidth
      if (isFullscreen) return window.innerWidth - 48
      if (containerRef.current) {
        return Math.floor(containerRef.current.getBoundingClientRect().width) - 32
      }
      return 700
    }

    let newError: string | null = null
    try {
      const code = children.trim()
      const currentHeight = isFullscreen ? window.innerHeight - 120 : height
      const currentWidth = getCurrentWidth()

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
      newError = err instanceof Error ? err.message : 'An error occurred'
    }

    // Only update state if error changed to avoid unnecessary renders
    if (newError !== lastErrorRef.current) {
      lastErrorRef.current = newError
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(newError)
    }
  }, [children, height, propWidth, isFullscreen, runCounter])

  // Manual run handler for button clicks
  const handleRun = useCallback(() => {
    setRunCounter(n => n + 1)
  }, [])

  // Handle resize
  useEffect(() => {
    if (propWidth) return // Fixed width, no need to listen

    const handleResize = () => {
      setRunCounter(n => n + 1)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [propWidth])

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
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setCodeVisible(!codeVisible)}
            className="text-xs px-2 sm:px-3 py-1.5 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            {codeVisible ? 'Hide Code' : 'Show Code'}
          </button>
          <button
            onClick={handleRun}
            className="text-xs px-2 sm:px-3 py-1.5 rounded bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
          >
            Run
          </button>
          <button
            onClick={toggleFullscreen}
            className="text-xs p-1.5 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
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
              background: 'transparent',
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
        ref={outputRef}
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
