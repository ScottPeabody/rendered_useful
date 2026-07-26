import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MDXEditorWrapper } from '../components/editor'
import MDXPreview from '../components/editor/MDXPreview'
import type { MDXEditorMethods } from '@mdxeditor/editor'
import { articles } from '../data/content'
import { themes } from '../themes'

type ViewMode = 'edit' | 'preview'

// Default template for new articles - showcasing actual site components
const NEW_ARTICLE_TEMPLATE = `---
title: "Writing Articles with MDX"
description: "A guide to the formatting options and components available when writing articles on rendered_useful."
date: "${new Date().toISOString().split('T')[0]}"
author: speabody
tags: [mdx, guide, getting-started]
featured: false
readingTime: 5
---

This article demonstrates the features available when writing content for **rendered_useful**. We use [MDX](https://mdxjs.com), which lets you combine standard Markdown with React components.

---

## Callouts

Use callouts to highlight important information:

<Callout type="info" title="Information">
  Use info callouts for general notes or context that readers might find helpful.
</Callout>

<Callout type="tip" title="Pro Tip">
  Tip callouts are great for best practices, shortcuts, or things that will save time.
</Callout>

<Callout type="warning" title="Warning">
  Use warning callouts to flag potential issues or things to watch out for.
</Callout>

<Callout type="success" title="Success">
  Success callouts work well for confirming correct approaches or celebrating milestones.
</Callout>

<Callout type="error" title="Error">
  Error callouts help highlight common mistakes or things to avoid.
</Callout>

---

## Code Blocks

Code blocks support syntax highlighting for most languages:

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

function greetUser(user: User): string {
  return \\\`Hello, \\\${user.name}!\\\`;
}
\`\`\`

Use \`inline code\` for short references like variable names or commands.

---

## Tech Stack

Showcase the technologies you used in a project:

<TechStack items={["React", "TypeScript", "Tailwind CSS", "Vite", "MDX"]} />

---

## Images

Add images with captions:

<Image 
  src="/images/apollo_9_splashes_down.jpg" 
  alt="Apollo 9 command module splashing down in the Atlantic Ocean"
  caption="Apollo 9 Splashes Down - NASA"
/>

---

## Diagrams with Mermaid

Create flowcharts, sequence diagrams, and more:

<Mermaid chart={\`
graph TD
    A[Write MDX] --> B{Preview it}
    B -->|Looks good| C[Publish]
    B -->|Needs work| D[Edit more]
    D --> B
    C --> E[Share with readers!]
\`} />

---

## Interactive Code Playground

Let readers experiment with live code - here's a bouncing ball animation:

<CodePlayground
  title="CSS Animation Demo"
  initialHtml={\`<div class="scene">
  <div class="ball"></div>
</div>
<p>The ball bounces using pure CSS animation!</p>\`}
  initialCss={\`.scene {
  height: 200px;
  background: linear-gradient(to bottom, #1e3a5f, #0f172a);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.ball {
  width: 40px;
  height: 40px;
  background: radial-gradient(circle at 30% 30%, #fbbf24, #f59e0b);
  border-radius: 50%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 1s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
}

@keyframes bounce {
  0%, 100% {
    top: 10px;
    animation-timing-function: ease-in;
  }
  50% {
    top: 140px;
    animation-timing-function: ease-out;
    transform: translateX(-50%) scaleY(0.8);
  }
}

p {
  text-align: center;
  color: #94a3b8;
  margin-top: 15px;
}\`}
  initialJs={\`// Pure CSS animation - no JS needed!
console.log('Animation running with CSS only');\`}
  height={400}
/>

---

## Todo Lists

Track progress in your articles:

<Todo items={[
  { text: "Write introduction", done: true },
  { text: "Add code examples", done: true },
  { text: "Include interactive demo", done: true },
  { text: "Review and publish", done: false }
]} />

---

## Theme & Layout

Let readers customize their experience:

<ThemeSelector />

<LayoutSelector />

---

## Conclusion

That's the full toolkit! Delete these examples and start writing your own content. Use the **Preview** tab to see how it renders, and toggle **Source/Diff** mode in the toolbar to see raw markdown or track changes.
`

// Storage key for drafts
const DRAFT_KEY_PREFIX = 'rendered_useful_draft_'

interface Draft {
  markdown: string
  lastSaved: string
}

function getDraftKey(slug: string): string {
  return `${DRAFT_KEY_PREFIX}${slug}`
}

function loadDraft(slug: string): Draft | null {
  try {
    const stored = localStorage.getItem(getDraftKey(slug))
    if (stored) {
      return JSON.parse(stored) as Draft
    }
  } catch (e) {
    console.error('Failed to load draft:', e)
  }
  return null
}

function saveDraft(slug: string, markdown: string): void {
  try {
    const draft: Draft = {
      markdown,
      lastSaved: new Date().toISOString(),
    }
    localStorage.setItem(getDraftKey(slug), JSON.stringify(draft))
  } catch (e) {
    console.error('Failed to save draft:', e)
  }
}

function deleteDraft(slug: string): void {
  try {
    localStorage.removeItem(getDraftKey(slug))
  } catch (e) {
    console.error('Failed to delete draft:', e)
  }
}

export default function EditPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const editorRef = useRef<MDXEditorMethods>(null)
  const editorContainerRef = useRef<HTMLDivElement>(null)
  
  const [markdown, setMarkdown] = useState<string>('')
  const [originalMarkdown, setOriginalMarkdown] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isNewArticle, setIsNewArticle] = useState(false)
  const [previewTheme, setPreviewTheme] = useState<string>('default')
  const [viewMode, setViewMode] = useState<ViewMode>('edit')
  
  const actualSlug = slug || 'new'

  // Apply theme preview to editor container
  useEffect(() => {
    if (!editorContainerRef.current) return
    
    const container = editorContainerRef.current
    
    if (previewTheme === 'default') {
      // Remove theme-specific CSS variables
      const props = Array.from(container.style).filter(p => p.startsWith('--color-') || p.startsWith('--font-') || p.startsWith('--shadow-'))
      props.forEach(prop => container.style.removeProperty(prop))
    } else {
      // Apply the selected theme's CSS variables
      const themeConfig = themes[previewTheme]
      if (themeConfig?.variables) {
        Object.entries(themeConfig.variables).forEach(([key, value]) => {
          if (value) container.style.setProperty(key, value)
        })
      }
    }
  }, [previewTheme])

  // Load existing article or draft
  useEffect(() => {
    async function loadContent() {
      setIsLoading(true)
      
      // Check for existing draft first
      const draft = loadDraft(actualSlug)
      let contentToLoad = NEW_ARTICLE_TEMPLATE
      
      if (actualSlug === 'new') {
        // New article
        setIsNewArticle(true)
        contentToLoad = draft?.markdown || NEW_ARTICLE_TEMPLATE
        setMarkdown(contentToLoad)
        // Original is what the user sees when they open - for diff tracking changes during THIS session
        setOriginalMarkdown(contentToLoad)
        if (draft) {
          setLastSaved(draft.lastSaved)
        }
      } else {
        // Try to load existing article
        const existingArticle = articles.find(a => a.slug === actualSlug)
        
        // Try to load the original file
        if (existingArticle) {
          try {
            const mdxModule = await import(`../../content/articles/${actualSlug}.mdx?raw`)
            contentToLoad = mdxModule.default
          } catch (e) {
            console.error('Failed to load original article:', e)
          }
        }
        
        if (draft) {
          // Use draft if available (user was editing)
          setMarkdown(draft.markdown)
          // Original is what they see when opening - track changes from THIS session
          setOriginalMarkdown(draft.markdown)
          setLastSaved(draft.lastSaved)
        } else if (existingArticle) {
          // Use original content
          setMarkdown(contentToLoad)
          setOriginalMarkdown(contentToLoad)
        } else {
          // Article doesn't exist, treat as new
          setIsNewArticle(true)
          setMarkdown(NEW_ARTICLE_TEMPLATE)
          setOriginalMarkdown(NEW_ARTICLE_TEMPLATE)
        }
      }
      
      setIsLoading(false)
    }
    
    loadContent()
  }, [actualSlug])

  // Auto-save to localStorage
  const handleChange = useCallback((newMarkdown: string) => {
    setMarkdown(newMarkdown)
    setHasUnsavedChanges(true)
    
    // Debounced auto-save
    const timeoutId = setTimeout(() => {
      saveDraft(actualSlug, newMarkdown)
      setLastSaved(new Date().toISOString())
      setHasUnsavedChanges(false)
    }, 1000)
    
    return () => clearTimeout(timeoutId)
  }, [actualSlug])

  // Manual save
  const handleSave = useCallback(() => {
    setIsSaving(true)
    saveDraft(actualSlug, markdown)
    setLastSaved(new Date().toISOString())
    setHasUnsavedChanges(false)
    setIsSaving(false)
  }, [actualSlug, markdown])

  // Download as MDX file
  const handleDownload = useCallback(() => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${actualSlug === 'new' ? 'untitled' : actualSlug}.mdx`
    a.click()
    URL.revokeObjectURL(url)
  }, [actualSlug, markdown])

  // Discard draft
  const handleDiscard = useCallback(() => {
    if (confirm('Are you sure you want to discard your draft? This cannot be undone.')) {
      deleteDraft(actualSlug)
      navigate('/articles')
    }
  }, [actualSlug, navigate])

  // Copy markdown to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      alert('Markdown copied to clipboard!')
    } catch (e) {
      console.error('Failed to copy:', e)
    }
  }, [markdown])

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-8">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-accent-primary)]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-8">
      {/* Header - responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <Link
            to="/articles"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors text-sm sm:text-base"
          >
            ← Back
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] truncate">
            {isNewArticle ? 'New Article' : `Editing: ${actualSlug}`}
          </h1>
        </div>
        
        {/* Controls - wrap on mobile */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Theme preview dropdown - hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-2">
            <label htmlFor="theme-preview" className="text-sm text-[var(--color-text-muted)]">
              Preview:
            </label>
            <select
              id="theme-preview"
              value={previewTheme}
              onChange={(e) => setPreviewTheme(e.target.value)}
              className="px-2 py-1 text-xs sm:text-sm bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
            >
              <option value="default">Default</option>
              {Object.keys(themes).map((themeName) => (
                <option key={themeName} value={themeName}>
                  {themes[themeName].name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Status indicator */}
          <span className="text-xs sm:text-sm text-[var(--color-text-muted)]">
            {hasUnsavedChanges ? (
              <span className="text-amber-500">● Unsaved</span>
            ) : lastSaved ? (
              <span className="text-green-500">✓ Saved</span>
            ) : null}
          </span>
          
          {/* Action buttons - compact on mobile */}
          <button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium bg-[var(--color-accent-primary)] text-[var(--color-accent-contrast)] rounded-lg hover:bg-[var(--color-accent-secondary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-surface)] border border-[var(--color-border)] transition-colors"
            title="Download .mdx"
          >
            <span className="hidden sm:inline">Download</span>
            <span className="sm:hidden">↓</span>
          </button>
          
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-surface)] border border-[var(--color-border)] transition-colors"
            title="Copy markdown"
          >
            <span className="hidden sm:inline">Copy</span>
            <span className="sm:hidden">📋</span>
          </button>
          
          <button
            onClick={handleDiscard}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
            title="Discard draft"
          >
            <span className="hidden sm:inline">Discard</span>
            <span className="sm:hidden">✕</span>
          </button>
        </div>
      </div>
      
      {/* Info banner - responsive text */}
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
          <strong>Note:</strong> Drafts save to your browser.{' '}
          <span className="hidden sm:inline">
            To publish, download the .mdx file and submit a pull request.{' '}
          </span>
          <Link to="/contribute" className="underline hover:no-underline">
            Learn more
          </Link>
        </p>
      </div>
      
      {/* View Mode Tabs - Sticky below navbar */}
      <div className="sticky top-14 sm:top-16 z-30 bg-[var(--color-background)] py-2 sm:py-3 -mx-4 px-4">
        <div className="flex items-center gap-1 p-1 bg-[var(--color-surface)] rounded-lg w-fit border border-[var(--color-border)]">
          <button
            onClick={() => setViewMode('edit')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
              viewMode === 'edit'
                ? 'bg-[var(--color-accent-primary)] text-[var(--color-accent-contrast)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]'
            }`}
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
              viewMode === 'preview'
                ? 'bg-[var(--color-accent-primary)] text-[var(--color-accent-contrast)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]'
            }`}
          >
            👁️ Preview
          </button>
        </div>
      </div>
      
      {/* Editor / Preview */}
      <div 
        ref={editorContainerRef}
        className="relative border border-[var(--color-border)] rounded-lg shadow-lg min-h-[400px] sm:min-h-[500px]"
      >
        {viewMode === 'edit' && (
          <MDXEditorWrapper
            ref={editorRef}
            markdown={markdown}
            onChange={handleChange}
            diffMarkdown={originalMarkdown}
          />
        )}
        
        {viewMode === 'preview' && (
          <div className="bg-[var(--color-background)] min-h-[400px] sm:min-h-[500px]">
            <MDXPreview markdown={markdown} className="max-w-4xl mx-auto px-4 sm:px-6" />
          </div>
        )}
      </div>
      
      {/* Tips - hidden on mobile to save space */}
      <div className="hidden sm:block mt-6 p-4 bg-[var(--color-surface-elevated)] rounded-lg">
        <h3 className="font-semibold text-[var(--color-text-primary)] mb-2">Editor Tips</h3>
        <ul className="text-sm text-[var(--color-text-muted)] space-y-1">
          <li>• <strong>Edit:</strong> Use the toolbar to format text, insert images, and add code blocks</li>
          <li>• <strong>Preview:</strong> See exactly how your article will look with all components rendered</li>
          <li>• Use the toolbar toggles to switch between Rich Text, Source, and Diff modes</li>
          <li>• Use the theme dropdown to preview how your article looks in different themes</li>
          <li>• Your draft is auto-saved every second to local storage</li>
        </ul>
      </div>
    </div>
  )
}
