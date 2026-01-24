import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react'
import initSqlJs from 'sql.js'
import type { Database, SqlJsStatic } from 'sql.js'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface SQLiteRunnerProps {
  children: string
  title?: string
  showCode?: boolean
  // Optional: pre-populate with schema/data
  setup?: string
}

interface QueryResult {
  columns: string[]
  rows: unknown[][]
  rowCount: number
  executionTime: number
}

// Singleton SQL.js instance
let sqlPromise: Promise<SqlJsStatic> | null = null

async function getSqlJs(): Promise<SqlJsStatic> {
  if (!sqlPromise) {
    sqlPromise = initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
    })
  }
  return sqlPromise
}

export default function SQLiteRunner({
  children,
  title,
  showCode = true,
  setup,
}: SQLiteRunnerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [codeVisible, setCodeVisible] = useState(showCode)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [runCounter, setRunCounter] = useState(0)

  const dbRef = useRef<Database | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastErrorRef = useRef<string | null>(null)

  // Initialize SQL.js and database
  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        const SQL = await getSqlJs()

        if (!mounted) return

        // Create a new database for this runner
        const db = new SQL.Database()
        dbRef.current = db

        // Run setup SQL if provided
        if (setup) {
          try {
            db.run(setup)
          } catch (err) {
            console.warn('Setup SQL error:', err)
          }
        }

        setIsLoading(false)
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize SQLite')
          setIsLoading(false)
        }
      }
    }

    init()

    return () => {
      mounted = false
      // Close the database on unmount
      if (dbRef.current) {
        dbRef.current.close()
        dbRef.current = null
      }
    }
  }, [setup])

  // Run query
  useLayoutEffect(() => {
    if (isLoading || !dbRef.current || runCounter === 0) return

    const runQuery = async () => {
      setIsRunning(true)
      const startTime = performance.now()

      let newError: string | null = null

      try {
        const db = dbRef.current!
        const sql = children.trim()

        // Execute the query
        const results = db.exec(sql)
        const endTime = performance.now()

        if (results.length > 0) {
          const lastResult = results[results.length - 1]
          setResult({
            columns: lastResult.columns,
            rows: lastResult.values,
            rowCount: lastResult.values.length,
            executionTime: endTime - startTime,
          })
        } else {
          // Query executed but returned no results (e.g., INSERT, UPDATE, CREATE)
          const endTime2 = performance.now()
          setResult({
            columns: ['Result'],
            rows: [['Query executed successfully']],
            rowCount: 1,
            executionTime: endTime2 - startTime,
          })
        }
      } catch (err) {
        newError = err instanceof Error ? err.message : 'Query failed'
        setResult(null)
      }

      // Only update error state if it changed
      if (newError !== lastErrorRef.current) {
        lastErrorRef.current = newError
        setError(newError)
      }
      setIsRunning(false)
    }

    runQuery()
  }, [children, runCounter, isLoading])

  // Handle run button
  const handleRun = useCallback(() => {
    setRunCounter(n => n + 1)
  }, [])

  // Handle fullscreen toggle
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)

  // Handle escape key
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
          {title && <span className="text-white font-semibold">{title}</span>}
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded flex items-center gap-1">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2-6-1.5-6-2 2.13-2 6-2zm6 12c0 .5-2.13 2-6 2s-6-1.5-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V17zm0-4c0 .5-2.13 2-6 2s-6-1.5-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V13zm0-4c0 .5-2.13 2-6 2s-6-1.5-6-2V6.77c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V9z"/>
            </svg>
            SQLite
          </span>
          {isLoading && (
            <span className="text-xs text-yellow-400 animate-pulse">Loading...</span>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setCodeVisible(!codeVisible)}
            className="text-xs px-2 sm:px-3 py-1.5 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            {codeVisible ? 'Hide SQL' : 'Show SQL'}
          </button>
          <button
            onClick={handleRun}
            disabled={isLoading || isRunning}
            className="text-xs px-2 sm:px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Running...' : 'Run'}
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

      {/* SQL Code Panel */}
      {codeVisible && (
        <div className="border-b border-slate-700 overflow-x-auto">
          <SyntaxHighlighter
            language="sql"
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

      {/* Results */}
      <div className="p-4">
        {error && (
          <div className="p-3 rounded bg-red-900/50 border border-red-700 text-red-300 text-sm mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="space-y-3">
            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>{result.rowCount} row{result.rowCount !== 1 ? 's' : ''}</span>
              <span>{result.executionTime.toFixed(2)}ms</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-800">
                    {result.columns.map((col, i) => (
                      <th
                        key={i}
                        className="px-4 py-2 text-left text-slate-300 font-medium border-b border-slate-700"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.slice(0, 100).map((row, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? 'bg-slate-900/50' : 'bg-slate-800/30'}
                    >
                      {row.map((cell, j) => (
                        <td
                          key={j}
                          className="px-4 py-2 text-slate-300 border-b border-slate-700/50"
                        >
                          {formatCell(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {result.rowCount > 100 && (
                <div className="px-4 py-2 text-xs text-slate-500 bg-slate-800/50">
                  Showing first 100 of {result.rowCount} rows
                </div>
              )}
            </div>
          </div>
        )}

        {!result && !error && !isLoading && (
          <div className="text-center py-8 text-slate-500">
            Click "Run" to execute the query
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8 text-slate-500 animate-pulse">
            Loading SQLite WebAssembly...
          </div>
        )}
      </div>
    </div>
  )
}

// Format cell values for display
function formatCell(value: unknown): string {
  if (value === null || value === undefined) {
    return 'NULL'
  }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value.toString() : value.toFixed(4)
  }
  if (value instanceof Uint8Array) {
    return `BLOB(${value.length} bytes)`
  }
  return String(value)
}
