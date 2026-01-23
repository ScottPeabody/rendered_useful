import { MDXProvider } from '@mdx-js/react'
import type { ReactNode, ComponentType, HTMLAttributes, ImgHTMLAttributes, AnchorHTMLAttributes, TableHTMLAttributes } from 'react'
import { Callout, TechStack, Image, Video, Audio, Todo, Mermaid, PythonRunner, RustRunner, D3Runner } from './mdx'
import RubiksCube from './games/RubiksCube'
import DosRunner from './games/DosRunner'

type MDXComponentProps = HTMLAttributes<HTMLElement>
type MDXImgProps = ImgHTMLAttributes<HTMLImageElement>
type MDXAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>
type MDXTableProps = TableHTMLAttributes<HTMLTableElement>
type MDXCodeProps = HTMLAttributes<HTMLElement> & { className?: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mdxComponents: Record<string, ComponentType<any>> = {
  Callout,
  TechStack,
  Image,
  Video,
  Audio,
  Todo,
  Mermaid,
  RubiksCube,
  Dos: DosRunner,
  Python: PythonRunner,
  Rust: RustRunner,
  D3: D3Runner,
  D3Runner,

  h1: (props: MDXComponentProps) => (
    <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mt-10 mb-4 first:mt-0" {...props} />
  ),
  h2: (props: MDXComponentProps) => (
    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mt-10 mb-4" {...props} />
  ),
  h3: (props: MDXComponentProps) => (
    <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-8 mb-3" {...props} />
  ),
  h4: (props: MDXComponentProps) => (
    <h4 className="text-lg font-semibold text-[var(--color-text-primary)] mt-6 mb-2" {...props} />
  ),
  p: (props: MDXComponentProps) => (
    <p className="text-[var(--color-text-secondary)] leading-relaxed mb-4" {...props} />
  ),
  ul: (props: MDXComponentProps) => (
    <ul className="list-disc list-inside space-y-2 text-[var(--color-text-secondary)] mb-6 ml-2" {...props} />
  ),
  ol: (props: MDXComponentProps) => (
    <ol className="list-decimal list-inside space-y-2 text-[var(--color-text-secondary)] mb-6 ml-2" {...props} />
  ),
  li: (props: MDXComponentProps) => (
    <li className="text-[var(--color-text-secondary)]" {...props} />
  ),
  a: (props: MDXAnchorProps) => (
    <a className="text-[var(--color-accent-primary)] hover:underline" {...props} />
  ),
  strong: (props: MDXComponentProps) => (
    <strong className="font-semibold text-[var(--color-text-primary)]" {...props} />
  ),
  em: (props: MDXComponentProps) => (
    <em className="italic" {...props} />
  ),
  code: (props: MDXCodeProps) => {
    if (!props.className) {
      return (
        <code className="px-1.5 py-0.5 bg-[var(--color-surface-elevated)] rounded text-sm font-mono text-[var(--color-accent-primary)]" {...props} />
      )
    }
    return <code {...props} />
  },
  pre: (props: MDXComponentProps) => (
    <pre className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-x-auto mb-6 text-sm" {...props} />
  ),
  blockquote: (props: MDXComponentProps) => (
    <blockquote className="border-l-4 border-[var(--color-accent-primary)] pl-4 italic text-[var(--color-text-muted)] my-6" {...props} />
  ),
  hr: () => (
    <hr className="border-[var(--color-border)] my-8" />
  ),
  table: (props: MDXTableProps) => (
    <div className="overflow-x-auto mb-6">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  th: (props: MDXComponentProps) => (
    <th className="border border-[var(--color-border)] px-4 py-2 bg-[var(--color-surface)] text-left font-semibold text-[var(--color-text-primary)]" {...props} />
  ),
  td: (props: MDXComponentProps) => (
    <td className="border border-[var(--color-border)] px-4 py-2 text-[var(--color-text-secondary)]" {...props} />
  ),
  img: (props: MDXImgProps) => (
    <img className="rounded-xl max-w-full h-auto my-6" {...props} />
  ),
}

interface MDXContentProviderProps {
  children: ReactNode
}

export default function MDXContentProvider({ children }: MDXContentProviderProps) {
  return (
    <MDXProvider components={mdxComponents}>
      {children}
    </MDXProvider>
  )
}
