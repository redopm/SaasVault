import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-inter">
      <Helmet>
        <title>Privacy Policy | Ikkish SaaS</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-black mb-2 tracking-tight text-slate-900">Privacy Policy</h1>
        <p className="text-slate-500 mb-12">Last Updated: July 2026</p>
        
        <div className="space-y-8 prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900">
          
          <section>
            <h2 className="text-2xl mb-4 font-bold">1. Introduction</h2>
            <p>
              At <strong>Ikkish SaaS</strong>, we take your privacy seriously. This policy explains how we collect, use, and protect your personal and business data when you use PitchKing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4 font-bold">2. Data We Collect</h2>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Account Information:</strong> Name, email address, and authentication data via Firebase Auth.</li>
              <li><strong>Generation Inputs:</strong> The raw text, business ideas, and metrics you input to generate pitch decks.</li>
              <li><strong>Payment Data:</strong> Handled entirely by secure third-party processors (Razorpay). We do not store your credit card details on our servers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl mb-4 font-bold">3. Third-Party AI Processors & IP Safety</h2>
            <p>
              To generate intelligent pitch decks, your inputs are securely transmitted to third-party Large Language Model (LLM) providers (such as Google Gemini). 
            </p>
            <p>
              <strong>Crucially, we DO NOT use your confidential pitch data or business ideas to train our own public AI models.</strong> Your data is used strictly to fulfill your generation request and is then discarded from active API memory in accordance with our API providers' zero-data-retention enterprise policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4 font-bold">4. How We Use Your Data</h2>
            <p>
              We use your information solely to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Provide, maintain, and improve the PitchKing service.</li>
              <li>Process transactions and deduct Vault Credits.</li>
              <li>Send critical service updates or support responses.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl mb-4 font-bold">5. Data Security</h2>
            <p>
              We implement industry-standard security measures (SSL/TLS encryption, secure cloud infrastructure) to protect your data against unauthorized access. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4 font-bold">6. Contact Us</h2>
            <p>
              If you have any questions or requests regarding your data, you can contact our privacy team at: <strong>ikkishprep@gmail.com</strong>
            </p>
            <p className="mt-2">
              <strong>Company Address:</strong><br />
              Plot no. 1502 ward no 12, Gautam Nagar<br />
              Chandauli, UTTAR PRADESH 232104, IN
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Privacy;
