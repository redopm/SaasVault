import { Link } from 'react-router-dom';

export default function SaaSVault() {
  return (
    <div className="min-h-screen p-8 bg-background text-text font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">SaaS <span className="text-primary">Vault</span></h1>
            <p className="text-text-muted">Curated, copyright-safe library of SaaS pitch deck teardowns.</p>
          </div>
          <Link to="/" className="text-primary hover:underline">&larr; Back to Generator</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-surface rounded-xl bg-[#111] hover:border-primary transition-colors cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">B2B SaaS Template</h2>
            <p className="text-sm text-text-muted mb-4">Why this structure works: Clear problem-solution mapping tailored for enterprise buyers.</p>
            <div className="w-full aspect-video bg-surface rounded-lg flex items-center justify-center">
              <span className="text-text-muted text-xs">Preview</span>
            </div>
          </div>

          <div className="p-6 border border-surface rounded-xl bg-[#111] hover:border-primary transition-colors cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">Consumer Tech Blueprint</h2>
            <p className="text-sm text-text-muted mb-4">Why this structure works: Focuses heavily on viral traction and daily active user metrics.</p>
            <div className="w-full aspect-video bg-surface rounded-lg flex items-center justify-center">
              <span className="text-text-muted text-xs">Preview</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
