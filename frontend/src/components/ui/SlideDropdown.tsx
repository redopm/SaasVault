import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function SlideDropdown({ 
  currentSlide, 
  setCurrentSlide,
  slidesArray = []
}: { 
  currentSlide: number, 
  setCurrentSlide: (idx: number) => void,
  slidesArray?: string[]
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const defaultSlides = [
    "Slide 1: Title",
    "Slide 2: Problem",
    "Slide 3: Solution",
    "Slide 4: Market",
    "Slide 5: Traction"
  ];
  
  const slides = slidesArray.length > 0 ? slidesArray : defaultSlides;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-w-[180px] bg-white/80 backdrop-blur-md border-2 border-teal-100 text-slate-700 font-bold px-5 rounded-xl shadow-sm hover:shadow-md hover:border-primary transition-all focus:outline-none h-[44px]"
      >
        <span>{slides[currentSlide] || `Slide ${currentSlide + 1}`}</span>
        <ChevronDown size={18} className={`text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
            className="absolute top-full left-0 mt-2 w-full bg-white/95 backdrop-blur-xl border border-teal-100 rounded-xl shadow-[0_20px_50px_rgba(0,198,255,0.2)] overflow-hidden"
          >
            {slides.map((slide, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ 
                  delay: idx * 0.08, // This creates the stair-like cascading effect
                  type: "spring",
                  stiffness: 300,
                  damping: 24
                }} 
                onClick={() => {
                  setCurrentSlide(idx);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-5 py-3.5 text-sm font-bold transition-colors border-b border-slate-50 last:border-b-0 ${currentSlide === idx ? 'bg-gradient-to-r from-primary/10 to-transparent text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-primary'}`}
              >
                {slide}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
