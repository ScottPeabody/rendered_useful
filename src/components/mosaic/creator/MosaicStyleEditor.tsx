import { useState, useCallback } from 'react';
import type { MosaicBackground } from '../../../types/mosaic';

interface MosaicStyleEditorProps {
  background: MosaicBackground;
  theme: 'light' | 'dark';
  onBackgroundChange: (bg: MosaicBackground) => void;
  onThemeChange: (theme: 'light' | 'dark') => void;
}

const solidColors = [
  '#1a1a2e', '#16213e', '#0f3460', '#533483',
  '#e94560', '#ff6b6b', '#feca57', '#48dbfb',
  '#1dd1a1', '#10ac84', '#5f27cd', '#341f97',
  '#222f3e', '#576574', '#8395a7', '#c8d6e5',
];

const gradientPresets: { from: string; to: string; direction: string }[] = [
  { from: '#667eea', to: '#764ba2', direction: 'to-br' },
  { from: '#f093fb', to: '#f5576c', direction: 'to-r' },
  { from: '#4facfe', to: '#00f2fe', direction: 'to-r' },
  { from: '#43e97b', to: '#38f9d7', direction: 'to-r' },
  { from: '#fa709a', to: '#fee140', direction: 'to-r' },
  { from: '#a18cd1', to: '#fbc2eb', direction: 'to-r' },
  { from: '#ff9a9e', to: '#fecfef', direction: 'to-r' },
  { from: '#667eea', to: '#764ba2', direction: 'to-b' },
];

export function MosaicStyleEditor({
  background,
  theme,
  onBackgroundChange,
  onThemeChange,
}: MosaicStyleEditorProps) {
  const [activeTab, setActiveTab] = useState<'solid' | 'gradient' | 'image'>('solid');

  const handleSolidColor = useCallback((color: string) => {
    onBackgroundChange({ type: 'solid', color });
  }, [onBackgroundChange]);

  const handleGradient = useCallback((preset: typeof gradientPresets[0]) => {
    onBackgroundChange({
      type: 'gradient',
      from: preset.from,
      to: preset.to,
      direction: preset.direction,
    });
  }, [onBackgroundChange]);

  const handleImageUrl = useCallback((url: string) => {
    onBackgroundChange({
      type: 'image',
      url,
      overlay: 'rgba(0,0,0,0.4)',
    });
  }, [onBackgroundChange]);

  return (
    <div className="p-4 bg-white/5 rounded-xl">
      <h3 className="font-medium mb-4">Style</h3>

      {/* Theme toggle */}
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm opacity-75">Theme:</span>
        <div className="flex bg-white/10 rounded-lg p-1">
          <button
            onClick={() => onThemeChange('dark')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              theme === 'dark' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            🌙 Dark
          </button>
          <button
            onClick={() => onThemeChange('light')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              theme === 'light' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            ☀️ Light
          </button>
        </div>
      </div>

      {/* Background type tabs */}
      <div className="flex gap-2 mb-4">
        {(['solid', 'gradient', 'image'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
              activeTab === tab ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Solid colors */}
      {activeTab === 'solid' && (
        <div className="grid grid-cols-8 gap-2">
          {solidColors.map((color) => (
            <button
              key={color}
              onClick={() => handleSolidColor(color)}
              className={`w-8 h-8 rounded-lg transition-transform hover:scale-110 ${
                background.type === 'solid' && background.color === color
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900'
                  : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}

      {/* Gradients */}
      {activeTab === 'gradient' && (
        <div className="grid grid-cols-4 gap-2">
          {gradientPresets.map((preset, index) => (
            <button
              key={index}
              onClick={() => handleGradient(preset)}
              className={`h-12 rounded-lg transition-transform hover:scale-105 ${
                background.type === 'gradient' &&
                background.from === preset.from &&
                background.to === preset.to
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900'
                  : ''
              }`}
              style={{
                background: `linear-gradient(to right, ${preset.from}, ${preset.to})`,
              }}
            />
          ))}
        </div>
      )}

      {/* Image URL */}
      {activeTab === 'image' && (
        <div className="space-y-3">
          <input
            type="url"
            placeholder="Enter image URL..."
            value={background.type === 'image' ? background.url : ''}
            onChange={(e) => handleImageUrl(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 rounded-lg text-sm placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          <p className="text-xs opacity-50">
            Tip: Use Unsplash, Pexels, or upload to your CDN
          </p>
          {background.type === 'image' && background.url && (
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!background.overlay}
                  onChange={(e) =>
                    onBackgroundChange({
                      ...background,
                      overlay: e.target.checked ? 'rgba(0,0,0,0.4)' : undefined,
                    })
                  }
                  className="rounded"
                />
                Dark overlay
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!background.blur}
                  onChange={(e) =>
                    onBackgroundChange({
                      ...background,
                      blur: e.target.checked ? 10 : undefined,
                    })
                  }
                  className="rounded"
                />
                Blur
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MosaicStyleEditor;
