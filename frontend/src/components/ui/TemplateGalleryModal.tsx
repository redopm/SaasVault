import { useState } from 'react';
import { X, Play, Sparkles } from 'lucide-react';
import { TEMPLATES } from '../../templates';
import type { Template } from '../../templates';

interface TemplateGalleryModalProps {
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

const CATEGORIES = ['All', 'B2B SaaS', 'D2C / E-commerce', 'AI & DeepTech', 'Fintech', 'Agencies'];

export default function TemplateGalleryModal({ onClose, onSelectTemplate }: TemplateGalleryModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredTemplates = TEMPLATES.filter(
    (t) => activeCategory === 'All' || t.category === activeCategory
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-6xl h-full max-h-[88vh] bg-slate-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200/50">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="text-amber-500" size={22} />
              Premium Templates
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-1">
              50 industry-standard decks — pick one and customize in seconds.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-8 py-4 bg-white border-b border-slate-100 flex gap-2 overflow-x-auto shrink-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col hover:-translate-y-1 duration-200"
              >
                {/* Thumbnail */}
                <div className="w-full aspect-[16/9] bg-slate-100 relative overflow-hidden">
                  <img
                    src={template.thumbnailUrl}
                    alt={template.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="px-4 py-2 bg-white text-slate-900 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-200">
                      <Play size={14} className="text-violet-600" />
                      Use Template
                    </div>
                  </div>

                  {/* Slide count indicator — replaces old FREE badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest rounded-lg">
                    {template.slides?.length || 11} Slides
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 flex flex-col gap-1.5">
                  <h3 className="font-black text-slate-900 text-sm truncate">{template.title}</h3>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{template.category}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <Sparkles size={32} className="mb-3 opacity-40" />
              <p className="font-bold">No templates in this category yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
