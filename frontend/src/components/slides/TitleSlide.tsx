import { ShieldCheck } from 'lucide-react';

export default function TitleSlide({ 
  companyName, 
  tagline,
  onUpdate
}: { 
  companyName?: string, 
  tagline?: string,
  onUpdate?: (field: string, value: string) => void
}) {
  const handleBlur = (field: string) => (e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate) {
      onUpdate(field, e.currentTarget.innerText);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center bg-white text-slate-900 p-16 text-left absolute inset-0 relative overflow-hidden">
      {/* Decorative Aurora orbs matching the image vibe */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10">
        <h1 
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={handleBlur('companyName')}
          className="text-[5.5rem] leading-none font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary drop-shadow-sm outline-none focus:ring-2 focus:ring-primary/30 rounded-lg p-2 -ml-2"
        >
          {companyName || "PitchKing"}
        </h1>
        <p 
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={handleBlur('tagline')}
          className="text-3xl font-medium max-w-3xl mb-16 text-slate-600 leading-snug outline-none focus:ring-2 focus:ring-primary/30 rounded-lg p-2 -ml-2"
        >
          {tagline || "The future of enterprise workflow automation"}
        </p>
        
        <div className="mt-auto">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-teal-100 bg-gradient-to-r from-white to-teal-50 shadow-sm">
            <ShieldCheck size={22} className="text-success" />
            <span className="text-sm font-bold tracking-widest uppercase text-slate-700">Enterprise Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
