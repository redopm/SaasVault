import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import SaaSVault from './pages/tool/saas-vault';
import Generator from './pages/Generator';
import PrintView from './pages/PrintView';
import Onboarding from './pages/Onboarding';
import OceanWave from './components/ui/OceanWave';
import VaultHome from './pages/VaultHome';
import MarketHome from './pages/market/MarketHome';
import ProductDetail from './pages/market/ProductDetail';
import PromptVault from './pages/tool/PromptVault';
import UserProfile from './pages/UserProfile';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import Refund from './pages/legal/Refund';
import TechArchKit from './pages/tool/TechArchKit';
import { usePageTracking } from './hooks/usePageTracking';
import ProductHuntLaunch from './pages/ProductHuntLaunch';
import PurchaseSuccess from './pages/PurchaseSuccess';

import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

function PitchKingHome() {
  return (
    <div className="min-h-screen ocean-aurora-bg text-text font-sans relative overflow-x-hidden">
      <Helmet>
        <title>PitchKing | AI Pitch Deck Generator for Startups</title>
        <meta name="description" content="Generate a highly-polished, YC-style pitch deck for your SaaS startup in 5 minutes using AI. Export to high-res PDF and PPTX instantly." />
        <meta name="keywords" content="AI Pitch Deck, Startup Pitch Deck, Pitch Deck Generator, YC Pitch Deck, SaaS Pitch Deck Maker, Investor Presentation" />
        <link rel="canonical" href="https://tools.ikkish.in/pitchking" />
      </Helmet>
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32">
        {/* Decorative Liquid Waves/Blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-gradient-to-br from-primary/30 to-secondary/10 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-[morph_8s_ease-in-out_infinite] blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[700px] bg-gradient-to-tr from-secondary/20 to-primary/20 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-[morph_12s_ease-in-out_infinite_reverse] blur-3xl pointer-events-none"></div>

        {/* Floating 3D Orbs */}
        <div className="absolute top-[20%] left-[15%] w-12 h-12 rounded-full bg-gradient-to-br from-white to-primary/40 shadow-[0_10px_20px_rgba(0,198,255,0.2)] backdrop-blur-md animate-bounce pointer-events-none" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-[30%] right-[20%] w-8 h-8 rounded-full bg-gradient-to-br from-white to-success/40 shadow-[0_10px_20px_rgba(16,185,129,0.2)] backdrop-blur-md animate-bounce pointer-events-none" style={{animationDuration: '5s', animationDelay: '1s'}}></div>
        
        {/* Main Content Area */}
        <div className="text-center relative z-10 px-4 mt-12">
          <div className="inline-block mb-6 px-5 py-2 rounded-full bg-white/60 backdrop-blur-xl border border-teal-100 shadow-sm text-sm font-bold text-secondary uppercase tracking-wider">
            The New Standard for Pitch Decks
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 tracking-tight text-slate-800 drop-shadow-sm">
            Pitch<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">King</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Get an Investor-Ready Pitch Deck in 5 Minutes. Premium designs, AI copy-polish, and bulletproof PDF exports.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <Link to="/onboarding" className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all transform hover:-translate-y-1">
              Start Generating
            </Link>
            <Link to="/" className="inline-block px-8 py-4 bg-white/80 backdrop-blur-md border border-teal-100 text-slate-700 font-bold rounded-2xl hover:bg-white transition-all shadow-sm hover:shadow-md transform hover:-translate-y-1">
              &larr; Back to Vault
            </Link>
          </div>
          
          <a href="#faq" className="text-slate-400 flex flex-col items-center hover:text-primary transition-colors">
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

        {/* Animated Ocean Wave at the bottom of hero */}
        <div className="absolute bottom-0 left-0 w-full">
          <OceanWave />
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="relative z-20 py-24 px-4 border-t border-teal-100/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-500 font-medium">Everything you need to know about our AI Pitch Deck Generator.</p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-teal-50 hover:bg-white/80 transition-all hover:shadow-md">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Can I preview my deck for free?</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Absolutely! You can use our builder to input your data and preview the design entirely for free. You will receive a watermarked PDF export. You only pay when you want to remove the watermark and apply our Silicon Valley-standard AI copy polish.</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-teal-50 hover:bg-white/80 transition-all hover:shadow-md">
              <h3 className="text-xl font-bold text-slate-800 mb-3">What does the AI Copy-Polish actually do?</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Most founders write technically accurate but poorly marketed copy. Our proprietary AI engine rewrites your raw text to sound like it was written by a top-tier venture capitalist. It makes your problem sound urgent, your solution sound inevitable, and your traction look massive.</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-teal-50 hover:bg-white/80 transition-all hover:shadow-md">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Do my credits ever expire?</h3>
              <p className="text-slate-600 leading-relaxed font-medium">No! We use a simple "Pay-As-You-Go" model instead of a recurring monthly subscription. Once you buy a credit pack, those credits stay in your account forever until you use them to generate a final pitch deck.</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-teal-50 hover:bg-white/80 transition-all hover:shadow-md">
              <h3 className="text-xl font-bold text-slate-800 mb-3">Is my startup's data secure?</h3>
              <p className="text-slate-600 leading-relaxed font-medium">Yes. We do not use your startup's pitch deck data to train our AI models. Your ideas remain strictly confidential and your generated PDFs are served via securely signed, expiring links.</p>
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
}

function TrackedRoutes() {
  usePageTracking();
  
  return (
    <div className="min-h-screen relative font-sans text-white overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-50">
      {/* Global Ocean Wave Background */}
      <div className="fixed inset-0 z-0 bg-[#0B1121]">
        <OceanWave />
      </div>
      
      {/* Main Content Area */}
      <div className="relative z-10 min-h-screen">
        <Routes>
          <Route path="/" element={<VaultHome />} />
          <Route path="/pitchking" element={<PitchKingHome />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/print/:jobId" element={<PrintView />} />
          <Route path="/tool/saas-vault" element={<SaaSVault />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/vault" element={<VaultHome />} />
          <Route path="/prompt-vault" element={<PromptVault />} />
          <Route path="/market" element={<MarketHome />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/tool/arch-kit" element={<TechArchKit />} />
          <Route path="/ph" element={<ProductHuntLaunch />} />
          <Route path="/purchase-success" element={<PurchaseSuccess />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <TrackedRoutes />
        <Toaster  
          position="top-center" 
          toastOptions={{ 
            style: { 
              background: '#1E293B', 
              color: '#F8FAFC',
              border: '1px solid rgba(255,255,255,0.1)'
            } 
          }} 
        />
      </Router>
    </HelmetProvider>
  );
}

export default App;
