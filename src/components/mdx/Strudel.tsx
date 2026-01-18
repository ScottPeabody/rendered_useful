import { useEffect, useRef, useState } from 'react'

interface StrudelProps {
  /** The Strudel pattern code to run */
  code: string
  /** Height of the editor in pixels */
  height?: number
  /** Whether to show line numbers */
  lineNumbers?: boolean
  /** Whether to auto-play on load (requires user interaction first) */
  autoplay?: boolean
  /** Use iframe embed instead of web component (has full UI with all buttons) */
  useIframe?: boolean
}

interface StrudelEditorElement extends HTMLElement {
  editor?: {
    toggle: () => void
    stop: () => void
    repl?: {
      scheduler?: {
        started: boolean
      }
    }
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'strudel-editor': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'line-numbers'?: string
          autoplay?: string
          code?: string
        },
        HTMLElement
      >
      'strudel-repl': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >
    }
  }
}

// Track if the script has been loaded
let scriptLoaded = false
let scriptPromise: Promise<void> | null = null

function loadStrudelScript(): Promise<void> {
  if (scriptLoaded) {
    return Promise.resolve()
  }
  
  if (scriptPromise) {
    return scriptPromise
  }
  
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@strudel/repl@latest'
    script.async = true
    script.onload = () => {
      scriptLoaded = true
      resolve()
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
  
  return scriptPromise
}

/**
 * Strudel - Live coding music patterns in MDX
 * 
 * Embeds a Strudel REPL editor for interactive music coding.
 * Based on TidalCycles, Strudel lets you create algorithmic music patterns.
 * 
 * @example
 * ```mdx
 * <Strudel code={`
 * note("c3 e3 g3 b3").sound("piano")
 * `} />
 * ```
 * 
 * @see https://strudel.cc for documentation
 * @license AGPL-3.0 (Strudel is AGPL licensed)
 */
export function Strudel({ 
  code, 
  height = 300, 
  lineNumbers = true,
  autoplay = false,
  useIframe = true
}: StrudelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<StrudelEditorElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  
  const handlePlay = () => {
    const editor = editorRef.current?.editor
    if (editor) {
      editor.toggle()
      setIsPlaying(!isPlaying)
    }
  }
  
  // Web component mode effect (only runs when not using iframe)
  useEffect(() => {
    if (useIframe) return
    
    const container = containerRef.current
    
    loadStrudelScript().then(() => {
      if (container && !editorRef.current) {
        // Create the strudel-editor element
        const editor = document.createElement('strudel-editor') as StrudelEditorElement
        
        if (lineNumbers) {
          editor.setAttribute('line-numbers', '')
        }
        
        if (autoplay) {
          editor.setAttribute('autoplay', '')
        }
        
        // Use code attribute
        editor.setAttribute('code', code.trim())
        
        container.appendChild(editor)
        editorRef.current = editor
        
        // Wait for the editor to initialize
        const checkReady = setInterval(() => {
          if (editor.editor) {
            setIsReady(true)
            clearInterval(checkReady)
          }
        }, 100)
        
        // Cleanup interval after 5 seconds
        setTimeout(() => clearInterval(checkReady), 5000)
      }
    })
    
    return () => {
      // Cleanup on unmount
      if (editorRef.current?.editor) {
        editorRef.current.editor.stop()
      }
      if (editorRef.current && container) {
        container.removeChild(editorRef.current)
        editorRef.current = null
      }
      setIsPlaying(false)
      setIsReady(false)
    }
  }, [code, lineNumbers, autoplay, useIframe])
  
  // For iframe mode, encode the code in base64 for the URL
  if (useIframe) {
    const encodedCode = btoa(unescape(encodeURIComponent(code.trim())))
    const iframeSrc = `https://strudel.cc/#${encodedCode}`
    
    return (
      <div className="strudel-container my-6">
        <iframe
          src={iframeSrc}
          width="100%"
          height={height}
          className="rounded-lg border border-gray-700"
          allow="autoplay"
          title="Strudel REPL"
        />
      </div>
    )
  }
  
  return (
    <div className="strudel-wrapper my-6">
      {/* Control bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-700 border-b-0 rounded-t-lg">
        <span className="text-sm text-gray-400 font-mono">strudel</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlay}
            disabled={!isReady}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-sm font-medium transition-colors ${
              isPlaying 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            } ${!isReady ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isPlaying ? 'Stop (Ctrl+.)' : 'Play (Ctrl+Enter)'}
          >
            {isPlaying ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                Stop
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play
              </>
            )}
          </button>
        </div>
      </div>
      {/* Editor container */}
      <div 
        ref={containerRef}
        className="strudel-container rounded-b-lg overflow-hidden border border-gray-700 border-t-0"
        style={{ minHeight: height }}
      />
    </div>
  )
}

/**
 * StrudelEmbed - Embed Strudel via iframe (simpler, but less customizable)
 * 
 * Use this for a simpler integration that loads the full Strudel website.
 * 
 * @example
 * ```mdx
 * <StrudelEmbed shareUrl="https://strudel.cc/?xwWRfuCE8TAR" />
 * ```
 */
export function StrudelEmbed({ 
  shareUrl, 
  width = '100%', 
  height = 400 
}: { 
  shareUrl: string
  width?: string | number
  height?: number 
}) {
  return (
    <div className="strudel-embed my-6">
      <iframe
        src={shareUrl}
        width={width}
        height={height}
        className="rounded-lg border border-gray-700"
        allow="autoplay"
        title="Strudel REPL"
      />
    </div>
  )
}
