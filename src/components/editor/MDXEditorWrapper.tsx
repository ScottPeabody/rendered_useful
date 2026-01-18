import { lazy, Suspense, forwardRef } from 'react'
import type { MDXEditorMethods, MDXEditorProps } from '@mdxeditor/editor'
import LoadingSpinner from '../ui/LoadingSpinner'

// Lazy load the heavy editor component
const InitializedMDXEditor = lazy(() => import('./InitializedMDXEditor'))

export interface MDXEditorWrapperProps extends Omit<MDXEditorProps, 'ref'> {
  onSave?: (markdown: string) => void
  diffMarkdown?: string
}

/**
 * A wrapper component that lazy-loads MDXEditor.
 * This keeps the main bundle small since the editor is ~150KB+ gzipped.
 */
const MDXEditorWrapper = forwardRef<MDXEditorMethods, MDXEditorWrapperProps>(
  (props, ref) => {
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center h-96 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
          <LoadingSpinner />
        </div>
      }>
        <InitializedMDXEditor {...props} editorRef={ref} />
      </Suspense>
    )
  }
)

MDXEditorWrapper.displayName = 'MDXEditorWrapper'

export default MDXEditorWrapper
