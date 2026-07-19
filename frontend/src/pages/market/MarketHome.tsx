import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Loader2, Layout, Briefcase, CheckSquare, Database, MonitorSmartphone, Store, Star, Zap, ArrowRight, Cpu, BookOpen, Activity, Bitcoin, Smartphone } from 'lucide-react';
import VaultNavbar from '../../components/vault/VaultNavbar';
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

// Per-product config: icon, accent color, glow color
const PRODUCT_CONFIG: Record<string, { icon: React.ReactNode; accent: string; glow: string; badge: string; featured?: boolean }> = {
  ecommerce_ui_kit: {
    icon: <Store size={28} strokeWidth={2.5} className="text-orange-400" />,
    accent: 'from-orange-500/25 via-rose-500/15 to-transparent border-orange-500/30 hover:border-orange-500/60 hover:shadow-[0_0_50px_rgba(249,115,22,0.2)]',
    glow: 'bg-orange-500/15',
    badge: 'text-orange-300 bg-orange-500/20 border border-orange-500/40',
    featured: true,
  },
  saas_dashboard_ui_kit: {
    icon: <Layout size={28} strokeWidth={2.5} className="text-purple-400" />,
    accent: 'from-purple-500/20 via-indigo-500/10 to-transparent border-purple-500/30 hover:border-purple-500/60 hover:shadow-[0_0_50px_rgba(168,85,247,0.2)]',
    glow: 'bg-purple-500/15',
    badge: 'text-purple-300 bg-purple-500/20 border border-purple-500/40',
  },
  agency_onboarding_kit: {
    icon: <Briefcase size={28} strokeWidth={2.5} className="text-amber-400" />,
    accent: 'from-amber-500/10 to-transparent border-white/10',
    glow: 'bg-amber-500/10',
    badge: 'text-amber-300 bg-amber-500/20',
  },
  ux_audit_checklist: {
    icon: <CheckSquare size={28} strokeWidth={2.5} className="text-emerald-400" />,
    accent: 'from-emerald-500/10 to-transparent border-white/10',
    glow: 'bg-emerald-500/10',
    badge: 'text-emerald-300 bg-emerald-500/20',
  },

  landing_kit_saas: {
    icon: <MonitorSmartphone size={28} strokeWidth={2.5} className="text-teal-400" />,
    accent: 'from-teal-500/10 to-transparent border-white/10',
    glow: 'bg-teal-500/10',
    badge: 'text-teal-300 bg-teal-500/20',
  },
  landing_kit_ai: {
    icon: <Cpu size={28} strokeWidth={2.5} className="text-purple-400" />,
    accent: 'from-purple-500/10 to-transparent border-white/10',
    glow: 'bg-purple-500/10',
    badge: 'text-purple-300 bg-purple-500/20',
  },
  landing_kit_agency: {
    icon: <Briefcase size={28} strokeWidth={2.5} className="text-amber-400" />,
    accent: 'from-amber-500/10 to-transparent border-white/10',
    glow: 'bg-amber-500/10',
    badge: 'text-amber-300 bg-amber-500/20',
  },
  landing_kit_ecommerce: {
    icon: <Store size={28} strokeWidth={2.5} className="text-orange-400" />,
    accent: 'from-orange-500/10 to-transparent border-white/10',
    glow: 'bg-orange-500/10',
    badge: 'text-orange-300 bg-orange-500/20',
  },
  landing_kit_edtech: {
    icon: <BookOpen size={28} strokeWidth={2.5} className="text-blue-400" />,
    accent: 'from-blue-500/10 to-transparent border-white/10',
    glow: 'bg-blue-500/10',
    badge: 'text-blue-300 bg-blue-500/20',
  },
  landing_kit_mobile: {
    icon: <Smartphone size={28} strokeWidth={2.5} className="text-rose-400" />,
    accent: 'from-rose-500/10 to-transparent border-white/10',
    glow: 'bg-rose-500/10',
    badge: 'text-rose-300 bg-rose-500/20',
  },
  landing_kit_health: {
    icon: <Activity size={28} strokeWidth={2.5} className="text-emerald-400" />,
    accent: 'from-emerald-500/10 to-transparent border-white/10',
    glow: 'bg-emerald-500/10',
    badge: 'text-emerald-300 bg-emerald-500/20',
  },
  landing_kit_fintech: {
    icon: <Bitcoin size={28} strokeWidth={2.5} className="text-yellow-400" />,
    accent: 'from-yellow-500/10 to-transparent border-white/10',
    glow: 'bg-yellow-500/10',
    badge: 'text-yellow-300 bg-yellow-500/20',
  },
};

const getConfig = (id: string) => PRODUCT_CONFIG[id] ?? {
  icon: <ShoppingBag size={28} strokeWidth={2.5} className="text-teal-400" />,
  accent: 'from-teal-500/10 to-transparent border-white/10',
  glow: 'bg-teal-500/10',
  badge: 'text-teal-300 bg-teal-500/20',
  featured: false,
};

export default function MarketHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/saas-market/products`);
      const data = await res.json();
      if (data.success) {
        const prods: Product[] = Object.entries(data.products).map(([id, p]: [string, any]) => ({ id, ...p }));
        // Sort: live products first, then coming soon
        prods.sort((a, b) => {
          if (!a.isComingSoon && b.isComingSoon) return -1;
          if (a.isComingSoon && !b.isComingSoon) return 1;
          return 0;
        });
        setProducts(prods);
      } else {
        toast.error("Failed to load store products");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const liveCount = products.filter(p => !p.isComingSoon).length;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-teal-500/30 pb-24">
      <VaultNavbar />

      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.15), transparent 60%)' }} />
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.12), transparent 60%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 md:pt-36">

        {/* Hero */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6 text-sm font-bold text-slate-300 backdrop-blur-sm">
            <Zap size={14} className="text-amber-400 fill-amber-400" />
            <span>{liveCount} Product{liveCount !== 1 ? 's' : ''} Available Now</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-5 leading-none">
            SaaS Vault <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Store</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Premium UI kits, templates & digital assets crafted for founders building products people love.
          </motion.p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-teal-400" size={44} />
            <p className="text-slate-500 font-medium">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => {
              const cfg = getConfig(product.id);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group"
                >
                  {/* Featured badge */}
                  {cfg.featured && !product.isComingSoon && (
                    <div className="absolute -top-3 left-6 z-20 flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[11px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-lg shadow-orange-500/30">
                      <Star size={10} className="fill-white" /> New Launch
                    </div>
                  )}

                  <Link to={`/product/${product.id}`} className="block h-full">
                    <div className={`relative h-full bg-gradient-to-b ${cfg.accent} border rounded-3xl p-7 backdrop-blur-sm transition-all duration-300 flex flex-col overflow-hidden ${product.isComingSoon ? 'opacity-60 cursor-not-allowed' : ''}`}>
                      
                      {/* Glow blob inside card */}
                      <div className={`absolute top-0 right-0 w-40 h-40 rounded-full ${cfg.glow} blur-xl pointer-events-none transition-opacity group-hover:opacity-100`} />

                      {/* Icon box */}
                      <div className={`relative z-10 w-14 h-14 rounded-2xl ${cfg.glow} border border-white/10 flex items-center justify-center mb-7 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                        {cfg.icon}
                      </div>

                      {/* Header row */}
                      <div className="relative z-10 flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black tracking-[0.15em] text-slate-500 uppercase">Digital Product</span>
                        {product.isComingSoon ? (
                          <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-500/20 border border-amber-500/30 rounded-full">
                            Coming Soon
                          </span>
                        ) : (
                          <span className={`px-3.5 py-1.5 text-xs font-black rounded-full ${cfg.badge}`}>
                            ₹{product.price_inr}
                          </span>
                        )}
                      </div>

                      {/* Product name */}
                      <h3 className="relative z-10 text-xl font-black mb-3 tracking-tight leading-tight group-hover:text-white transition-colors">
                        {product.name}
                      </h3>

                      {/* Description */}
                      <p className="relative z-10 text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                        {product.description}
                      </p>

                      {/* Features pills */}
                      {product.features && product.features.length > 0 && !product.isComingSoon && (
                        <div className="relative z-10 flex flex-wrap gap-2 mb-6">
                          {product.features.slice(0, 3).map((f, fi) => (
                            <span key={fi} className="text-[10px] font-bold text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                              {f}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* CTA row */}
                      <div className="relative z-10 pt-5 border-t border-white/10 flex items-center justify-between">
                        <span className={`inline-flex items-center gap-2 text-sm font-black transition-colors ${
                          product.isComingSoon ? 'text-slate-600' : 'text-slate-300 group-hover:text-white'
                        }`}>
                          {product.isComingSoon ? 'Notify Me' : 'View Details'}
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        {!product.isComingSoon && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                            Live ●
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Trust & Security Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
          className="mt-20 space-y-6">
          
          {/* Main trust bar */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { icon: '🔒', title: '256-bit SSL', sub: 'Encrypted & Secure' },
              { icon: '⚡', title: 'Instant Download', sub: 'Delivered immediately' },
              { icon: '♾️', title: 'Lifetime Access', sub: 'Buy once, use forever' },
              { icon: '🛡️', title: 'Buyer Protection', sub: 'Razorpay guaranteed' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 backdrop-blur-sm hover:border-white/20 transition-colors">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-black text-white leading-tight">{item.title}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment methods bar */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Accepted payments:</span>
            
            {/* Visa */}
            <div className="bg-white rounded-md px-2.5 py-1.5 h-8 flex items-center justify-center shadow-sm">
              <svg viewBox="0 7 24 10" className="h-4.5 w-auto" xmlns="http://www.w3.org/2000/svg" style={{ height: '18px' }}>
                <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" fill="#1434CB"/>
              </svg>
            </div>

            {/* Mastercard */}
            <div className="bg-white rounded-md px-2 py-1.5 h-8 flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 50 30" className="h-4 w-auto" xmlns="http://www.w3.org/2000/svg">
                <circle cx="18" cy="15" r="13" fill="#EB001B"/>
                <circle cx="32" cy="15" r="13" fill="#F79E1B"/>
                <path d="M25 5.5a13 13 0 0 1 0 19A13 13 0 0 1 25 5.5z" fill="#FF5F00"/>
              </svg>
            </div>

            {/* UPI - official logo image */}
            <div className="bg-white rounded-md px-2.5 py-1.5 h-8 flex items-center justify-center shadow-sm">
              <img
                src="https://images.icon-icons.com/2699/PNG/512/upi_logo_icon_169316.png"
                alt="UPI"
                className="h-5 w-auto"
              />
            </div>

            {/* Razorpay */}
            <div className="flex items-center gap-2 bg-white/8 border border-white/15 rounded-lg px-3.5 py-2">
              <img
                src="https://razorpay.com/favicon.png"
                alt="Razorpay" className="h-4 w-4 rounded"
                onError={(e: any) => { e.target.style.display='none'; }}
              />
              <span className="text-[11px] font-black text-slate-300">Powered by Razorpay</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
