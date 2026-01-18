import { useState, useRef, useEffect, type ForwardedRef } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../../context/ThemeContext'
import {
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  // Plugins
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  frontmatterPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  toolbarPlugin,
  jsxPlugin,
  directivesPlugin,
  AdmonitionDirectiveDescriptor,
  // Toolbar components
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  Separator,
  DiffSourceToggleWrapper,
  InsertFrontmatter,
  InsertAdmonition,
  type JsxComponentDescriptor,
  GenericJsxEditor,
  // For inserting JSX
  usePublisher,
  insertMarkdown$,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import './mdx-editor-theme.css'

// Custom descriptors for rendered_useful MDX components
const jsxComponentDescriptors: JsxComponentDescriptor[] = [
  {
    name: 'Callout',
    kind: 'flow',
    source: '@/components/mdx',
    props: [
      { name: 'type', type: 'string' },
      { name: 'title', type: 'string' },
    ],
    hasChildren: true,
    Editor: GenericJsxEditor,
  },
  {
    name: 'CodePlayground',
    kind: 'flow',
    source: '@/components/mdx',
    props: [
      { name: 'title', type: 'string' },
      { name: 'initialHtml', type: 'string' },
      { name: 'initialCss', type: 'string' },
      { name: 'initialJs', type: 'string' },
      { name: 'height', type: 'expression' },
      { name: 'allowNetwork', type: 'expression' },
      { name: 'editable', type: 'expression' },
    ],
    hasChildren: false,
    Editor: GenericJsxEditor,
  },
  {
    name: 'TechStack',
    kind: 'flow',
    source: '@/components/mdx',
    props: [
      { name: 'items', type: 'expression' },
    ],
    hasChildren: false,
    Editor: GenericJsxEditor,
  },
  {
    name: 'Image',
    kind: 'flow',
    source: '@/components/mdx',
    props: [
      { name: 'src', type: 'string' },
      { name: 'alt', type: 'string' },
      { name: 'caption', type: 'string' },
    ],
    hasChildren: false,
    Editor: GenericJsxEditor,
  },
  {
    name: 'Video',
    kind: 'flow',
    source: '@/components/mdx',
    props: [
      { name: 'src', type: 'string' },
      { name: 'title', type: 'string' },
    ],
    hasChildren: false,
    Editor: GenericJsxEditor,
  },
  {
    name: 'Audio',
    kind: 'flow',
    source: '@/components/mdx',
    props: [
      { name: 'src', type: 'string' },
      { name: 'title', type: 'string' },
    ],
    hasChildren: false,
    Editor: GenericJsxEditor,
  },
  {
    name: 'ThemeSelector',
    kind: 'flow',
    source: '@/components/mdx',
    props: [],
    hasChildren: false,
    Editor: GenericJsxEditor,
  },
  {
    name: 'LayoutSelector',
    kind: 'flow',
    source: '@/components/mdx',
    props: [],
    hasChildren: false,
    Editor: GenericJsxEditor,
  },
  {
    name: 'Mermaid',
    kind: 'flow',
    source: '@/components/mdx',
    props: [
      { name: 'chart', type: 'string' },
    ],
    hasChildren: false,
    Editor: GenericJsxEditor,
  },
  {
    name: 'Todo',
    kind: 'flow',
    source: '@/components/mdx',
    props: [
      { name: 'items', type: 'expression' },
    ],
    hasChildren: false,
    Editor: GenericJsxEditor,
  },
]

// Widget definitions for the insert menu
// Props use expression values (MDast format) for complex types
interface WidgetDefinition {
  name: string
  icon: string
  description: string
  insertText: string // MDX text to insert
}

const widgets: WidgetDefinition[] = [
  {
    name: 'Callout',
    icon: '💬',
    description: 'Info, tip, warning, or danger box',
    insertText: '<Callout type="info" title="Note">\n  Your message here\n</Callout>',
  },
  {
    name: 'TechStack',
    icon: '🛠️',
    description: 'Technology badges',
    insertText: '<TechStack items={["React", "TypeScript"]} />',
  },
  {
    name: 'Image',
    icon: '🖼️',
    description: 'Image with caption',
    insertText: '<Image src="https://via.placeholder.com/800x400" alt="Description" caption="Caption text" />',
  },
  {
    name: 'Mermaid',
    icon: '📊',
    description: 'Diagrams and flowcharts',
    insertText: '<Mermaid chart={`\ngraph TD\n    A[Start] --> B[End]\n`} />',
  },
  {
    name: 'CodePlayground',
    icon: '🎮',
    description: 'Interactive code sandbox',
    insertText: '<CodePlayground\n  title="Try it"\n  initialHtml="<h1>Hello</h1>"\n  initialCss="h1 { color: purple; }"\n  initialJs=""\n  height={300}\n/>',
  },
  {
    name: 'Todo',
    icon: '✅',
    description: 'Task checklist',
    insertText: '<Todo items={[\n  { text: "Task 1", done: false },\n  { text: "Task 2", done: false }\n]} />',
  },
  {
    name: 'Video',
    icon: '🎬',
    description: 'Embed video',
    insertText: '<Video src="https://www.youtube.com/embed/VIDEO_ID" title="Video title" />',
  },
  {
    name: 'Audio',
    icon: '🔊',
    description: 'Embed audio',
    insertText: '<Audio src="/audio/example.mp3" title="Audio title" />',
  },
  {
    name: 'ThemeSelector',
    icon: '🎨',
    description: 'Let readers pick theme',
    insertText: '<ThemeSelector />',
  },
  {
    name: 'LayoutSelector',
    icon: '📐',
    description: 'Let readers pick layout',
    insertText: '<LayoutSelector />',
  },
]

// Custom button to insert widgets - uses Portal to escape stacking context
function InsertWidgetButton() {
  const insertMarkdown = usePublisher(insertMarkdown$)
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })

  // Calculate menu position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.left,
      })
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1.5 text-sm rounded hover:bg-[var(--baseBgActive)] transition-colors"
        title="Insert Widget"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span>📦</span>
        <span>Widgets</span>
        <span className="text-xs">▼</span>
      </button>
      
      {isOpen && createPortal(
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0" 
            style={{ zIndex: 9998 }}
            onClick={() => setIsOpen(false)}
          />
          {/* Menu */}
          <div 
            className="fixed w-64 py-1 rounded-lg shadow-2xl max-h-80 overflow-y-auto"
            style={{ 
              zIndex: 9999,
              top: menuPosition.top,
              left: menuPosition.left,
              backgroundColor: 'var(--color-surface, #1e1e32)',
              border: '1px solid var(--color-border, #3f3f5a)',
            }}
            role="menu"
          >
            {widgets.map((widget) => (
              <button
                key={widget.name}
                type="button"
                role="menuitem"
                onClick={() => {
                  insertMarkdown(widget.insertText)
                  setIsOpen(false)
                }}
                className="w-full px-3 py-2 text-left transition-colors flex items-center gap-3"
                style={{
                  color: 'var(--color-text-primary, #e5e5e5)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-elevated, #252540)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <span className="text-lg">{widget.icon}</span>
                <div>
                  <div className="font-medium">{widget.name}</div>
                  <div className="text-xs opacity-70">{widget.description}</div>
                </div>
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </>
  )
}

// Toolbar component with all the common editing tools
function EditorToolbar() {
  return (
    <DiffSourceToggleWrapper>
      <UndoRedo />
      <Separator />
      <BoldItalicUnderlineToggles />
      <Separator />
      <BlockTypeSelect />
      <Separator />
      <ListsToggle />
      <Separator />
      <CreateLink />
      <InsertImage />
      <InsertTable />
      <InsertThematicBreak />
      <Separator />
      <InsertFrontmatter />
      <InsertAdmonition />
      <Separator />
      <InsertWidgetButton />
    </DiffSourceToggleWrapper>
  )
}

interface InitializedMDXEditorProps extends MDXEditorProps {
  editorRef: ForwardedRef<MDXEditorMethods> | null
  diffMarkdown?: string
}

/**
 * The actual MDXEditor component with all plugins initialized.
 * This is loaded lazily to keep the main bundle small.
 */
export default function InitializedMDXEditor({
  editorRef,
  markdown,
  onChange,
  diffMarkdown = '',
  ...props
}: InitializedMDXEditorProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  
  return (
    <MDXEditor
      ref={editorRef}
      markdown={markdown}
      onChange={onChange}
      className={`mdx-editor-wrapper ${isDark ? 'dark-theme' : ''}`}
      contentEditableClassName="prose prose-lg max-w-none"
      plugins={[
        // Basic formatting
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        
        // Links and images
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin({
          imageUploadHandler: async () => {
            // For now, just return a placeholder
            // In the future, this would upload to a CDN or storage
            return Promise.resolve('https://via.placeholder.com/800x400')
          },
        }),
        
        // Tables
        tablePlugin(),
        
        // Front-matter (article metadata)
        frontmatterPlugin(),
        
        // Code blocks with syntax highlighting
        codeBlockPlugin({ defaultCodeBlockLanguage: 'typescript' }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            js: 'JavaScript',
            javascript: 'JavaScript',
            ts: 'TypeScript',
            typescript: 'TypeScript',
            jsx: 'JSX',
            tsx: 'TSX',
            css: 'CSS',
            html: 'HTML',
            json: 'JSON',
            python: 'Python',
            rust: 'Rust',
            bash: 'Bash',
            shell: 'Shell',
            sql: 'SQL',
            yaml: 'YAML',
            md: 'Markdown',
            mdx: 'MDX',
            '': 'Plain Text',
          },
        }),
        
        // JSX components (Callout, CodePlayground, etc.)
        jsxPlugin({ jsxComponentDescriptors }),
        
        // Directives (admonitions)
        directivesPlugin({
          directiveDescriptors: [AdmonitionDirectiveDescriptor],
        }),
        
        // Diff/source mode toggle
        diffSourcePlugin({
          viewMode: 'rich-text',
          diffMarkdown: diffMarkdown,
        }),
        
        // Toolbar
        toolbarPlugin({
          toolbarContents: EditorToolbar,
        }),
      ]}
      {...props}
    />
  )
}
