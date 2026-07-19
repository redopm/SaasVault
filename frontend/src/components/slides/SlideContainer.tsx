import React from 'react';

export default function SlideContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-5xl aspect-video bg-surface rounded-xl shadow-2xl overflow-hidden relative border border-[#222]">
      {children}
    </div>
  );
}
