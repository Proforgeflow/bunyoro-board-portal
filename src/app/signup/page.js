'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { addMember } from '@/lib/members';

export default function SignupPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState('email');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Shareholder',
    shares: '',
    amountPaid: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addMember(formData);
      router.push('/admin');
    } catch (err) {
      console.error('Failed to register member:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Header & Logo */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-amber-500/20">
            B
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none tracking-tight text-white">Bunyoro Board</h1>
            <span className="text-xs text-slate-400">Portal & Investor Platform</span>
          </div>
        </div>
        <Link href="/admin" className="text-sm text-slate-400 hover:text-white transition">
          Admin Portal →
        </Link>
      </header>

      {/* Main Grid Layout */}
      <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-8">
        {/* Left Column: Features & Highlights */}
        <div className="lg:col-span-6 space-y-6">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-block">
            Verified Shareholder Platform
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Secure Real Estate & Shareholder Portal
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Access your real estate portfolio contributions, track share allocations, and view transparent audit reports in real time.
          </p>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-amber-400 font-bold mb-1">📊 Shares Ledger</div>
              <p className="text-xs text-slate-400">Real-time tracking of individual & collective share balances.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-amber-400 font-bold mb-1">🔐 Encrypted Vault</div>
              <p className="text-xs text-slate-400">Protected by 256-Bit SSL encryption & Supabase DB.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-amber-400 font-bold mb-1">💳 UGX Receipts</div>
              <p className="text-xs text-slate-400">Instant validation of capital deposits & buy-in transactions.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-amber-400 font-bold mb-1">⚡ Instant OTP</div>
              <p className="text-xs text-slate-400">Multi-factor SMS and Email identity verification.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Auth & Registration Form */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-2">Member Registration</h3>
            <p className="text-xs text-slate-400 mb-6">Select your verification channel to proceed.</p>

            {/* Verification Toggle */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition ${authMethod === 'email' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                ✉️ Email Address
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('sms')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition ${authMethod === 'sms' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                📱 Mobile Phone (SMS)
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mbabazi Rose"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {authMethod === 'email' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="member@domain.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+256 700 000 000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Shares Purchased</label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                    value={formData.shares}
                    onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Amount Paid (UGX)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                    value={formData.amountPaid}
                    onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-lg shadow-lg shadow-amber-500/20 transition mt-2 text-sm"
              >
                {loading ? 'Processing Registration...' : 'Send Verification Code'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                🔒 Encrypted 256-Bit SSL • Supabase & Firebase Auth Protected
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto w-full border-t border-slate-800 pt-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Bunyoro Board Portal. All rights reserved.
      </footer>
    </div>
  );
}
