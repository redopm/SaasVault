import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Rocket, CheckCircle2, Star, Zap } from 'lucide-react';
import OceanWave from '../components/ui/OceanWave';

const ProductHuntLaunch: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-x-hidden">
      <Helmet>
        <title>PitchKing x Product Hunt | Get an investor-ready deck in 5 minutes</title>
        <meta name="description" content="Welcome Product Hunt Makers! Get an investor-ready deck in 5 minutes. Claim your 1 Free Deck (25 Vault Credits) today." />
      </Helmet>
      
      {/* Product Hunt Welcome Banner */}
      <div className="w-full py-3 px-4 text-center z-50 relative flex items-center justify-center gap-2" style={{ backgroundColor: '#DA552F', color: '#fff' }}>
        <span className="text-xl">👋</span>
        <p className="font-bold text-sm tracking-wide">
          Welcome Product Hunt Makers! We're giving you <span className="underline decoration-white/50 underline-offset-2">1 Free Pitch Deck</span> on signup today.
        </p>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex flex-col items-center justify-center pt-16 pb-32">
        {/* Decorative Liquid Waves/Blobs for Light Theme */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-[#DA552F]/10 to-orange-400/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-[morph_8s_ease-in-out_infinite] blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[700px] bg-gradient-to-tr from-orange-300/10 to-[#DA552F]/10 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-[morph_12s_ease-in-out_infinite_reverse] blur-3xl pointer-events-none"></div>

        {/* Floating 3D Orbs */}
        <div className="absolute top-[20%] left-[15%] w-12 h-12 rounded-full bg-gradient-to-br from-white to-[#DA552F]/30 shadow-[0_10px_20px_rgba(218,85,47,0.15)] backdrop-blur-md animate-bounce pointer-events-none" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-[30%] right-[20%] w-8 h-8 rounded-full bg-gradient-to-br from-white to-amber-500/30 shadow-[0_10px_20px_rgba(245,158,11,0.15)] backdrop-blur-md animate-bounce pointer-events-none" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
        
        {/* Main Content Area */}
        <div className="text-center relative z-10 px-4 mt-12 max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-5 py-2 rounded-full bg-white/80 backdrop-blur-xl border border-[#DA552F]/20 shadow-sm text-sm font-bold uppercase tracking-wider" style={{ color: '#DA552F' }}>
            <Rocket size={16} className="inline mr-2 -mt-1" />
            #1 Product of the Day
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold mb-8 tracking-tight text-slate-800 drop-shadow-sm leading-tight">
            Get an <span style={{ color: '#DA552F' }}>investor-ready</span> deck in 5 minutes.
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Stop wasting weeks on design and copy. Input your idea, and our AI writes your pitch like a top-tier VC and designs it like an agency.
          </p>
          
          {/* Offer Highlight Box */}
          <div className="bg-white/80 backdrop-blur-md border-2 border-[#DA552F]/20 rounded-2xl p-6 mb-10 max-w-lg mx-auto shadow-xl shadow-[#DA552F]/5 transform hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Zap className="text-amber-500" size={24} fill="currentColor" />
              <h3 className="text-xl font-bold text-slate-800">Special Launch Offer</h3>
            </div>
            <p className="text-slate-600 font-medium mb-4">Create your account today and instantly receive:</p>
            <div className="flex items-center justify-center gap-2 text-lg font-bold" style={{ color: '#DA552F' }}>
              <Star size={20} fill="currentColor" />
              1 Free Deck (25 Vault Credits)
            </div>
            <p className="text-xs text-slate-400 mt-3 font-medium uppercase tracking-wide">No credit card required for preview</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link to="/onboarding" className="inline-flex items-center justify-center px-10 py-5 font-bold text-white rounded-2xl shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-xl" style={{ backgroundColor: '#DA552F', boxShadow: '0 10px 25px rgba(218,85,47,0.3)' }}>
              Claim My Free Deck
            </Link>
          </div>
          
          <a href="#faq" className="text-slate-400 flex flex-col items-center hover:text-[#DA552F] transition-colors">
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <span className="text-sm font-bold uppercase tracking-widest mb-2">Read FAQs</span>
              <ChevronDown size={24} />
            </motion.div>
          </a>
        </div>

      </div>

      {/* FAQ Section (Matching light theme from App.tsx) */}
      <div id="faq" className="relative z-20 py-24 px-4 border-t border-slate-200 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-500 font-medium">Everything you need to know about PitchKing.</p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <CheckCircle2 className="text-[#DA552F]" size={20} />
                How does the free offer work?
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">When you sign up using Google or Email, your account is instantly loaded with 25 Vault Credits. Generating one complete, unwatermarked PDF pitch deck costs exactly 25 credits. This means your first deck is 100% free.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <CheckCircle2 className="text-[#DA552F]" size={20} />
                What does the AI Copy-Polish actually do?
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">Most founders write technically accurate but poorly marketed copy. Our proprietary AI engine rewrites your raw text to sound like it was written by a top-tier venture capitalist. It makes your problem sound urgent, your solution sound inevitable, and your traction look massive.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <CheckCircle2 className="text-[#DA552F]" size={20} />
                Is my startup's data secure?
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">Yes. You retain 100% intellectual property (IP) ownership of your deck. We do not use your startup's pitch deck data to train our public AI models. Your ideas remain strictly confidential.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="relative z-20 py-12 bg-white border-t border-slate-200 text-center">
        <div className="flex justify-center gap-6 mb-4">
          <Link to="/terms" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Privacy Policy</Link>
          <Link to="/refund" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Refund Policy</Link>
        </div>
        <p className="text-slate-400 font-medium text-sm mb-2">© 2026 Ikkish SaaS. Built for founders.</p>
        <p className="text-slate-400/80 text-xs">Plot no. 1502 ward no 12, Gautam Nagar, Chandauli, UTTAR PRADESH 232104, IN</p>
      </footer>
    </div>
  );
};

export default ProductHuntLaunch;
