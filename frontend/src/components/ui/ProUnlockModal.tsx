import React, { useState } from 'react';
import { X, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { THEMES } from '../../themes';

interface ProUnlockModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProUnlockModal({ onClose, onSuccess }: ProUnlockModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate a payment delay
    setTimeout(() => {
      localStorage.setItem('pitchking_pro', 'true');
      setIsProcessing(false);
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header Graphic */}
        <div className="w-full h-40 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 relative flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
          >
            <X size={18} />
          </button>
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/40 mb-3 shadow-lg">
            <Lock size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-black font-heading tracking-tight drop-shadow-md">Unlock Pro Templates</h2>
        </div>

        {/* Content */}
        <div className="p-8 pb-10 flex flex-col items-center text-center">
          <p className="text-slate-600 font-medium mb-6">
            Get instant access to <strong className="text-slate-900 font-bold">45+ Premium Pitch Decks</strong> designed by VC experts. Perfect for SaaS, E-commerce, DeepTech, and more.
          </p>

          <div className="flex flex-col gap-3 w-full mb-8 text-left text-sm font-medium text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>45+ Industry-Specific Master Templates</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>10 Premium Cinematic Themes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>Unlimited Exports (PDF & PPTX)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>One-time payment, lifetime access</span>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="flex items-end justify-center gap-2 mb-6">
            <span className="text-5xl font-black font-heading text-slate-900 tracking-tighter">$29</span>
            <span className="text-slate-400 font-bold pb-1 uppercase tracking-wider text-xs">/ lifetime</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl font-black text-lg text-white shadow-[0_10px_30px_rgba(245,158,11,0.4)] hover:shadow-[0_10px_40px_rgba(245,158,11,0.6)] hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0 disabled:active:scale-100 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #ea580c)' }}
          >
            {isProcessing ? (
              <span className="animate-pulse">Processing Payment...</span>
            ) : (
              <>
                <Sparkles size={20} />
                Upgrade to Pro
              </>
            )}
          </button>
          
          <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-4 font-bold">Secured by Stripe</p>
        </div>
      </div>
    </div>
  );
}
