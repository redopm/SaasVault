import { TrendingUp } from 'lucide-react';

export default function TractionSlide({ 
  metrics,
  onUpdate
}: { 
  metrics?: {label: string, value: string}[],
  onUpdate?: (index: number, field: 'label' | 'value', value: string) => void
}) {
  const defaultMetrics = [
    { label: "ARR", value: "$1M" },
    { label: "GROWTH", value: "20% MoM" }
  ];
  
  const displayMetrics = metrics && metrics.length > 0 ? metrics : defaultMetrics;

  const handleBlur = (index: number, field: 'label' | 'value') => (e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate) {
      onUpdate(index, field, e.currentTarget.innerText);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-background p-12 relative overflow-hidden">
      <div className="z-10 w-full max-w-[1600px] flex flex-col items-center justify-center h-full px-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--theme-text,#ffffff)] mb-16 md:mb-24 tracking-tight text-center">
          Traction & Growth
        </h2>
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full justify-center items-stretch">
          {displayMetrics.map((metric, i) => (
            <div key={i} className="bg-[var(--theme-card,#1e293b)] flex-1 min-w-[280px] md:min-w-[400px] max-w-[600px] flex flex-col justify-center p-8 md:p-16 text-center border-t-4 border-t-[var(--theme-primary,#34d399)] relative overflow-hidden rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-[var(--theme-primary,#34d399)] opacity-10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div 
                contentEditable={!!onUpdate}
                suppressContentEditableWarning
                onBlur={handleBlur(i, 'value')}
                className="text-6xl md:text-8xl lg:text-[130px] font-black bg-gradient-to-br from-[var(--theme-primary,#34d399)] to-cyan-400 bg-clip-text text-transparent mb-4 outline-none focus:ring-2 focus:ring-primary/30 rounded-lg p-1 break-words whitespace-normal w-full overflow-hidden"
              >
                {metric.value}
              </div>
              
              <div 
                contentEditable={!!onUpdate}
                suppressContentEditableWarning
                onBlur={handleBlur(i, 'label')}
                className="text-xl md:text-2xl lg:text-3xl font-bold text-[var(--theme-text,#ffffff)] tracking-[0.1em] md:tracking-[0.2em] uppercase outline-none focus:ring-2 focus:ring-primary/30 rounded-lg p-1 break-words whitespace-normal w-full overflow-hidden"
              >
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
