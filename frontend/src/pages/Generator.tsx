import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import GenericSlideRenderer from '../components/slides/GenericSlideRenderer';
import { PenSquare, FileText, ChevronRight, FileOutput, Loader2, ArrowLeft, ArrowUp, ArrowDown, Plus, Trash2, Edit2, Lock, FileBox, Sparkles, Zap, Star, Target, Rocket, CheckCircle2 } from 'lucide-react';
import OceanWave from '../components/ui/OceanWave';
import SlideDropdown from '../components/ui/SlideDropdown';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import AuthModal from '../components/auth/AuthModal';
import ThemeModal from '../components/ui/ThemeModal';
import FontModal from '../components/ui/FontModal';
import TemplateGalleryModal from '../components/ui/TemplateGalleryModal';
import type { Template } from '../templates';
import EditorToolbar from '../components/ui/EditorToolbar';
import { Helmet } from 'react-helmet-async';
import { THEMES } from '../themes';
import toast from 'react-hot-toast';

export default function Generator() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'dump';
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPPTX, setIsExportingPPTX] = useState(false);
  const [viewMode, setViewMode] = useState<'input' | 'editor'>('input');
  const [deckData, setDeckData] = useState<any>(null);
  
  // Undo/Redo & Auto-save State
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Auto-Save load on mount
  useEffect(() => {
    const saved = localStorage.getItem('pitchking_autosave');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.slides) {
          setDeckData(parsed);
          setHistory([parsed]);
          setHistoryIndex(0);
        }
      } catch (e) {
        console.error("Failed to load autosave", e);
      }
    }
  }, []);

  // Update deck data with history tracking
  const updateDeckData = (newData: any) => {
    setDeckData(newData);
    // Debounce or just save directly (it's small JSON)
    localStorage.setItem('pitchking_autosave', JSON.stringify(newData));
    
    // Add to history
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newData);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  };

  // Keyboard Shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'editor') return;
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            // Redo
            if (historyIndex < history.length - 1) {
              const nextData = history[historyIndex + 1];
              setDeckData(nextData);
              localStorage.setItem('pitchking_autosave', JSON.stringify(nextData));
              setHistoryIndex(prev => prev + 1);
            }
          } else {
            // Undo
            if (historyIndex > 0) {
              const prevData = history[historyIndex - 1];
              setDeckData(prevData);
              localStorage.setItem('pitchking_autosave', JSON.stringify(prevData));
              setHistoryIndex(prev => prev - 1);
            }
          }
        } else if (e.key === 'y') {
          e.preventDefault();
          // Redo
          if (historyIndex < history.length - 1) {
            const nextData = history[historyIndex + 1];
            setDeckData(nextData);
            localStorage.setItem('pitchking_autosave', JSON.stringify(nextData));
            setHistoryIndex(prev => prev + 1);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, history, historyIndex]);
  const [selectedTheme, setSelectedTheme] = useState('aurora');
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isFontModalOpen, setIsFontModalOpen] = useState(false);
  const [isTemplateGalleryOpen, setIsTemplateGalleryOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState('font-inter');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [deckBgImage, setDeckBgImage] = useState<string>('');

  const addBlock = (blockType: 'text' | 'image') => {
    if (!deckData) return;
    const newSlides = [...deckData.slides];
    const currentSlide = newSlides[activeSlideIndex];
    
    const newBlock = blockType === 'text' 
      ? { type: 'text', content: 'Enter your text here...' }
      : { type: 'image', imageUrl: 'https://via.placeholder.com/800x400?text=Click+to+replace+image' };

    if (currentSlide && currentSlide.type === 'custom') {
      currentSlide.blocks = [...(currentSlide.blocks || []), newBlock];
    } else {
      newSlides.splice(activeSlideIndex + 1, 0, {
        type: 'custom',
        blocks: [newBlock]
      });
      setActiveSlideIndex(activeSlideIndex + 1);
    }
    updateDeckData({ ...deckData, slides: newSlides });
  };

  const addSlide = (index: number) => {
    if (!deckData) return;
    const newSlides = [...deckData.slides];
    newSlides.splice(index + 1, 0, { type: 'list', title: 'New Slide', content: 'Add your content here...', items: ['Point 1', 'Point 2'] });
    updateDeckData({ ...deckData, slides: newSlides });
  };

  const deleteSlide = (index: number) => {
    if (!deckData || deckData.slides.length <= 1) return;
    if (confirm("Are you sure you want to delete this slide?")) {
      const newSlides = [...deckData.slides];
      newSlides.splice(index, 1);
      updateDeckData({ ...deckData, slides: newSlides });
    }
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    if (!deckData) return;
    const newSlides = [...deckData.slides];
    if (direction === 'up' && index > 0) {
      [newSlides[index - 1], newSlides[index]] = [newSlides[index], newSlides[index - 1]];
      updateDeckData({ ...deckData, slides: newSlides });
    } else if (direction === 'down' && index < newSlides.length - 1) {
      [newSlides[index + 1], newSlides[index]] = [newSlides[index], newSlides[index + 1]];
      updateDeckData({ ...deckData, slides: newSlides });
    }
  };
  
  const [textContent, setTextContent] = useState("");
  const [guidedData, setGuidedData] = useState({ name: '', problem: '', metrics: '' });
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);

  // ─── Hand-crafted YC-quality demo deck ─────────────────────────────────────
  const SENTINEL_DECK = {
    slides: [
      {
        type: 'title',
        companyName: 'Sentinel',
        tagline: 'The Autonomous Security Operations Center for the Enterprise.',
        tag: 'AI · Cybersecurity'
      },
      {
        type: 'split',
        tag: 'THE PROBLEM',
        title: 'Enterprise Security Teams Are Drowning',
        content: 'Every analyst handles 4,000+ alerts/day. 97% are false positives. The real threats are invisible.',
        items: [
          '287 days — average time to detect a real breach (IBM, 2024)',
          '$4.5M — average cost per breach for mid-market enterprises',
          '35%/yr analyst churn due to burnout & alert fatigue'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
      },
      {
        type: 'split',
        tag: 'THE SOLUTION',
        title: 'One AI. Zero Alert Fatigue.',
        content: 'Sentinel is an autonomous AI co-pilot that triages, correlates, and resolves 95% of security alerts — without touching your existing stack.',
        items: [
          'Connects to any SIEM/SOAR in under 15 minutes',
          'Trained on 200B+ real-world security events',
          'Self-learning model — gets smarter with every alert',
          'Full audit trail for SOC 2 & ISO 27001 compliance'
        ],
        imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80'
      },
      {
        type: 'list',
        tag: 'HOW IT WORKS',
        title: 'From Chaos to Clarity in 4 Steps',
        items: [
          'Step 1: 1-click connector to your SIEM (Splunk, Microsoft Sentinel, CrowdStrike)',
          'Step 2: AI ingests & classifies 100% of alerts in <2 seconds',
          'Step 3: Real threats surface instantly; false positives auto-closed',
          'Step 4: Weekly executive reports with ROI metrics & compliance docs'
        ]
      },
      {
        type: 'chart',
        tag: 'MARKET OPPORTUNITY',
        title: '$78B Security Ops Market',
        content: 'Cloud security ops growing at 24% CAGR. AI-native platforms replacing legacy SIEM by 2027.',
        chartType: 'horizontalBar',
        data: [
          { label: 'TAM — Global Cybersec Ops ($B)', value: 78 },
          { label: 'SAM — Enterprise SOAR/SIEM ($B)', value: 14 },
          { label: 'SOM — AI-native SOC ($B)', value: 1.2 }
        ]
      },
      {
        type: 'metrics',
        tag: 'TRACTION',
        title: '$285K MRR. Zero Churn.',
        content: 'Growing 22% month-over-month with zero marketing spend.',
        metrics: [
          { label: 'MRR', value: '$285K', desc: '+22% MoM' },
          { label: 'Clients', value: '43', desc: 'Fortune 1000' },
          { label: 'Churn', value: '0%', desc: '12 months straight' },
          { label: 'NPS', value: '78', desc: 'World-class' }
        ]
      },
      {
        type: 'chart',
        tag: 'GROWTH',
        title: 'MRR Trajectory',
        content: 'Organic growth only. No paid marketing.',
        chartType: 'line',
        data: [
          { label: 'Jan', value: 45 },
          { label: 'Feb', value: 68 },
          { label: 'Mar', value: 95 },
          { label: 'Apr', value: 140 },
          { label: 'May', value: 195 },
          { label: 'Jun', value: 285 }
        ]
      },
      {
        type: 'metrics',
        tag: 'BUSINESS MODEL',
        title: 'Usage-Based SaaS with Land & Expand',
        content: 'Customers start small and expand as alert volume grows.',
        metrics: [
          { label: 'Starter', value: '$2.5K', desc: '/mo · 50K alerts' },
          { label: 'Growth', value: '$8.5K', desc: '/mo · 200K alerts' },
          { label: 'Enterprise', value: '$25K+', desc: '/mo · unlimited' },
          { label: 'LTV:CAC', value: '25:1', desc: 'Class-leading' }
        ]
      },
      {
        type: 'chart',
        tag: 'COMPETITIVE LANDSCAPE',
        title: 'We Win on What Matters Most',
        content: 'Autonomous resolution rate — the single metric every CISO cares about.',
        chartType: 'bar',
        data: [
          { label: 'Sentinel', value: 97 },
          { label: 'CrowdStrike', value: 58 },
          { label: 'Splunk', value: 45 },
          { label: 'Manual SOC', value: 15 }
        ]
      },
      {
        type: 'list',
        tag: 'THE TEAM',
        title: 'Built to Win by People Who\'ve Done It',
        items: [
          'Arjun Mehta · CEO — Ex-Palo Alto Networks, led product division to $200M ARR',
          'Sarah Chen · CTO — Ex-Google DeepMind, holds 3 AI security patents',
          'Marcus Williams · VP Sales — Scaled Wiz EMEA from $0 → $15M ARR in 18 months',
          'Advisor: Roelof Botha — Partner, Sequoia Capital (Zoom, YouTube, LinkedIn)'
        ]
      },
      {
        type: 'list',
        tag: 'THE ASK',
        title: 'Raising $5M Seed',
        items: [
          '60% Engineering — grow from 6 to 14 engineers',
          '25% GTM & Sales — target Fortune 1000 pipeline',
          '15% Operations — 24-month runway secured',
          'Milestone: $2M ARR → Series A in 18 months'
        ]
      }
    ]
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const unsubDoc = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            setCredits(docSnap.data().vault_credits || 0);
          } else {
            setCredits(0);
          }
        });
        return () => unsubDoc();
      } else {
        setCredits(0);
        // Automatically prompt for login if accessing tools unauthenticated
        setTimeout(() => setIsAuthModalOpen(true), 1000);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadSampleData = () => {
    setTextContent("We are building a SaaS for presentation design. Creating pitch decks is hard and takes days. We use AI to turn messy notes into Silicon Valley-standard slides in seconds. Market size is $10B. We already have 50 beta users and 10% WoW growth.");
  };

  const handleUnlockPPTX = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const isAdmin = ['omprakashmaury24@gmail.com', 'opmaury001@gmail.com'].includes(user.email || '');
    if (!isAdmin && credits < 50) {
      toast.error("You need at least 50 Credits to export to PPTX. Please upgrade your vault.", { duration: 5000 });
      return;
    }

    setIsExportingPPTX(true);
    toast.loading("Generating Editable PPTX (This might take a few seconds)...", { id: 'pptx-export' });

    try {
      const token = await user.getIdToken();
      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : `http://${window.location.hostname}:10001`);
      const response = await fetch(`${baseUrl}/api/pitchking/export-pptx`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          deck_data: deckData,
          theme: selectedTheme
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Export failed");
      }
      
      const blob = new Blob([await response.arrayBuffer()], { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'PitchKing_Presentation.pptx';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        if (document.body.contains(a)) document.body.removeChild(a);
      }, 5000);
      
      toast.dismiss('pptx-export');
      toast.success("Editable PPTX Downloaded successfully!");
      
    } catch (error: any) {
      toast.dismiss('pptx-export');
      toast.error(error.message || "Failed to download PPTX. Please try again.");
    } finally {
      setIsExportingPPTX(false);
    }
  };

  const handleUnlockPro = async () => {
    let currentUser = user;
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    
    // Admin Bypass
    const ADMIN_EMAILS = ['omprakashmaury24@gmail.com', 'opmaury001@gmail.com'];
    const isAdmin = currentUser.email ? ADMIN_EMAILS.includes(currentUser.email) : false;
    
    if (credits < 25 && !isAdmin) {
      toast.error('Not enough credits. You need 25 credits to export PDF.', { duration: 5000 });
      window.location.href = '/#pricing';
      return;
    }

    setIsExporting(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const token = await currentUser.getIdToken();
      const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : `http://${window.location.hostname}:10001`);
      
      const res = await fetch(`${baseUrl}/api/pitchking/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          deck_data: deckData,
          session_id: "preview-session",
          theme: selectedTheme
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (res.status === 402) {
        alert("Insufficient credits. Redirecting to Pricing...");
        window.location.href = '/#pricing';
        return;
      }
      
      if (!res.ok) {
        throw new Error("Failed to export PDF");
      }
      
      const blob = new Blob([await res.arrayBuffer()], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'PitchKing_Pitch_Deck.pdf';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        if (document.body.contains(a)) document.body.removeChild(a);
      }, 5000);
      
      toast.success('25 credits used. Your high-res PDF is downloading!', { duration: 5000, icon: undefined });
    } catch (e: any) {
      if (e.name === 'AbortError') {
        alert("Request timed out after 30 seconds. Please check your connection and try again.");
      } else {
        console.error(e);
        alert("Failed to process your request. If credits were used, they have been refunded.");
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerate = async () => {
    const finalContent = mode === 'guided' 
      ? `Name: ${guidedData.name}\nProblem: ${guidedData.problem}\nTraction: ${guidedData.metrics}`
      : textContent;
      
    if (!finalContent.trim()) {
      toast.error('Please enter some content to generate your deck.');
      return;
    }
    
    // Auth gate — must be logged in to use AI generation
    if (!user) {
      toast.error('Please sign in to generate your pitch deck.', { duration: 4000 });
      setIsAuthModalOpen(true);
      return;
    }
    setIsGenerating(true);
    try {
      const apiUrl = import.meta.env.PROD ? '/api/pitchking/generate' : 'http://localhost:10001/api/pitchking/generate';
      const token = await user.getIdToken();
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: finalContent,
          mode: mode
        })
      });
      
      const data = await response.json();
      if (data.deck_data) {
        updateDeckData(data.deck_data);
      } else if (data.error) {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Failed to generate:", error);
      toast.error("Failed to generate deck. Our AI engine might be temporarily busy.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 ocean-aurora-bg relative overflow-hidden">
      <Helmet>
        <title>App | PitchKing</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      {viewMode === 'input' ? (
        <>
          {/* Left Panel: Data Engine */}
          <div className="w-1/3 bg-white/60 backdrop-blur-md border-r border-teal-100 flex flex-col z-10 shadow-[4px_0_24px_rgba(0,198,255,0.05)]">
            <div className="p-8 border-b border-teal-50 flex-none relative">
              <Link to="/" className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-primary transition-colors mb-4">
                <ArrowLeft size={14} /> Back to Vault
              </Link>
              <h2 className="text-3xl font-extrabold tracking-tight animate-liquid-title mb-1">Data Engine</h2>
              <p className="text-sm text-slate-500 font-medium">
                {mode === 'dump' ? 'Paste your raw thoughts' : 'Answer the questionnaire'}
              </p>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto">
              <div className="mb-6 flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Raw Input</label>
                <button 
                  onClick={loadSampleData}
                  className="text-xs text-primary font-bold hover:text-secondary transition-colors"
                >
                  Load Sample Data
                </button>
              </div>
              
              {mode === 'dump' ? (
                <textarea 
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  className="w-full h-[60%] p-5 border border-teal-100 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none shadow-inner bg-white/80 font-medium text-slate-700 leading-relaxed"
                  placeholder="Dump all your messy thoughts, notes, or website copy here..."
                />
              ) : (
                <div className="space-y-4 overflow-y-auto h-[60%] pr-2">
                  <div className="bg-white/60 p-4 rounded-xl border border-slate-100 shadow-sm">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Step 1: Identity</label>
                    <input 
                      type="text" 
                      placeholder="What is your product name?"
                      className="w-full p-3 border border-teal-100 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm bg-white font-medium text-slate-700"
                      value={guidedData.name}
                      onChange={(e) => setGuidedData({...guidedData, name: e.target.value})}
                    />
                  </div>
                  <div className="bg-white/60 p-4 rounded-xl border border-slate-100 shadow-sm">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Step 2: The Problem</label>
                    <textarea 
                      placeholder="What painful problem does it solve?"
                      className="w-full h-24 p-3 border border-teal-100 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none shadow-sm bg-white font-medium text-slate-700"
                      value={guidedData.problem}
                      onChange={(e) => setGuidedData({...guidedData, problem: e.target.value})}
                    />
                  </div>
                  <div className="bg-white/60 p-4 rounded-xl border border-slate-100 shadow-sm">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Step 3: Metrics</label>
                    <input 
                      type="text" 
                      placeholder="Current revenue or users?"
                      className="w-full p-3 border border-teal-100 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm bg-white font-medium text-slate-700"
                      value={guidedData.metrics}
                      onChange={(e) => setGuidedData({...guidedData, metrics: e.target.value})}
                    />
                  </div>
                </div>
              )}
               
               <div className="pt-6 border-t border-teal-50 mt-8 flex flex-col gap-3">

                 {/* Example Deck Button — prominent, at top */}
                 <button
                   onClick={() => {
                     updateDeckData(SENTINEL_DECK);
                     setSelectedTheme('midnight_vc');
                     setSelectedFont('font-inter');
                     setViewMode('editor');
                     toast.success('Loaded Sentinel — YC-Quality Demo Deck!');
                   }}
                   className="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 border-2 border-violet-500/40 hover:border-violet-500 transition-all"
                   style={{ background: 'linear-gradient(135deg, #1e1b4b, #2d1b69)', color: '#c4b5fd' }}
                 >
                   <Target size={16} />
                   See a YC-Quality Example Deck
                 </button>

                 {/* AI Generate Button */}
                 <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || (mode === 'dump' ? !textContent : !guidedData.name)}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
                  >
                   {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={18} />}
                   {isGenerating ? 'AI is generating...' : 'AI Polish Copy'}
                   {!user && <Lock size={14} className="opacity-60" />}
                 </button>

                 <div className="relative flex items-center py-1">
                   <div className="flex-grow border-t border-slate-200"></div>
                   <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">or</span>
                   <div className="flex-grow border-t border-slate-200"></div>
                 </div>
               </div>
            </div>
          </div>

          {/* Right Panel: Live Preview (Input Mode) */}
          <div className="w-2/3 flex flex-col p-8 relative overflow-hidden items-center justify-center">
            {deckData && deckData.slides && deckData.slides.length > 0 ? (
              <div className="flex flex-col items-center gap-6 z-10 w-full h-full">
                
                {/* Mini Preview Header Controls */}
                <div 
                  className="flex justify-between items-center w-full p-3 rounded-2xl shadow-xl border" 
                  style={{ 
                    background: `color-mix(in srgb, ${THEMES[selectedTheme]?.colors?.background || '#0f172a'} 95%, transparent)`, 
                    borderColor: `color-mix(in srgb, ${THEMES[selectedTheme]?.colors?.primary || '#22d3ee'} 20%, transparent)`,
                    backdropFilter: 'blur(12px)' 
                  }}
                >
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsTemplateGalleryOpen(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all"
                      style={{ 
                        background: `color-mix(in srgb, ${THEMES[selectedTheme]?.colors?.primary || '#22d3ee'} 10%, transparent)`,
                        color: THEMES[selectedTheme]?.colors?.text || '#f1f5f9',
                        borderColor: `color-mix(in srgb, ${THEMES[selectedTheme]?.colors?.primary || '#22d3ee'} 30%, transparent)`
                      }}
                    >
                      <Sparkles size={13} className="text-amber-400" /> Browse Templates
                    </button>
                    
                    <button onClick={handleUnlockPro} disabled={isExporting} className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all" style={{ background: `color-mix(in srgb, ${THEMES[selectedTheme]?.colors?.background || '#1e293b'} 70%, rgba(0,0,0,0.3))`, color: THEMES[selectedTheme]?.colors?.text || '#f1f5f9', borderColor: `color-mix(in srgb, ${THEMES[selectedTheme]?.colors?.primary || '#22d3ee'} 30%, transparent)` }}>
                      {isExporting ? <Loader2 size={13} className="animate-spin" /> : <Lock size={13} className="text-amber-400" />} PDF <span className="text-slate-500 flex items-center gap-0.5">25<Zap size={10} className="text-amber-400" /></span>
                    </button>
                    
                    <button onClick={handleUnlockPPTX} disabled={isExportingPPTX} className="px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all shadow-md" style={{ background: 'linear-gradient(135deg, #059669, #0891b2)', color: 'white' }}>
                      {isExportingPPTX ? <Loader2 size={13} className="animate-spin" /> : <FileBox size={13} />} PPTX <span className="text-white/60 flex items-center gap-0.5">50<Zap size={10} /></span>
                    </button>
                  </div>
                  <button onClick={() => setViewMode('editor')} className="text-xs font-black flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all" style={{ background: `color-mix(in srgb, ${THEMES[selectedTheme]?.colors?.primary || '#22d3ee'} 15%, transparent)`, color: THEMES[selectedTheme]?.colors?.primary || '#22d3ee', border: `1px solid color-mix(in srgb, ${THEMES[selectedTheme]?.colors?.primary || '#22d3ee'} 30%, transparent)` }}>
                    <FileText size={13} /> Full Editor
                  </button>
                </div>

                {/* Mini Slides List with watermark */}
                <div className="flex-1 w-full overflow-y-auto flex flex-col gap-8 pb-12 pr-4 custom-scrollbar">
                  {deckData.slides.map((slide: any, idx: number) => (
                    <div key={idx} className="w-full flex justify-center">
                      <div 
                        className="relative shrink-0 overflow-hidden shadow-lg border border-slate-200 rounded-xl"
                        style={{ width: '580px', height: '326px' }}
                      >
                        <div 
                          className={`absolute top-0 left-0 w-[1280px] h-[720px] origin-top-left ${selectedFont} pointer-events-none`}
                          data-theme={selectedTheme}
                          style={{ transform: `scale(${580/1280})`, background: THEMES[selectedTheme]?.colors?.background || '#0f172a' }}
                        >
                          <GenericSlideRenderer slide={slide} onUpdate={() => {}} />
                        </div>
                        {/* Watermark overlay on mini previews */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 overflow-hidden">
                          <span className="text-[48px] font-black text-white/10 -rotate-12 whitespace-nowrap select-none tracking-widest uppercase">PREVIEW</span>
                        </div>
                        {/* Slide number */}
                        <div className="absolute bottom-2 right-2 z-30 px-2 py-0.5 rounded text-[10px] font-black" style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.6)' }}>{idx + 1}</div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <div className="w-full max-w-lg aspect-video flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 backdrop-blur-sm font-medium z-10 rounded-3xl border-2 border-slate-200 border-dashed">
                <FileText size={48} className="mb-4 opacity-30" />
                <p>Input data and click "AI Polish Copy" to generate</p>
              </div>
            )}
            
            <OceanWave />
          </div>
        </>
      ) : (
        /* Full-Screen Editor Mode */
        <div className="w-full h-full flex flex-col relative z-20 overflow-y-auto" style={{ background: THEMES[selectedTheme]?.colors?.background || '#0f172a' }}>
            <EditorToolbar 
              onThemeClick={() => setIsThemeModalOpen(true)} 
              onFontClick={() => setIsFontModalOpen(true)}
              onAddText={() => addBlock('text')}
              onAddImage={() => addBlock('image')}
              onUndo={() => {
                if (historyIndex > 0) {
                  const prevData = history[historyIndex - 1];
                  setDeckData(prevData);
                  localStorage.setItem('pitchking_autosave', JSON.stringify(prevData));
                  setHistoryIndex(prev => prev - 1);
                }
              }}
              onRedo={() => {
                if (historyIndex < history.length - 1) {
                  const nextData = history[historyIndex + 1];
                  setDeckData(nextData);
                  localStorage.setItem('pitchking_autosave', JSON.stringify(nextData));
                  setHistoryIndex(prev => prev + 1);
                }
              }}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              selectedThemeBg={THEMES[selectedTheme]?.colors?.background || '#0f172a'}
            />

          {/* ── Top Header — theme-aware ──────────────────── */}
          <div
            className="sticky top-0 z-40 backdrop-blur-xl border-b px-6 py-3 flex justify-between items-center shadow-xl"
            style={{
              background: `color-mix(in srgb, ${THEMES[selectedTheme]?.colors?.background || '#0f172a'} 92%, transparent)`,
              borderBottomColor: `color-mix(in srgb, ${THEMES[selectedTheme]?.colors?.primary || '#22d3ee'} 20%, transparent)`,
            }}
          >
            {/* Left: Back + Deck title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewMode('input')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-sm transition-all hover:bg-black/10"
                style={{ color: THEMES[selectedTheme]?.colors?.muted || '#94a3b8' }}
              >
                <ArrowLeft size={16} /> Back
              </button>
              <div className="h-5 w-[1px]" style={{ background: `color-mix(in srgb, ${THEMES[selectedTheme]?.colors?.text || '#f1f5f9'} 20%, transparent)` }} />
              <span className="text-sm font-semibold tracking-wide flex items-center gap-1.5" style={{ color: THEMES[selectedTheme]?.colors?.text || '#f1f5f9', opacity: 0.8 }}>
                <Star size={13} className="text-violet-400" fill="currentColor" />
                PitchKing Editor
              </span>
              <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-[11px] font-bold">Auto-saving</span>
              </div>
            </div>

            {/* Right: Export Buttons */}
            <div className="flex items-center gap-3">
              {/* Credits display */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Zap size={13} className="text-amber-400" />
                <span className="text-amber-300 text-xs font-black">{credits} Credits</span>
              </div>

              {/* PDF Export */}
              <button
                onClick={handleUnlockPro}
                disabled={isExporting || isExportingPPTX}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 border hover:opacity-90"
                style={{
                  background: `color-mix(in srgb, ${THEMES[selectedTheme]?.colors?.background || '#1e293b'} 70%, rgba(0,0,0,0.3))`,
                  color: THEMES[selectedTheme]?.colors?.text || '#f1f5f9',
                  borderColor: `color-mix(in srgb, ${THEMES[selectedTheme]?.colors?.primary || '#22d3ee'} 30%, transparent)`,
                }}
                title="Export as PDF — 25 Credits"
              >
                {isExporting ? <Loader2 className="animate-spin" size={15} /> : <Lock size={15} className="text-amber-400" />}
                <span>PDF</span>
                <span className="text-[10px] text-slate-500 font-medium flex items-center gap-0.5">25 <Zap size={10} className="text-amber-400" /></span>
              </button>

              {/* PPTX Export — Premium */}
              <button
                onClick={handleUnlockPPTX}
                disabled={isExporting || isExportingPPTX}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all disabled:opacity-50 shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #059669, #0891b2)', color: 'white' }}
                title="Export as editable PPTX — 50 Credits"
              >
                {isExportingPPTX ? <Loader2 className="animate-spin" size={15} /> : <FileBox size={15} />}
                <span>Editable PPTX</span>
                <span className="text-[10px] text-white/60 font-medium flex items-center gap-0.5">50 <Zap size={10} /></span>
              </button>
            </div>
          </div>

          {/* Scrollable Canvas — wider for bigger slides */}
          <div className="flex-1 w-full max-w-[1200px] mx-auto py-10 px-6 flex flex-col gap-12 relative z-10">
            {deckData?.slides?.map((slide: any, idx: number) => (
              <div key={idx} className="flex flex-col items-center group relative">
                
                {/* Add Slide Above (only on first) */}
                {idx === 0 && (
                  <button onClick={() => addSlide(-1)} className="absolute -top-4 z-50 bg-white border border-slate-200 text-slate-400 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100 hover:text-primary shadow-sm">
                    <Plus size={16} />
                  </button>
                )}

                <div 
                  className={`slide-container aspect-[16/9] w-full rounded-2xl overflow-hidden relative transition-all duration-300 ${selectedFont}`}
                  data-theme={selectedTheme}
                  style={{
                    background: THEMES[selectedTheme]?.colors?.background || '#0f172a',
                    boxShadow: activeSlideIndex === idx
                      ? `0 0 0 2px var(--theme-primary, #22d3ee), 0 30px 70px rgba(0,0,0,0.5), 0 0 80px color-mix(in srgb, var(--theme-primary, #22d3ee) 15%, transparent)`
                      : '0 25px 60px rgba(0,0,0,0.4)',
                    ...(deckBgImage ? {
                      backgroundImage: `url(${deckBgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    } : {})
                  }}
                  onClick={() => setActiveSlideIndex(idx)}
                >
                  {/* Background image overlay — subtle, for readability */}
                  {deckBgImage && <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'rgba(0,0,0,0.35)' }} />}

                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-black z-50 pointer-events-none" style={{ background: 'var(--theme-card, rgba(0,0,0,0.3))', color: 'var(--theme-muted, #94a3b8)' }}>
                    {idx + 1} / {deckData.slides.length}
                  </div>
                  
                  {/* Slide Controls Hover Menu */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    <button onClick={(e) => { e.stopPropagation(); moveSlide(idx, 'up'); }} disabled={idx === 0} className="p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm hover:bg-white text-slate-600 hover:text-primary disabled:opacity-30">
                      <ArrowUp size={16} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); moveSlide(idx, 'down'); }} disabled={idx === deckData.slides.length - 1} className="p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm hover:bg-white text-slate-600 hover:text-primary disabled:opacity-30">
                      <ArrowDown size={16} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteSlide(idx); }} disabled={deckData.slides.length <= 1} className="p-2 bg-red-500/80 backdrop-blur rounded-lg shadow-sm hover:bg-red-500 text-white disabled:opacity-30">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <GenericSlideRenderer 
                    slide={slide} 
                    onUpdate={(updatedSlide) => {
                      const newSlides = [...deckData.slides];
                      newSlides[idx] = updatedSlide;
                      updateDeckData({ ...deckData, slides: newSlides });
                    }}
                  />
                </div>
                
                {/* Add Slide Below */}
                <button onClick={(e) => { e.stopPropagation(); addSlide(idx); }} className="absolute -bottom-4 z-50 bg-white border border-slate-200 text-slate-400 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100 hover:text-primary shadow-sm">
                  <Plus size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Watermark Overlay (Pointer Events None) */}
          <div className="watermark-overlay fixed inset-0 pointer-events-none z-50 flex flex-col items-center justify-around opacity-[0.03] overflow-hidden">
            <span className="text-[120px] sm:text-[180px] font-black text-black transform -rotate-12 whitespace-nowrap select-none tracking-widest">PREVIEW MODE</span>
            <span className="text-[120px] sm:text-[180px] font-black text-black transform -rotate-12 whitespace-nowrap select-none tracking-widest">PREVIEW MODE</span>
            <span className="text-[120px] sm:text-[180px] font-black text-black transform -rotate-12 whitespace-nowrap select-none tracking-widest">PREVIEW MODE</span>
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setTimeout(() => handleUnlockPro(), 500);
        }} 
      />

      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        selectedTheme={selectedTheme}
        onSelectTheme={setSelectedTheme}
        deckBgImage={deckBgImage}
        onSetBgImage={setDeckBgImage}
      />
      
      <FontModal 
        isOpen={isFontModalOpen}
        onClose={() => setIsFontModalOpen(false)}
        selectedFont={selectedFont}
        onSelect={(font) => {
          setSelectedFont(font);
          if (deckData) {
            updateDeckData({ ...deckData, font: font });
          }
        }}
      />
      
      {isTemplateGalleryOpen && (
        <TemplateGalleryModal
          onClose={() => setIsTemplateGalleryOpen(false)}
          onSelectTemplate={(template: Template) => {
            updateDeckData({ slides: template.slides });
            setSelectedTheme(template.defaultTheme);
            setSelectedFont(template.defaultFont);
            setIsTemplateGalleryOpen(false);
            setViewMode('editor');
            toast.success(`Loaded ${template.title}!`);
          }}
        />
      )}
    </div>
  );
}
