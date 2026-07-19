import React, { useState, useEffect } from 'react';
import { X, Check, Image as ImageIcon } from 'lucide-react';
import { THEMES } from '../../themes';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTheme: string;
  onSelectTheme: (themeId: string) => void;
  deckBgImage?: string;
  onSetBgImage?: (url: string) => void;
}

// Mini slide preview rendered purely in CSS
const ThemePreview = ({ theme }: { theme: typeof THEMES[string] }) => {
  const { colors } = theme;
  return (
    <div
      className="w-full rounded-lg overflow-hidden relative"
      style={{ background: colors.background, aspectRatio: '16/9' }}
    >
      <div className="absolute top-0 right-0 w-10 h-10 rounded-bl-full opacity-20" style={{ background: colors.primary }} />
      <div className="absolute top-3 left-3">
        <div
          className="text-[5px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded-full"
          style={{ color: colors.primary, background: `${colors.primary}22`, border: `1px solid ${colors.primary}44` }}
        >
          THE PROBLEM
        </div>
      </div>
      <div className="absolute top-7 left-3 right-3 h-2 rounded-full" style={{ background: colors.text, opacity: 0.85, width: '60%' }} />
      <div className="absolute top-11 left-3 right-3 h-1.5 rounded-full" style={{ background: colors.text, opacity: 0.3, width: '45%' }} />
      {[0, 1, 2].map(i => (
        <div key={i} className="absolute left-3 flex items-center gap-1" style={{ top: `${58 + i * 10}%` }}>
          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: colors.primary }} />
          <div className="h-1 rounded-full" style={{ background: colors.muted, opacity: 0.5, width: `${50 - i * 8}px` }} />
        </div>
      ))}
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }} />
    </div>
  );
};

const BG_PRESETS = [
  { label: 'None', url: '' },
  { label: 'Dark Mesh', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=900&q=75' },
  { label: 'Tech Grid', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=75' },
  { label: 'Dark Marble', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=900&q=75' },
  { label: 'Night City', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=75' },
  { label: 'Abstract Blue', url: 'https://images.unsplash.com/photo-1502691876148-a84978e59af8?auto=format&fit=crop&w=900&q=75' },
  { label: 'Dark Bokeh', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=75' },
  { label: 'Grain Texture', url: 'https://images.unsplash.com/photo-1558470598-a5dda9640f68?auto=format&fit=crop&w=900&q=75' },
  { label: 'Dark Concrete', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=75' },
  { label: 'Minimal White', url: 'https://images.unsplash.com/photo-1531685250784-7569952593d2?auto=format&fit=crop&w=900&q=75' },
];

export default function ThemeModal({ isOpen, onClose, selectedTheme, onSelectTheme, deckBgImage = '', onSetBgImage }: ThemeModalProps) {
  const [customBgUrl, setCustomBgUrl] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    // Portal-style overlay — using position:fixed on #root level via z-[9999]
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(2, 6, 23, 0.75)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal container */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col"
        style={{ maxHeight: 'calc(100vh - 48px)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header — always visible */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Choose Theme</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {Object.keys(THEMES).length} premium palettes — each optimized for investor presentations
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable body — ONLY this area scrolls */}
        <div className="flex-1 overflow-y-auto min-h-0">

          {/* Theme Grid */}
          <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {Object.entries(THEMES).map(([id, theme]) => {
              const isSelected = selectedTheme === id;
              return (
                <div
                  key={id}
                  onClick={() => onSelectTheme(id)}
                  className={`relative cursor-pointer rounded-xl border-2 transition-all overflow-hidden ${
                    isSelected
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/20'
                      : 'border-slate-100 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="p-2 pb-0">
                    <ThemePreview theme={theme} />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-black text-slate-800 text-sm">{theme.name}</h3>
                      {isSelected && (
                        <div className="bg-blue-500 text-white p-0.5 rounded-full">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">{theme.description}</p>
                    <div className="flex gap-1 mt-2">
                      {[theme.colors.background, theme.colors.primary, theme.colors.secondary, theme.colors.card].map((c, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-slate-200"
                          style={{ background: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Background Image Section */}
          {onSetBgImage && (
            <div className="px-6 pb-6 border-t border-slate-100 pt-5">
              <h3 className="text-sm font-black text-slate-800 mb-1">Slide Background Image</h3>
              <p className="text-[11px] text-slate-500 mb-4">A subtle image overlaid behind your slide content. Dark overlay is added automatically for readability.</p>

              <div className="grid grid-cols-5 gap-2 mb-4">
                {BG_PRESETS.map((preset) => {
                  const isBgSelected = deckBgImage === preset.url;
                  return (
                    <div
                      key={preset.label}
                      onClick={() => onSetBgImage(preset.url)}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${isBgSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-400'}`}
                      style={{ aspectRatio: '16/9' }}
                    >
                      {preset.url ? (
                        <>
                          <img
                            src={preset.url}
                            alt={preset.label}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              const parent = (e.target as HTMLImageElement).parentElement;
                              if (parent) {
                                (e.target as HTMLImageElement).style.display = 'none';
                                parent.style.background = '#cbd5e1';
                              }
                            }}
                          />
                          {/* Subtle dark overlay — matches real slide appearance */}
                          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)' }} />
                        </>
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                          <span className="text-[10px] text-slate-400 font-bold">None</span>
                        </div>
                      )}
                      {isBgSelected && (
                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center z-10">
                          <div className="bg-blue-500 text-white p-0.5 rounded-full"><Check size={10} strokeWidth={3} /></div>
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white text-center py-0.5 font-bold z-10">{preset.label}</div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 border border-slate-200">
                  <ImageIcon size={14} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Paste custom image URL..."
                    value={customBgUrl}
                    onChange={(e) => setCustomBgUrl(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && customBgUrl) { onSetBgImage(customBgUrl); setCustomBgUrl(''); } }}
                    className="flex-1 bg-transparent text-xs text-slate-700 focus:outline-none font-medium"
                  />
                </div>
                <button
                  onClick={() => { if (customBgUrl) { onSetBgImage(customBgUrl); setCustomBgUrl(''); } }}
                  className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer — always visible */}
        <div className="px-7 py-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0 rounded-b-2xl">
          <p className="text-xs text-slate-400 font-medium">
            Selected: <span className="text-slate-700 font-black">{THEMES[selectedTheme]?.name}</span>
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm text-sm"
            >
              Apply Theme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
