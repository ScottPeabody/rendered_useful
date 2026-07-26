import { useState, useCallback } from 'react';
import { RotateCcw, ExternalLink, Loader2, Download } from 'lucide-react';

interface JupyterLiteEmbedProps {
  /** Height of the notebook iframe */
  height?: number;
  /** URL to a .ipynb file to load */
  notebookUrl?: string;
  /** Storage key for localStorage persistence */
  storageKey?: string;
  /** Kernel language (determines which JupyterLite distribution to use) */
  kernelLanguage?: 'python' | 'javascript';
  /** Theme: 'light' or 'dark' */
  theme?: 'light' | 'dark';
  /** Show toolbar with controls */
  showToolbar?: boolean;
  /** Show the "Open in new tab" button */
  showOpenExternal?: boolean;
  /** Show the footer info */
  showFooter?: boolean;
  /** Minimal mode - hides toolbar and footer, good for standalone pages */
  minimal?: boolean;
}

// JupyterLite CDN URLs
const JUPYTERLITE_URL = 'https://jupyterlite.github.io/demo';

export function JupyterLiteEmbed({
  height = 600,
  notebookUrl,
  storageKey,
  kernelLanguage = 'python',
  theme = 'dark',
  showToolbar = true,
  showOpenExternal = true,
  showFooter = true,
  minimal = false,
}: JupyterLiteEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);

  // Minimal mode overrides
  const displayToolbar = minimal ? false : showToolbar;
  const displayFooter = minimal ? false : showFooter;

  // Build the JupyterLite URL
  const buildJupyterUrl = useCallback(() => {
    const url = `${JUPYTERLITE_URL}/lab/index.html`;
    const params = new URLSearchParams();
    
    // Set theme
    if (theme === 'dark') {
      params.set('theme', 'JupyterLab Dark');
    }
    
    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  }, [theme]);

  // Reset/reload the notebook
  const handleReset = useCallback(() => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
    
    // Clear localStorage if we have a storage key
    if (storageKey && typeof window !== 'undefined') {
      localStorage.removeItem(`jupyterlite-${storageKey}`);
    }
  }, [storageKey]);

  // Open in new tab
  const handleOpenExternal = useCallback(() => {
    window.open(buildJupyterUrl(), '_blank');
  }, [buildJupyterUrl]);

  // Handle iframe load
  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  // Handle iframe error
  const handleIframeError = useCallback(() => {
    setIsLoading(false);
    setError('Failed to load JupyterLite. Please try again.');
  }, []);

  return (
    <div className={`${minimal ? '' : 'my-8'} rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)]`}>
      {/* Toolbar */}
      {displayToolbar && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)] bg-[var(--color-background)]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <span className="px-2 py-0.5 rounded bg-[var(--color-accent-primary)]/20 text-[var(--color-accent-primary)] font-mono text-xs">
                {kernelLanguage}
              </span>
              <span>JupyterLite Notebook</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notebookUrl && (
              <a
                href={notebookUrl}
                download
                className="p-2 rounded hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                title="Download notebook"
              >
                <Download size={16} />
              </a>
            )}
            <button
              onClick={handleReset}
              className="p-2 rounded hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              title="Reset notebook"
            >
              <RotateCcw size={16} />
            </button>
            {showOpenExternal && (
              <button
                onClick={handleOpenExternal}
                className="p-2 rounded hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                title="Open in new tab"
              >
                <ExternalLink size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Notebook container */}
      <div className="relative" style={{ height }}>
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-background)] z-10">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-primary)]" />
              <p className="text-[var(--color-text-secondary)]">Loading JupyterLite...</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                First load may take a moment to initialize the Python kernel
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-background)] z-10">
            <div className="flex flex-col items-center gap-4 text-center px-4">
              <p className="text-red-500">{error}</p>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded bg-[var(--color-accent-primary)] text-[var(--color-accent-contrast)] hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* JupyterLite iframe */}
        <iframe
          key={iframeKey}
          src={buildJupyterUrl()}
          className="w-full h-full border-0"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          allow="cross-origin-isolated"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-top-navigation-by-user-activation allow-downloads"
          title="JupyterLite Notebook"
        />
      </div>

      {/* Footer info */}
      {displayFooter && (
        <div className="px-4 py-2 border-t border-[var(--color-border)] bg-[var(--color-background)]">
          <p className="text-xs text-[var(--color-text-muted)]">
            Powered by <a href="https://jupyterlite.readthedocs.io/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent-primary)] hover:underline">JupyterLite</a> - 
            runs entirely in your browser using WebAssembly. No server required.
          </p>
        </div>
      )}
    </div>
  );
}

export default JupyterLiteEmbed;
