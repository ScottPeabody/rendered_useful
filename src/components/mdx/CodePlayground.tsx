import { useState, useMemo, useCallback, useEffect, useRef, useLayoutEffect } from 'react'
import { EditorView, basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

interface CodePlaygroundProps {
  initialHtml?: string
  initialCss?: string
  initialJs?: string
  height?: number
  editable?: boolean
  title?: string
  allowNetwork?: boolean
}

type Tab = 'html' | 'css' | 'js'

// CodeMirror editor component
function CodeEditor({
  code,
  onChange,
  language,
  editable = true,
}: {
  code: string
  onChange: (value: string) => void
  language: Tab
  editable?: boolean
}) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    const languageExtension = 
      language === 'html' ? html() :
      language === 'css' ? css() :
      javascript()

    const extensions = [
      basicSetup,
      languageExtension,
      oneDark,
      EditorView.lineWrapping,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChange(update.state.doc.toString())
        }
      }),
    ]

    if (!editable) {
      extensions.push(EditorState.readOnly.of(true))
    }

    const state = EditorState.create({
      doc: code,
      extensions,
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, [language]) // Only recreate on language change

  // Update content when code prop changes externally
  useEffect(() => {
    if (viewRef.current) {
      const currentContent = viewRef.current.state.doc.toString()
      if (currentContent !== code) {
        viewRef.current.dispatch({
          changes: { from: 0, to: currentContent.length, insert: code }
        })
      }
    }
  }, [code])

  return (
    <div 
      ref={editorRef} 
      className="h-full overflow-auto [&_.cm-editor]:h-full [&_.cm-scroller]:overflow-auto"
    />
  )
}

export default function CodePlayground({
  initialHtml = '<div class="box">Hello World</div>',
  initialCss = '.box {\n  color: blue;\n  padding: 20px;\n  font-family: system-ui;\n}',
  initialJs = 'console.log("Hello from the playground!");',
  height = 400,
  editable = true,
  title,
  allowNetwork = false,
}: CodePlaygroundProps) {
  const [htmlCode, setHtmlCode] = useState(initialHtml)
  const [cssCode, setCssCode] = useState(initialCss)
  const [jsCode, setJsCode] = useState(initialJs)
  const [activeTab, setActiveTab] = useState<Tab>('html')
  const [consoleOutput, setConsoleOutput] = useState<string[]>([])
  const [showConsole, setShowConsole] = useState(false)
  
  // Unique ID for this playground instance
  const playgroundId = useRef(`playground-${Math.random().toString(36).slice(2, 11)}`).current

  // Generate preview HTML with console capture
  // CSP to block network requests (disabled when allowNetwork is true)
  const cspMeta = allowNetwork 
    ? '' 
    : `<meta http-equiv="Content-Security-Policy" content="default-src 'unsafe-inline'; script-src 'unsafe-inline'; style-src 'unsafe-inline';">`

  const previewSrc = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          ${cspMeta}
          <style>
            * { box-sizing: border-box; }
            body { 
              margin: 0; 
              padding: 16px; 
              font-family: system-ui, -apple-system, sans-serif;
              background: white;
              color: #1a1a1a;
            }
            ${cssCode}
          </style>
        </head>
        <body>
          ${htmlCode}
          <script>
            // Unique ID for this playground
            const PLAYGROUND_ID = '${playgroundId}';
            
            // Capture console output
            const originalConsole = {
              log: console.log,
              warn: console.warn,
              error: console.error,
            };
            
            function sendToParent(method, args) {
              try {
                parent.postMessage({
                  type: 'console',
                  playgroundId: PLAYGROUND_ID,
                  method,
                  args: args.map(arg => 
                    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                  ),
                }, '*');
              } catch(e) {}
            }
            
            console.log = (...args) => {
              originalConsole.log(...args);
              sendToParent('log', args);
            };
            console.warn = (...args) => {
              originalConsole.warn(...args);
              sendToParent('warn', args);
            };
            console.error = (...args) => {
              originalConsole.error(...args);
              sendToParent('error', args);
            };
            
            // Catch errors
            window.onerror = (msg, url, line, col, error) => {
              sendToParent('error', ['Error: ' + msg + ' (line ' + line + ')']);
              return false;
            };
            
            // Run user code
            try {
              ${jsCode}
            } catch(e) {
              console.error(e.toString());
            }
          </script>
        </body>
      </html>
    `
  }, [htmlCode, cssCode, jsCode, playgroundId, cspMeta])

  // Handle console messages from iframe - only from OUR iframe
  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type === 'console' && event.data?.playgroundId === playgroundId) {
      const { method, args } = event.data
      const prefix = method === 'error' ? '❌ ' : method === 'warn' ? '⚠️ ' : '› '
      setConsoleOutput(prev => [...prev.slice(-50), prefix + args.join(' ')])
      setShowConsole(true)
    }
  }, [playgroundId])

  // Listen for messages - use useLayoutEffect to attach before iframe loads
  useLayoutEffect(() => {
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [handleMessage])

  const clearConsole = () => setConsoleOutput([])

  const getCurrentCode = () => {
    if (activeTab === 'html') return htmlCode
    if (activeTab === 'css') return cssCode
    return jsCode
  }

  const setCurrentCode = (value: string) => {
    if (activeTab === 'html') setHtmlCode(value)
    else if (activeTab === 'css') setCssCode(value)
    else setJsCode(value)
  }

  const tabLabels: Record<Tab, string> = {
    html: 'HTML',
    css: 'CSS',
    js: 'JS',
  }

  return (
    <div 
      className="my-8 border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-surface)]"
      style={{ height: allowNetwork ? height + 36 : height }}
    >
      {/* Network Warning */}
      {allowNetwork && (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border-b border-amber-500/30 text-amber-600 dark:text-amber-400">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-xs font-medium">Network access enabled — this playground can make external requests</span>
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
        <div className="flex">
          {(['html', 'css', 'js'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-[var(--color-surface)] text-[var(--color-accent-primary)] border-b-2 border-[var(--color-accent-primary)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3">
          {title && (
            <span className="text-xs text-[var(--color-text-muted)]">{title}</span>
          )}
          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              showConsole 
                ? 'bg-[var(--color-accent-primary)] text-white' 
                : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            Console {consoleOutput.length > 0 && `(${consoleOutput.length})`}
          </button>
        </div>
      </div>

      {/* Editor + Preview */}
      <div className="flex" style={{ height: height - 41 - (showConsole ? 120 : 0) }}>
        {/* Code Editor */}
        <div className="w-1/2 border-r border-[var(--color-border)] flex flex-col bg-[#282c34]">
          <CodeEditor
            code={getCurrentCode()}
            onChange={setCurrentCode}
            language={activeTab}
            editable={editable}
          />
        </div>

        {/* Live Preview */}
        <div className="w-1/2 bg-white">
          <iframe
            srcDoc={previewSrc}
            sandbox="allow-scripts"
            className="w-full h-full border-0"
            title="Preview"
          />
        </div>
      </div>

      {/* Console */}
      {showConsole && (
        <div className="h-[120px] border-t border-[var(--color-border)] bg-[#1e1e1e] flex flex-col">
          <div className="flex items-center justify-between px-3 py-1 border-b border-gray-700">
            <span className="text-xs text-gray-400">Console</span>
            <button
              onClick={clearConsole}
              className="text-xs text-gray-400 hover:text-gray-200"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 overflow-auto p-2 font-mono text-xs">
            {consoleOutput.length === 0 ? (
              <div className="text-gray-500">Console output will appear here...</div>
            ) : (
              consoleOutput.map((line, i) => (
                <div 
                  key={i} 
                  className={`${
                    line.startsWith('❌') ? 'text-red-400' : 
                    line.startsWith('⚠️') ? 'text-yellow-400' : 
                    'text-gray-300'
                  }`}
                >
                  {line}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
