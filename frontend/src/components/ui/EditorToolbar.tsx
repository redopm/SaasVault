import { Type, Palette, Undo2, Redo2, Image as ImageIcon, LayoutGrid } from 'lucide-react';

interface Props {
  onThemeClick: () => void;
  onFontClick: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onAddText?: () => void;
  onAddImage?: () => void;
  canUndo: boolean;
  canRedo: boolean;
  selectedThemeBg: string;
}

export default function EditorToolbar({
  onThemeClick,
  onFontClick,
  onUndo,
  onRedo,
  onAddText,
  onAddImage,
  canUndo,
  canRedo,
  selectedThemeBg,
}: Props) {
  const sep = <div className="w-px h-5 bg-white/10 mx-1" />;

  const Btn = ({
    onClick,
    title,
    disabled,
    active,
    children,
    accent,
  }: {
    onClick?: () => void;
    title: string;
    disabled?: boolean;
    active?: boolean;
    children: React.ReactNode;
    accent?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all
        ${disabled ? 'opacity-25 cursor-not-allowed text-slate-500' : ''}
        ${!disabled && active ? 'text-white' : ''}
        ${!disabled && !active ? 'text-slate-400 hover:text-white hover:bg-white/10' : ''}
        ${accent ? 'bg-white/[0.07] text-white border border-white/10' : ''}
      `}
      style={active && !disabled ? { background: `color-mix(in srgb, ${selectedThemeBg} 40%, transparent)`, color: 'var(--theme-primary, #22d3ee)' } : undefined}
    >
      {children}
    </button>
  );

  return (
    <div
      className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 p-2 rounded-2xl z-50 border border-white/[0.08]"
      style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.96) 0%, rgba(15,23,42,0.92) 100%)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)' }}
    >
      {/* Toolbar header dot */}
      <div className="w-6 h-[3px] rounded-full mb-1" style={{ background: 'var(--theme-primary, #22d3ee)' }} />

      {/* Undo / Redo */}
      <Btn onClick={onUndo} title="Undo (Ctrl+Z)" disabled={!canUndo}>
        <Undo2 size={16} />
      </Btn>
      <Btn onClick={onRedo} title="Redo (Ctrl+Y)" disabled={!canRedo}>
        <Redo2 size={16} />
      </Btn>

      <div className="h-px w-8 my-1 bg-white/10" />

      {/* Block tools */}
      <Btn onClick={onAddText} title="Add Text Block">
        <Type size={16} />
      </Btn>
      <Btn onClick={onAddImage} title="Add Image Block">
        <ImageIcon size={16} />
      </Btn>

      <div className="h-px w-8 my-1 bg-white/10" />

      {/* Theme */}
      <button
        onClick={onThemeClick}
        title="Change Theme"
        className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
      >
        <div className="relative">
          <Palette size={16} />
          <div
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-slate-900"
            style={{ backgroundColor: selectedThemeBg }}
          />
        </div>
      </button>

      {/* Font / Layout */}
      <Btn onClick={onFontClick} title="Typography & Font">
        <LayoutGrid size={16} />
      </Btn>

      {/* Tooltip label */}
      <div className="mt-2 text-[9px] font-black uppercase tracking-widest text-center" style={{ color: 'var(--theme-primary, #22d3ee)', opacity: 0.5 }}>
        Tools
      </div>
    </div>
  );
}
