import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Download, CreditCard, Clock, CheckCircle2, User as UserIcon, XCircle } from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import VaultNavbar from '../components/vault/VaultNavbar';

const apiUrl = import.meta.env.PROD ? '' : 'http://localhost:10001';

interface UserProfileData {
  vault_credits: number;
  name: string;
  email: string;
  plan_months?: number; // Optional, can be derived
}

interface Purchase {
  product_id: string;
  product_name: string;
  amount_paid: number;
  download_count: number;
  created_at: any;
}

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      window.location.href = '/';
      return;
    }

    const fetchData = async () => {
      try {
        const token = await user.getIdToken();
        
        // Fetch Profile
        const profileRes = await fetch(`${apiUrl}/api/user/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileJson = await profileRes.json();
        
        // Fetch Purchases
        const purchasesRes = await fetch(`${apiUrl}/api/saas-market/my-purchases`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const purchasesJson = await purchasesRes.json();

        if (profileJson.success) setProfileData(profileJson.data);
        if (purchasesJson.success) setPurchases(purchasesJson.purchases);
        
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  const handleDownload = async (productId: string) => {
    try {
      const token = await user?.getIdToken();
      if (!token) return;

      const res = await fetch(`${apiUrl}/api/saas-market/download/${productId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success && data.url) {
        window.open(data.url, '_blank');
        
        // Update local state to reflect download count
        setPurchases(prev => prev.map(p => 
          p.product_id === productId ? { ...p, download_count: (p.download_count || 0) + 1 } : p
        ));
      } else {
        alert(data.error || 'Failed to generate download link');
      }
    } catch (err) {
      alert('Network error while downloading');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <VaultNavbar />
      
      <main className="max-w-6xl mx-auto px-6 py-32">
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight mb-2">My Dashboard</h1>
          <p className="text-slate-400">Manage your credits, subscriptions, and digital products.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 flex items-center gap-3">
            <XCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile & Credits Sidebar */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold">
                  {profileData?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || <UserIcon />}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{profileData?.name || 'User'}</h2>
                  <p className="text-sm text-slate-400">{profileData?.email || user?.email}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Vault Credits
                  </div>
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                    {profileData?.vault_credits?.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Available for PitchKing & PromptVault</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Digital Vault (Purchased Products) */}
            <section>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Package className="w-6 h-6 text-indigo-400" />
                My Digital Vault
              </h3>
              
              {purchases.length === 0 ? (
                <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-12 text-center">
                  <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-slate-300 mb-2">No products yet</h4>
                  <p className="text-slate-500 mb-6">You haven't purchased any UI kits or templates.</p>
                  <a href="/market" className="inline-flex items-center justify-center px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors">
                    Browse Marketplace
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {purchases.map((purchase, idx) => (
                    <motion.div 
                      key={purchase.product_id + idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 flex flex-col"
                    >
                      <h4 className="font-bold text-lg mb-1">{purchase.product_name || purchase.product_id}</h4>
                      <p className="text-sm text-slate-400 mb-6">
                        Purchased on {new Date(purchase.created_at).toLocaleDateString()}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">
                          {purchase.download_count || 0}/5 Downloads Used
                        </span>
                        
                        <button
                          onClick={() => handleDownload(purchase.product_id)}
                          disabled={(purchase.download_count || 0) >= 5}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
