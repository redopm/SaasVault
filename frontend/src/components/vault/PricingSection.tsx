import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, Loader2 } from 'lucide-react';
import { auth, loginWithGoogle } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { processPayment } from '../../utils/payment';

type Plan = {
  name: string;
  monthlyPrice: number | string;
  yearlyPrice: number | string;
  description: string;
  features: string[];
  popular?: boolean;
  comingSoon?: boolean;
  disclaimer?: string;
};

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const [audience, setAudience] = useState<'individual' | 'team'>('individual');
  const [user, setUser] = useState<User | null>(null);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleBuy = async (plan: Plan) => {
    if (plan.monthlyPrice === "Custom") {
      alert("Contact Sales triggered");
      return;
    }
    
    let currentUser = user;
    if (!currentUser) {
      try {
        currentUser = await loginWithGoogle();
      } catch (err) {
        console.error("Login required to purchase");
        return;
      }
    }

    if (!currentUser) return;

    setProcessingPlan(plan.name);
    
    // Extract credit amount from features string (naive parser for demo)
    const creditFeature = plan.features.find(f => f.includes('Vault Credits'));
    let credits = 1000;
    if (creditFeature) {
      if (creditFeature.includes('3000')) credits = 3000;
      else if (creditFeature.includes('20,000')) credits = 20000;
    }

    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    
    try {
      const token = await currentUser.getIdToken();
      const success = await processPayment(Number(price), token, credits);
      if (success) {
        setPaymentSuccess(true);
        setTimeout(() => setPaymentSuccess(false), 5000);
      }
    } catch (e) {
      console.error("Failed to get token for payment", e);
    }
    
    setProcessingPlan(null);
  };

  const individualPlans: Plan[] = [
    {
      name: "Starter",
      monthlyPrice: 499,
      yearlyPrice: 399,
      description: "Perfect for exploring the Vault.",
      features: [
        "1000 AI Vault Credits / month",
        "Access to all AI Generators",
        "Remove all Watermarks",
        "Standard Support"
      ],
      popular: false
    },
    {
      name: "Pro",
      monthlyPrice: 999,
      yearlyPrice: 799,
      description: "For professionals needing unlimited power.",
      features: [
        "3000 AI Vault Credits / month",
        "Access to all Static UI Kits",
        "Advanced Export (PPTX, PDF)",
        "Early Access to New Tools",
        "Remove all Watermarks",
        "Priority Support"
      ],
      popular: true
    },
    {
      name: "Creator",
      monthlyPrice: 5999,
      yearlyPrice: 4799,
      description: "Full access including source code.",
      features: [
        "20,000 AI Vault Credits / month",
        "Source Code for UI Kits",
        "Commercial License *",
        "Custom Domain Export",
        "Remove all Watermarks"
      ],
      popular: false,
      disclaimer: "* Commercial License allows use in client projects. Resale as standalone template prohibited. Subject to License Terms."
    }
  ];

  const teamPlans: Plan[] = [
    {
      name: "Startup",
      monthlyPrice: 1999,
      yearlyPrice: 1599,
      description: "For small teams moving fast.",
      features: [
        "Up to 3 Team Members",
        "Shared Unlimited AI Workspace",
        "Team Collaboration",
        "Priority Support"
      ],
      comingSoon: true
    },
    {
      name: "Agency",
      monthlyPrice: 7999,
      yearlyPrice: 6399,
      description: "For high-volume client work.",
      features: [
        "Up to 10 Team Members",
        "White-label Exports",
        "Dedicated Account Manager",
        "Custom Branding"
      ],
      comingSoon: true
    },
    {
      name: "Enterprise",
      monthlyPrice: "Custom",
      yearlyPrice: "Custom",
      description: "For large organizations.",
      features: [
        "Unlimited Seats",
        "API Access to Vault Models",
        "SSO Authentication",
        "SLA Guarantee"
      ],
      comingSoon: true
    }
  ];

  const currentPlans = audience === 'individual' ? individualPlans : teamPlans;

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 border-t border-white/10" id="pricing">
      {paymentSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(20,184,166,0.3)] z-50 flex items-center gap-3 font-bold">
          <Check size={24} className="bg-white/20 rounded-full p-1" />
          Payment Successful! Your credits have been added.
        </div>
      )}

      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 drop-shadow-xl">
          One Vault. <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">Infinite Possibilities.</span>
        </h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto font-medium">
          Choose a plan that scales with you. Upgrade anytime.
        </p>
      </div>

      {/* Toggles */}
      <div className="flex flex-col items-center gap-8 mb-16">
        {/* Audience Toggle */}
        <div className="flex bg-white/5 backdrop-blur-xl p-1 rounded-full border border-white/10">
          <button 
            onClick={() => setAudience('individual')}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${audience === 'individual' ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Individual
          </button>
          <button 
            onClick={() => setAudience('team')}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${audience === 'team' ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Team
          </button>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center gap-4">
          <span className={`text-sm font-bold ${!isYearly ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
          <button 
            onClick={() => setIsYearly(!isYearly)}
            className="w-14 h-7 bg-white/10 rounded-full p-1 relative transition-colors hover:bg-white/20 border border-white/20"
          >
            <motion.div 
              className="w-5 h-5 bg-teal-400 rounded-full shadow-md"
              layout
              animate={{ x: isYearly ? 28 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={`text-sm font-bold flex items-center gap-2 ${isYearly ? 'text-white' : 'text-slate-400'}`}>
            Yearly <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-1 rounded-full border border-teal-500/30">SAVE 20%</span>
          </span>
        </div>
        <p className="text-slate-500 text-xs mt-4 font-medium uppercase tracking-widest">
          All prices are inclusive of 18% GST
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnimatePresence mode="wait">
          {currentPlans.map((plan, index) => (
            <motion.div
              key={plan.name + audience}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`relative bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 border ${plan.popular ? 'border-teal-500 shadow-[0_0_40px_rgba(20,184,166,0.2)]' : 'border-white/10'} flex flex-col overflow-hidden group`}
            >
              {plan.comingSoon && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex items-center justify-center rounded-[2rem]">
                  <span className="bg-white/10 border border-white/20 text-white px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl">
                    Coming Soon
                  </span>
                </div>
              )}
              
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-teal-500 to-blue-500 text-white px-4 py-1 rounded-b-xl text-xs font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="mb-8 mt-4">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm h-10">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-extrabold text-white">
                    {plan.monthlyPrice === "Custom" ? "Custom" : `₹${isYearly ? plan.yearlyPrice : plan.monthlyPrice}`}
                  </span>
                  {plan.monthlyPrice !== "Custom" && (
                    <span className="text-slate-400 font-medium mb-1">/ month</span>
                  )}
                </div>
                {isYearly && plan.monthlyPrice !== "Custom" && typeof plan.yearlyPrice === "number" && (
                  <p className="text-teal-400 text-sm mt-2 font-medium">
                    Billed ₹{plan.yearlyPrice * 12} annually
                  </p>
                )}
              </div>

              <div className="flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300 font-medium">
                      <Check size={20} className="text-teal-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.disclaimer && (
                <div className="mt-6 flex items-start gap-2 text-xs text-slate-500 bg-white/5 p-3 rounded-xl border border-white/5">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <p>{plan.disclaimer}</p>
                </div>
              )}

              <button 
                onClick={() => handleBuy(plan)}
                disabled={processingPlan === plan.name}
                className={`mt-8 w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${plan.popular ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'} disabled:opacity-50`}
              >
                {processingPlan === plan.name ? <Loader2 className="animate-spin" size={20} /> : (plan.monthlyPrice === "Custom" ? "Contact Sales" : "Get Started")}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
