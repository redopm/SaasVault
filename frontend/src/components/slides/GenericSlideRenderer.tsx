import React, { useState } from 'react';
import { Image as ImageIcon, BarChart2, BarChart, PieChart, TrendingUp, Activity } from 'lucide-react';
import {
  ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
  PieChart as RePieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';

interface SlideData {
  type: 'title' | 'list' | 'split' | 'metrics' | 'custom' | 'chart';
  tag?: string;
  title?: string;
  companyName?: string;
  tagline?: string;
  content?: string;
  imageUrl?: string;
  items?: string[];
  metrics?: Array<{ label: string; value: string; desc?: string }>;
  blocks?: Array<{ type: string; content?: string; imageUrl?: string }>;
  chartType?: 'bar' | 'horizontalBar' | 'pie' | 'donut' | 'line';
  data?: Array<{ label: string; value: number }>;
}

interface Props {
  slide: SlideData;
  onUpdate: (updatedSlide: SlideData) => void;
}

const T = {
  text:    { color: 'var(--theme-text, #f0f9ff)' },
  muted:   { color: 'var(--theme-muted, #94a3b8)' },
  primary: { color: 'var(--theme-primary, #22d3ee)' },
  card:    { background: 'var(--theme-card, rgba(30,41,59,0.9))', border: '1px solid var(--theme-border, rgba(255,255,255,0.1))' },
  accentBg:{ background: 'var(--theme-primary, #22d3ee)' },
  accentText: { color: 'var(--theme-bg, #0f172a)' },
  divider: { background: 'linear-gradient(90deg, var(--theme-primary, #22d3ee), var(--theme-secondary, #38bdf8))' },
};

// ─── Image Panel (reusable across slide types) ───────────────────────────────
function ImagePanel({ imageUrl, onSet, compact = false }: { imageUrl?: string; onSet: (url: string) => void; compact?: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  
  const h = compact ? 'h-full' : 'h-36';
  
  if (imageUrl) {
    return (
      <div className={`relative group/img w-full ${h} rounded-xl overflow-hidden`}>
        <img src={imageUrl} alt="Visual" className="w-full h-full object-cover" />
        <button
          onClick={(e) => { e.stopPropagation(); onSet(''); }}
          className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity font-bold"
        >✕ Remove</button>
      </div>
    );
  }
  
  if (isEditing) {
    return (
      <div className={`w-full ${h} rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all`}
        style={{ borderColor: 'var(--theme-primary)', background: 'color-mix(in srgb, var(--theme-primary) 10%, transparent)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-bold mb-2 text-center" style={T.text}>Paste Image URL</p>
        <input 
          type="text" 
          autoFocus
          className="w-full text-xs p-2 rounded-lg bg-black/20 text-white border-none focus:outline-none mb-2"
          placeholder="https://..."
          value={tempUrl}
          onChange={(e) => setTempUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && tempUrl) { onSet(tempUrl); setIsEditing(false); }
            if (e.key === 'Escape') setIsEditing(false);
          }}
        />
        <div className="flex gap-2 w-full">
          <button onClick={() => { if (tempUrl) onSet(tempUrl); setIsEditing(false); }} className="flex-1 text-xs py-1.5 rounded bg-blue-500 text-white font-bold">Apply</button>
          <button onClick={() => setIsEditing(false)} className="flex-1 text-xs py-1.5 rounded bg-slate-600 text-white font-bold">Cancel</button>
        </div>
      </div>
    );
  }
  
  return (
    <div
      className={`w-full ${h} rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all group/img`}
      style={{ borderColor: 'var(--theme-border, rgba(255,255,255,0.15))', background: 'color-mix(in srgb, var(--theme-primary) 6%, transparent)' }}
      onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 group-hover/img:scale-110 transition-transform" style={T.accentBg}>
        <ImageIcon size={18} style={T.accentText} />
      </div>
      <p className="text-xs font-black uppercase tracking-widest" style={T.muted}>Add Image</p>
    </div>
  );
}

// ─── Chart Type Selector ─────────────────────────────────────────────────────
const CHART_TYPES: Array<{ id: string; label: string; Icon: React.FC<any> }> = [
  { id: 'bar',           label: 'Bar',      Icon: BarChart2 },
  { id: 'horizontalBar', label: 'H-Bar',    Icon: BarChart },
  { id: 'line',          label: 'Line',     Icon: TrendingUp },
  { id: 'pie',           label: 'Pie',      Icon: PieChart },
  { id: 'donut',         label: 'Donut',    Icon: Activity },
];

function ChartTypeSelector({ current, onChange }: { current: string; onChange: (t: string) => void }) {
  return (
    <div className="flex items-center gap-1.5 mb-3 shrink-0 flex-wrap">
      <span className="text-xs font-black uppercase tracking-widest mr-1" style={T.muted}>Chart:</span>
      {CHART_TYPES.map(({ id, label, Icon }) => {
        const active = current === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
            style={active
              ? { background: 'var(--theme-primary)', color: 'var(--theme-bg)' }
              : { background: 'var(--theme-card)', color: 'var(--theme-muted)', border: '1px solid var(--theme-border)' }
            }
          >
            <Icon size={12} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function GenericSlideRenderer({ slide, onUpdate }: Props) {
  if (!slide) return null;

  const handleChange = (field: keyof SlideData, value: any) => onUpdate({ ...slide, [field]: value });
  const handleArrayChange = (arr: 'items' | 'metrics' | 'data', idx: number, val: any) => {
    const a = [...(slide[arr] || [])];
    a[idx] = val;
    onUpdate({ ...slide, [arr]: a });
  };

  const CHART_COLORS = ['var(--theme-primary,#22d3ee)', '#f59e0b', '#10b981', '#6366f1', '#f43f5e', '#84cc16'];
  const [addingImage, setAddingImage] = useState(false);

  const renderEyebrow = () => {
    if (!slide.tag) return null;
    return (
      <div className="text-[10px] font-black tracking-[0.2em] uppercase inline-block mb-3 px-3 py-1 rounded-full shrink-0"
        style={{ color: 'var(--theme-primary)', background: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--theme-primary) 28%, transparent)' }}>
        {slide.tag}
      </div>
    );
  };

  const renderFloatingImageButton = (onSetUrl: (url: string) => void) => {
    if (addingImage) {
      return (
        <div className="absolute bottom-3 right-3 z-50 w-64 p-3 rounded-xl shadow-2xl border" style={{ ...T.card, borderColor: 'var(--theme-primary)' }} onClick={(e) => e.stopPropagation()}>
          <p className="text-[10px] font-bold mb-2 uppercase tracking-widest" style={T.primary}>Paste Image URL</p>
          <input 
            type="text" autoFocus
            className="w-full text-xs p-2 rounded bg-black/30 text-white border-none focus:outline-none mb-2"
            placeholder="https://..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') { onSetUrl(e.currentTarget.value); setAddingImage(false); }
              if (e.key === 'Escape') setAddingImage(false);
            }}
          />
          <div className="flex gap-2">
            <button onClick={(e) => { const input = e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement; if (input.value) onSetUrl(input.value); setAddingImage(false); }} className="flex-1 text-[10px] py-1 rounded bg-blue-500 text-white font-bold">Apply</button>
            <button onClick={() => setAddingImage(false)} className="flex-1 text-[10px] py-1 rounded bg-slate-600 text-white font-bold">Cancel</button>
          </div>
        </div>
      );
    }
    return (
      <div className="absolute bottom-3 right-3 z-20">
        <button
          onClick={(e) => { e.stopPropagation(); setAddingImage(true); }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold opacity-30 hover:opacity-100 transition-opacity"
          style={T.card}
          title="Add image to this slide"
        >
          <ImageIcon size={12} style={T.primary} /> Add Image
        </button>
      </div>
    );
  };

  // ─── TITLE ─────────────────────────────────────────────────────────────────
  if (slide.type === 'title') {
    return (
      <div className="w-full h-full flex flex-row overflow-hidden relative">
        {/* Left: Content */}
        <div className="flex-1 flex flex-col justify-center px-16 py-10 relative z-10">
          {/* Diagonal accent blob */}
          <div className="absolute top-0 right-0 w-80 h-80 opacity-[0.07] pointer-events-none" style={{ background: 'radial-gradient(circle, var(--theme-primary) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 opacity-[0.04] pointer-events-none" style={{ background: 'radial-gradient(circle, var(--theme-secondary) 0%, transparent 70%)' }} />

          <div className="text-[10px] font-black tracking-[0.25em] uppercase mb-4 flex items-center gap-2" style={T.primary}>
            <span className="w-6 h-[2px] inline-block rounded-full" style={T.accentBg} />
            {slide.tag || 'PITCH DECK'}
          </div>
          <textarea
            value={slide.companyName || ''}
            onChange={(e) => handleChange('companyName', e.target.value)}
            placeholder="Company Name"
            className="text-7xl font-black mb-4 font-heading tracking-tight leading-[0.92] bg-transparent border-none focus:outline-none resize-none overflow-hidden w-full"
            style={{ ...T.text, minHeight: '1.1em' }}
            rows={Math.max(1, Math.ceil((slide.companyName || '').length / 12))}
          />
          <div className="w-20 h-1.5 rounded-full mb-7 shrink-0" style={T.divider} />
          <textarea
            value={slide.tagline || ''}
            onChange={(e) => handleChange('tagline', e.target.value)}
            placeholder="Your compelling tagline here"
            className="text-2xl font-medium leading-relaxed max-w-lg bg-transparent border-none focus:outline-none resize-none overflow-hidden w-full"
            style={{ ...T.muted, minHeight: '1.5em' }}
            rows={Math.max(1, Math.ceil((slide.tagline || '').length / 30))}
          />
        </div>
        {/* Right: abstract geometric pattern */}
        <div className="w-[38%] relative shrink-0 overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'color-mix(in srgb, var(--theme-primary) 6%, transparent)' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(var(--theme-primary) 1px, transparent 1px), linear-gradient(90deg, var(--theme-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          {/* Big circle accent */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-10" style={T.accentBg} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-15" style={T.accentBg} />
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[7rem] font-black opacity-[0.08] tracking-widest select-none" style={T.text}>
              {(slide.companyName || 'C').charAt(0)}
            </div>
          </div>
          {/* Diagonal line accent */}
          <div className="absolute bottom-0 right-0 w-full h-full" style={{ background: 'linear-gradient(135deg, transparent 60%, color-mix(in srgb, var(--theme-primary) 15%, transparent) 100%)' }} />
        </div>
      </div>
    );
  }

  // ─── LIST ──────────────────────────────────────────────────────────────────
  if (slide.type === 'list') {
    const isAsk    = (slide.tag || '').toLowerCase().includes('ask');
    const isProblem = (slide.tag || '').toLowerCase().includes('problem');
    const isTeam    = (slide.tag || '').toLowerCase().includes('team') || (slide.tag || '').toLowerCase().includes('advisor');
    const bulletStyle = isProblem
      ? { color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }
      : { color: 'var(--theme-primary)', background: 'color-mix(in srgb, var(--theme-primary) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--theme-primary) 25%, transparent)' };
    const bulletIcon = isProblem ? '✗' : isAsk ? '→' : '✓';
    const hasImage = !!slide.imageUrl;

    // ── TEAM SLIDE — Premium Card Grid ──────────────────────────────────────
    if (isTeam) {
      const members = slide.items || [];
      return (
        <div className="w-full h-full flex flex-col px-12 py-8 overflow-hidden">
          {renderEyebrow()}
          <textarea
            value={slide.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="The Team"
            className="text-4xl font-black mb-6 font-heading leading-tight shrink-0 bg-transparent border-none focus:outline-none resize-none overflow-hidden w-full"
            style={{ ...T.text, minHeight: '1.2em' }}
            rows={Math.max(1, Math.ceil((slide.title || '').length / 30))}
          />
          <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
            {members.map((item: string, i: number) => {
              // Parse: "Full Name · Title — Credibility"
              const dotParts = item.split('·');
              const name = dotParts[0]?.replace('Advisor:', '').replace(/\[|\]/g, '').trim();
              const rest = dotParts[1] || item;
              const dashParts = rest.split('—');
              const titlePart = dashParts[0]?.replace(/\[|\]/g, '').trim();
              const credPart = dashParts[1]?.replace(/\[|\]/g, '').trim() || '';
              const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
              const accentColors = ['var(--theme-primary)', '#f59e0b', '#10b981', '#6366f1'];
              return (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl relative overflow-hidden" style={{ ...T.card, border: '1px solid color-mix(in srgb, var(--theme-primary) 15%, transparent)' }}>
                  {/* Subtle corner glow */}
                  <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full opacity-[0.08] pointer-events-none" style={{ background: accentColors[i % 4] }} />
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-black text-sm" style={{ background: `color-mix(in srgb, ${accentColors[i % 4]} 20%, transparent)`, color: accentColors[i % 4], border: `2px solid ${accentColors[i % 4]}` }}>
                    {initials || (i + 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-base leading-tight truncate" style={T.text}>{name}</div>
                    <div className="text-xs font-bold mt-0.5 mb-1.5" style={{ color: accentColors[i % 4] }}>{titlePart}</div>
                    <textarea
                      value={credPart}
                      onChange={(e) => {
                        const newItems = [...(slide.items || [])];
                        newItems[i] = `${name} · ${titlePart} — ${e.target.value}`;
                        onUpdate({ ...slide, items: newItems });
                      }}
                      className="w-full bg-transparent text-[11px] focus:outline-none border-none resize-none leading-snug"
                      style={T.muted}
                      rows={2}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Special ASK slide layout
    if (isAsk) {
      return (
        <div className="w-full h-full flex flex-row overflow-hidden">
          {/* Left: Content */}
          <div className="flex-1 flex flex-col justify-center px-12 py-10 overflow-hidden">
            {renderEyebrow()}
            <textarea
              value={slide.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Title"
              className="text-5xl font-black mb-6 font-heading leading-tight shrink-0 bg-transparent border-none focus:outline-none resize-none overflow-hidden w-full"
              style={{ ...T.text, minHeight: '1.2em' }}
              rows={Math.max(1, Math.ceil((slide.title || '').length / 25))}
            />
            <div className="flex flex-col gap-4">
              {(slide.items || []).map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-sm font-black" style={bulletStyle}>
                    {bulletIcon}
                  </div>
                  <textarea
                    value={item}
                    onChange={(e) => handleArrayChange('items', i, e.target.value)}
                    className="w-full bg-transparent text-lg focus:outline-none border-none resize-none leading-snug font-semibold overflow-hidden"
                    style={{ ...T.text, minHeight: '1.5em' }}
                    rows={Math.max(1, Math.ceil(item.length / 48))}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Right: Big impactful number/visual */}
          <div className="w-[40%] flex flex-col items-center justify-center px-8 py-10 shrink-0 relative">
            <div className="absolute inset-4 rounded-2xl opacity-10" style={T.accentBg} />
            <div className="relative z-10 text-center">
              <div className="text-8xl font-black leading-none mb-2" style={T.primary}>
                {/* Extract the dollar/number from title */}
                {(slide.title || '').match(/[\$£€][\d.]+[KMB]?/)?.[0] || '$1M'}
              </div>
              <div className="text-sm font-black uppercase tracking-widest mb-6" style={T.muted}>Seeking</div>
              <div className="w-16 h-1 rounded-full mx-auto mb-6" style={T.divider} />
              {/* Funding breakdown visual */}
              <div className="flex flex-col gap-1.5 text-left w-full max-w-[180px] mx-auto">
                {(slide.items || []).map((item: string, i: number) => {
                  const pct = item.match(/(\d+)%/)?.[1];
                  return pct ? (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-bold mb-1" style={T.muted}>
                        <span>{item.replace(/\d+%\s*/, '').replace(/^[→✓✗]\s*/, '').trim()}</span>
                        <span style={T.primary}>{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'color-mix(in srgb, var(--theme-primary) 15%, transparent)' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, ...T.accentBg }} />
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex flex-col px-14 py-10 overflow-hidden relative">
        <div className="flex flex-col h-full" style={{ width: hasImage ? '65%' : '100%' }}>
          {renderEyebrow()}
          <textarea
            value={slide.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Title"
            className="text-4xl font-black mb-5 font-heading leading-tight shrink-0 bg-transparent border-none focus:outline-none resize-none overflow-hidden w-full"
            style={{ ...T.text, minHeight: '1.2em' }}
            rows={Math.max(1, Math.ceil((slide.title || '').length / 30))}
          />
          {slide.content !== undefined && (
            <textarea
              value={slide.content || ''}
              onChange={(e) => handleChange('content', e.target.value)}
              className="text-base mb-4 shrink-0 leading-snug bg-transparent border-none focus:outline-none resize-none overflow-hidden w-full"
              style={{ ...T.muted, minHeight: '1.5em' }}
              rows={Math.max(1, Math.ceil((slide.content || '').length / 60))}
            />
          )}
          <div className="flex-1 flex flex-col justify-evenly overflow-hidden">
            {(slide.items || []).map((item: string, i: number) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-black" style={bulletStyle}>
                  {bulletIcon}
                </div>
                <textarea
                  value={item}
                  onChange={(e) => handleArrayChange('items', i, e.target.value)}
                  className="w-full bg-transparent text-xl focus:outline-none border-none resize-none leading-snug font-semibold overflow-hidden"
                  style={{ ...T.text, minHeight: '1.5em', height: 'auto' }}
                  rows={Math.max(1, Math.ceil(item.length / 52))}
                />
              </div>
            ))}
          </div>
        </div>
        
        {hasImage && (
          <div className="absolute right-12 bottom-12 w-[32%] h-[45%] z-10 shadow-2xl rounded-xl">
            <ImagePanel imageUrl={slide.imageUrl} onSet={(u) => handleChange('imageUrl', u)} compact />
          </div>
        )}
        {!hasImage && renderFloatingImageButton((u) => handleChange('imageUrl', u))}
      </div>
    );
  }

  // ─── SPLIT ─────────────────────────────────────────────────────────────────
  if (slide.type === 'split') {
    const isSplitProblem = (slide.tag || '').toLowerCase().includes('problem');
    const splitBulletStyle = isSplitProblem
      ? { color: '#ef4444' }
      : { color: 'var(--theme-primary)' };
    const splitBulletIcon = isSplitProblem ? '✗' : '✓';
    return (
      <div className="w-full h-full flex flex-row overflow-hidden">
        <div className="flex-1 flex flex-col justify-center px-12 py-10 overflow-hidden">
          {renderEyebrow()}
          <textarea
            value={slide.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            className="text-4xl font-black mb-4 font-heading leading-tight shrink-0 bg-transparent border-none focus:outline-none resize-none overflow-hidden w-full"
            style={{ ...T.text, minHeight: '1.2em' }}
            rows={Math.max(1, Math.ceil((slide.title || '').length / 25))}
          />
          {slide.content !== undefined && (
            <textarea
              value={slide.content || ''}
              onChange={(e) => handleChange('content', e.target.value)}
              className="text-base font-medium mb-5 shrink-0 leading-relaxed bg-transparent border-none focus:outline-none resize-none overflow-hidden w-full"
              style={{ ...T.muted, minHeight: '1.5em' }}
              rows={Math.max(1, Math.ceil((slide.content || '').length / 50))}
            />
          )}
          <div className="flex flex-col gap-3">
            {(slide.items || []).map((item: string, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <span className="font-black text-lg shrink-0 mt-0.5" style={splitBulletStyle}>{splitBulletIcon}</span>
                <textarea
                  value={item}
                  onChange={(e) => handleArrayChange('items', i, e.target.value)}
                  className="w-full bg-transparent text-base focus:outline-none border-none resize-none leading-snug font-semibold overflow-hidden"
                  style={{ ...T.text, minHeight: '1.4em' }}
                  rows={Math.max(1, Math.ceil(item.length / 55))}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="w-[44%] relative group/image shrink-0">
          <ImagePanel imageUrl={slide.imageUrl} onSet={(u) => handleChange('imageUrl', u)} compact />
        </div>
      </div>
    );
  }

  // ─── METRICS ───────────────────────────────────────────────────────────────
  if (slide.type === 'metrics') {
    const isBusinessModel = (slide.tag || '').toLowerCase().includes('business') || (slide.tag || '').toLowerCase().includes('model');
    return (
      <div className="w-full h-full flex flex-col px-14 py-8 overflow-hidden">
        {renderEyebrow()}
        <textarea
          value={slide.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          className="text-4xl font-black mb-2 text-center font-heading shrink-0 bg-transparent border-none focus:outline-none resize-none overflow-hidden w-full"
          style={{ ...T.text, minHeight: '1.2em' }}
          rows={Math.max(1, Math.ceil((slide.title || '').length / 40))}
        />
        {slide.content !== undefined && (
          <textarea
            value={slide.content || ''}
            onChange={(e) => handleChange('content', e.target.value)}
            className="text-sm text-center mb-6 shrink-0 leading-snug bg-transparent border-none focus:outline-none resize-none overflow-hidden w-full"
            style={{ ...T.muted, minHeight: '1.5em' }}
            rows={Math.max(1, Math.ceil((slide.content || '').length / 80))}
          />
        )}
        <div className="flex-1 flex flex-col justify-center -mt-6">
          <div className="flex flex-wrap gap-5 justify-center">
            {(slide.metrics || []).map((m, i: number) => (
              <div
                key={i}
                className="px-7 py-5 rounded-2xl flex-1 min-w-[150px] text-center border-t-4"
                style={{ ...T.card, borderTopColor: 'var(--theme-primary)', marginTop: 0 }}
              >
                <input
                  value={m.value}
                  onChange={(e) => handleArrayChange('metrics', i, { ...m, value: e.target.value })}
                  className="w-full bg-transparent text-4xl font-black text-center border-none focus:outline-none font-heading"
                  style={{ color: 'var(--theme-primary)' }}
                />
                <input
                  value={m.label}
                  onChange={(e) => handleArrayChange('metrics', i, { ...m, label: e.target.value })}
                  className="w-full bg-transparent text-xs font-black uppercase tracking-widest text-center border-none focus:outline-none mt-0.5"
                  style={T.muted}
                />
                {m.desc !== undefined && (
                  <input
                    value={m.desc}
                    onChange={(e) => handleArrayChange('metrics', i, { ...m, desc: e.target.value })}
                    className="w-full bg-transparent text-[10px] text-center border-none focus:outline-none mt-0.5 opacity-60"
                    style={T.muted}
                  />
                )}
              </div>
            ))}
          </div>
          {/* Business model gets an image slot below metrics */}
          {isBusinessModel && (
            <div className="mt-4 mx-auto w-full max-w-xs">
              <ImagePanel imageUrl={slide.imageUrl} onSet={(u) => handleChange('imageUrl', u)} />
            </div>
          )}
        </div>
        {!isBusinessModel && !slide.imageUrl && renderFloatingImageButton((u) => handleChange('imageUrl', u))}
      </div>
    );
  }

  // ─── CUSTOM ────────────────────────────────────────────────────────────────
  if (slide.type === 'custom') {
    return (
      <div className="w-full h-full flex flex-col p-10 overflow-hidden">
        <div className="flex flex-col gap-5 h-full w-full max-w-4xl mx-auto items-center justify-center">
          {(!slide.blocks || slide.blocks.length === 0) && (
            <div className="text-lg font-medium border-2 border-dashed rounded-2xl p-10 w-full text-center"
              style={{ ...T.muted, borderColor: 'var(--theme-border, rgba(255,255,255,0.1))' }}>
              Click the Toolbar to add Text or Image blocks here.
            </div>
          )}
          {(slide.blocks || []).map((block, i: number) => (
            <div key={i} className="w-full group/block relative">
              <button
                onClick={() => { const nb = [...slide.blocks!]; nb.splice(i, 1); handleChange('blocks', nb); }}
                className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover/block:opacity-100 transition-opacity"
                title="Remove Block"
              >✕</button>
              {block.type === 'heading' || block.type === 'text' ? (
                <textarea
                  value={block.content || ''}
                  onChange={(e) => { const nb = [...slide.blocks!]; nb[i] = { ...nb[i], content: e.target.value }; handleChange('blocks', nb); }}
                  className={`w-full bg-transparent focus:outline-none border-none resize-none text-center ${block.type === 'heading' ? 'text-5xl font-black font-heading' : 'text-2xl font-medium leading-relaxed'}`}
                  style={T.text}
                  placeholder={`Enter ${block.type}...`}
                  rows={block.type === 'heading' ? 1 : 3}
                />
              ) : block.type === 'image' ? (
                <div className="w-full cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  const url = window.prompt('Image URL (e.g. https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800):');
                  if (url) {
                    const newBlocks = [...slide.blocks!];
                    newBlocks[i] = { ...newBlocks[i], imageUrl: url };
                    handleChange('blocks', newBlocks);
                  }
                }}>
                  <ImagePanel imageUrl={block.imageUrl} onSet={(u) => { const nb = [...slide.blocks!]; nb[i] = { ...nb[i], imageUrl: u }; handleChange('blocks', nb); }} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── CHART ─────────────────────────────────────────────────────────────────
  if (slide.type === 'chart') {
    const chartType = slide.chartType || 'bar';
    const isHorizontal = chartType === 'horizontalBar';

    const getThemePrimary = () => {
      if (typeof document !== 'undefined') {
        const el = document.querySelector('[data-theme]');
        if (el) return getComputedStyle(el).getPropertyValue('--theme-primary').trim() || '#22d3ee';
      }
      return '#22d3ee';
    };
    const C = [getThemePrimary(), '#f59e0b', '#10b981', '#6366f1', '#f43f5e', '#84cc16'];

    const TOOLTIP_STYLE = { borderRadius: '8px', border: 'none', background: 'var(--theme-card)', color: 'var(--theme-text)' };
    const TICK = { fontSize: 12, fill: 'var(--theme-muted, #94a3b8)' };
    const GRID = 'rgba(255,255,255,0.06)';

    const renderChart = () => {
      const data = slide.data || [];
      if (!data.length) return <div className="text-center" style={T.muted}>No data available</div>;

      if (chartType === 'pie' || chartType === 'donut') {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%"
                innerRadius={chartType === 'donut' ? '52%' : '0%'} outerRadius="72%"
                label={({ name, percent }) => `${name} ${(percent ? (percent * 100).toFixed(0) : 0)}%`} labelLine>
                {data.map((_, idx) => <Cell key={idx} fill={C[idx % C.length]} />)}
              </Pie>
              <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
            </RePieChart>
          </ResponsiveContainer>
        );
      }
      if (chartType === 'line') {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={TICK} dy={8} />
              <YAxis axisLine={false} tickLine={false} tick={TICK} dx={-8} />
              <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="value" stroke={C[0]} strokeWidth={4} dot={{ r: 6, fill: C[0], strokeWidth: 0 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      }
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ReBarChart data={data} layout={isHorizontal ? 'vertical' : 'horizontal'} margin={{ top: 10, right: 20, left: isHorizontal ? 60 : 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={!isHorizontal} vertical={isHorizontal} stroke={GRID} />
            <XAxis type={isHorizontal ? 'number' : 'category'} dataKey={isHorizontal ? undefined : 'label'} axisLine={false} tickLine={false} tick={TICK} dy={8} />
            <YAxis type={isHorizontal ? 'category' : 'number'} dataKey={isHorizontal ? 'label' : undefined} axisLine={false} tickLine={false} tick={TICK} dx={-8} />
            <RechartsTooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="value" radius={isHorizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]}>
              {data.map((_, idx) => <Cell key={idx} fill={C[idx % C.length]} />)}
            </Bar>
          </ReBarChart>
        </ResponsiveContainer>
      );
    };

    const hasImage = !!slide.imageUrl;

    return (
      <div className={`w-full h-full flex ${hasImage ? 'flex-row' : 'flex-col'} px-14 py-8 overflow-hidden`}>
        {hasImage ? (
          // Split layout: chart left, image right
          <>
            <div className="flex-1 flex flex-col overflow-hidden">
              {renderEyebrow()}
              <textarea
                value={slide.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="text-3xl font-black mb-1 font-heading shrink-0 bg-transparent border-none focus:outline-none resize-none overflow-hidden w-full"
                style={{ ...T.text, minHeight: '1.2em' }}
                rows={Math.max(1, Math.ceil((slide.title || '').length / 35))}
              />
              {slide.content !== undefined && (
                <textarea
                  value={slide.content || ''}
                  onChange={(e) => handleChange('content', e.target.value)}
                  className="text-sm mb-2 shrink-0 bg-transparent border-none focus:outline-none resize-none overflow-hidden w-full"
                  style={{ ...T.muted, minHeight: '1.5em' }}
                  rows={Math.max(1, Math.ceil((slide.content || '').length / 60))}
                />
              )}
              <div className="flex flex-col gap-1 mb-2">
                <ChartTypeSelector current={chartType} onChange={(t) => handleChange('chartType', t)} />
                <div className="flex flex-wrap gap-2">
                  {(slide.data || []).map((d, i) => (
                    <div key={i} className="flex gap-1 border border-slate-700/30 rounded p-1" style={{ background: 'color-mix(in srgb, var(--theme-card) 50%, transparent)' }}>
                      <input value={d.label} onChange={e => handleArrayChange('data', i, { ...d, label: e.target.value })} className="w-16 bg-transparent text-[10px] focus:outline-none font-bold" style={T.text} />
                      <input value={d.value} onChange={e => handleArrayChange('data', i, { ...d, value: Number(e.target.value) })} type="number" className="w-12 bg-transparent text-[10px] focus:outline-none" style={T.muted} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 min-h-0">{renderChart()}</div>
            </div>
            <div className="w-[35%] pl-6 flex flex-col justify-center shrink-0">
              <ImagePanel imageUrl={slide.imageUrl} onSet={(u) => handleChange('imageUrl', u)} compact />
            </div>
          </>
        ) : (
          // Full-width chart
          <>
            {renderEyebrow()}
            <textarea
              value={slide.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              className="text-4xl font-black mb-1 font-heading shrink-0 bg-transparent border-none focus:outline-none resize-none overflow-hidden w-full"
              style={{ ...T.text, minHeight: '1.2em' }}
              rows={Math.max(1, Math.ceil((slide.title || '').length / 45))}
            />
            {slide.content !== undefined && (
              <textarea
                value={slide.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                className="text-sm mb-2 shrink-0 bg-transparent border-none focus:outline-none resize-none overflow-hidden w-full"
                style={{ ...T.muted, minHeight: '1.5em' }}
                rows={Math.max(1, Math.ceil((slide.content || '').length / 80))}
              />
            )}
            <div className="flex flex-col gap-1 mb-2">
              <ChartTypeSelector current={chartType} onChange={(t) => handleChange('chartType', t)} />
              <div className="flex flex-wrap gap-2">
                {(slide.data || []).map((d, i) => (
                  <div key={i} className="flex gap-1 border border-slate-700/30 rounded p-1" style={{ background: 'color-mix(in srgb, var(--theme-card) 50%, transparent)' }}>
                    <input value={d.label} onChange={e => handleArrayChange('data', i, { ...d, label: e.target.value })} className="w-16 bg-transparent text-[10px] focus:outline-none font-bold" style={T.text} />
                    <input value={d.value} onChange={e => handleArrayChange('data', i, { ...d, value: Number(e.target.value) })} type="number" className="w-12 bg-transparent text-[10px] focus:outline-none" style={T.muted} />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 min-h-0">{renderChart()}</div>
            {renderFloatingImageButton((u) => handleChange('imageUrl', u))}
          </>
        )}
      </div>
    );
  }

  return <div style={T.text}>Unknown Slide Type</div>;
}
