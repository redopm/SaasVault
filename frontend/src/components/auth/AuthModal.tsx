import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, loginWithGoogle, db } from '../../firebase';
import { createPortal } from 'react-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type AuthMode = 'login' | 'signup' | 'forgot' | 'otp';

const OTP_API_URL = "https://script.google.com/macros/s/AKfycbwjcqYFY6Y-JuVCvw56RZbsapa1pL0c7fiOZc5J---XX5ffPcznydWVZZJgDStZCipiIQ/exec";

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // OTP States
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);

  // Validate Password Strength
  const isPasswordStrong = (pwd: string) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    return regex.test(pwd);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    const trimmedEmail = email.trim();

    try {
      if (mode === 'signup') {
        if (!isPasswordStrong(password)) {
          throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
        }
        if (name.length < 3) {
          throw new Error("Name must be at least 3 characters long.");
        }

        // Generate OTP
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(newOtp);

        // Send OTP via API
        const response = await fetch(`${OTP_API_URL}?email=${encodeURIComponent(trimmedEmail)}&otp=${newOtp}&name=${encodeURIComponent(name)}`);
        const result = await response.json();
        
        if (result.success) {
          setMode('otp');
          setSuccessMsg("We sent a 6-digit code to your email.");
        } else {
          throw new Error("Failed to send OTP. Please try again.");
        }

      } else if (mode === 'login') {
        await signInWithEmailAndPassword(auth, trimmedEmail, password);
        onSuccess();
      } else if (mode === 'forgot') {
        if (!trimmedEmail) throw new Error("Please enter your email address.");
        await sendPasswordResetEmail(auth, trimmedEmail);
        setSuccessMsg("Password reset link sent! Please check your inbox.");
        setTimeout(() => setMode('login'), 3000);
      } else if (mode === 'otp') {
        if (otp !== generatedOtp) {
          throw new Error("Invalid OTP! Please check your email and try again.");
        }
        // OTP verified, create account
        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          username: name,
          email: trimmedEmail,
          createdAt: new Date(),
          isPro: false,
          vault_credits: 25 // Default free credits if not set elsewhere
        });
        onSuccess();
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please log in.");
        setMode('login');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        setError("Invalid email or password.");
      } else {
        setError(err.message || "An error occurred during authentication.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError("This email is already registered with a password. Please log in with your email and password.");
      } else {
        setError("Failed to sign in with Google.");
      }
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-slate-700/50 shadow-2xl"
        >
          {/* Top Gradient Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 to-emerald-400" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'signup' && 'Join SaaS Vault'}
                {mode === 'forgot' && 'Reset Password'}
                {mode === 'otp' && 'Verify Email'}
              </h2>
              <p className="text-slate-400 text-sm">
                {mode === 'login' && 'Sign in to access your premium generated decks.'}
                {mode === 'signup' && 'Create a free account to unlock premium features.'}
                {mode === 'forgot' && 'Enter your email to receive a reset link.'}
                {mode === 'otp' && `We sent a 6-digit code to ${email}`}
              </p>
            </div>

            {/* Error & Success Messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                >
                  <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-200">{error}</p>
                </motion.div>
              )}
              {successMsg && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3"
                >
                  <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-emerald-200">{successMsg}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              
              {mode === 'otp' ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ShieldCheck size={18} className="text-slate-500" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit OTP" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all text-center tracking-[0.5em] font-bold"
                  />
                </div>
              ) : (
                <>
                  {mode === 'signup' && (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User size={18} className="text-slate-500" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-slate-500" />
                    </div>
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                    />
                  </div>

                  {mode !== 'forgot' && (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock size={18} className="text-slate-500" />
                      </div>
                      <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all"
                      />
                    </div>
                  )}
                </>
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => { setMode('forgot'); setError(null); setSuccessMsg(null); }}
                    className="text-sm text-teal-400 hover:text-teal-300 transition-colors font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-bold rounded-xl shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Send OTP' : mode === 'otp' ? 'Verify & Create Account' : 'Send Reset Link'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
              
              {mode === 'otp' && (
                <button 
                  type="button"
                  onClick={() => { setMode('signup'); setOtp(''); setError(null); setSuccessMsg(null); }}
                  className="w-full py-2 text-sm text-slate-400 hover:text-white transition-colors mt-2"
                >
                  Cancel & Go Back
                </button>
              )}
            </form>

            {(mode === 'login' || mode === 'signup') && (
              <>
                <div className="flex items-center my-6">
                  <div className="flex-1 h-px bg-slate-800"></div>
                  <span className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Or</span>
                  <div className="flex-1 h-px bg-slate-800"></div>
                </div>

                <button 
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    <path fill="none" d="M1 1h22v22H1z" />
                  </svg>
                  Continue with Google
                </button>
              </>
            )}

            <div className="mt-8 text-center">
              {mode === 'login' ? (
                <p className="text-slate-400 text-sm">
                  Don't have an account?{' '}
                  <button onClick={() => { setMode('signup'); setError(null); setSuccessMsg(null); }} className="text-teal-400 hover:text-teal-300 font-medium">Sign up</button>
                </p>
              ) : mode === 'signup' ? (
                <p className="text-slate-400 text-sm">
                  Already have an account?{' '}
                  <button onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }} className="text-teal-400 hover:text-teal-300 font-medium">Log in</button>
                </p>
              ) : mode === 'forgot' ? (
                <p className="text-slate-400 text-sm">
                  Remember your password?{' '}
                  <button onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }} className="text-teal-400 hover:text-teal-300 font-medium">Log in</button>
                </p>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
