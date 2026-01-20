import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, Play, Square, ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface NotebookCell {
  cell_type: 'markdown' | 'code' | 'raw';
  source: string | string[];
  outputs?: NotebookOutput[];
  execution_count?: number | null;
  metadata?: Record<string, unknown>;
}

interface NotebookOutput {
  output_type: 'stream' | 'execute_result' | 'display_data' | 'error';
  text?: string | string[];
  data?: {
    'text/plain'?: string | string[];
    'text/html'?: string | string[];
    'image/png'?: string;
  };
  name?: string;
  ename?: string;
  evalue?: string;
  traceback?: string[];
}

interface NotebookData {
  cells: NotebookCell[];
  metadata?: {
    kernelspec?: {
      display_name?: string;
      language?: string;
      name?: string;
    };
  };
  nbformat: number;
  nbformat_minor: number;
}

interface CellState {
  output: string;
  error: string | null;
  isRunning: boolean;
  executionCount: number | null;
}

interface PyodideNotebookProps {
  notebookUrl: string;
}

declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackagesFromImports: (code: string) => Promise<void>;
  globals: {
    get: (name: string) => unknown;
  };
}

function getSourceText(source: string | string[]): string {
  return Array.isArray(source) ? source.join('') : source;
}

// Simple markdown renderer
function renderMarkdown(text: string): string {
  return text
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-[var(--color-text-primary)]">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-6 mb-3 text-[var(--color-text-primary)]">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 text-[var(--color-text-primary)]">$1</h1>')
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-[var(--color-surface)] text-[var(--color-accent-primary)] font-mono text-sm">$1</code>')
    .replace(/^\- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-[var(--color-accent-primary)] hover:underline">$1</a>')
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/\n/g, '<br />');
}

function MarkdownCell({ cell }: { cell: NotebookCell }) {
  const source = getSourceText(cell.source);
  const html = renderMarkdown(source);

  return (
    <div 
      className="prose prose-invert max-w-none px-4 py-2 text-[var(--color-text-secondary)]"
      dangerouslySetInnerHTML={{ __html: `<p class="mb-3">${html}</p>` }}
    />
  );
}

interface CodeCellProps {
  cell: NotebookCell;
  index: number;
  cellState: CellState;
  onRun: () => void;
  pyodideReady: boolean;
}

function CodeCell({ cell, index: _index, cellState, onRun, pyodideReady }: CodeCellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const source = getSourceText(cell.source);

  return (
    <div className="border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-surface)]">
      {/* Cell header */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-background)] border-b border-[var(--color-border)]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-0.5 hover:bg-[var(--color-surface)] rounded transition-colors"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
        </button>
        <span className="text-xs text-[var(--color-text-muted)] font-mono">
          [{cellState.executionCount ?? ' '}]
        </span>
        <span className="text-xs text-[var(--color-text-muted)]">Python</span>
        <div className="flex-1" />
        <button
          onClick={onRun}
          disabled={!pyodideReady || cellState.isRunning}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-green-600/20 text-green-400 hover:bg-green-600/30"
          title={pyodideReady ? 'Run cell (Shift+Enter)' : 'Loading Python...'}
        >
          {cellState.isRunning ? (
            <>
              <Square size={12} className="animate-pulse" />
              Running
            </>
          ) : (
            <>
              <Play size={12} />
              Run
            </>
          )}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Code */}
          <div className="text-sm">
            <SyntaxHighlighter
              language="python"
              style={oneDark}
              customStyle={{
                margin: 0,
                padding: '12px 16px',
                background: 'transparent',
                fontSize: '13px',
              }}
            >
              {source}
            </SyntaxHighlighter>
          </div>

          {/* Output */}
          {(cellState.output || cellState.error) && (
            <div className="border-t border-[var(--color-border)] p-3 bg-[var(--color-background)]">
              {cellState.error ? (
                <pre className="text-sm text-red-400 whitespace-pre-wrap font-mono bg-red-500/10 p-2 rounded">
                  {cellState.error}
                </pre>
              ) : cellState.output.includes('<img') ? (
                // Render HTML output (for matplotlib figures)
                <div 
                  className="text-sm text-[var(--color-text-secondary)]"
                  dangerouslySetInnerHTML={{ __html: cellState.output }}
                />
              ) : (
                <pre className="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap font-mono">
                  {cellState.output}
                </pre>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function PyodideNotebook({ notebookUrl }: PyodideNotebookProps) {
  const [notebook, setNotebook] = useState<NotebookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const [cellStates, setCellStates] = useState<Map<number, CellState>>(new Map());
  const pyodideRef = useRef<PyodideInterface | null>(null);
  const executionCountRef = useRef(0);

  // Load notebook
  useEffect(() => {
    async function loadNotebook() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(notebookUrl);
        if (!response.ok) {
          throw new Error(`Failed to load notebook: ${response.status}`);
        }
        const data = await response.json();
        setNotebook(data);
        
        // Initialize cell states
        const states = new Map<number, CellState>();
        data.cells.forEach((_: NotebookCell, i: number) => {
          states.set(i, { output: '', error: null, isRunning: false, executionCount: null });
        });
        setCellStates(states);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load notebook');
      } finally {
        setLoading(false);
      }
    }

    loadNotebook();
  }, [notebookUrl]);

  // Load Pyodide
  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current || pyodideLoading) return;
    
    setPyodideLoading(true);
    try {
      // Load Pyodide script if not already loaded
      if (!window.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Pyodide'));
          document.head.appendChild(script);
        });
      }

      const pyodide = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
      });

      // Set up stdout capture and matplotlib support
      await pyodide.runPythonAsync(`
import sys
from io import StringIO

class OutputCapture:
    def __init__(self):
        self.output = StringIO()
        self.figures = []
    
    def write(self, text):
        self.output.write(text)
    
    def flush(self):
        pass
    
    def get_output(self):
        return self.output.getvalue()
    
    def get_figures(self):
        return self.figures
    
    def add_figure(self, fig_data):
        self.figures.append(fig_data)
    
    def clear(self):
        self.output = StringIO()
        self.figures = []

_output_capture = OutputCapture()
sys.stdout = _output_capture
sys.stderr = _output_capture

# Setup matplotlib for inline display
def setup_matplotlib():
    try:
        import matplotlib
        matplotlib.use('AGG')
        import matplotlib.pyplot as plt
        
        # Store original show function
        _original_show = plt.show
        
        def capture_show(*args, **kwargs):
            import base64
            from io import BytesIO
            for fig_num in plt.get_fignums():
                fig = plt.figure(fig_num)
                buf = BytesIO()
                fig.savefig(buf, format='png', bbox_inches='tight', dpi=100)
                buf.seek(0)
                img_data = base64.b64encode(buf.read()).decode('utf-8')
                _output_capture.add_figure(img_data)
                buf.close()
            plt.close('all')
        
        plt.show = capture_show
        return True
    except ImportError:
        return False
      `);

      pyodideRef.current = pyodide;
      setPyodideReady(true);
    } catch (err) {
      console.error('Failed to load Pyodide:', err);
      setError('Failed to load Python runtime');
    } finally {
      setPyodideLoading(false);
    }
  }, [pyodideLoading]);

  // Run a cell
  const runCell = useCallback(async (cellIndex: number, source: string) => {
    if (!pyodideRef.current) {
      await loadPyodide();
      if (!pyodideRef.current) return;
    }

    const pyodide = pyodideRef.current;
    
    setCellStates(prev => {
      const newStates = new Map(prev);
      newStates.set(cellIndex, { ...prev.get(cellIndex)!, isRunning: true, output: '', error: null });
      return newStates;
    });

    try {
      // Clear output capture
      await pyodide.runPythonAsync('_output_capture.clear()');
      
      // Strip IPython magic commands (lines starting with % or !)
      // These don't work in plain Python/Pyodide
      const cleanedSource = source
        .split('\n')
        .filter(line => {
          const trimmed = line.trim();
          // Skip magic commands like %matplotlib inline, !pip install, etc.
          return !trimmed.startsWith('%') && !trimmed.startsWith('!');
        })
        .join('\n');
      
      // If all lines were magic commands, just skip
      if (!cleanedSource.trim()) {
        executionCountRef.current += 1;
        setCellStates((prev) => {
          const newStates = new Map(prev);
          newStates.set(cellIndex, {
            ...prev.get(cellIndex)!,
            isRunning: false,
            output: '(magic commands skipped in rendered mode)',
            error: null,
            executionCount: executionCountRef.current,
          });
          return newStates;
        });
        return;
      }
      
      // Try to install any needed packages
      try {
        await pyodide.loadPackagesFromImports(cleanedSource);
        // Setup matplotlib if it was imported
        if (cleanedSource.includes('matplotlib') || cleanedSource.includes('plt')) {
          await pyodide.runPythonAsync('setup_matplotlib()');
        }
      } catch {
        // Ignore package loading errors
      }

      // Run the code
      const result = await pyodide.runPythonAsync(cleanedSource);
      
      // Get captured output and figures
      const capturedOutput = await pyodide.runPythonAsync('_output_capture.get_output()') as string;
      const figures = await pyodide.runPythonAsync('_output_capture.get_figures()');
      const figureList = figures ? (figures as { toJs: () => string[] }).toJs() : [];
      
      // Format output
      let output = capturedOutput || '';
      if (result !== undefined && result !== null && String(result) !== 'None') {
        if (output) output += '\n';
        output += String(result);
      }
      
      // Add figure images as HTML img tags
      if (figureList && figureList.length > 0) {
        const figuresHtml = figureList.map((imgData: string) => 
          `<img src="data:image/png;base64,${imgData}" style="max-width: 100%;" />`
        ).join('\n');
        output = output ? output + '\n' + figuresHtml : figuresHtml;
      }

      executionCountRef.current += 1;
      
      setCellStates(prev => {
        const newStates = new Map(prev);
        newStates.set(cellIndex, { 
          output, 
          error: null, 
          isRunning: false, 
          executionCount: executionCountRef.current 
        });
        return newStates;
      });
    } catch (err) {
      executionCountRef.current += 1;
      setCellStates(prev => {
        const newStates = new Map(prev);
        newStates.set(cellIndex, { 
          output: '', 
          error: err instanceof Error ? err.message : String(err), 
          isRunning: false,
          executionCount: executionCountRef.current
        });
        return newStates;
      });
    }
  }, [loadPyodide]);

  // Run all cells
  const runAllCells = useCallback(async () => {
    if (!notebook) return;
    
    for (let i = 0; i < notebook.cells.length; i++) {
      const cell = notebook.cells[i];
      if (cell.cell_type === 'code') {
        await runCell(i, getSourceText(cell.source));
      }
    }
  }, [notebook, runCell]);

  // Reset kernel
  const resetKernel = useCallback(() => {
    pyodideRef.current = null;
    setPyodideReady(false);
    executionCountRef.current = 0;
    
    if (notebook) {
      const states = new Map<number, CellState>();
      notebook.cells.forEach((_, i) => {
        states.set(i, { output: '', error: null, isRunning: false, executionCount: null });
      });
      setCellStates(states);
    }
  }, [notebook]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-primary)]" />
          <p className="text-[var(--color-text-secondary)]">Loading notebook...</p>
        </div>
      </div>
    );
  }

  if (error || !notebook) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Failed to load notebook'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded bg-[var(--color-accent-primary)] text-white hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const kernelName = notebook.metadata?.kernelspec?.display_name || 'Python 3';

  return (
    <div className="space-y-4">
      {/* Notebook header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 rounded bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] text-xs font-medium">
            {kernelName}
          </span>
          <span className="text-sm text-[var(--color-text-muted)]">
            {notebook.cells.length} cells
          </span>
          {pyodideLoading && (
            <span className="flex items-center gap-2 text-sm text-yellow-400">
              <Loader2 size={14} className="animate-spin" />
              Loading Python...
            </span>
          )}
          {pyodideReady && (
            <span className="text-sm text-green-400">
              ● Python ready
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runAllCells}
            disabled={pyodideLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play size={14} />
            Run All
          </button>
          <button
            onClick={resetKernel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm font-medium hover:bg-[var(--color-border)]/50 transition-colors"
            title="Reset kernel"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Cells */}
      <div className="space-y-3">
        {notebook.cells.map((cell, index) => {
          if (cell.cell_type === 'code') {
            return (
              <CodeCell
                key={index}
                cell={cell}
                index={index}
                cellState={cellStates.get(index) || { output: '', error: null, isRunning: false, executionCount: null }}
                onRun={() => runCell(index, getSourceText(cell.source))}
                pyodideReady={pyodideReady || !pyodideLoading}
              />
            );
          }
          if (cell.cell_type === 'markdown') {
            return <MarkdownCell key={index} cell={cell} />;
          }
          return null;
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-4 py-6 text-sm text-[var(--color-text-muted)]">
        <span>Powered by Pyodide</span>
        <span>•</span>
        <a
          href={notebookUrl}
          download
          className="hover:text-[var(--color-text-primary)] transition-colors"
        >
          Download .ipynb
        </a>
      </div>
    </div>
  );
}

export default PyodideNotebook;
