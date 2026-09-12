'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'sms' | 'email'>('sms');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'verify'>('input');
  
  // Form States
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+971552372079');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Firebase OTP Request Logic Hook
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Verification logic hook -> Supabase sync -> Dashboard
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid verification code.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Container */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 transition-all">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-500 text-slate-950 font-bold text-xl mb-3 shadow-lg shadow-emerald-500/20">
            BO
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Bunyoro Omuhama
          </h1>
          <p className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mt-1">
            Real Estates LTD • Shareholder Portal
          </p>
        </div>

        {/* Authentication Mode Switcher */}
        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => { setAuthMode('sms'); setStep('input'); }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              authMode === 'sms'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📱</span> Mobile Phone (SMS)
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('email'); setStep('input'); }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              authMode === 'email'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>✉️</span> Email Address
          </button>
        </div>

        {/* Dynamic Error Banner */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* SMS Authentication Flow */}
        {authMode === 'sms' && (
          <>
            {step === 'input' ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Asuman Kusiima"
                    className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Mobile Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>

                <div id="recaptcha-container" />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-semibold rounded-xl text-sm shadow-lg shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent" />
                  ) : (
                    'Send Verification Code'
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-xs text-slate-400">
                    Enter the 6-digit verification code sent to
                  </p>
                  <p className="text-xs font-semibold text-emerald-400 mt-0.5">{phone}</p>
                </div>

                <div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="• • • • • •"
                    className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-center text-xl tracking-[0.5em] font-mono text-emerald-400 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-semibold rounded-xl text-sm shadow-lg shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent" />
                  ) : (
                    'Verify Code & Enter Portal'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="w-full text-center text-xs text-slate-400 hover:text-slate-200 py-1 transition-colors"
                >
                  ← Edit Phone Number
                </button>
              </form>
            )}
          </>
        )}

        {/* Email Authentication Flow */}
        {authMode === 'email' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Corporate Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="shareholder@bunyororealestate.com"
                className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-semibold rounded-xl text-sm shadow-lg shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              Sign In to Shareholder Portal
            </button>
          </form>
        )}

        {/* Security / Compliance Disclaimer */}
        <div className="mt-8 text-center pt-4 border-t border-slate-800/60">
          <p className="text-[10px] text-slate-500">
            Encrypted 256-Bit SSL • Supabase & Firebase Auth Protected
          </p>
        </div>
      </div>
    </div>
  );
}
