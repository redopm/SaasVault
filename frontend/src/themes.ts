export const THEMES: Record<string, {
  id: string;
  name: string;
  description: string;
  colors: { primary: string; secondary: string; background: string; text: string; card: string; muted: string; };
  thumbnailBg: string;
}> = {
  aurora: {
    id: 'aurora',
    name: 'Ocean Aurora',
    description: 'Vibrant oceanic gradients — modern & bold',
    colors: { primary: '#22d3ee', secondary: '#38bdf8', background: '#0f172a', text: '#f0f9ff', card: 'rgba(30,41,59,0.9)', muted: '#94a3b8' },
    thumbnailBg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  },
  midnight_vc: {
    id: 'midnight_vc',
    name: 'Midnight VC',
    description: 'Electric violet on ultra-dark — Silicon Valley elite',
    colors: { primary: '#a78bfa', secondary: '#7c3aed', background: '#09090b', text: '#fafafa', card: 'rgba(39,39,42,0.95)', muted: '#a1a1aa' },
    thumbnailBg: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
  },
  silicon_sage: {
    id: 'silicon_sage',
    name: 'Silicon Sage',
    description: 'Clean grey + emerald — YC-style clarity',
    colors: { primary: '#10b981', secondary: '#059669', background: '#f9fafb', text: '#111827', card: '#ffffff', muted: '#6b7280' },
    thumbnailBg: 'linear-gradient(135deg, #f9fafb 0%, #ecfdf5 100%)',
  },
  obsidian_gold: {
    id: 'obsidian_gold',
    name: 'Obsidian Gold',
    description: 'Luxury black with amber gold — premium & serious',
    colors: { primary: '#f59e0b', secondary: '#d97706', background: '#0c0a09', text: '#fef3c7', card: 'rgba(28,25,23,0.95)', muted: '#a8a29e' },
    thumbnailBg: 'linear-gradient(135deg, #0c0a09 0%, #1c1917 100%)',
  },
  arctic_light: {
    id: 'arctic_light',
    name: 'Arctic Light',
    description: 'Pure white with icy blue — clean & trustworthy',
    colors: { primary: '#3b82f6', secondary: '#2563eb', background: '#ffffff', text: '#1e293b', card: '#f8fafc', muted: '#64748b' },
    thumbnailBg: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
  },
  rose_quartz: {
    id: 'rose_quartz',
    name: 'Rose Quartz',
    description: 'Warm cream with rose gold — elegant & memorable',
    colors: { primary: '#f43f5e', secondary: '#e11d48', background: '#fff1f2', text: '#1c1917', card: '#ffffff', muted: '#9f1239' },
    thumbnailBg: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
  },
  deep_ocean: {
    id: 'deep_ocean',
    name: 'Deep Ocean',
    description: 'Midnight blue with cyan — deep tech & trustworthy',
    colors: { primary: '#06b6d4', secondary: '#0891b2', background: '#0c1428', text: '#e2e8f0', card: 'rgba(15,28,60,0.9)', muted: '#94a3b8' },
    thumbnailBg: 'linear-gradient(135deg, #0c1428 0%, #0f1c3f 100%)',
  },
  forest_venture: {
    id: 'forest_venture',
    name: 'Forest Venture',
    description: 'Deep forest green with lime — growth & sustainability',
    colors: { primary: '#84cc16', secondary: '#65a30d', background: '#0a1a0e', text: '#f0fdf4', card: 'rgba(20,45,20,0.9)', muted: '#86efac' },
    thumbnailBg: 'linear-gradient(135deg, #0a1a0e 0%, #14532d 100%)',
  },
  crimson_empire: {
    id: 'crimson_empire',
    name: 'Crimson Empire',
    description: 'Deep burgundy with crimson — bold & commanding',
    colors: { primary: '#ef4444', secondary: '#dc2626', background: '#1a0505', text: '#fef2f2', card: 'rgba(45,10,10,0.95)', muted: '#fca5a5' },
    thumbnailBg: 'linear-gradient(135deg, #1a0505 0%, #450a0a 100%)',
  },
  corporate_slate: {
    id: 'corporate_slate',
    name: 'Corporate Slate',
    description: 'Dark slate with sapphire blue — institutional & credible',
    colors: { primary: '#6366f1', secondary: '#4f46e5', background: '#0f172a', text: '#e2e8f0', card: 'rgba(30,41,59,0.95)', muted: '#94a3b8' },
    thumbnailBg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  },
};

