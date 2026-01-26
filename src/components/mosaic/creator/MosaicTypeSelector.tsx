import type { MosaicType } from '../../../types/mosaic';

interface MosaicTypeOption {
  type: MosaicType;
  label: string;
  icon: string;
  description: string;
  color: string;
}

const mosaicTypes: MosaicTypeOption[] = [
  {
    type: 'post',
    label: 'Post',
    icon: '📝',
    description: 'Share a thought or message',
    color: 'from-purple-500 to-pink-500',
  },
  {
    type: 'quote',
    label: 'Quote',
    icon: '💬',
    description: 'Share an inspiring quote',
    color: 'from-amber-500 to-orange-500',
  },
  {
    type: 'image',
    label: 'Image',
    icon: '🖼️',
    description: 'Share a single image',
    color: 'from-green-500 to-emerald-500',
  },
  {
    type: 'gallery',
    label: 'Gallery',
    icon: '🎨',
    description: 'Share multiple images',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    type: 'video',
    label: 'Video',
    icon: '🎬',
    description: 'Share a video clip',
    color: 'from-red-500 to-rose-500',
  },
  {
    type: 'code',
    label: 'Code',
    icon: '💻',
    description: 'Share a code snippet',
    color: 'from-slate-500 to-zinc-600',
  },
  {
    type: 'poll',
    label: 'Poll',
    icon: '📊',
    description: 'Create a poll',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    type: 'article-preview',
    label: 'Link',
    icon: '🔗',
    description: 'Share a link with preview',
    color: 'from-teal-500 to-green-500',
  },
];

interface MosaicTypeSelectorProps {
  selectedType: MosaicType | null;
  onSelectType: (type: MosaicType) => void;
}

export function MosaicTypeSelector({ selectedType, onSelectType }: MosaicTypeSelectorProps) {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6 text-center">What do you want to create?</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {mosaicTypes.map((option) => (
          <button
            key={option.type}
            onClick={() => onSelectType(option.type)}
            className={`relative p-4 rounded-xl text-left transition-all duration-200 ${
              selectedType === option.type
                ? 'ring-2 ring-white scale-105'
                : 'hover:scale-102 hover:opacity-90'
            }`}
          >
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${option.color} opacity-80`} />
            <div className="relative z-10">
              <span className="text-3xl mb-2 block">{option.icon}</span>
              <h3 className="font-medium text-sm">{option.label}</h3>
              <p className="text-xs opacity-75 mt-1 line-clamp-2">{option.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MosaicTypeSelector;
