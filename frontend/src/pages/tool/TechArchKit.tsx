import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Sparkles, Download, Copy, Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import mermaid from 'mermaid';
import toast from 'react-hot-toast';
import VaultNavbar from '../../components/vault/VaultNavbar';
import AuthModal from '../../components/auth/AuthModal';
import { auth } from '../../firebase';
import { getIdToken } from 'firebase/auth';

const API_URL = import.meta.env.PROD ? '' : 'http://localhost:10001';

export default function TechArchKit() {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mermaidCode, setMermaidCode] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);
  
  const mermaidRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        primaryColor: '#0f172a',
        primaryTextColor: '#f8fafc',
        primaryBorderColor: '#334155',
        lineColor: '#64748b',
        secondaryColor: '#1e293b',
        tertiaryColor: '#1e293b'
      },
      flowchart: {
        defaultRenderer: 'elk',
        curve: 'stepAfter'
      },
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif'
    });
  }, []);

  useEffect(() => {
    const renderMermaid = async () => {
      if (mermaidCode && mermaidRef.current) {
        setRenderError(null);
        try {
          mermaidRef.current.innerHTML = '';
          const { svg } = await mermaid.render('mermaid-svg-generated', mermaidCode);
          if (mermaidRef.current) {
             mermaidRef.current.innerHTML = svg;
          }
        } catch (error) {
          console.error("Mermaid Render Error:", error);
          setRenderError("Failed to render diagram. The generated syntax was invalid.");
          handleRefund();
        }
      }
    };
    renderMermaid();
  }, [mermaidCode]);

  const handleRefund = async () => {
    if (isProcessingRefund) return;
    setIsProcessingRefund(true);
    
    try {
      const user = auth.currentUser;
      if (!user) return;
      
      const token = await getIdToken(user);
      const response = await fetch(`${API_URL}/api/arch-kit/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: 'parse_error' })
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success("Diagram generation failed. Your 15 Vault Credits have been refunded.");
      } else {
        toast.error("Failed to refund credits. Please contact support.");
      }
    } catch (error) {
      console.error("Refund error:", error);
    } finally {
      setIsProcessingRefund(false);
    }
  };

  const handleGenerate = async () => {
    if (!description.trim() || description.length < 5) {
      toast.error('Please enter a longer description.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsGenerating(true);
    setMermaidCode(null);
    setRenderError(null);

    try {
      const token = await getIdToken(user);
      const response = await fetch(`${API_URL}/api/arch-kit/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ description })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          toast.error(data.error);
          navigate('/user/profile');
        } else {
          throw new Error(data.error || 'Failed to generate diagram');
        }
      } else {
        toast.success(`Generated! Deducted ${data.credits_deducted} Credits.`);
        setMermaidCode(data.mermaid_code);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyCode = () => {
    if (mermaidCode) {
      navigator.clipboard.writeText(mermaidCode);
      toast.success('Mermaid code copied to clipboard!');
    }
  };

  const downloadSvg = () => {
    if (mermaidRef.current) {
      const svgElement = mermaidRef.current.querySelector('svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'architecture_diagram.svg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error('No SVG found to download.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 flex flex-col">
      <Helmet>
        <title>Technical Arch Kit | SaaS Vault</title>
      </Helmet>
      
      <VaultNavbar />
      
      <main className="flex-grow pt-24 pb-20 px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
              <ArrowLeft size={24} className="text-slate-400" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-red-500 flex items-center">
                <Sparkles className="mr-3 text-rose-400" size={28} />
                Technical Arch Kit
              </h1>
              <p className="text-slate-400 mt-1">Generate Mermaid.js System Architecture diagrams instantly using AI.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Describe your architecture
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. A React frontend connecting to a Node.js API, saving data to MongoDB and using Redis for caching."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 h-48 focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                  maxLength={3000}
                />
                <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                  <span>{description.length}/3000</span>
                  <span className="text-rose-400 font-medium">15 Credits</span>
                </div>
                
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || description.length < 5}
                  className="mt-6 w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isGenerating ? (
                    <><Loader2 className="animate-spin mr-2" size={20} /> Generating...</>
                  ) : (
                    <><Sparkles className="mr-2" size={20} /> Generate Diagram</>
                  )}
                </button>
              </div>
              
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start space-x-3 text-sm text-rose-200">
                <AlertTriangle size={20} className="text-rose-400 flex-shrink-0 mt-0.5" />
                <p>If the AI generates invalid Mermaid syntax that fails to render, your 15 credits will be <strong>automatically refunded</strong>.</p>
              </div>
            </div>

            {/* Output Section */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden h-[600px] flex flex-col relative">
                
                {/* Toolbar */}
                <div className="bg-slate-800/80 border-b border-slate-700 p-4 flex justify-between items-center">
                  <h3 className="font-medium text-slate-200">Live Preview</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={copyCode}
                      disabled={!mermaidCode || !!renderError}
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Copy Mermaid Code"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={downloadSvg}
                      disabled={!mermaidCode || !!renderError}
                      className="p-2 bg-rose-500 hover:bg-rose-600 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      title="Download SVG"
                    >
                      <Download size={18} className="mr-2" />
                      <span className="text-sm font-medium">Export</span>
                    </button>
                  </div>
                </div>

                {/* Canvas */}
                <div className="flex-grow p-6 overflow-auto bg-slate-900/50 relative">
                  {!mermaidCode && !isGenerating && !renderError && (
                    <div className="absolute inset-0 text-slate-500 flex flex-col items-center justify-center text-center">
                      <Sparkles size={48} className="mb-4 opacity-20" />
                      <p>Your generated architecture diagram will appear here.</p>
                    </div>
                  )}
                  
                  {isGenerating && (
                    <div className="absolute inset-0 text-rose-400 flex flex-col items-center justify-center">
                      <Loader2 size={40} className="animate-spin mb-4" />
                      <p className="animate-pulse">AI is mapping your architecture...</p>
                    </div>
                  )}

                  {renderError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <div className="max-w-md p-6 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-400">
                        <AlertTriangle size={48} className="mb-4 mx-auto text-red-500" />
                        <h4 className="text-lg font-bold mb-2">Syntax Error</h4>
                        <p className="text-sm opacity-90">{renderError}</p>
                      </div>
                    </div>
                  )}

                  {/* Mermaid Container */}
                  <div 
                    ref={mermaidRef} 
                    className={`min-w-fit min-h-fit w-full flex justify-center transition-opacity duration-500 ${isGenerating || renderError ? 'opacity-0 hidden' : 'opacity-100'}`}
                  >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
