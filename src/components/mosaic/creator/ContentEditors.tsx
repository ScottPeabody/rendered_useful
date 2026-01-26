import { useCallback } from 'react';
import type {
  PostContent,
  QuoteContent,
  CodeContent,
  PollContent,
  ImageContent,
} from '../../../types/mosaic';

// Post Editor
interface PostEditorProps {
  content: PostContent;
  onChange: (content: PostContent) => void;
}

export function PostEditor({ content, onChange }: PostEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Text</label>
        <textarea
          value={content.text}
          onChange={(e) => onChange({ ...content, text: e.target.value })}
          placeholder="What's on your mind?"
          className="w-full h-32 px-4 py-3 bg-white/10 rounded-xl text-white placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Font Size</label>
          <select
            value={content.fontSize || 'lg'}
            onChange={(e) => onChange({ ...content, fontSize: e.target.value as PostContent['fontSize'] })}
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-sm focus:outline-none"
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
            <option value="xl">X-Large</option>
            <option value="2xl">2X-Large</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Alignment</label>
          <select
            value={content.alignment || 'center'}
            onChange={(e) => onChange({ ...content, alignment: e.target.value as PostContent['alignment'] })}
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-sm focus:outline-none"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Quote Editor
interface QuoteEditorProps {
  content: QuoteContent;
  onChange: (content: QuoteContent) => void;
}

export function QuoteEditor({ content, onChange }: QuoteEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Quote</label>
        <textarea
          value={content.text}
          onChange={(e) => onChange({ ...content, text: e.target.value })}
          placeholder="Enter the quote..."
          className="w-full h-24 px-4 py-3 bg-white/10 rounded-xl text-white placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none font-serif italic"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Author</label>
          <input
            type="text"
            value={content.author || ''}
            onChange={(e) => onChange({ ...content, author: e.target.value })}
            placeholder="Who said this?"
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-sm placeholder:opacity-50 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Source</label>
          <input
            type="text"
            value={content.source || ''}
            onChange={(e) => onChange({ ...content, source: e.target.value })}
            placeholder="Book, speech, etc."
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-sm placeholder:opacity-50 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={content.style === 'large'}
            onChange={(e) => onChange({ ...content, style: e.target.checked ? 'large' : 'minimal' })}
            className="rounded"
          />
          Large style
        </label>
      </div>
    </div>
  );
}

// Code Editor
interface CodeEditorProps {
  content: CodeContent;
  onChange: (content: CodeContent) => void;
}

const languages = [
  'javascript', 'typescript', 'python', 'rust', 'go', 'java',
  'c', 'cpp', 'csharp', 'ruby', 'php', 'swift', 'kotlin',
  'html', 'css', 'sql', 'bash', 'json', 'yaml', 'markdown',
];

export function CodeEditor({ content, onChange }: CodeEditorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <select
            value={content.language}
            onChange={(e) => onChange({ ...content, language: e.target.value })}
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-sm focus:outline-none"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Filename (optional)</label>
          <input
            type="text"
            value={content.filename || ''}
            onChange={(e) => onChange({ ...content, filename: e.target.value })}
            placeholder="example.ts"
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-sm placeholder:opacity-50 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Code</label>
        <textarea
          value={content.code}
          onChange={(e) => onChange({ ...content, code: e.target.value })}
          placeholder="// Paste your code here..."
          className="w-full h-48 px-4 py-3 bg-white/10 rounded-xl text-white font-mono text-sm placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
          spellCheck={false}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Highlight Lines (comma-separated)</label>
        <input
          type="text"
          value={content.highlightLines?.join(', ') || ''}
          onChange={(e) => {
            const lines = e.target.value
              .split(',')
              .map((s) => parseInt(s.trim()))
              .filter((n) => !isNaN(n));
            onChange({ ...content, highlightLines: lines.length > 0 ? lines : undefined });
          }}
          placeholder="1, 3, 5-7"
          className="w-full px-3 py-2 bg-white/10 rounded-lg text-sm placeholder:opacity-50 focus:outline-none"
        />
      </div>
    </div>
  );
}

// Poll Editor
interface PollEditorProps {
  content: PollContent;
  onChange: (content: PollContent) => void;
}

export function PollEditor({ content, onChange }: PollEditorProps) {
  const addOption = useCallback(() => {
    if (content.options.length < 6) {
      onChange({ ...content, options: [...content.options, ''] });
    }
  }, [content, onChange]);

  const removeOption = useCallback((index: number) => {
    if (content.options.length > 2) {
      const newOptions = content.options.filter((_, i) => i !== index);
      onChange({ ...content, options: newOptions });
    }
  }, [content, onChange]);

  const updateOption = useCallback((index: number, value: string) => {
    const newOptions = [...content.options];
    newOptions[index] = value;
    onChange({ ...content, options: newOptions });
  }, [content, onChange]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Question</label>
        <input
          type="text"
          value={content.question}
          onChange={(e) => onChange({ ...content, question: e.target.value })}
          placeholder="Ask a question..."
          className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Options</label>
        <div className="space-y-2">
          {content.options.map((option, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 px-3 py-2 bg-white/10 rounded-lg text-sm placeholder:opacity-50 focus:outline-none"
              />
              {content.options.length > 2 && (
                <button
                  onClick={() => removeOption(index)}
                  className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        {content.options.length < 6 && (
          <button
            onClick={addOption}
            className="mt-2 px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
          >
            + Add Option
          </button>
        )}
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={content.allowMultiple || false}
            onChange={(e) => onChange({ ...content, allowMultiple: e.target.checked })}
            className="rounded"
          />
          Allow multiple selections
        </label>
      </div>
    </div>
  );
}

// Image Editor
interface ImageEditorProps {
  content: ImageContent;
  onChange: (content: ImageContent) => void;
}

export function ImageEditor({ content, onChange }: ImageEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Image URL</label>
        <input
          type="url"
          value={content.url}
          onChange={(e) => onChange({ ...content, url: e.target.value })}
          placeholder="https://..."
          className="w-full px-4 py-3 bg-white/10 rounded-xl text-white placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/30"
        />
      </div>
      {content.url && (
        <div className="aspect-video bg-white/5 rounded-lg overflow-hidden">
          <img
            src={content.url}
            alt="Preview"
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-2">Alt Text</label>
        <input
          type="text"
          value={content.alt}
          onChange={(e) => onChange({ ...content, alt: e.target.value })}
          placeholder="Describe the image..."
          className="w-full px-3 py-2 bg-white/10 rounded-lg text-sm placeholder:opacity-50 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Caption (optional)</label>
        <input
          type="text"
          value={content.caption || ''}
          onChange={(e) => onChange({ ...content, caption: e.target.value })}
          placeholder="Add a caption..."
          className="w-full px-3 py-2 bg-white/10 rounded-lg text-sm placeholder:opacity-50 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Fit</label>
        <select
          value={content.fit || 'cover'}
          onChange={(e) => onChange({ ...content, fit: e.target.value as ImageContent['fit'] })}
          className="w-full px-3 py-2 bg-white/10 rounded-lg text-sm focus:outline-none"
        >
          <option value="cover">Cover (fill)</option>
          <option value="contain">Contain (fit)</option>
          <option value="fill">Stretch</option>
        </select>
      </div>
    </div>
  );
}


