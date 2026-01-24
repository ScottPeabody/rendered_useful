import { useState, useRef, useEffect, useCallback, useLayoutEffect } from 'react'
import * as duckdb from '@duckdb/duckdb-wasm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Import worker and wasm URLs for Vite bundling
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url'
import duckdb_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url'
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url'
import duckdb_worker_eh from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url'

// Convert Arrow values to plain JavaScript values
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function arrowToJS(val: any): unknown {
  if (val === null || val === undefined) {
    return null
  }
  // Handle BigInt
  if (typeof val === 'bigint') {
    return Number(val)
  }
  // Handle Arrow Decimal (has a toBigInt or similar)
  if (val?.constructor?.name === 'Decimal') {
    return Number(val)
  }
  // Handle arrays (Arrow lists)
  if (Array.isArray(val)) {
    return val.map(arrowToJS)
  }
  // Handle Map/Struct types that have toJSON - parse the JSON string
  if (typeof val?.toJSON === 'function') {
    try {
      const json = val.toJSON()
      // toJSON returns a JSON string, so parse it
      if (typeof json === 'string') {
        return JSON.parse(json)
      }
      return json
    } catch {
      return val.toString()
    }
  }
  // Handle objects with toArray (Arrow vectors)
  if (typeof val?.toArray === 'function') {
    return val.toArray().map(arrowToJS)
  }
  // Primitives pass through
  return val
}

// DuckDB bundles for Vite
const DUCKDB_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: duckdb_wasm,
    mainWorker: duckdb_worker,
  },
  eh: {
    mainModule: duckdb_wasm_eh,
    mainWorker: duckdb_worker_eh,
  },
}

interface DuckDBRunnerProps {
  children: string
  title?: string
  showCode?: boolean
  // Optional CSV data to load as tables
  tables?: Record<string, string>
}

interface QueryResult {
  columns: string[]
  rows: unknown[][]
  rowCount: number
  executionTime: number
}

// Singleton DuckDB instance
let dbInstance: duckdb.AsyncDuckDB | null = null
let dbInitPromise: Promise<duckdb.AsyncDuckDB> | null = null

async function getDatabase(): Promise<duckdb.AsyncDuckDB> {
  if (dbInstance) return dbInstance

  if (dbInitPromise) return dbInitPromise

  dbInitPromise = (async () => {
    // Select the best bundle for this browser
    const bundle = await duckdb.selectBundle(DUCKDB_BUNDLES)

    // Instantiate the worker
    const worker = new Worker(bundle.mainWorker!)
    const logger = new duckdb.ConsoleLogger()

    // Instantiate the async DB
    const db = new duckdb.AsyncDuckDB(logger, worker)
    await db.instantiate(bundle.mainModule)

    dbInstance = db
    return db
  })()

  return dbInitPromise
}

export function DuckDBRunner({
  children,
  title,
  showCode = true,
  tables = {},
}: DuckDBRunnerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<QueryResult | null>(null)
  const [codeVisible, setCodeVisible] = useState(showCode)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [runCounter, setRunCounter] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const connRef = useRef<duckdb.AsyncDuckDBConnection | null>(null)
  const lastErrorRef = useRef<string | null>(null)

  // Initialize DuckDB
  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        const db = await getDatabase()
        const conn = await db.connect()

        // Load any provided tables
        for (const [tableName, csvData] of Object.entries(tables)) {
          await db.registerFileText(`${tableName}.csv`, csvData)
          await conn.query(`
            CREATE OR REPLACE TABLE ${tableName} AS 
            SELECT * FROM read_csv_auto('${tableName}.csv')
          `)
        }

        if (mounted) {
          connRef.current = conn
          setIsLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize DuckDB')
          setIsLoading(false)
        }
      }
    }

    init()

    return () => {
      mounted = false
    }
  }, [tables])

  // Run query
  useLayoutEffect(() => {
    if (isLoading || !connRef.current || runCounter === 0) return

    const runQuery = async () => {
      setIsRunning(true)
      const startTime = performance.now()

      let newError: string | null = null

      try {
        const conn = connRef.current!
        const sql = children.trim()

        const arrowResult = await conn.query(sql)
        const endTime = performance.now()

        // Convert Arrow result to plain arrays
        const columns = arrowResult.schema.fields.map(f => f.name)
        const rows: unknown[][] = []

        // Iterate through each row using the table iterator
        for (const row of arrowResult) {
          const rowArray: unknown[] = []
          for (const col of columns) {
            // Get the raw value and convert to JS primitive
            const val = row[col]
            rowArray.push(arrowToJS(val))
          }
          rows.push(rowArray)
        }

        setResult({
          columns,
          rows,
          rowCount: arrowResult.numRows,
          executionTime: endTime - startTime,
        })
      } catch (err) {
        newError = err instanceof Error ? err.message : 'Query failed'
        setResult(null)
      }

      // Only update error state if it changed
      if (newError !== lastErrorRef.current) {
        lastErrorRef.current = newError
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            DuckDB
          </span>
          {isLoading && (
            <span className="text-xs text-yellow-400 animate-pulse">Initializing...</span>
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
            className="text-xs px-2 sm:px-3 py-1.5 rounded bg-amber-600 text-white hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="px-4 py-2 text-left font-semibold text-slate-300 border-b border-slate-700"
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
            Loading DuckDB WebAssembly...
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
  if (typeof value === 'bigint') {
    return value.toString()
  }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value.toString() : value.toFixed(4)
  }
  if (value instanceof Date) {
    return value.toISOString()
  }
  if (Array.isArray(value)) {
    return '[' + value.map(formatCell).join(', ') + ']'
  }
  if (typeof value === 'object') {
    // Handle objects that might contain BigInt
    try {
      return JSON.stringify(value, (_, v) => 
        typeof v === 'bigint' ? v.toString() : v
      )
    } catch {
      return String(value)
    }
  }
  return String(value)
}

export default DuckDBRunner
