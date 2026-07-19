import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OceanWave from '../components/ui/OceanWave';
import { FileText, ListChecks } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Onboarding() {
  const navigate = useNavigate();
  const [animatingCard, setAnimatingCard] = useState<string | null>(null);

  const handleSelect = (mode: string) => {
    setAnimatingCard(mode);
    // Wait for the full 1.5s water drop animation to finish, then navigate
    setTimeout(() => {
      navigate(`/generator?mode=${mode}`);
    }, 1500);
  };

  const isAnimating = animatingCard !== null;

  return (
    <div className="min-h-screen flex items-center justify-center ocean-aurora-bg text-text font-sans relative overflow-hidden">
      <Helmet>
        <title>Onboarding | PitchKing</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      {/* Decorative Liquid Waves */}
      <div className={`transition-opacity duration-700 absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-primary/30 to-secondary/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-[morph_8s_ease-in-out_infinite] blur-3xl pointer-events-none ${isAnimating ? 'opacity-0' : 'opacity-100'}`}></div>
      
      <div className={`transition-opacity duration-700 absolute bottom-[-20%] left-[-10%] w-[800px] h-[700px] bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-[morph_12s_ease-in-out_infinite_reverse] blur-3xl pointer-events-none ${isAnimating ? 'opacity-0' : 'opacity-100'}`}></div>

      <div className="text-center relative z-10 px-4 w-full max-w-4xl pb-16">
        {/* Header Section */}
        <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-800 drop-shadow-sm">
            Initialize Your Deck
          </h1>
          <p className="text-base text-slate-600 mb-12 max-w-xl mx-auto font-medium">
            Choose how you want to provide your core data. Our AI will structure and polish it into an investor-ready format.
          </p>
        </div>
        
        {/* Cards Section */}
        <div className="grid md:grid-cols-2 gap-8 text-left relative z-20">
          
          {/* Option 1: Brain Dump */}
          <div className="relative flex justify-center">
            <button 
              onClick={() => handleSelect('dump')}
              disabled={isAnimating}
              className={`w-full max-w-sm group bg-white/70 backdrop-blur-xl border-2 border-teal-100/50 p-8 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,198,255,0.15)] transition-all duration-300 transform hover:-translate-y-2 text-left flex flex-col ${animatingCard === 'dump' ? 'animate-water-drop z-50 absolute w-full' : (isAnimating ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 relative')}`}
            >
              {/* Droplets that break off during animation */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full opacity-0 drop-1 pointer-events-none"></div>
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-secondary rounded-full opacity-0 drop-2 pointer-events-none"></div>
              <div className="absolute top-1/3 right-1/4 w-5 h-5 bg-primary rounded-full opacity-0 drop-3 pointer-events-none"></div>

              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary to-secondary opacity-0 group-hover:opacity-100 transition-all duration-300 inner-content"></div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mb-5 text-primary group-hover:scale-110 transition-transform inner-content">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 tracking-tight inner-content">Raw Brain Dump</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium inner-content">
                Paste your rough notes, website copy, or messy thoughts. The AI will extract the core elements and map them perfectly to the standard pitch structure.
              </p>
            </button>
          </div>

          {/* Option 2: Guided Flow */}
          <div className="relative flex justify-center">
            <button 
              onClick={() => handleSelect('guided')}
              disabled={isAnimating}
              className={`w-full max-w-sm group bg-white/70 backdrop-blur-xl border-2 border-teal-100/50 p-8 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,114,255,0.15)] transition-all duration-300 transform hover:-translate-y-2 text-left flex flex-col ${animatingCard === 'guided' ? 'animate-water-drop z-50 absolute w-full' : (isAnimating ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 relative')}`}
            >
              {/* Droplets that break off during animation */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-secondary rounded-full opacity-0 drop-1 pointer-events-none"></div>
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary rounded-full opacity-0 drop-2 pointer-events-none"></div>
              <div className="absolute top-1/3 right-1/4 w-5 h-5 bg-secondary rounded-full opacity-0 drop-3 pointer-events-none"></div>

              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-secondary to-primary opacity-0 group-hover:opacity-100 transition-all duration-300 inner-content"></div>
              <div className="w-12 h-12 bg-gradient-to-br from-secondary/10 to-secondary/20 rounded-2xl flex items-center justify-center mb-5 text-secondary group-hover:scale-110 transition-transform inner-content">
                <ListChecks size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 tracking-tight inner-content">Guided Questionnaire</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium inner-content">
                Go through a focused, step-by-step interview. Answer simple questions about your product, and the AI will craft compelling, investor-grade slides.
              </p>
            </button>
          </div>

        </div>
      </div>

      <OceanWave />
    </div>
  );
}
