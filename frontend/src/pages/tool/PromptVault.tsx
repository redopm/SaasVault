import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Copy, CheckCircle2, Lock, Sparkles, Filter } from 'lucide-react';
import VaultNavbar from '../../components/vault/VaultNavbar';
import AuthModal from '../../components/auth/AuthModal';
import { auth } from '../../firebase';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.PROD ? '' : 'http://localhost:10001';

interface Prompt {
  id: string;
  category: string;
  title: string;
  description: string;
  promptText: string;
}

export default function PromptVault() {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(auth.currentUser);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchPrompts(currentUser);
      } else {
        setLoading(false);
        setHasAccess(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchPrompts = async (currentUser: any) => {
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`${API_URL}/api/prompt-vault/prompts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setPrompts(data.prompts);
        setHasAccess(true);
      } else {
        // If not successful, they likely don't have access
        setHasAccess(false);
      }
    } catch (error) {
      console.error(error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Prompt copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = ['All', ...Array.from(new Set(prompts.map(p => p.category)))];

  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredPrompts.length / itemsPerPage);
  const paginatedPrompts = filteredPrompts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 font-inter text-slate-800">
      <Helmet>
        <title>AI Prompt Vault | Premium ChatGPT & Claude Prompts</title>
        <meta name="description" content="Unlock advanced AI prompts for SaaS founders, marketers, and developers. Get better results from ChatGPT, Claude, and Midjourney." />
        <meta property="og:title" content="AI Prompt Vault | Premium Prompts" />
        <meta property="og:description" content="Unlock advanced AI prompts for SaaS founders, marketers, and developers." />
      </Helmet>

      <VaultNavbar />

      <main className="max-w-6xl mx-auto px-6 py-24">
        {/* Header Section */}
        <div className="mb-12">
          <Link to="/vault" className="inline-flex items-center text-sm font-medium text-pink-500 hover:text-pink-700 transition-colors mb-6">
            <ArrowLeft size={16} className="mr-2" /> Back to Vault
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 flex items-center gap-3">
            <Sparkles className="text-pink-500" size={40} />
            AI Prompt Vault
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            A premium collection of expertly crafted AI prompts to 10x your productivity in Marketing, Coding, SEO, and Sales.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        )}

        {/* Locked Paywall State */}
        {!loading && !hasAccess && (
          <div className="relative rounded-3xl overflow-hidden bg-white/50 backdrop-blur-xl border border-white p-12 text-center shadow-xl shadow-pink-500/10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-pink-50/90 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Lock size={32} className="text-pink-500" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Vault is Locked</h2>
              <p className="text-slate-600 mb-8 max-w-md">
                You need an active SaaS Vault subscription to access these premium prompts.
              </p>
              {!user ? (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="px-8 py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-full font-bold shadow-lg shadow-pink-500/30 transition-all hover:scale-105"
                >
                  Sign in to Access
                </button>
              ) : (
                <a 
                  href="/#pricing"
                  className="inline-block px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold shadow-lg shadow-slate-900/20 transition-all hover:scale-105"
                >
                  Get SaaS Vault Access
                </a>
              )}
            </div>
          </div>
        )}

        {/* Vault Content */}
        {!loading && hasAccess && (
          <div className="space-y-8">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/60 p-4 rounded-2xl border border-pink-100 backdrop-blur-md shadow-sm">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search prompts..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                <Filter size={20} className="text-slate-400 mr-2 shrink-0" />
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat 
                        ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20' 
                        : 'bg-white text-slate-600 hover:bg-pink-50 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPrompts.length > 0 ? (
                paginatedPrompts.map((prompt) => (
                  <motion.div 
                    key={prompt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 border border-pink-100 shadow-xl shadow-pink-500/5 hover:shadow-2xl hover:shadow-pink-500/10 transition-all flex flex-col group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-transparent rounded-bl-full -mr-16 -mt-16 pointer-events-none transition-transform group-hover:scale-150"></div>
                    
                    <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 text-xs font-bold rounded-full w-fit mb-4">
                      {prompt.category}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                      {prompt.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-6 flex-grow">
                      {prompt.description}
                    </p>
                    
                    <div className="relative mt-auto">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none h-24 bottom-0"></div>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 h-32 overflow-hidden text-sm text-slate-600 font-mono relative opacity-70">
                        {prompt.promptText}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setSelectedPrompt(prompt)}
                      className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-pink-600 text-white rounded-xl font-bold transition-colors group/btn"
                    >
                      View Prompt
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 text-slate-500">
                  No prompts found matching your search.
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <span className="text-slate-500 font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedPrompt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedPrompt(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white/20"
            >
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-start bg-gradient-to-b from-pink-50/50 to-white">
                <div>
                  <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 text-xs font-bold rounded-full mb-3">
                    {selectedPrompt.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                    {selectedPrompt.title}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedPrompt(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors shrink-0"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-slate-50/50">
                <p className="text-slate-600 mb-8 text-lg leading-relaxed">{selectedPrompt.description}</p>
                <div className="bg-[#0f172a] rounded-2xl p-6 md:p-8 text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap shadow-inner overflow-x-auto selection:bg-pink-500/30">
                  {selectedPrompt.promptText}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 bg-white">
                <button 
                  onClick={() => handleCopy(selectedPrompt.id, selectedPrompt.promptText)}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-pink-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  {copiedId === selectedPrompt.id ? (
                    <><CheckCircle2 size={24} className="text-white drop-shadow-md" /> Copied to Clipboard!</>
                  ) : (
                    <><Copy size={24} /> Copy Full Prompt</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={() => setShowAuthModal(false)} />
    </div>
  );
}
