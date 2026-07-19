import { CheckCircle2 } from 'lucide-react';

export default function SolutionSlide({ 
  description, 
  features,
  onUpdate
}: { 
  description?: string, 
  features?: string[],
  onUpdate?: (field: string, value: string, index?: number) => void
}) {
  const handleBlur = (field: string, index?: number) => (e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate) {
      onUpdate(field, e.currentTarget.innerText, index);
    }
  };

  const currentFeatures = features || ["One-click generation", "100% accurate extraction", "Seamless integration"];

  return (
    <div className="w-full h-full flex flex-col justify-center bg-background text-text p-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-4xl w-full mx-auto z-10">
        <h2 className="text-xl font-bold text-primary tracking-widest uppercase mb-4">The Solution</h2>
        
        <p 
          contentEditable={!!onUpdate}
          suppressContentEditableWarning
          onBlur={handleBlur('description')}
          className="text-4xl font-extrabold text-slate-800 leading-tight mb-12 outline-none focus:ring-2 focus:ring-primary/30 rounded-lg p-2 -ml-2"
        >
          {description || "Our AI-powered platform automates your entire workflow in seconds."}
        </p>
        
        <div className="grid grid-cols-2 gap-6">
          {currentFeatures.map((feature, i) => (
            <div key={i} className="flex items-center gap-4 bg-white/50 p-6 rounded-2xl border border-teal-50 shadow-sm">
              <CheckCircle2 className="text-success flex-shrink-0" size={32} />
              <span 
                contentEditable={!!onUpdate}
                suppressContentEditableWarning
                onBlur={handleBlur('features', i)}
                className="text-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/30 rounded-lg p-1 w-full"
              >
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
