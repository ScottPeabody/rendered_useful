import type { ReactNode } from 'react'
import Callout from './Callout'
import TechStack from './TechStack'
import Image from './Image'
import Video from './Video'
import Audio from './Audio'
import Todo from './Todo'
import ThemeSelector from './ThemeSelector'
import LayoutSelector from './LayoutSelector'

 
export { Callout, TechStack, Image, Video, Audio, Todo, ThemeSelector, LayoutSelector }

interface MDXProps {
  children?: ReactNode
  href?: string
  className?: string
  src?: string
  alt?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MDXComponents = Record<string, React.ComponentType<any>>

// eslint-disable-next-line react-refresh/only-export-components
export const mdxComponents: MDXComponents = {
  h1: ({ children }: MDXProps) => (
    <h1 className="text-4xl font-bold mt-12 mb-6 text-[var(--color-text-primary)]">
      {children}
    </h1>
  ),
  h2: ({ children }: MDXProps) => (
    <h2 className="text-3xl font-bold mt-10 mb-4 text-[var(--color-text-primary)]">
      {children}
    </h2>
  ),
  h3: ({ children }: MDXProps) => (
    <h3 className="text-2xl font-semibold mt-8 mb-3 text-[var(--color-text-primary)]">
      {children}
    </h3>
  ),
  h4: ({ children }: MDXProps) => (
    <h4 className="text-xl font-semibold mt-6 mb-2 text-[var(--color-text-primary)]">
      {children}
    </h4>
  ),

  p: ({ children }: MDXProps) => (
    <p className="mb-6 leading-relaxed text-[var(--color-text-secondary)]">
      {children}
    </p>
  ),
  strong: ({ children }: MDXProps) => (
    <strong className="font-semibold text-[var(--color-text-primary)]">{children}</strong>
  ),
  em: ({ children }: MDXProps) => <em className="italic">{children}</em>,

  a: ({ href, children }: MDXProps) => (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="text-[var(--color-accent-primary)] hover:text-[var(--color-accent-secondary)] underline underline-offset-2 transition-colors"
    >
      {children}
    </a>
  ),

  ul: ({ children }: MDXProps) => (
    <ul className="mb-6 ml-6 space-y-2 list-disc marker:text-[var(--color-accent-primary)]">
      {children}
    </ul>
  ),
  ol: ({ children }: MDXProps) => (
    <ol className="mb-6 ml-6 space-y-2 list-decimal marker:text-[var(--color-accent-primary)]">
      {children}
    </ol>
  ),
  li: ({ children }: MDXProps) => (
    <li className="text-[var(--color-text-secondary)]">{children}</li>
  ),

  blockquote: ({ children }: MDXProps) => (
    <blockquote className="my-6 pl-4 border-l-4 border-[var(--color-accent-primary)] text-[var(--color-text-muted)] italic">
      {children}
    </blockquote>
  ),

  code: ({ children, className }: MDXProps) => {
    // Check if this is a code block (has language class) or inline code
    const isCodeBlock = className?.includes('language-')
    
    if (isCodeBlock) {
      return <code className={className}>{children}</code>
    }
    
    return (
      <code className="px-1.5 py-0.5 text-sm font-mono bg-[var(--color-surface-elevated)] text-[var(--color-accent-tertiary)] rounded">
        {children}
      </code>
    )
  },
  pre: ({ children }: MDXProps) => (
    <div className="relative group my-6">
      <pre className="overflow-x-auto p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm">
        {children}
      </pre>
      <button
        onClick={() => {
          const codeElement = children as React.ReactElement<{ children?: string }>
          const code = codeElement?.props?.children
          if (typeof code === 'string') {
            navigator.clipboard.writeText(code)
          }
        }}
        className="absolute top-3 right-3 px-2 py-1 text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-elevated)] rounded opacity-0 group-hover:opacity-100 transition-opacity hover:text-[var(--color-text-primary)]"
      >
        Copy
      </button>
    </div>
  ),

  table: ({ children }: MDXProps) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }: MDXProps) => (
    <th className="px-4 py-3 text-left font-semibold text-[var(--color-text-primary)] bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      {children}
    </th>
  ),
  td: ({ children }: MDXProps) => (
    <td className="px-4 py-3 text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
      {children}
    </td>
  ),

  hr: () => <hr className="my-12 border-[var(--color-border)]" />,

  img: ({ src, alt }: MDXProps) => (
    <figure className="my-8">
      <img
        src={src}
        alt={alt}
        className="rounded-xl border border-[var(--color-border)] w-full"
      />
      {alt && (
        <figcaption className="mt-2 text-center text-sm text-[var(--color-text-muted)]">
          {alt}
        </figcaption>
      )}
    </figure>
  ),

  Callout,
  TechStack,
}
