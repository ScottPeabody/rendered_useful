import { useState, useEffect } from 'react';
import { Loader2, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
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
    'image/jpeg'?: string;
    'image/svg+xml'?: string | string[];
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
    language_info?: {
      name?: string;
      version?: string;
    };
  };
  nbformat: number;
  nbformat_minor: number;
}

interface NotebookRendererProps {
  notebookUrl: string;
}

// Simple markdown renderer (basic support)
function renderMarkdown(text: string): string {
  return text
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-[var(--color-text-primary)]">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-6 mb-3 text-[var(--color-text-primary)]">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 text-[var(--color-text-primary)]">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-[var(--color-surface)] text-[var(--color-accent-primary)] font-mono text-sm">$1</code>')
    // Lists
    .replace(/^\- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-[var(--color-accent-primary)] hover:underline">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-3">')
    .replace(/\n/g, '<br />');
}

function getSourceText(source: string | string[]): string {
  return Array.isArray(source) ? source.join('') : source;
}

function CellOutput({ output }: { output: NotebookOutput }) {
  if (output.output_type === 'stream') {
    const text = getSourceText(output.text || '');
    return (
      <pre className="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap font-mono bg-black/20 p-2 rounded">
        {text}
      </pre>
    );
  }

  if (output.output_type === 'execute_result' || output.output_type === 'display_data') {
    const data = output.data;
    if (!data) return null;

    // Image outputs
    if (data['image/png']) {
      return (
        <img 
          src={`data:image/png;base64,${data['image/png']}`} 
          alt="Output" 
          className="max-w-full rounded"
        />
      );
    }
    if (data['image/jpeg']) {
      return (
        <img 
          src={`data:image/jpeg;base64,${data['image/jpeg']}`} 
          alt="Output" 
          className="max-w-full rounded"
        />
      );
    }
    if (data['image/svg+xml']) {
      const svg = getSourceText(data['image/svg+xml']);
      return <div dangerouslySetInnerHTML={{ __html: svg }} className="max-w-full" />;
    }

    // HTML output
    if (data['text/html']) {
      const html = getSourceText(data['text/html']);
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: html }} 
          className="overflow-x-auto text-sm"
        />
      );
    }

    // Plain text
    if (data['text/plain']) {
      const text = getSourceText(data['text/plain']);
      return (
        <pre className="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap font-mono">
          {text}
        </pre>
      );
    }
  }

  if (output.output_type === 'error') {
    return (
      <pre className="text-sm text-red-400 whitespace-pre-wrap font-mono bg-red-500/10 p-2 rounded">
        {output.ename}: {output.evalue}
        {output.traceback && '\n' + output.traceback.join('\n').replace(/\x1b\[[0-9;]*m/g, '')}
      </pre>
    );
  }

  return null;
}

function CodeCell({ cell, index: _index }: { cell: NotebookCell; index: number }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const source = getSourceText(cell.source);
  const hasOutput = cell.outputs && cell.outputs.length > 0;

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
          [{cell.execution_count ?? ' '}]
        </span>
        <span className="text-xs text-[var(--color-text-muted)]">Code</span>
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
          {hasOutput && (
            <div className="border-t border-[var(--color-border)] p-3 space-y-2 bg-[var(--color-background)]">
              {cell.outputs!.map((output, i) => (
                <CellOutput key={i} output={output} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
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

export function NotebookRenderer({ notebookUrl }: NotebookRendererProps) {
  const [notebook, setNotebook] = useState<NotebookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load notebook');
      } finally {
        setLoading(false);
      }
    }

    loadNotebook();
  }, [notebookUrl]);

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

  const kernelName = notebook.metadata?.kernelspec?.display_name || 
                     notebook.metadata?.language_info?.name || 
                     'Python';

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
        </div>
      </div>

      {/* Cells */}
      <div className="space-y-3">
        {notebook.cells.map((cell, index) => {
          if (cell.cell_type === 'code') {
            return <CodeCell key={index} cell={cell} index={index} />;
          }
          if (cell.cell_type === 'markdown') {
            return <MarkdownCell key={index} cell={cell} />;
          }
          return null;
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-4 py-6 text-sm text-[var(--color-text-muted)]">
        <a
          href={notebookUrl}
          download
          className="flex items-center gap-1.5 hover:text-[var(--color-text-primary)] transition-colors"
        >
          Download .ipynb
        </a>
        <span>•</span>
        <a
          href="https://jupyter.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-[var(--color-text-primary)] transition-colors"
        >
          Jupyter <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}

export default NotebookRenderer;
