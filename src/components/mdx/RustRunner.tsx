import { useState, useCallback, useRef, useEffect } from 'react'
import { Play, Square, Loader2, Maximize2, Minimize2, Terminal, Package, Copy, Check } from 'lucide-react'

interface RustRunnerProps {
  /** Rust source code to compile and run */
  code: string
  /** Title shown in the header */
  title?: string
  /** Auto-run on mount */
  autoRun?: boolean
  /** Show the source code */
  showCode?: boolean
  /** Show line numbers in code display */
  lineNumbers?: boolean
  /** Rust edition (2018, 2021) */
  edition?: '2015' | '2018' | '2021'
  /** Compilation mode */
  mode?: 'debug' | 'release'
  /** Build target - 'run' executes, 'wasm' compiles to WebAssembly */
  target?: 'run' | 'wasm'
  /** Max height for output area */
  maxOutputHeight?: string
}

interface PlaygroundResponse {
  success: boolean
  stdout: string
  stderr: string
}

interface WasmExports {
  [key: string]: unknown
}

// Rust Playground API endpoint
const PLAYGROUND_URL = 'https://play.rust-lang.org/execute'

export default function RustRunner({
  code,
  title = 'Rust',
  autoRun = false,
  showCode = true,
  lineNumbers = true,
  edition = '2021',
  mode = 'release',
  target = 'run',
  maxOutputHeight = '300px',
}: RustRunnerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [output, setOutput] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [wasmExports, setWasmExports] = useState<WasmExports | null>(null)
  const [wasmInput, setWasmInput] = useState('')
  const [wasmFn, setWasmFn] = useState('')
  const abortControllerRef = useRef<AbortController | null>(null)
  const hasAutoRun = useRef(false)

  const runCode = useCallback(async () => {
    if (isRunning) return

    setIsRunning(true)
    setOutput('')
    setError(null)
    setWasmExports(null)

    abortControllerRef.current = new AbortController()

    try {
      if (target === 'wasm') {
        // For WASM, we need to compile with wasm32-unknown-unknown target
        // The playground doesn't directly support WASM output, so we'll use a workaround
        // We'll compile and run code that demonstrates WASM concepts
        setOutput('⚠️ Direct WASM compilation requires a build server.\n\n')
        setOutput(prev => prev + 'For now, running as native Rust...\n\n')
      }

      const response = await fetch(PLAYGROUND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channel: 'stable',
          mode: mode,
          edition: edition,
          crateType: 'bin',
          tests: false,
          code: code,
          backtrace: false,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`Playground API error: ${response.status}`)
      }

      const result: PlaygroundResponse = await response.json()

      if (result.stderr && !result.success) {
        setError(result.stderr)
      } else {
        let outputText = ''
        // Show build output first (it happens before execution)
        if (result.stderr) {
          const hasRealWarnings = result.stderr.includes('warning:') || result.stderr.includes('warning[')
          if (hasRealWarnings) {
            outputText += '⚠️ Warnings:\n' + result.stderr + '\n'
          } else {
            outputText += result.stderr + '\n'
          }
        }
        // Then show program output
        if (result.stdout) {
          outputText += result.stdout
        }
        setOutput(outputText.trim() || '(no output)')
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setOutput('Execution cancelled.')
      } else {
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      }
    } finally {
      setIsRunning(false)
      abortControllerRef.current = null
    }
  }, [code, edition, mode, target, isRunning])

  // Auto-run on mount
  useEffect(() => {
    if (autoRun && !hasAutoRun.current) {
      hasAutoRun.current = true
      runCode()
    }
  }, [autoRun, runCode])

  const stopExecution = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  const copyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [code])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
  }, [])

  // Call a WASM exported function
  const callWasmFunction = useCallback(() => {
    if (!wasmExports || !wasmFn) return

    try {
      const fn = wasmExports[wasmFn]
      if (typeof fn === 'function') {
        // Parse input as JSON array of arguments
        const args = wasmInput ? JSON.parse(`[${wasmInput}]`) : []
        const result = fn(...args)
        setOutput(prev => prev + `\n${wasmFn}(${wasmInput}) = ${result}`)
      } else {
        setError(`'${wasmFn}' is not a function`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error calling function')
    }
  }, [wasmExports, wasmFn, wasmInput])

  // Render code with syntax highlighting (basic)
  const renderCode = () => {
    const lines = code.split('\n')
    return lines.map((line, i) => (
      <div key={i} className="table-row">
        {lineNumbers && (
          <span className="table-cell pr-4 text-right text-[var(--color-text-muted)] select-none opacity-50 text-sm">
            {i + 1}
          </span>
        )}
        <span className="table-cell">
          <code>{highlightRust(line)}</code>
        </span>
      </div>
    ))
  }

  // Basic Rust syntax highlighting using tokenization
  const highlightRust = (line: string) => {
    // Tokenize the line to avoid regex interference
    const tokens: { text: string; type: string }[] = []
    let remaining = line
    
    while (remaining.length > 0) {
      let matched = false
      
      // Try to match patterns in order of priority
      const patterns: [RegExp, string][] = [
        // Comments first (highest priority)
        [/^\/\/.*$/, 'comment'],
        [/^\/\*[\s\S]*?\*\//, 'comment'],
        // Strings
        [/^"(?:[^"\\]|\\.)*"/, 'string'],
        [/^'(?:[^'\\]|\\.)'/, 'char'],
        // Attributes
        [/^#\[[\w(),\s="']+\]/, 'attribute'],
        // Lifetimes
        [/^'[a-z]+\b/, 'lifetime'],
        // Macros (word followed by !)
        [/^\b\w+!/, 'macro'],
        // Keywords
        [/^\b(fn|let|mut|const|if|else|match|loop|while|for|in|return|struct|enum|impl|trait|pub|use|mod|crate|self|super|where|async|await|move|ref|static|unsafe|extern|type|as|dyn|box)\b/, 'keyword'],
        // Types
        [/^\b(i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str|String|Vec|Option|Result|Box|Rc|Arc|Cell|RefCell|Self|HashMap|HashSet)\b/, 'type'],
        // Numbers
        [/^\b(0x[0-9a-fA-F]+|0b[01]+|0o[0-7]+|\d+\.?\d*(?:e[+-]?\d+)?)\b/, 'number'],
        // Identifiers and other text
        [/^\w+/, 'text'],
        // Operators and punctuation
        [/^[^\w\s]+/, 'punctuation'],
        // Whitespace
        [/^\s+/, 'whitespace'],
      ]
      
      for (const [pattern, type] of patterns) {
        const match = remaining.match(pattern)
        if (match) {
          tokens.push({ text: match[0], type })
          remaining = remaining.slice(match[0].length)
          matched = true
          break
        }
      }
      
      // Safety: consume one character if nothing matched
      if (!matched) {
        tokens.push({ text: remaining[0], type: 'text' })
        remaining = remaining.slice(1)
      }
    }
    
    // Render tokens with appropriate colors
    const colorMap: Record<string, string> = {
      comment: 'text-gray-500',
      string: 'text-green-400',
      char: 'text-green-400',
      attribute: 'text-yellow-400',
      lifetime: 'text-orange-400',
      macro: 'text-purple-400',
      keyword: 'text-pink-400',
      type: 'text-cyan-400',
      number: 'text-amber-400',
      punctuation: 'text-gray-400',
      text: '',
      whitespace: '',
    }
    
    return (
      <>
        {tokens.map((token, i) => {
          const escaped = token.text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
          const colorClass = colorMap[token.type] || ''
          return colorClass ? (
            <span key={i} className={colorClass} dangerouslySetInnerHTML={{ __html: escaped }} />
          ) : (
            <span key={i} dangerouslySetInnerHTML={{ __html: escaped }} />
          )
        })}
      </>
    )
  }

  // Format and colorize output
  const formatOutput = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, i) => {
      let className = 'text-gray-300' // default
      
      // Compiling/Building messages
      if (line.match(/^\s*(Compiling|Downloading|Downloaded|Building|Documenting)/)) {
        className = 'text-cyan-400'
      }
      // Finished message (specific cargo format)
      else if (line.match(/^\s*Finished\s+`/)) {
        className = 'text-green-400'
      }
      // Running message (specific cargo format with backticks)
      else if (line.match(/^\s*Running\s+`/)) {
        className = 'text-green-400'
      }
      // Warning indicators
      else if (line.match(/warning(\[|:|\s)/i) || line.includes('⚠️')) {
        className = 'text-yellow-400'
      }
      // Error indicators  
      else if (line.match(/error(\[|:|\s)/i)) {
        className = 'text-red-400'
      }
      // Help/note messages
      else if (line.match(/^\s*(help|note):/i)) {
        className = 'text-blue-400'
      }
      // Line number indicators (e.g., "  --> src/main.rs:1:5")
      else if (line.match(/^\s*-->/)) {
        className = 'text-blue-300'
      }
      // Pipe indicators for error context
      else if (line.match(/^\s*\d*\s*\|/)) {
        className = 'text-gray-400'
      }
      // Caret indicators (^^^)
      else if (line.match(/^\s*\^+/)) {
        className = 'text-yellow-400'
      }
      
      return (
        <div key={i} className={className}>
          {line || '\u00A0'}
        </div>
      )
    })
  }

  // Format error output with more detail
  const formatError = (text: string) => {
    const lines = text.split('\n')
    return lines.map((line, i) => {
      let className = 'text-red-400' // default for errors
      
      // Error type header
      if (line.match(/^error\[E\d+\]:/)) {
        className = 'text-red-500 font-bold'
      }
      // Location pointer
      else if (line.match(/^\s*-->/)) {
        className = 'text-blue-300'
      }
      // Code context with pipe
      else if (line.match(/^\s*\d*\s*\|/)) {
        className = 'text-gray-300'
      }
      // Help suggestions
      else if (line.match(/^\s*(help|note):/i)) {
        className = 'text-cyan-400'
      }
      // Caret indicators
      else if (line.match(/\^+/)) {
        className = 'text-red-400'
      }
      
      return (
        <div key={i} className={className}>
          {line || '\u00A0'}
        </div>
      )
    })
  }

  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-50 bg-[var(--color-bg-primary)] overflow-auto p-4'
    : 'my-6 rounded-lg overflow-hidden border border-[var(--color-border)]'

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <Package size={16} className="text-orange-500" />
          <span className="font-medium text-sm">{title}</span>
          <span className="text-xs text-[var(--color-text-muted)] px-2 py-0.5 bg-[var(--color-bg-secondary)] rounded">
            Rust {edition}
          </span>
          {mode === 'release' && (
            <span className="text-xs text-green-400 px-2 py-0.5 bg-green-400/10 rounded">
              release
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={copyCode}
            className="p-1.5 rounded hover:bg-[var(--color-bg-secondary)] transition-colors"
            title="Copy code"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded hover:bg-[var(--color-bg-secondary)] transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          {isRunning ? (
            <button
              onClick={stopExecution}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
            >
              <Square size={14} />
              <span className="hidden sm:inline">Stop</span>
            </button>
          ) : (
            <button
              onClick={runCode}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm font-medium transition-colors"
            >
              <Play size={14} />
              <span className="hidden sm:inline">Run</span>
            </button>
          )}
        </div>
      </div>

      {/* Code Display */}
      {showCode && (
        <div className="overflow-x-auto">
          <pre className="p-4 text-sm font-mono table w-full">
            {renderCode()}
          </pre>
        </div>
      )}

      {/* Output Area */}
      <div className="border-t border-[var(--color-border)]">
        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-tertiary)] text-xs text-[var(--color-text-muted)]">
          <Terminal size={14} />
          <span>Output</span>
          {isRunning && (
            <Loader2 size={14} className="animate-spin ml-auto" />
          )}
        </div>
        <div
          className="p-4 bg-[#1a1a1a] font-mono text-sm overflow-auto"
          style={{ maxHeight: isFullscreen ? '50vh' : maxOutputHeight }}
        >
          {error ? (
            <pre className="whitespace-pre-wrap">{formatError(error)}</pre>
          ) : output ? (
            <pre className="whitespace-pre-wrap">{formatOutput(output)}</pre>
          ) : (
            <span className="text-[var(--color-text-muted)]">
              Click "Run" to compile and execute the Rust code
            </span>
          )}
        </div>
      </div>

      {/* WASM Function Caller (when WASM is loaded) */}
      {wasmExports && (
        <div className="border-t border-[var(--color-border)] p-4 bg-[var(--color-bg-tertiary)]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="function name"
              value={wasmFn}
              onChange={(e) => setWasmFn(e.target.value)}
              className="px-2 py-1 text-sm bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded"
            />
            <span className="text-[var(--color-text-muted)]">(</span>
            <input
              type="text"
              placeholder="args (comma-separated)"
              value={wasmInput}
              onChange={(e) => setWasmInput(e.target.value)}
              className="flex-1 px-2 py-1 text-sm bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded"
            />
            <span className="text-[var(--color-text-muted)]">)</span>
            <button
              onClick={callWasmFunction}
              className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm"
            >
              Call
            </button>
          </div>
          <div className="mt-2 text-xs text-[var(--color-text-muted)]">
            Available exports: {Object.keys(wasmExports).filter(k => typeof wasmExports[k] === 'function').join(', ') || 'none'}
          </div>
        </div>
      )}
    </div>
  )
}
