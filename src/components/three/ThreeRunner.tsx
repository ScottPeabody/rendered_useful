import { useRef, useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import * as Babel from '@babel/standalone';
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

interface ThreeRunnerProps {
  code: string;
  title?: string;
  showCode?: boolean;
  height?: number;
  className?: string;
}

export function ThreeRunner({
  code,
  title = 'Three.js Scene',
  showCode = true,
  height = 400,
  className = '',
}: ThreeRunnerProps) {
  const [editorCode, setEditorCode] = useState(code);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [codeVisible, setCodeVisible] = useState(showCode);
  const [originalCode] = useState(code);
  const [SceneComponent, setSceneComponent] = useState<React.ComponentType | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current || viewRef.current) return;

    const extensions = [
      basicSetup,
      javascript({ jsx: true, typescript: true }),
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

  // Compile and run Three.js scene
  const runScene = useCallback((sceneCode: string) => {
    try {
      setError(null);

      // Transpile JSX to JavaScript using Babel
      const transpiledCode = Babel.transform(sceneCode, {
        presets: ['react'],
        filename: 'scene.jsx',
      }).code;

      // Create a function that returns a component
      const componentCreator = new Function(
        'React',
        'THREE',
        'useFrame',
        'useThree',
        'useRef',
        'useState',
        'useEffect',
        'useMemo',
        'Html',
        `
        ${transpiledCode}
        return Scene;
        `
      );

      // Call with imported dependencies
      const Component = componentCreator(
        React,
        THREE,
        useFrame,
        useThree,
        useRef,
        useState,
        useEffect,
        useMemo,
        Html
      );

      setSceneComponent(() => Component);
    } catch (err) {
      setError((err as Error).message);
      console.error('Three.js scene error:', err);
      setSceneComponent(null);
    }
  }, []);

  // Run scene when code changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      runScene(editorCode);
    }, 500);

    return () => clearTimeout(timer);
  }, [editorCode, runScene]);

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
    runScene(editorCode);
  }, [editorCode, runScene]);

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
          <Code size={18} className="text-cyan-400" />
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
        className="relative bg-black"
        style={{ height: isFullscreen ? 'calc(100vh - 200px)' : height }}
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <Suspense fallback={null}>
            {SceneComponent && <SceneComponent />}
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
