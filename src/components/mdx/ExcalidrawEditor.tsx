import { useCallback, useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

// Import Excalidraw CSS
import '@excalidraw/excalidraw/index.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExcalidrawElement = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExcalidrawAPI = any;

interface ExcalidrawEditorProps {
  /** Height of the editor */
  height?: number;
  /** Whether the canvas is view-only */
  viewOnly?: boolean;
  /** Storage key for localStorage persistence */
  storageKey?: string;
  /** Show grid background */
  gridMode?: boolean;
  /** Theme: 'light' or 'dark' */
  theme?: 'light' | 'dark';
  /** URL to load example data from (JSON file with elements array) */
  dataUrl?: string;
  /** Initial data to load (array of Excalidraw elements) */
  initialData?: unknown[];
  /** Show the Save File button */
  showSave?: boolean;
  /** Show the Clear button */
  showClear?: boolean;
  /** Show the Fullscreen button */
  showFullscreen?: boolean;
}

export function ExcalidrawEditor({
  height = 500,
  viewOnly = false,
  storageKey,
  gridMode = false,
  theme = 'dark',
  dataUrl,
  initialData,
  showSave = true,
  showClear = true,
  showFullscreen = true,
}: ExcalidrawEditorProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Excalidraw, setExcalidraw] = useState<React.ComponentType<any> | null>(null);
  const [initialElements, setInitialElements] = useState<ExcalidrawElement[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const excalidrawAPIRef = useRef<ExcalidrawAPI>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Load Excalidraw component dynamically
  useEffect(() => {
    let cancelled = false;
    
    import('@excalidraw/excalidraw').then((module) => {
      if (!cancelled) {
        setExcalidraw(() => module.Excalidraw);
      }
    }).catch((err) => {
      console.error('Failed to load Excalidraw:', err);
    });
    
    return () => { cancelled = true; };
  }, []);

  // Load initial data from URL, localStorage, initialData prop, or start fresh
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      // First try localStorage if we have a storage key
      if (storageKey && typeof window !== 'undefined') {
        const saved = localStorage.getItem(`excalidraw-${storageKey}`);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              if (!cancelled) {
                setInitialElements(parsed);
                setIsLoading(false);
              }
              return;
            }
          } catch (e) {
            console.error('Failed to load saved Excalidraw data:', e);
          }
        }
      }

      // Then try initialData prop (inline JSON)
      if (initialData && Array.isArray(initialData) && initialData.length > 0) {
        if (!cancelled) {
          setInitialElements(initialData as ExcalidrawElement[]);
          setIsLoading(false);
        }
        return;
      }

      // Then try loading from URL if provided
      if (dataUrl) {
        try {
          const response = await fetch(dataUrl);
          const data = await response.json();
          if (!cancelled) {
            // Support both { elements: [...] } and [...] formats
            const elements = data.elements || data;
            setInitialElements(Array.isArray(elements) ? elements : null);
          }
        } catch (err) {
          console.error('Failed to load Excalidraw data from URL:', err);
        }
      }

      if (!cancelled) {
        setIsLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, [dataUrl, storageKey, initialData]);

  // Save to localStorage on change
  const handleChange = useCallback(
    (elements: readonly ExcalidrawElement[]) => {
      if (storageKey && elements.length > 0) {
        const toSave = elements.filter((el: ExcalidrawElement) => !el.isDeleted);
        localStorage.setItem(`excalidraw-${storageKey}`, JSON.stringify(toSave));
      }
    },
    [storageKey]
  );

  // Export current drawing as JSON
  const handleExport = useCallback(() => {
    const api = excalidrawAPIRef.current;
    if (!api) return;

    const elements = api.getSceneElements();
    const toExport = elements.filter((el: ExcalidrawElement) => !el.isDeleted);
    
    const blob = new Blob([JSON.stringify({ elements: toExport }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'excalidraw-drawing.json';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // Clear the canvas
  const handleClear = useCallback(() => {
    const api = excalidrawAPIRef.current;
    if (!api) return;
    
    if (confirm('Clear the canvas? This cannot be undone.')) {
      api.resetScene();
      if (storageKey) {
        localStorage.removeItem(`excalidraw-${storageKey}`);
      }
    }
  }, [storageKey]);

  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Handle Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    
    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when fullscreen
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  if (!Excalidraw || isLoading) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-900 rounded-lg border border-gray-700"
        style={{ height }}
      >
        <div className="text-gray-400">Loading Excalidraw...</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={isFullscreen 
        ? "fixed inset-0 z-50 bg-gray-900 flex flex-col" 
        : "my-4"
      }
    >
      {/* Toolbar */}
      {!viewOnly && (showSave || showClear || showFullscreen || storageKey) && (
        <div className={`flex flex-wrap items-center gap-2 ${isFullscreen ? 'p-2 border-b border-gray-700' : 'mb-2'}`}>
          {showSave && (
            <button
              onClick={handleExport}
              className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              💾 Save File
            </button>
          )}
          {showClear && (
            <button
              onClick={handleClear}
              className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              🗑️ Clear
            </button>
          )}
          {showFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors flex items-center gap-1.5"
              title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </button>
          )}
          <div className="flex-1" />
          {storageKey && (
            <span className="px-3 py-1.5 text-xs text-gray-500">
              Auto-saving to browser
            </span>
          )}
        </div>
      )}

      {/* Fullscreen close button for view-only mode */}
      {viewOnly && isFullscreen && (
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors flex items-center gap-1.5"
          >
            <Minimize2 size={14} />
            Exit
          </button>
        </div>
      )}

      {/* Excalidraw Canvas */}
      <div 
        className={isFullscreen 
          ? "flex-1" 
          : "rounded-lg overflow-hidden border border-gray-700"
        }
        style={isFullscreen ? undefined : { height }}
      >
        <Excalidraw
          excalidrawAPI={(api: ExcalidrawAPI) => { excalidrawAPIRef.current = api; }}
          initialData={initialElements ? { elements: initialElements } : undefined}
          onChange={handleChange}
          viewModeEnabled={viewOnly}
          gridModeEnabled={gridMode}
          theme={theme}
          UIOptions={{
            canvasActions: {
              loadScene: !viewOnly,
              saveToActiveFile: false,
            },
          }}
        />
      </div>

      {viewOnly && !isFullscreen && showFullscreen && (
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500">
            This canvas is in view-only mode
          </p>
          <button
            onClick={toggleFullscreen}
            className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors flex items-center gap-1"
          >
            <Maximize2 size={12} />
            Fullscreen
          </button>
        </div>
      )}

      {viewOnly && !showFullscreen && (
        <p className="text-xs text-gray-500 mt-2">
          This canvas is in view-only mode
        </p>
      )}
    </div>
  );
}

export default ExcalidrawEditor;
