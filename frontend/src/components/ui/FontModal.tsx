import { X } from 'lucide-react';
import React from 'react';

const FONTS = [
  { id: 'font-inter', name: 'Inter', type: 'Modern & Clean' },
  { id: 'font-space', name: 'Space Grotesk', type: 'Tech & Bold' },
  { id: 'font-playfair', name: 'Playfair Display', type: 'Elegant & Classic' },
  { id: 'font-outfit', name: 'Outfit', type: 'Geometric & Friendly' },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedFont: string;
  onSelect: (font: string) => void;
}

export default function FontModal({ isOpen, onClose, selectedFont, onSelect }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Typography Settings</h2>
            <p className="text-slate-500 mt-1">Select the global font family for your presentation.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {FONTS.map(font => (
            <div 
              key={font.id}
              onClick={() => onSelect(font.id)}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${selectedFont === font.id ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{font.name}</h3>
                  <p className="text-sm text-slate-500">{font.type}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedFont === font.id ? 'border-primary' : 'border-slate-300'}`}>
                  {selectedFont === font.id && <div className="w-3 h-3 rounded-full bg-primary" />}
                </div>
              </div>
              
              {/* Preview Box */}
              <div className={`mt-4 p-4 rounded-xl bg-white border border-slate-200 ${font.id}`}>
                <h4 className="text-2xl font-bold mb-2 text-slate-800">Ag</h4>
                <p className="text-sm text-slate-600">The quick brown fox jumps over the lazy dog.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
