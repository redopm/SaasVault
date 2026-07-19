import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Loader2, CheckCircle2, Lock, ArrowRight, Layout, Briefcase, CheckSquare, Database, MonitorSmartphone, ShoppingBag, Store, Shield, RefreshCw, Download, Star, Cpu, BookOpen, Activity, Bitcoin, Smartphone } from 'lucide-react';
import VaultNavbar from '../../components/vault/VaultNavbar';
import AuthModal from '../../components/auth/AuthModal';
import { auth } from '../../firebase';
import { processMarketPayment } from '../../utils/marketPayment';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.PROD ? '' : 'http://localhost:10001';

interface Product {
  id: string;
  name: string;
  description: string;
  price_inr: number;
  features: string[];
  isComingSoon: boolean;
}

const getIcon = (id: string) => {
  switch(id) {
    case 'ecommerce_ui_kit': return <Store size={48} className="text-orange-400" />;
    case 'saas_dashboard_ui_kit': return <Layout size={48} className="text-purple-400" />;
    case 'agency_onboarding_kit': return <Briefcase size={48} className="text-amber-400" />;
    case 'ux_audit_checklist': return <CheckSquare size={48} className="text-green-400" />;
    case 'ai_prompt_vault': return <Database size={48} className="text-indigo-400" />;
    case 'landing_kit_saas': return <MonitorSmartphone size={48} className="text-teal-400" />;
    case 'landing_kit_ai': return <Cpu size={48} className="text-purple-400" />;
    case 'landing_kit_agency': return <Briefcase size={48} className="text-amber-400" />;
    case 'landing_kit_ecommerce': return <Store size={48} className="text-orange-400" />;
    case 'landing_kit_edtech': return <BookOpen size={48} className="text-blue-400" />;
    case 'landing_kit_mobile': return <Smartphone size={48} className="text-rose-400" />;
    case 'landing_kit_health': return <Activity size={48} className="text-emerald-400" />;
    case 'landing_kit_fintech': return <Bitcoin size={48} className="text-yellow-400" />;
    default: return <ShoppingBag size={48} className="text-teal-400" />;
  }
}

// Trust Seal Component — Premium redesign
const TrustSeals = () => (
  <div className="mt-5 space-y-4">

    {/* === Secure Checkout Banner === */}
    <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z" fill="#10b981" opacity="0.2"/>
        <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z" stroke="#10b981" strokeWidth="1.5" fill="none"/>
        <path d="M9 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div>
        <p className="text-sm font-black text-emerald-400 leading-tight">100% Secure Checkout</p>
        <p className="text-[11px] text-slate-500">256-bit SSL · PCI DSS Compliant</p>
      </div>
    </div>

    {/* === Payment Methods === */}
    <div className="rounded-xl border border-white/10 bg-white/3 p-4 space-y-3">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-3">Accepted Payment Methods</p>
      
      <div className="flex flex-wrap items-center gap-2">

        {/* ── VISA ── */}
        <div className="bg-white rounded-lg px-3 py-1.5 h-9 flex items-center justify-center shadow-sm">
          <svg viewBox="0 7 24 10" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" fill="#1434CB"/>
          </svg>
        </div>

        {/* ── MASTERCARD ── */}
        <div className="bg-white rounded-lg px-2.5 py-1.5 h-9 flex items-center justify-center shadow-sm">
          <svg viewBox="0 0 50 30" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="15" r="13" fill="#EB001B"/>
            <circle cx="32" cy="15" r="13" fill="#F79E1B"/>
            <path d="M25 5.5a13 13 0 0 1 0 19A13 13 0 0 1 25 5.5z" fill="#FF5F00"/>
          </svg>
        </div>

        {/* ── UPI — real official logo ── */}
        <div className="bg-white rounded-lg px-2.5 py-1.5 h-9 flex items-center justify-center shadow-sm">
          <img
            src="https://images.icon-icons.com/2699/PNG/512/upi_logo_icon_169316.png"
            alt="UPI"
            className="h-6 w-auto"
          />
        </div>

        {/* ── NET BANKING ── */}
        <div className="bg-white rounded-lg px-2.5 py-1.5 h-9 flex items-center gap-1.5 shadow-sm">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 10.5L12 4l9 6.5V12H3v-1.5z" fill="#1e40af"/>
            <rect x="4" y="12" width="16" height="7" rx="0.5" fill="#1e40af" opacity="0.7"/>
            <rect x="9.5" y="13.5" width="5" height="5.5" rx="0.5" fill="white"/>
            <rect x="3" y="19" width="18" height="1.5" rx="0.5" fill="#1e40af"/>
          </svg>
          <span className="text-[10px] font-black text-slate-700">Net Banking</span>
        </div>
      </div>

      {/* ── Razorpay powered-by row ── */}
      <div className="flex items-center gap-2 pt-1 border-t border-white/8">
        {/* Razorpay SVG logo (inline) */}
        <svg viewBox="0 0 120 30" className="h-5 w-auto" xmlns="http://www.w3.org/2000/svg">
          {/* Razorpay wordmark in white */}
          <text x="32" y="22" fontSize="15" fontWeight="800" fontFamily="'Helvetica Neue',Arial,sans-serif" fill="#6c7589">razorpay</text>
          {/* Razorpay blade icon (simplified) */}
          <polygon points="8,4 22,4 14,14 20,14 8,28 12,16 6,16" fill="#2d9cdb"/>
        </svg>
        <span className="text-[10px] text-slate-600 font-semibold">Secured by Razorpay</span>
      </div>
    </div>

    {/* === Trust Badges Row === */}
    <div className="grid grid-cols-3 gap-2">
      {[
        { icon: (
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" fill="#f59e0b" opacity="0.15"/>
            <path d="M4 12v5a2 2 0 002 2h12a2 2 0 002-2v-5" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M16 6l-4 4-4-4" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="12" y1="2" x2="12" y2="10" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ), label: 'Instant Delivery', color: 'text-blue-400' },
        { icon: (
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="4" stroke="#f59e0b" strokeWidth="1.5"/>
          </svg>
        ), label: 'Lifetime Access', color: 'text-amber-400' },
        { icon: (
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6l-8-4z" stroke="#10b981" strokeWidth="1.5" fill="#10b981" fillOpacity="0.1"/>
            <path d="M9 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ), label: 'Buyer Protected', color: 'text-emerald-400' },
      ].map((badge, i) => (
        <div key={i} className="flex flex-col items-center gap-2 bg-white/4 border border-white/8 rounded-xl p-3 text-center hover:bg-white/8 transition-colors">
          {badge.icon}
          <span className={`text-[10px] font-bold ${badge.color} leading-tight`}>{badge.label}</span>
        </div>
      ))}
    </div>

    {/* === Star Rating === */}
    <div className="flex items-center justify-center gap-2">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg key={i} viewBox="0 0 20 20" className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1l2.39 5.26L18 7.27l-4 3.9.94 5.5L10 14.1l-4.94 2.57.94-5.5-4-3.9 5.61-.81z" fill="#f59e0b"/>
          </svg>
        ))}
      </div>
      <span className="text-[11px] font-bold text-slate-500">4.9/5 · Verified buyers</span>
    </div>
  </div>
);



export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [alreadyPurchased, setAlreadyPurchased] = useState(false);
  const [accessLink, setAccessLink] = useState('');

  useEffect(() => {
    fetchProductDetails();
    if (auth.currentUser) {
      checkPurchaseHistory();
    }
    
    // Listen for auth state changes to re-check purchase history
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkPurchaseHistory();
      } else {
        setAlreadyPurchased(false);
        setAccessLink('');
      }
    });
    return () => unsubscribe();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/api/saas-market/products`);
      const data = await res.json();
      if (data.success && id && data.products[id]) {
        setProduct(data.products[id]);
      } else {
        toast.error("Product not found");
        navigate('/market');
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const checkPurchaseHistory = async () => {
    if (!auth.currentUser) return;
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`${API_URL}/api/saas-market/my-purchases`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        const purchase = data.purchases.find((p: any) => p.product_id === id);
        if (purchase) {
          setAlreadyPurchased(true);
          setAccessLink(purchase.access_link);
        }
      }
    } catch (error) {
      console.error("Failed to check purchase history", error);
    }
  };

  const handleBuyNow = async () => {
    if (!product || product.isComingSoon || alreadyPurchased) return;
    
    if (!auth.currentUser) {
      toast.error("Please login to purchase");
      setIsAuthModalOpen(true);
      return;
    }

    setIsProcessing(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const result = await processMarketPayment(product.id, token);
      
      if (result.success && result.link) {
        navigate('/purchase-success', { state: { link: result.link, productName: product.name } });
      } else if (result.error === 'You have already purchased this product') {
        toast.success("You already own this product!");
        checkPurchaseHistory(); // Refresh state
      } else {
        toast.error(result.error || "Payment failed or cancelled");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (accessLink === 'FIREBASE_STORAGE') {
      setIsProcessing(true);
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`${API_URL}/api/saas-market/download/${product?.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.url) {
          window.open(data.url, '_blank');
        } else {
          toast.error(data.error || "Failed to generate download link");
        }
      } catch (error) {
        toast.error("Download failed");
      } finally {
        setIsProcessing(false);
      }
    } else {
      window.open(accessLink, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center">
        <Loader2 className="animate-spin text-teal-400" size={48} />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-teal-500/30 pb-20">
      <VaultNavbar />
      
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-32">
        <button onClick={() => navigate('/market')} className="text-slate-400 hover:text-white font-bold text-sm mb-8 flex items-center gap-2 transition-colors">
          &larr; Back to Store
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Product Details */}
          <div className="lg:col-span-8">
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 backdrop-blur-xl mb-8">
              <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
                <div className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner shrink-0">
                  {getIcon(product.id)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold tracking-widest text-teal-400 uppercase bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">Digital Product</span>
                    {product.isComingSoon && <span className="text-xs font-bold tracking-widest text-amber-300 uppercase bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">In Development</span>}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{product.name}</h1>
                  <p className="text-xl text-slate-300 leading-relaxed">{product.description}</p>
                </div>
              </div>

              <hr className="border-white/10 my-10" />

              <h3 className="text-2xl font-bold mb-6">What's Included</h3>
              <ul className="space-y-4">
                {product.features && product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="text-teal-400 shrink-0 mt-1" size={20} />
                    <span className="text-slate-300 text-lg leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Checkout Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 bg-white/5 border border-white/20 rounded-[2rem] p-8 backdrop-blur-2xl shadow-2xl">
              <div className="mb-8">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs block mb-2">Total Price</span>
                <div className="text-5xl font-black text-white tracking-tighter">
                  ₹{product.price_inr}
                </div>
                <p className="text-sm text-slate-400 mt-2">One-time payment. Lifetime access.</p>
              </div>

              {alreadyPurchased ? (
                <div className="space-y-4">
                  <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 text-center">
                    <p className="text-emerald-400 font-bold text-sm mb-1">✓ Already Purchased</p>
                    <p className="text-xs text-slate-300">You have full access to this product.</p>
                  </div>
                  <button 
                    onClick={handleDownload}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20 disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={18} /> : null}
                    Access Product <ArrowRight size={18} />
                  </button>
                </div>
              ) : product.isComingSoon ? (
                <button disabled className="w-full flex items-center justify-center gap-2 py-4 bg-slate-800 text-slate-400 font-bold rounded-xl border border-slate-700 cursor-not-allowed">
                  <Lock size={18} />
                  Coming Soon
                </button>
              ) : (
                <button 
                  onClick={handleBuyNow}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-black text-lg rounded-xl transition-all shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:shadow-[0_0_50px_rgba(20,184,166,0.5)] disabled:opacity-70"
                >
                  {isProcessing ? <Loader2 className="animate-spin" size={24} /> : <ShoppingCart size={24} />}
                  {isProcessing ? 'Processing...' : 'Buy Now'}
                </button>
              )}

              <TrustSeals />
            </div>
          </div>

        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => {
          setIsAuthModalOpen(false);
          checkPurchaseHistory(); // Check history after login just in case
        }} 
      />
    </div>
  );
}
