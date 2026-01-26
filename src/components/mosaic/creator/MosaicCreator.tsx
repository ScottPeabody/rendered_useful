import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MosaicTypeSelector } from './MosaicTypeSelector';
import { MosaicStyleEditor } from './MosaicStyleEditor';
import { MosaicPreview } from './MosaicPreview';
import {
  PostEditor,
  QuoteEditor,
  CodeEditor,
  PollEditor,
  ImageEditor,
} from './ContentEditors';
import type {
  MosaicType,
  MosaicBackground,
  MosaicContent,
  PostContent,
  QuoteContent,
  CodeContent,
  PollContent,
  ImageContent,
} from '../../../types/mosaic';

// Default content for each type (partial - only types we support in creator)
const defaultContent: Partial<Record<MosaicType, MosaicContent>> = {
  post: { text: '', fontSize: 'lg', alignment: 'center' } as PostContent,
  quote: { text: '', style: 'minimal' } as QuoteContent,
  code: { code: '', language: 'typescript' } as CodeContent,
  poll: { question: '', options: ['', ''], totalVotes: 0, userVote: null } as PollContent,
  image: { url: '', alt: '' } as ImageContent,
  gallery: { images: [], transition: 'slide' },
  video: { url: '' },
  collage: { items: [], layout: '2x2' },
  'article-preview': { slug: '', title: '', excerpt: '' },
  'project-spotlight': { slug: '', title: '', description: '' },
  'notebook-cell': { notebookPath: '', cellIndex: 0 },
  thread: { pageCount: 1 },
};

const defaultBackground: MosaicBackground = {
  type: 'gradient',
  from: '#667eea',
  to: '#764ba2',
  direction: 'to-br',
};

type CreatorStep = 'type' | 'content' | 'style' | 'preview';

export function MosaicCreator() {
  const [step, setStep] = useState<CreatorStep>('type');
  const [selectedType, setSelectedType] = useState<MosaicType | null>(null);
  const [content, setContent] = useState<MosaicContent | null>(null);
  const [background, setBackground] = useState<MosaicBackground>(defaultBackground);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const handleSelectType = useCallback((type: MosaicType) => {
    setSelectedType(type);
    setContent(defaultContent[type] || { text: '' } as PostContent);
    setStep('content');
  }, []);

  const handleBack = useCallback(() => {
    if (step === 'content') setStep('type');
    else if (step === 'style') setStep('content');
    else if (step === 'preview') setStep('style');
  }, [step]);

  const handleNext = useCallback(() => {
    if (step === 'content') setStep('style');
    else if (step === 'style') setStep('preview');
  }, [step]);

  const handlePublish = useCallback(() => {
    // In mock mode, just log and show success
    console.log('Publishing mosaic:', {
      type: selectedType,
      content,
      background,
      theme,
    });
    // TODO: Add to mock data or send to backend
    alert('Mosaic created! (In development mode, this would save to the backend)');
  }, [selectedType, content, background, theme]);

  // Render content editor based on type
  const renderContentEditor = useMemo(() => {
    if (!selectedType || !content) return null;

    switch (selectedType) {
      case 'post':
        return (
          <PostEditor
            content={content as PostContent}
            onChange={setContent}
          />
        );
      case 'quote':
        return (
          <QuoteEditor
            content={content as QuoteContent}
            onChange={setContent}
          />
        );
      case 'code':
        return (
          <CodeEditor
            content={content as CodeContent}
            onChange={setContent}
          />
        );
      case 'poll':
        return (
          <PollEditor
            content={content as PollContent}
            onChange={setContent}
          />
        );
      case 'image':
        return (
          <ImageEditor
            content={content as ImageContent}
            onChange={setContent}
          />
        );
      default:
        return (
          <div className="text-center py-8 opacity-50">
            <p>Editor for {selectedType} coming soon!</p>
          </div>
        );
    }
  }, [selectedType, content]);

  // Check if content is valid for proceeding
  const isContentValid = useMemo(() => {
    if (!content || !selectedType) return false;

    switch (selectedType) {
      case 'post':
        return (content as PostContent).text.trim().length > 0;
      case 'quote':
        return (content as QuoteContent).text.trim().length > 0;
      case 'code':
        return (content as CodeContent).code.trim().length > 0;
      case 'poll': {
        const poll = content as PollContent;
        return poll.question.trim().length > 0 && poll.options.filter(o => o.trim()).length >= 2;
      }
      case 'image':
        return (content as ImageContent).url.trim().length > 0;
      default:
        return true;
    }
  }, [content, selectedType]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/mosaics"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              ✕
            </Link>
            <h1 className="font-semibold">Create Mosaic</h1>
          </div>
          
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {(['type', 'content', 'style', 'preview'] as const).map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === s ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {step !== 'type' && (
              <button
                onClick={handleBack}
                className="px-4 py-1.5 text-sm bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                Back
              </button>
            )}
            {step === 'preview' ? (
              <button
                onClick={handlePublish}
                className="px-4 py-1.5 text-sm bg-white text-gray-900 rounded-full font-medium hover:bg-white/90 transition-colors"
              >
                Publish
              </button>
            ) : step !== 'type' && (
              <button
                onClick={handleNext}
                disabled={step === 'content' && !isContentValid}
                className="px-4 py-1.5 text-sm bg-white text-gray-900 rounded-full font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {step === 'type' && (
          <MosaicTypeSelector
            selectedType={selectedType}
            onSelectType={handleSelectType}
          />
        )}

        {step === 'content' && selectedType && (
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Create your {selectedType}
            </h2>
            {renderContentEditor}
          </div>
        )}

        {step === 'style' && (
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Style your mosaic
            </h2>
            <MosaicStyleEditor
              background={background}
              theme={theme}
              onBackgroundChange={setBackground}
              onThemeChange={setTheme}
            />
          </div>
        )}

        {step === 'preview' && selectedType && content && (
          <div className="flex flex-col items-center gap-8">
            <h2 className="text-xl font-semibold text-center">
              Preview
            </h2>
            <MosaicPreview
              type={selectedType}
              content={content}
              background={background}
              theme={theme}
            />
            <p className="text-sm opacity-50 text-center max-w-md">
              This is how your mosaic will appear in the feed. 
              Click Publish when you're ready to share it.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default MosaicCreator;
