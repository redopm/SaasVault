import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Refund: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-inter">
      <Helmet>
        <title>Refund Policy | Ikkish SaaS</title>
      </Helmet>
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <h1 className="text-4xl font-black mb-2 tracking-tight text-slate-900">Refund Policy</h1>
        <p className="text-slate-500 mb-12">Last Updated: July 2026</p>
        
        <div className="space-y-8 prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900">
          
          <section>
            <h2 className="text-2xl mb-4 font-bold">1. Marketplace Digital Products (100% Buyer Protection)</h2>
            <p>
              We stand by the premium quality of the digital assets (UI Kits, Templates) sold on the SaaS Vault Market. If you are not completely satisfied with a marketplace purchase, you can request a full refund within <strong>14 days of your purchase</strong> under our 14-Day Money-Back Guarantee.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4 font-bold">2. AI Pitch Deck Generation (Vault Credits)</h2>
            <p>
              PitchKing operates on the "Vault Credits" system included in your SaaS Vault subscription. Because generating pitch decks and rendering PDFs incurs immediate costs with our third-party AI providers, <strong>consumed Vault Credits are strictly non-refundable.</strong>
            </p>
            <p>
              If you request a refund within 14 days of a SaaS Vault subscription purchase, <strong>only the remaining unused credit balance</strong> will be refunded to your original payment method in INR (₹). For example, if you consumed 50 credits, you will only be refunded for the remaining unused credits from your subscription tier.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mb-4 font-bold">3. Exceptions & Technical Failures</h2>
            <p>
              We will always issue a prompt refund or credit reimbursement under the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Technical Failures:</strong> If our system deducts your credits but fails to generate or deliver the PDF document due to an internal error.</li>
              <li><strong>Billing Errors:</strong> If you were demonstrably double-charged by our payment gateway (e.g., Razorpay/Stripe) due to a technical glitch.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl mb-4 font-bold">4. Requesting Support</h2>
            <p>
              If you believe you have experienced a technical failure or billing error, please contact us within 7 days of the incident with your account details and transaction ID.
            </p>
            <p>
              Contact Email: <strong>ikkishprep@gmail.com</strong>
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

export default Refund;
