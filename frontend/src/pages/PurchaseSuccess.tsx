import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ExternalLink, ArrowLeft } from 'lucide-react';
import VaultNavbar from '../components/vault/VaultNavbar';

export default function PurchaseSuccess() {
  const location = useLocation();
  const { link, productName } = location.state || {};

  if (!link) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-screen text-white font-sans bg-slate-950 flex flex-col">
      <VaultNavbar />
      
      {/* Background Glow */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10 px-4 pt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white/10 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl p-10 max-w-lg w-full text-center shadow-[0_20px_80px_rgba(16,185,129,0.2)]"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.4)]"
          >
            <CheckCircle size={48} className="text-emerald-400" />
          </motion.div>

          <h1 className="text-4xl font-black text-white mb-4 tracking-tight drop-shadow-md">
            Payment Successful!
          </h1>
          
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            Thank you for purchasing <strong className="text-white">{productName || 'the product'}</strong>. Your access link is ready.
          </p>

          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-transform hover:scale-105 mb-6"
          >
            Access Your Product <ExternalLink size={20} />
          </a>
          
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-8">
            <p className="text-sm text-amber-200 font-medium">
              Important: Please bookmark or save the link above. It will also be sent to your registered email shortly (if email delivery is configured).
            </p>
          </div>

          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-semibold transition-colors">
            <ArrowLeft size={16} /> Back to Vault
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
