import { useState, useEffect, useCallback, Component } from 'react'
import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { MDXProvider } from '@mdx-js/react'
import type { ComponentType, ReactNode, ErrorInfo } from 'react'
import { Callout, TechStack, Image, Video, Audio, Todo, Mermaid, ThemeSelector, LayoutSelector, CodePlayground } from '../mdx'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = ComponentType<any>

// Error Boundary for catching render errors
interface ErrorBoundaryProps {
  children: ReactNode
  fallback: (error: Error) => ReactNode
  resetKey?: string // Change this to reset the error boundary
}

interface ErrorBoundaryState {
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error when resetKey changes (content updated)
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null })
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MDX Preview Error:', error, errorInfo)
  }

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error)
    }
    return this.props.children
  }
}

// Components available in preview
const previewComponents: Record<string, AnyComponent> = {
  Callout,
  TechStack,
  Image,
  Video,
  Audio,
  Todo,
  Mermaid,
  ThemeSelector,
  LayoutSelector,
  CodePlayground,
}

// MDX typography components matching MDXContentProvider
const mdxComponents: Record<string, AnyComponent> = {
  ...previewComponents,
  h1: (props) => (
    <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mt-10 mb-4 first:mt-0" {...props} />
  ),
  h2: (props) => (
    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-10 mb-4" {...props} />
  ),
  h3: (props) => (
    <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-8 mb-3" {...props} />
  ),
  h4: (props) => (
    <h4 className="text-lg font-semibold text-[var(--color-text-primary)] mt-6 mb-2" {...props} />
  ),
  p: (props) => (
    <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4" {...props} />
  ),
  ul: (props) => (
    <ul className="list-disc list-inside space-y-2 text-[var(--color-text-secondary)] mb-6 ml-2" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal list-inside space-y-2 text-[var(--color-text-secondary)] mb-6 ml-2" {...props} />
  ),
  li: (props) => (
    <li className="text-[var(--color-text-secondary)]" {...props} />
  ),
  a: (props) => (
    <a className="text-[var(--color-accent-primary)] hover:underline" {...props} />
  ),
  strong: (props) => (
    <strong className="font-semibold text-[var(--color-text-primary)]" {...props} />
  ),
  em: (props) => (
    <em className="italic" {...props} />
  ),
  code: (props: { className?: string; children?: ReactNode }) => {
    if (!props.className) {
      return (
        <code className="px-1.5 py-0.5 bg-[var(--color-surface-elevated)] rounded text-sm font-mono text-[var(--color-accent-primary)]" {...props} />
      )
    }
    return <code {...props} />
  },
  pre: (props) => (
    <pre className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 overflow-x-auto mb-6" {...props} />
  ),
  blockquote: (props) => (
    <blockquote className="border-l-4 border-[var(--color-accent-primary)] pl-4 italic text-[var(--color-text-muted)] my-6" {...props} />
  ),
  hr: () => (
    <hr className="border-t border-[var(--color-border)] my-8" />
  ),
  table: (props) => (
    <div className="overflow-x-auto mb-6">
      <table className="w-full border-collapse border border-[var(--color-border)]" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-left font-semibold text-[var(--color-text-primary)]" {...props} />
  ),
  td: (props) => (
    <td className="border border-[var(--color-border)] px-4 py-2 text-[var(--color-text-secondary)]" {...props} />
  ),
}

interface MDXPreviewProps {
  markdown: string
  className?: string
}

export function MDXPreview({ markdown, className = '' }: MDXPreviewProps) {
  const [Content, setContent] = useState<ComponentType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isCompiling, setIsCompiling] = useState(false)

  // Debounced compilation
  const compileMarkdown = useCallback(async (source: string) => {
    if (!source.trim()) {
      setContent(null)
      setError(null)
      return
    }

    setIsCompiling(true)
    setError(null)

    try {
      // Remove frontmatter for preview (between ---)
      let processedContent = source.replace(/^---[\s\S]*?---\n?/, '')
      
      // Remove import statements - we provide all components directly
      // This handles: import { X } from '...', import X from '...', import '...'
      processedContent = processedContent.replace(/^import\s+.*?['"].*?['"];?\s*$/gm, '')
      
      // Remove export statements that might cause issues
      processedContent = processedContent.replace(/^export\s+.*?;?\s*$/gm, '')
      
      // Use evaluate which properly handles components
      const { default: MDXContent } = await evaluate(processedContent, {
        ...runtime,
        remarkPlugins: [remarkGfm, remarkFrontmatter],
        development: false,
        // Provide all components directly
        useMDXComponents: () => mdxComponents,
      })

      setContent(() => MDXContent as ComponentType)
      setError(null)
    } catch (err) {
      console.error('MDX compilation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to compile MDX')
      setContent(null)
    } finally {
      setIsCompiling(false)
    }
  }, [])

  // Debounce the compilation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      compileMarkdown(markdown)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [markdown, compileMarkdown])

  if (isCompiling && !Content) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="flex items-center gap-3 text-[var(--color-text-muted)]">
          <div className="animate-spin h-5 w-5 border-2 border-[var(--color-accent-primary)] border-t-transparent rounded-full" />
          <span>Compiling preview...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-4 ${className}`}>
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <h3 className="font-semibold text-red-500 mb-2">Preview Error</h3>
          <pre className="text-sm text-red-400 whitespace-pre-wrap font-mono">{error}</pre>
        </div>
      </div>
    )
  }

  if (!Content) {
    return (
      <div className={`flex items-center justify-center p-8 text-[var(--color-text-muted)] ${className}`}>
        Start writing to see preview...
      </div>
    )
  }

  return (
    <div className={`p-6 relative ${className}`}>
      {isCompiling && (
        <div className="absolute top-2 right-2 text-xs text-[var(--color-text-muted)]">
          Updating...
        </div>
      )}
      <ErrorBoundary
        resetKey={markdown}
        fallback={(err) => (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <h3 className="font-semibold text-red-500 mb-2">Render Error</h3>
            <pre className="text-sm text-red-400 whitespace-pre-wrap font-mono">{err.message}</pre>
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              This error is in the preview only. Edit your content to fix the issue.
            </p>
          </div>
        )}
      >
        <MDXProvider components={mdxComponents}>
          <article className="prose prose-invert max-w-none">
            <Content />
          </article>
        </MDXProvider>
      </ErrorBoundary>
    </div>
  )
}

export default MDXPreview
