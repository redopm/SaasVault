import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, UserCircle, LogOut, Coins } from 'lucide-react';
import { auth, logout, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import AuthModal from '../auth/AuthModal';

export default function VaultNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
        setCredits(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    setIsAuthModalOpen(true);
  };

  const navigate = useNavigate();
  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const scrollToPricing = () => {
      const el = document.getElementById('pricing');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    };
    // If already on home page, just scroll directly
    if (window.location.pathname === '/') {
      scrollToPricing();
    } else {
      // Navigate to home first, then scroll after page loads
      navigate('/');
      setTimeout(scrollToPricing, 300);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
          </span>
          <span className="text-white font-extrabold tracking-tight text-xl">SaaS Vault</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/market" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
            Market
          </Link>
          <button onClick={handlePricingClick} className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden md:block">
            Pricing
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              
              {user.email === 'opmaury001@gmail.com' ? (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-purple-400">
                  <span className="text-xs font-extrabold uppercase tracking-widest">Admin Access</span>
                </div>
              ) : credits !== null && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-teal-400">
                  <Coins size={14} />
                  <span className="text-sm font-bold">{credits} <span className="text-teal-400/70 font-medium">Credits</span></span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-5 h-5 rounded-full" />
                ) : (
                  <UserCircle size={18} />
                )}
                <span className="hidden md:inline-block">{user.displayName || user.email?.split('@')[0]}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-slate-400 hover:text-rose-400 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLogin}
              className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg hover:shadow-[0_0_15px_rgba(20,184,166,0.5)] transition-all"
            >
              <LogIn size={16} />
              Login
            </button>
          )}
        </div>
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => setIsAuthModalOpen(false)} 
      />
    </nav>
  );
}
