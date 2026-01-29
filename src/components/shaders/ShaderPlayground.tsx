import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import { ShaderCanvas } from './ShaderCanvas';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Code,
  Eye,
  EyeOff,
} from 'lucide-react';

const DEFAULT_SHADER = `precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  
  vec3 color = vec3(uv.x, uv.y, 0.5 + 0.5 * sin(u_time));
  
  gl_FragColor = vec4(color, 1.0);
}`;

interface ShaderPlaygroundProps {
  initialCode?: string;
  showCode?: boolean;
  height?: number;
  className?: string;
}

export function ShaderPlayground({ 
  initialCode = DEFAULT_SHADER, 
  showCode = true,
  height = 400,
  className = '' 
}: ShaderPlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [codeVisible, setCodeVisible] = useState(showCode);
  const [originalCode] = useState(initialCode);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  // Debounce code changes
  const [debouncedCode, setDebouncedCode] = useState(code);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedCode(code), 300);
    return () => clearTimeout(timer);
  }, [code]);

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    // Small delay to ensure DOM is ready, especially important on mobile
    const initTimer = setTimeout(() => {
      if (!editorRef.current) return;

      const extensions = [
        basicSetup,
        cpp(), // GLSL is C-like, cpp works well
        oneDark,
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            setCode(update.state.doc.toString());
          }
        }),
      ];

      const state = EditorState.create({
        doc: code,
        extensions,
      });

      const view = new EditorView({
        state,
        parent: editorRef.current,
      });

      viewRef.current = view;
    }, 100);

    return () => {
      clearTimeout(initTimer);
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeVisible]); // Re-create when code becomes visible

  // Update editor content when initialCode changes (for different examples)
  useEffect(() => {
    if (viewRef.current) {
      const currentContent = viewRef.current.state.doc.toString();
      if (currentContent !== initialCode && code === currentContent) {
        viewRef.current.dispatch({
          changes: { from: 0, to: currentContent.length, insert: initialCode }
        });
        setCode(initialCode);
      }
    }
  }, [initialCode, code]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [code]);

  const handleReset = useCallback(() => {
    if (viewRef.current) {
      const currentContent = viewRef.current.state.doc.toString();
      viewRef.current.dispatch({
        changes: { from: 0, to: currentContent.length, insert: originalCode }
      });
    }
    setCode(originalCode);
    setError(null);
  }, [originalCode]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

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
          <Code size={18} className="text-purple-400" />
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
            GLSL Fragment Shader
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setCodeVisible(!codeVisible)}
            className="flex items-center gap-1.5 text-xs px-2 sm:px-3 py-1.5 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
          >
            {codeVisible ? <EyeOff size={14} /> : <Eye size={14} />}
            <span className="hidden sm:inline">{codeVisible ? 'Hide Code' : 'Show Code'}</span>
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
            {/* Uniforms Reference */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700/50">
              <span className="text-xs text-slate-500">Available Uniforms:</span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-slate-300">
                <span><span className="text-purple-400">vec2</span> u_resolution</span>
                <span><span className="text-purple-400">float</span> u_time</span>
                <span><span className="text-purple-400">vec2</span> u_mouse</span>
              </div>
            </div>
            <div 
              ref={editorRef}
              className="max-h-[300px] overflow-auto [&_.cm-editor]:!bg-transparent [&_.cm-scroller]:overflow-auto [&_.cm-gutters]:bg-slate-800/50 [&_.cm-gutters]:border-r-slate-700 [&_.cm-activeLineGutter]:bg-slate-700/50"
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
            <div className="font-medium mb-1">Shader Error:</div>
            <pre className="whitespace-pre-wrap text-xs">{error}</pre>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas Output */}
      <div className="relative" style={{ height: isFullscreen ? 'calc(100vh - 200px)' : height }}>
        <ShaderCanvas
          fragmentShader={debouncedCode}
          onError={setError}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
