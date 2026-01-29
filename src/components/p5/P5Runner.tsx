import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Code,
  Eye,
  EyeOff,
  Play,
} from 'lucide-react';
import p5 from 'p5';

interface P5RunnerProps {
  code: string;
  title?: string;
  showCode?: boolean;
  height?: number;
  className?: string;
}

export function P5Runner({
  code,
  title = 'p5.js Sketch',
  showCode = true,
  height = 400,
  className = '',
}: P5RunnerProps) {
  const [editorCode, setEditorCode] = useState(code);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [codeVisible, setCodeVisible] = useState(showCode);
  const [originalCode] = useState(code);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const extensions = [
      basicSetup,
      javascript(),
      oneDark,
      EditorView.lineWrapping,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          setEditorCode(update.state.doc.toString());
        }
      }),
    ];

    const state = EditorState.create({
      doc: editorCode,
      extensions,
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeVisible]);

  // Run p5.js sketch
  const runSketch = useCallback((sketchCode: string) => {
    if (!canvasContainerRef.current) return;

    // Clean up previous instance
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
      p5InstanceRef.current = null;
    }

    // Clear container
    canvasContainerRef.current.innerHTML = '';

    try {
      setError(null);

      // Create the sketch function
      const sketch = new Function('p', sketchCode);

      // Get container width for responsive canvas
      const containerWidth = canvasContainerRef.current.clientWidth || 600;

      // Create new p5 instance
      p5InstanceRef.current = new p5((p: p5) => {
        // Make container width available to sketch
        (p as any).containerWidth = containerWidth;

        try {
          sketch(p);
        } catch (err) {
          setError((err as Error).message);
          console.error('p5.js sketch error:', err);
        }
      }, canvasContainerRef.current);
    } catch (err) {
      setError((err as Error).message);
      console.error('p5.js execution error:', err);
    }
  }, []);

  // Run sketch when code changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      runSketch(editorCode);
    }, 500);

    return () => clearTimeout(timer);
  }, [editorCode, runSketch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(editorCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [editorCode]);

  const handleReset = useCallback(() => {
    if (viewRef.current) {
      const currentContent = viewRef.current.state.doc.toString();
      viewRef.current.dispatch({
        changes: { from: 0, to: currentContent.length, insert: originalCode },
      });
    }
    setEditorCode(originalCode);
    setError(null);
  }, [originalCode]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const handleRerun = useCallback(() => {
    runSketch(editorCode);
  }, [editorCode, runSketch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-50 bg-slate-900 p-6 overflow-auto'
    : `my-6 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden ${className}`;

  return (
    <div className={containerClasses}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Code size={18} className="text-pink-400" />
          <span className="text-sm font-medium text-slate-200">{title}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setCodeVisible(!codeVisible)}
            className="flex items-center gap-1.5 text-xs px-2 sm:px-3 py-1.5 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            {codeVisible ? <EyeOff size={14} /> : <Eye size={14} />}
            <span className="hidden sm:inline">
              {codeVisible ? 'Hide Code' : 'Show Code'}
            </span>
          </button>
          <button
            onClick={handleRerun}
            className="p-1.5 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
            title="Re-run"
          >
            <Play size={16} />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
            title="Reset"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
            title="Copy code"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Code Panel */}
      <AnimatePresence>
        {codeVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-slate-700 overflow-hidden"
          >
            <div
              ref={editorRef}
              className="max-h-[400px] overflow-auto [&_.cm-editor]:!bg-transparent [&_.cm-scroller]:overflow-auto [&_.cm-gutters]:bg-slate-800/50 [&_.cm-gutters]:border-r-slate-700 [&_.cm-activeLineGutter]:bg-slate-700/50"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-3 bg-red-900/30 border-b border-red-800 text-red-300 font-mono text-sm overflow-auto max-h-24"
          >
            <div className="font-medium mb-1">Error:</div>
            <pre className="whitespace-pre-wrap text-xs">{error}</pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas Output */}
      <div
        className="relative bg-white w-full overflow-hidden"
        style={{ height: isFullscreen ? 'calc(100vh - 200px)' : height }}
      >
        <div ref={canvasContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
