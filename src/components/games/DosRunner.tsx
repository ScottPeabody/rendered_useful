import { useState, useRef, useEffect, useCallback } from 'react'
import { Maximize2, Minimize2, Play, Loader2, Monitor } from 'lucide-react'

// Declare global Dos from js-dos CDN
declare global {
  interface Window {
    Dos: (element: HTMLElement, options: {
      url: string
      autoStart?: boolean
      pathPrefix?: string
      noSideBar?: boolean
      noFullscreen?: boolean
      noSocialLinks?: boolean
    }) => Promise<unknown>
  }
}

interface DosRunnerProps {
  /** URL to the .jsdos bundle */
  bundleUrl: string
  /** Title shown in header */
  title?: string
  /** Optional subtitle/year badge */
  year?: string
  /** Description shown on start screen */
  description?: string
  /** Emoji/icon for header */
  icon?: string
  /** Show the header bar */
  showHeader?: boolean
  /** Initial height */
  height?: string
  /** Accent color for buttons */
  accentColor?: string
  /** Controls help text */
  controls?: string
  /** Approximate download size */
  downloadSize?: string
}

export function DosRunner({
  bundleUrl,
  title = 'DOS Game',
  year,
  description = 'Classic DOS game running in your browser via DOSBox',
  icon = '🎮',
  showHeader = true,
  height = '600px',
  accentColor = 'bg-blue-700 hover:bg-blue-600',
  controls,
  downloadSize = '5MB',
}: DosRunnerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<HTMLDivElement>(null)

  // Load js-dos script
  useEffect(() => {
    if (document.querySelector('script[src*="js-dos"]')) {
      setScriptLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://v8.js-dos.com/latest/js-dos.js'
    script.async = true
    script.onload = () => setScriptLoaded(true)
    script.onerror = () => setError('Failed to load js-dos library')
    document.head.appendChild(script)

    // Also load the CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://v8.js-dos.com/latest/js-dos.css'
    document.head.appendChild(link)
  }, [])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const startGame = useCallback(async () => {
    if (!gameRef.current || isStarted || !scriptLoaded) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // Initialize js-dos with autoStart to skip login screen
      await window.Dos(gameRef.current, {
        url: bundleUrl,
        autoStart: true,
      })
      
      setIsStarted(true)
    } catch (err) {
      console.error('Failed to start game:', err)
      setError(err instanceof Error ? err.message : 'Failed to load game')
    } finally {
      setIsLoading(false)
    }
  }, [bundleUrl, isStarted, scriptLoaded])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && containerRef.current) {
        await containerRef.current.requestFullscreen()
      } else if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error('Fullscreen error:', err)
    }
  }

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-[var(--color-border)] bg-black">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <span className="font-bold">{icon}</span>
            <span className="font-medium text-sm">{title}</span>
            {year && (
              <span className="text-xs text-[var(--color-text-muted)] px-2 py-0.5 bg-[var(--color-bg-secondary)] rounded">
                {year}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded hover:bg-[var(--color-bg-secondary)] transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
      )}

      {/* Game Container */}
      <div 
        ref={containerRef}
        className="relative bg-black flex items-center justify-center"
        style={{ height: isFullscreen ? '100vh' : height }}
      >
        {/* js-dos container */}
        <div
          ref={gameRef}
          className="w-full h-full"
          style={{ display: isStarted ? 'block' : 'none' }}
        />

        {/* Start Screen */}
        {!isStarted && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
            <Monitor size={64} className="text-gray-600 mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">
              {title}
            </h2>
            <p className="text-gray-400 mb-6 text-center max-w-md px-4">
              {description}
            </p>
            {error && (
              <p className="text-red-500 mb-4 text-sm">{error}</p>
            )}
            <button
              onClick={startGame}
              disabled={!scriptLoaded}
              className={`flex items-center gap-2 px-6 py-3 ${accentColor} disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors`}
            >
              <Play size={20} />
              {scriptLoaded ? 'Start Game' : 'Loading...'}
            </button>
            <p className="text-gray-500 text-xs mt-4">
              Click to load (~{downloadSize} download)
            </p>
          </div>
        )}

        {/* Loading Screen */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90">
            <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
            <p className="text-gray-400">Loading {title}...</p>
          </div>
        )}
      </div>

      {/* Controls Help */}
      {controls && (
        <div className="px-4 py-2 bg-[var(--color-bg-tertiary)] border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
          <span className="font-medium">Controls:</span> {controls}
        </div>
      )}
    </div>
  )
}

export default DosRunner
