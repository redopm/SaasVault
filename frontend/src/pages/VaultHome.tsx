import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Briefcase, Layout, FileText, Code, Settings, ChevronDown, ShoppingCart, Loader2, CheckSquare, Database, MonitorSmartphone } from 'lucide-react';
import PricingSection from '../components/vault/PricingSection';
import VaultNavbar from '../components/vault/VaultNavbar';
import { auth } from '../firebase';
import { processMarketPayment } from '../utils/marketPayment';
import toast from 'react-hot-toast';
import AuthModal from '../components/auth/AuthModal';

const tools = [
  {
    id: 1,
    title: 'PitchKing AI',
    description: 'Generate 5-slide YC-style investor pitch decks in 5 minutes using Gemini AI.',
    icon: <Sparkles size={28} className="text-teal-400" />,
    link: '/pitchking',
    type: 'AI Tool',
    color: 'from-teal-400 to-emerald-400',
    isComingSoon: false
  },
  {
    id: 2,
    title: 'Senior Dev Portfolio',
    description: 'Auto-generate a premium developer portfolio from your GitHub profile.',
    icon: <Code size={28} className="text-blue-400" />,
    link: '#',
    type: 'AI Tool',
    color: 'from-blue-400 to-indigo-500',
    isComingSoon: true
  },
  {
    id: 3,
    title: 'SaaS Dashboard UI Kit',
    description: 'Premium Figma files & Tailwind components for SaaS dashboards.',
    icon: <Layout size={28} className="text-purple-400" />,
    link: '/product/saas_dashboard_ui_kit',
    type: 'UI Kit',
    color: 'from-purple-400 to-pink-500',
    isComingSoon: false,
    price: 999,
    productId: 'saas_dashboard_ui_kit'
  },
  {
    id: 4,
    title: 'Agency Onboarding Kit',
    description: 'Notion workspace duplicate for freelance and agency client onboarding.',
    icon: <Briefcase size={28} className="text-amber-400" />,
    link: '/product/agency_onboarding_kit',
    type: 'Notion Kit',
    color: 'from-amber-400 to-orange-500',
    isComingSoon: false,
    price: 999,
    productId: 'agency_onboarding_kit'
  },
  {
    id: 5,
    title: 'Technical Arch Kit',
    description: 'Instantly generate Mermaid.js system architecture diagrams from text.',
    icon: <Settings size={28} className="text-rose-400" />,
    link: '/tool/arch-kit',
    type: 'AI Tool',
    color: 'from-rose-400 to-red-500',
    isComingSoon: false
  },
  {
    id: 6,
    title: 'B2B Lead Magnet Gen',
    description: '10-page professional whitepaper generation for your B2B SaaS.',
    icon: <FileText size={28} className="text-cyan-400" />,
    link: '#',
    type: 'AI Tool',
    color: 'from-cyan-400 to-blue-500',
    isComingSoon: true
  },
  {
    id: 7,
    title: 'SaaS UX/UI Conversion Audit Checklist',
    description: 'A high-value PDF and Notion Checklist to audit your landing page conversion rates.',
    icon: <CheckSquare size={28} className="text-green-400" />,
    link: '/product/ux_audit_checklist',
    type: 'Notion Kit',
    color: 'from-green-400 to-emerald-500',
    isComingSoon: false,
    price: 999,
    productId: 'ux_audit_checklist'
  },
  {
    id: 8,
    title: 'AI Prompt Vaults',
    description: '500+ premium, battle-tested AI prompts in a structured Notion database.',
    icon: <Database size={28} className="text-pink-400" />,
    link: '/prompt-vault',
    type: 'Prompt Kit',
    color: 'from-pink-400 to-rose-500',
    isComingSoon: false
  },
  {
    id: 9,
    title: 'SaaS Landing Page & Social Media Kit',
    description: 'Premium Canva templates and Figma files for your startup branding.',
    icon: <MonitorSmartphone size={28} className="text-fuchsia-400" />,
    link: '/product/landing_kit_saas',
    type: 'Design Kit',
    color: 'from-fuchsia-400 to-pink-500',
    isComingSoon: false,
    price: 999,
    productId: 'landing_kit_saas'
  },
  {
    id: 10,
    title: 'Notion Workspace Generator',
    description: 'AI generates a complete, custom Notion workspace for your company instantly.',
    icon: <Briefcase size={28} className="text-orange-400" />,
    link: '#',
    type: 'AI Tool',
    color: 'from-orange-400 to-red-500',
    isComingSoon: true
  }
];

export default function VaultHome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Track scroll progress for the entire page
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax effects for different elements
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  
  // Column parallax translations
  const leftColY = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const rightColY = useTransform(scrollYProgress, [0, 1], [200, -200]);

  return (
    <div ref={containerRef} className="relative min-h-[250vh] text-white font-sans selection:bg-teal-500/30">
      <Helmet>
        <title>SaaS Vault | Premium Digital Products & AI Tools for Founders</title>
        <meta name="description" content="Discover premium UI kits, pitch deck generators, and AI prompt vaults designed specifically for SaaS founders and indie hackers to scale faster." />
        <meta property="og:title" content="SaaS Vault | Premium Digital Products for Founders" />
        <meta property="og:description" content="Discover premium UI kits, pitch deck generators, and AI prompt vaults designed specifically for SaaS founders." />
      </Helmet>
      
      <VaultNavbar />

      {/* Fixed Background Image with Deep Space Overlay */}
      <div className="fixed inset-0 z-[-1] bg-slate-950">
        <img 
          src="/saas_premium_bg.png" 
          alt="Premium Background" 
          className="w-full h-full object-cover opacity-80"
        />
        {/* Subtle dark gradient overlay to ensure text pops */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950/80"></div>
      </div>

      {/* Hero Section */}
      <motion.div 
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="sticky top-0 h-screen flex flex-col items-center justify-center text-center px-4"
      >
        <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 shadow-lg text-xs font-bold text-slate-300 uppercase tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          Ikkish SaaS Vault
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-white mb-6 drop-shadow-2xl">
          Build <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">Unstoppable</span>
        </h1>
        
        <p className="text-xl md:text-3xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed mb-12 drop-shadow-md">
          The ultimate collection of AI tools, UI wireframes, and business kits designed for hyper-growth founders.
        </p>

        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-16 text-slate-400 flex flex-col items-center drop-shadow-md"
        >
          <span className="text-sm font-bold uppercase tracking-widest mb-2 text-white/50">Explore the Vault</span>
          <ChevronDown size={32} className="text-white/70" />
        </motion.div>
      </motion.div>

      {/* Tools Parallax Grid Section */}
      <div id="market" className="relative z-10 max-w-6xl mx-auto px-4 pb-32 -mt-[20vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Left Column */}
          <motion.div style={{ y: leftColY }} className="flex flex-col gap-8 md:gap-12">
            {tools.filter((_, i) => i % 2 === 0).map((tool) => (
              <ToolCard key={tool.id} tool={tool} onRequireLogin={() => setIsAuthModalOpen(true)} />
            ))}
          </motion.div>
          
          {/* Right Column */}
          <motion.div style={{ y: rightColY }} className="flex flex-col gap-8 md:gap-12">
            {tools.filter((_, i) => i % 2 !== 0).map((tool) => (
              <ToolCard key={tool.id} tool={tool} onRequireLogin={() => setIsAuthModalOpen(true)} />
            ))}
          </motion.div>

        </div>
      </div>

      {/* Global SaaS Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <footer className="relative z-10 py-12 bg-white/5 backdrop-blur-xl border-t border-white/10 text-center">
        <div className="flex justify-center gap-6 mb-4">
          <Link to="/terms" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/refund" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Refund Policy</Link>
        </div>
        <p className="text-slate-400 font-medium drop-shadow-md text-sm">© 2026 Ikkish SaaS Vault. Designed for Excellence.</p>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}

// Extracted Glassmorphism Card Component for cleaner code
function ToolCard({ tool, onRequireLogin }: { tool: any, onRequireLogin: () => void }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!tool.productId) return;
    
    if (!auth.currentUser) {
      toast.error("Please login to purchase");
      onRequireLogin();
      return;
    }

    setIsProcessing(true);
    const token = await auth.currentUser.getIdToken();
    const result = await processMarketPayment(tool.productId, token);
    
    setIsProcessing(false);
    if (result.success && result.link) {
      // Redirect to success page with link
      navigate('/purchase-success', { state: { link: result.link, productName: tool.title } });
    } else {
      toast.error("Payment failed or cancelled");
    }
  };

  const CardContent = (
    <div className={`relative bg-white/10 backdrop-blur-2xl rounded-[2rem] p-10 shadow-2xl border border-white/20 transition-all duration-500 overflow-hidden ${tool.isComingSoon ? 'opacity-70 grayscale-[30%]' : 'hover:shadow-[0_20px_80px_rgba(20,184,166,0.3)] hover:-translate-y-2 hover:border-white/40'}`}>
      
      {/* Hover Glow Behind Card content */}
      {!tool.isComingSoon && <div className={`absolute -inset-1 rounded-[2rem] bg-gradient-to-br ${tool.color} opacity-0 blur-3xl group-hover:opacity-30 transition-opacity duration-700 -z-10`}></div>}
      
      {/* Subtle Shimmer Effect */}
      {!tool.isComingSoon && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>}

      <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">
        <div className={`w-16 h-16 shrink-0 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner transition-transform duration-500 ${!tool.isComingSoon && 'group-hover:scale-110 group-hover:rotate-3'}`}>
          {tool.icon}
        </div>
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">{tool.type}</span>
            {tool.isComingSoon && (
              <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-500/20 border border-amber-500/30 rounded-full shadow-sm">
                Coming Soon
              </span>
            )}
            {!tool.isComingSoon && tool.price && (
              <span className="px-3 py-1 text-[12px] font-bold tracking-widest text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-sm">
                ₹{tool.price}
              </span>
            )}
          </div>
          <h3 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">{tool.title}</h3>
        </div>
      </div>
      
      <p className="text-lg text-slate-300 font-medium leading-relaxed">
        {tool.description}
      </p>
      
      <div className={`mt-8 flex items-center gap-2 text-sm font-bold ${tool.isComingSoon ? 'text-slate-500' : 'text-slate-300 group-hover:text-white transition-colors'}`}>
        {tool.isComingSoon ? 'In Development' : (
          tool.price ? (
             <button 
               onClick={handleBuyNow}
               disabled={isProcessing}
               className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all disabled:opacity-50"
             >
               {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
               {isProcessing ? 'Processing...' : 'Buy Now'}
             </button>
          ) : (
            <>Explore Tool <Sparkles size={16} className={`group-hover:text-teal-400 transition-colors`} /></>
          )
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={tool.isComingSoon ? "" : "group"}
    >
      {tool.isComingSoon ? (
        <div className="block w-full cursor-not-allowed">
          {CardContent}
        </div>
      ) : (
        tool.price ? (
          <div className="block w-full">
            {CardContent}
          </div>
        ) : (
          <Link to={tool.link} className="block w-full">
            {CardContent}
          </Link>
        )
      )}
    </motion.div>
  );
}
