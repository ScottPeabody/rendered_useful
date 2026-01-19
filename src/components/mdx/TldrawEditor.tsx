import { useCallback, useEffect, useRef, useState } from 'react';

// Import tldraw CSS
import 'tldraw/tldraw.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TldrawType = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EditorType = any;

interface TldrawEditorProps {
  /** Height of the editor */
  height?: number;
  /** Whether the canvas is view-only */
  viewOnly?: boolean;
  /** Persistence key for localStorage */
  persistenceKey?: string;
  /** URL to load example data from (tldraw snapshot JSON) */
  dataUrl?: string;
  /** Initial snapshot data to load */
  initialData?: unknown;
  /** Show the Save File button */
  showSave?: boolean;
  /** Show the Clear button */
  showClear?: boolean;
}

// Validate that a snapshot has the required structure
function isValidSnapshot(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  const snapshot = data as Record<string, unknown>;
  // A valid tldraw snapshot should have document.store with shapes
  if (!snapshot.document || typeof snapshot.document !== 'object') return false;
  const doc = snapshot.document as Record<string, unknown>;
  if (!doc.store || typeof doc.store !== 'object') return false;
  // Check that store has some content
  const store = doc.store as Record<string, unknown>;
  return Object.keys(store).length > 0;
}

export function TldrawEditor({
  height = 500,
  viewOnly = false,
  persistenceKey,
  dataUrl,
  initialData,
  showSave = true,
  showClear = true,
}: TldrawEditorProps) {
  const [TldrawComponent, setTldrawComponent] = useState<TldrawType | null>(null);
  const [snapshot, setSnapshot] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const editorRef = useRef<EditorType>(null);
  
  // Load tldraw dynamically to avoid SSR issues
  useEffect(() => {
    let cancelled = false;
    
    import('tldraw').then((module) => {
      if (!cancelled) {
        setTldrawComponent(() => module.Tldraw);
      }
    }).catch((err) => {
      console.error('Failed to load tldraw:', err);
    });
    
    return () => { cancelled = true; };
  }, []);

  // Load snapshot from URL, initialData prop, or start fresh
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      // First try initialData prop (inline snapshot)
      if (initialData && isValidSnapshot(initialData)) {
        if (!cancelled) {
          setSnapshot(initialData);
          setIsLoading(false);
        }
        return;
      }

      // Then try loading from URL if provided
      if (dataUrl) {
        try {
          const response = await fetch(dataUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
          }
          const data = await response.json();
          if (!cancelled) {
            if (isValidSnapshot(data)) {
              setSnapshot(data);
            } else {
              console.warn('Invalid tldraw snapshot format, starting with empty canvas');
              setLoadError('No example diagram available yet. Draw something and export it!');
            }
          }
        } catch (err) {
          console.error('Failed to load tldraw data from URL:', err);
          if (!cancelled) {
            setLoadError('Could not load example diagram');
          }
        }
      }
      
      if (!cancelled) {
        setIsLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, [dataUrl, initialData]);

  // Handle editor mount
  const handleMount = useCallback((editor: EditorType) => {
    editorRef.current = editor;
    
    // Set read-only mode if needed
    if (viewOnly) {
      editor.updateInstanceState({ isReadonly: true });
    }
  }, [viewOnly]);

  // Export current drawing as JSON snapshot
  const handleExport = useCallback(async () => {
    const editor = editorRef.current;
    if (!editor) return;

    try {
      // Import getSnapshot dynamically
      const { getSnapshot } = await import('tldraw');
      const snap = getSnapshot(editor.store);
      
      const blob = new Blob([JSON.stringify(snap, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tldraw-snapshot.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export:', err);
    }
  }, []);

  // Clear the canvas
  const handleClear = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    
    if (confirm('Clear the canvas? This cannot be undone.')) {
      // Delete all shapes
      const shapeIds = editor.getCurrentPageShapeIds();
      if (shapeIds.size > 0) {
        editor.deleteShapes([...shapeIds]);
      }
    }
  }, []);

  if (!TldrawComponent || isLoading) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-900 rounded-lg border border-gray-700"
        style={{ height }}
      >
        <div className="text-gray-400">Loading tldraw...</div>
      </div>
    );
  }

  // Show message if trying to load a read-only example that doesn't exist
  if (viewOnly && loadError && !snapshot) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-900 rounded-lg border border-gray-700"
        style={{ height }}
      >
        <div className="text-center text-gray-400 p-8">
          <p className="text-lg mb-2">📝 No example diagram yet</p>
          <p className="text-sm">Create one in the Interactive Canvas below, export it, and save to <code className="bg-gray-800 px-1 rounded">/public/examples/</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-4">
      {/* Toolbar */}
      {!viewOnly && (showSave || showClear || persistenceKey) && (
        <div className="flex gap-2 mb-2">
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
          {persistenceKey && (
            <span className="px-3 py-1.5 text-xs text-gray-500">
              Auto-saving to browser
            </span>
          )}
        </div>
      )}

      {/* tldraw Canvas */}
      <div 
        className="tldraw__editor rounded-lg overflow-hidden border border-gray-700"
        style={{ height }}
      >
        <TldrawComponent
          persistenceKey={persistenceKey}
          snapshot={snapshot || undefined}
          onMount={handleMount}
          inferDarkMode
        />
      </div>

      {viewOnly && (
        <p className="text-xs text-gray-500 mt-2">
          This canvas is in view-only mode
        </p>
      )}
    </div>
  );
}

export default TldrawEditor;
