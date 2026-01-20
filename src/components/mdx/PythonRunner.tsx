import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Square, RotateCcw, Loader2, Maximize2, X } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackagesFromImports: (code: string) => Promise<void>;
  globals: {
    get: (name: string) => unknown;
  };
}

declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface>;
    _sharedPyodide?: PyodideInterface;
    _pyodideLoading?: Promise<PyodideInterface>;
    Bokeh?: unknown;
    _bokehLoading?: Promise<void>;
  }
}

// Load Bokeh JavaScript library from CDN
async function loadBokehJS(): Promise<void> {
  // Already loaded
  if (window.Bokeh) {
    return;
  }

  // Wait for in-progress load
  if (window._bokehLoading) {
    return window._bokehLoading;
  }

  // Start loading
  window._bokehLoading = (async () => {
    const bokehVersion = '3.2.2';
    const scripts = [
      `https://cdn.bokeh.org/bokeh/release/bokeh-${bokehVersion}.min.js`,
      `https://cdn.bokeh.org/bokeh/release/bokeh-widgets-${bokehVersion}.min.js`,
      `https://cdn.bokeh.org/bokeh/release/bokeh-tables-${bokehVersion}.min.js`,
      `https://cdn.bokeh.org/bokeh/release/bokeh-gl-${bokehVersion}.min.js`,
    ];

    // Load scripts sequentially (they depend on each other)
    for (const src of scripts) {
      await new Promise<void>((resolve, reject) => {
        // Check if already loaded
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.crossOrigin = 'anonymous';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });
    }

    // Wait for Bokeh to be fully initialized
    await new Promise<void>((resolve) => {
      const checkBokeh = () => {
        if (window.Bokeh) {
          resolve();
        } else {
          setTimeout(checkBokeh, 50);
        }
      };
      checkBokeh();
    });
  })();

  return window._bokehLoading;
}

interface PythonRunnerProps {
  /** The Python code to run - pass as `code` prop or as children with template literal */
  children?: string;
  /** The Python code to run - alternative to children */
  code?: string;
  /** Whether to auto-run on mount */
  autoRun?: boolean;
  /** Title for the code block */
  title?: string;
  /** Whether to show line numbers */
  lineNumbers?: boolean;
  /** Height constraint for output */
  maxOutputHeight?: number;
  /** Whether to show the code block (default: true) */
  showCode?: boolean;
}

// Shared Pyodide loader to avoid multiple instances
async function getOrLoadPyodide(): Promise<PyodideInterface> {
  // Return existing instance
  if (window._sharedPyodide) {
    return window._sharedPyodide;
  }

  // Wait for in-progress load
  if (window._pyodideLoading) {
    return window._pyodideLoading;
  }

  // Start new load
  window._pyodideLoading = (async () => {
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

def setup_matplotlib():
    try:
        import matplotlib
        matplotlib.use('AGG')
        import matplotlib.pyplot as plt
        
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

    window._sharedPyodide = pyodide;
    return pyodide;
  })();

  return window._pyodideLoading;
}

export function PythonRunner({ 
  children, 
  code: codeProp,
  autoRun = false, 
  title,
  lineNumbers = true,
  maxOutputHeight = 400,
  showCode = true,
}: PythonRunnerProps) {
  const [output, setOutput] = useState<string>('');
  const [figures, setFigures] = useState<string[]>([]);
  const [htmlOutput, setHtmlOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(!!window._sharedPyodide);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pyodideRef = useRef<PyodideInterface | null>(window._sharedPyodide || null);
  const hasAutoRun = useRef(false);
  const htmlContainerRef = useRef<HTMLDivElement>(null);

  // Get code from either prop or children
  const code = (codeProp || (typeof children === 'string' ? children : String(children || ''))).trim();

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setOutput('');
    setFigures([]);
    setHtmlOutput('');

    try {
      // Load Pyodide if not ready
      if (!pyodideRef.current) {
        setIsLoading(true);
        pyodideRef.current = await getOrLoadPyodide();
        setPyodideReady(true);
        setIsLoading(false);
      }

      const pyodide = pyodideRef.current;

      // Clear output capture
      await pyodide.runPythonAsync('_output_capture.clear()');

      // Check if code uses matplotlib and set it up
      if (code.includes('matplotlib') || code.includes('plt.')) {
        await pyodide.loadPackagesFromImports('import matplotlib');
        await pyodide.runPythonAsync('setup_matplotlib()');
      }

      // Check if code uses Bokeh
      const usesBokeh = code.includes('bokeh');
      if (usesBokeh) {
        // Load Bokeh JavaScript library for rendering
        await loadBokehJS();
        
        await pyodide.loadPackagesFromImports('import bokeh');
        // Set up Bokeh for standalone HTML output
        await pyodide.runPythonAsync(`
from bokeh.io import output_notebook
from bokeh.embed import file_html
from bokeh.resources import CDN
import bokeh.plotting

_bokeh_figures = []
_original_show = bokeh.plotting.show

def _capture_bokeh_show(p):
    html = file_html(p, CDN, "plot")
    _bokeh_figures.append(html)

bokeh.plotting.show = _capture_bokeh_show
bokeh.io.show = _capture_bokeh_show

def _get_bokeh_figures():
    return _bokeh_figures

def _clear_bokeh_figures():
    global _bokeh_figures
    _bokeh_figures = []
`);
      }

      // Load any required packages
      await pyodide.loadPackagesFromImports(code);

      // Strip IPython magic commands
      const cleanedCode = code
        .split('\n')
        .filter(line => {
          const trimmed = line.trim();
          return !trimmed.startsWith('%') && !trimmed.startsWith('!');
        })
        .join('\n');

      // Run the code
      const result = await pyodide.runPythonAsync(cleanedCode);

      // Get captured output
      const capturedOutput = await pyodide.runPythonAsync('_output_capture.get_output()') as string;
      const capturedFigures = await pyodide.runPythonAsync('list(_output_capture.get_figures())') as string[];

      // Get Bokeh figures if any
      let bokehHtml = '';
      if (code.includes('bokeh')) {
        try {
          const bokehFigures = await pyodide.runPythonAsync('_get_bokeh_figures()') as string[];
          if (bokehFigures && bokehFigures.length > 0) {
            bokehHtml = bokehFigures.join('\n');
          }
          await pyodide.runPythonAsync('_clear_bokeh_figures()');
        } catch {
          // Bokeh not set up yet, ignore
        }
      }

      // Build output string
      let outputStr = capturedOutput;
      if (result !== undefined && result !== null && String(result) !== 'None') {
        if (outputStr && !outputStr.endsWith('\n')) {
          outputStr += '\n';
        }
        outputStr += String(result);
      }

      setOutput(outputStr);
      setFigures(capturedFigures || []);
      setHtmlOutput(bokehHtml);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      // Clean up Python traceback for readability
      const cleanError = errorMessage
        .replace(/File "<exec>", line \d+, in <module>\n/g, '')
        .replace(/PythonError: Traceback \(most recent call last\):\n/g, '');
      setError(cleanError);
    } finally {
      setIsRunning(false);
    }
  }, [code]);

  // Auto-run on mount if requested
  useEffect(() => {
    if (autoRun && !hasAutoRun.current) {
      hasAutoRun.current = true;
      runCode();
    }
  }, [autoRun, runCode]);

  const clearOutput = () => {
    setOutput('');
    setFigures([]);
    setHtmlOutput('');
    setError(null);
  };

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  // Execute Bokeh scripts when HTML output changes
  useEffect(() => {
    if (htmlOutput && htmlContainerRef.current) {
      const container = htmlContainerRef.current;
      
      // Parse the full HTML to extract body content
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlOutput, 'text/html');
      const bodyContent = doc.body;
      
      if (!bodyContent) {
        container.innerHTML = htmlOutput;
        return;
      }
      
      // Get all scripts from the body
      const scripts = Array.from(bodyContent.querySelectorAll('script'));
      
      // Remove scripts from body temporarily so we can add content first
      scripts.forEach(s => s.remove());
      
      // Clear container and add the body content (divs, etc.)
      container.innerHTML = '';
      Array.from(bodyContent.children).forEach(child => {
        container.appendChild(child.cloneNode(true));
      });
      
      // Separate JSON data scripts from executable JS scripts
      const jsonScripts = scripts.filter(s => s.type === 'application/json');
      const jsScripts = scripts.filter(s => s.type !== 'application/json' && !s.src?.includes('cdn.bokeh.org'));
      
      // Add JSON data scripts to document body (Bokeh needs to find them globally)
      jsonScripts.forEach(script => {
        // Remove any existing script with same ID to prevent duplicates
        const existingScript = document.getElementById(script.id);
        if (existingScript) existingScript.remove();
        
        const newScript = document.createElement('script');
        newScript.type = 'application/json';
        newScript.id = script.id;
        newScript.textContent = script.textContent;
        document.body.appendChild(newScript);
      });
      
      // Execute Bokeh JS scripts after Bokeh is loaded
      const executeBokehScripts = () => {
        jsScripts.forEach(script => {
          if (script.textContent) {
            try {
              // Use Function constructor to execute in global scope
              const fn = new Function(script.textContent);
              fn();
            } catch (e) {
              console.warn('Bokeh script execution error:', e);
            }
          }
        });
      };
      
      // Wait for Bokeh to be available
      const waitForBokeh = (attempts = 0) => {
        if (window.Bokeh) {
          // Give Bokeh a moment to fully initialize
          setTimeout(executeBokehScripts, 50);
        } else if (attempts < 50) {
          setTimeout(() => waitForBokeh(attempts + 1), 100);
        } else {
          console.warn('Bokeh library not loaded after timeout');
        }
      };
      
      waitForBokeh();
      
      // Cleanup: remove JSON scripts when component unmounts or output changes
      return () => {
        jsonScripts.forEach(script => {
          const elem = document.getElementById(script.id);
          if (elem) elem.remove();
        });
      };
    }
  }, [htmlOutput]);

  return (
    <>
      {/* Fullscreen overlay for matplotlib figures */}
      {isFullscreen && figures.length > 0 && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFullscreen(false);
          }}
        >
          {/* Fullscreen header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="text-sm font-medium text-white/80">
              🐍 {title || 'Python'} - Visualization
            </span>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              title="Exit fullscreen (Esc)"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Fullscreen content */}
          <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
            <div className="max-w-full max-h-full">
              {figures.map((fig, i) => (
                <img
                  key={i}
                  src={`data:image/png;base64,${fig}`}
                  alt={`Figure ${i + 1}`}
                  className="max-w-full max-h-[calc(100vh-120px)] object-contain rounded"
                />
              ))}
            </div>
          </div>
          
          {/* Fullscreen hint */}
          <div className="text-center py-2 text-white/40 text-xs">
            Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Esc</kbd> or click outside to exit
          </div>
        </div>
      )}

      {/* Fullscreen overlay for Bokeh - uses portal-style approach */}
      {isFullscreen && htmlOutput && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFullscreen(false);
          }}
        >
          {/* Fullscreen header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="text-sm font-medium text-white/80">
              🐍 {title || 'Python'} - Interactive Visualization
            </span>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              title="Exit fullscreen (Esc)"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Fullscreen Bokeh content - the actual container is positioned here via CSS */}
          <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
            {/* Placeholder - actual Bokeh content stays in place but gets styled */}
          </div>
          
          {/* Fullscreen hint */}
          <div className="text-center py-2 text-white/40 text-xs">
            Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Esc</kbd> or click outside to exit
          </div>
        </div>
      )}

      <div className="my-6 rounded-lg border border-[var(--color-border)] overflow-hidden bg-[var(--color-surface)]">
        {/* Header */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-background)] border-b border-[var(--color-border)]">
          <span className="text-xs font-medium text-[var(--color-text-muted)]">
            🐍 {title || 'Python'}
          </span>
          <div className="flex-1" />
          {(figures.length > 0 || htmlOutput) && (
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-1.5 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors"
              title="Fullscreen visualization"
            >
              <Maximize2 size={14} />
            </button>
          )}
          {(output || error || figures.length > 0 || htmlOutput) && (
            <button
              onClick={clearOutput}
              className="p-1.5 rounded text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] transition-colors"
              title="Clear output"
            >
              <RotateCcw size={14} />
            </button>
          )}
          <button
            onClick={runCode}
            disabled={isRunning || isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-green-600/20 text-green-400 hover:bg-green-600/30"
            title={pyodideReady ? 'Run code' : 'Click to load Python runtime and run'}
          >
            {isLoading ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                Loading Python...
              </>
            ) : isRunning ? (
              <>
                <Square size={12} className="animate-pulse" />
                Running...
              </>
            ) : (
              <>
                <Play size={12} />
                Run
              </>
            )}
          </button>
        </div>

        {/* Code */}
        {showCode && (
          <div className="text-sm">
            <SyntaxHighlighter
              language="python"
              style={oneDark}
              showLineNumbers={lineNumbers}
              customStyle={{
                margin: 0,
                padding: '12px 16px',
                background: 'transparent',
                fontSize: '13px',
              }}
              lineNumberStyle={{
                minWidth: '2em',
                paddingRight: '1em',
                color: 'var(--color-text-muted)',
                opacity: 0.5,
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        )}

        {/* Output */}
        {(output || error || figures.length > 0 || htmlOutput) && (
          <div 
            className="border-t border-[var(--color-border)] p-3 bg-[var(--color-background)]"
            style={{ maxHeight: maxOutputHeight, overflowY: 'auto' }}
          >
            {error ? (
              <pre className="text-sm text-red-400 whitespace-pre-wrap font-mono bg-red-500/10 p-2 rounded">
                {error}
              </pre>
            ) : (
              <>
                {output && (
                  <pre className="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap font-mono">
                    {output}
                  </pre>
                )}
                {figures.map((fig, i) => (
                  <img
                    key={i}
                    src={`data:image/png;base64,${fig}`}
                    alt={`Figure ${i + 1}`}
                    className="mt-2 max-w-full rounded cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setIsFullscreen(true)}
                    title="Click to view fullscreen"
                  />
                ))}
                {htmlOutput && (
                  <div 
                    ref={htmlContainerRef}
                    className={`mt-2 bokeh-output ${isFullscreen ? 'bokeh-fullscreen' : ''}`}
                    style={isFullscreen ? {
                      position: 'fixed',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 51,
                      minHeight: 100,
                    } : { minHeight: 100 }}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default PythonRunner;
