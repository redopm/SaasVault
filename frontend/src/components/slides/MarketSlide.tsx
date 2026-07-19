export default function MarketSlide({ 
  tam, 
  sam, 
  som,
  onUpdate 
}: { 
  tam?: string, 
  sam?: string, 
  som?: string,
  onUpdate?: (field: string, value: string) => void
}) {
  const handleBlur = (field: string) => (e: React.FocusEvent<HTMLElement>) => {
    if (onUpdate) {
      onUpdate(field, e.currentTarget.innerText);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-background p-12 relative overflow-hidden">
      <div className="z-10 w-full max-w-[1600px] px-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--theme-text,#ffffff)] mb-12 tracking-tight text-center md:text-left">
          Market Size
        </h2>
        
        <div className="flex flex-col md:flex-row gap-16 items-center justify-between">
          {/* Text Metrics - Left Side */}
          <div className="flex flex-col gap-6 w-full md:w-[45%]">
            <div className="bg-[var(--theme-card,#1e293b)] p-6 md:p-8 rounded-3xl border-l-8 border-l-cyan-400 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
              <div 
                contentEditable={!!onUpdate}
                suppressContentEditableWarning
                onBlur={handleBlur('tam')}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--theme-text,#ffffff)] outline-none focus:ring-2 focus:ring-primary/30 rounded-lg break-words whitespace-normal w-full overflow-hidden"
              >
                {tam || "$10B"}
              </div>
              <div className="text-cyan-400 font-bold uppercase tracking-wider text-sm mt-2">
                Total Addressable Market (TAM)
              </div>
            </div>
            
            <div className="bg-[var(--theme-card,#1e293b)] p-6 md:p-8 rounded-3xl border-l-8 border-l-blue-500 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
              <div 
                contentEditable={!!onUpdate}
                suppressContentEditableWarning
                onBlur={handleBlur('sam')}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--theme-text,#ffffff)] outline-none focus:ring-2 focus:ring-primary/30 rounded-lg break-words whitespace-normal w-full overflow-hidden"
              >
                {sam || "$1B"}
              </div>
              <div className="text-blue-500 font-bold uppercase tracking-wider text-sm mt-2">
                Serviceable Addressable Market (SAM)
              </div>
            </div>
            
            <div className="bg-[var(--theme-card,#1e293b)] p-6 md:p-8 rounded-3xl border-l-8 border-l-purple-500 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
              <div 
                contentEditable={!!onUpdate}
                suppressContentEditableWarning
                onBlur={handleBlur('som')}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-[var(--theme-text,#ffffff)] outline-none focus:ring-2 focus:ring-primary/30 rounded-lg break-words whitespace-normal w-full overflow-hidden"
              >
                {som || "$50M"}
              </div>
              <div className="text-purple-500 font-bold uppercase tracking-wider text-sm mt-2">
                Serviceable Obtainable Market (SOM)
              </div>
            </div>
          </div>
          
          {/* CSS Nested Circles - Right Side */}
          <div className="w-full md:w-[50%] h-[400px] md:h-[600px] lg:h-[700px] relative flex justify-center items-center scale-75 md:scale-90 lg:scale-100 origin-center">
            {/* TAM */}
            <div className="absolute flex flex-col items-center justify-start pt-12 rounded-full border-4 border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_60px_rgba(34,211,238,0.2)]" style={{ width: '650px', height: '650px', top: '25px' }}>
              <span className="text-cyan-400 font-bold text-3xl">TAM</span>
            </div>
            {/* SAM */}
            <div className="absolute flex flex-col items-center justify-start pt-10 rounded-full border-4 border-blue-500/60 bg-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.3)]" style={{ width: '450px', height: '450px', bottom: '25px' }}>
              <span className="text-blue-400 font-bold text-2xl">SAM</span>
            </div>
            {/* SOM */}
            <div className="absolute flex flex-col items-center justify-center rounded-full border-4 border-purple-500/80 bg-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.4)]" style={{ width: '250px', height: '250px', bottom: '25px' }}>
              <span className="text-white font-bold text-xl">SOM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
