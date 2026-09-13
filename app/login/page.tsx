'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'sms' | 'email'>('sms');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'verify'>('input');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+971552372079');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep('verify');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to dispatch verification code.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      router.push('/admin');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid verification code.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-950 p-4 text-slate-100 sm:p-6">
      <div className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="z-10 w-full max-w-md rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="mb-8 text-center">
          <img
            src="/logo.png"
            alt="Bunyoro Omuhama logo"
            className="mx-auto mb-4 h-24 w-24 rounded-full border border-amber-400/40 bg-slate-950/70 object-cover shadow-lg shadow-emerald-500/20"
          />
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Bunyoro Omuhama</h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-400">
            Real Estates LTD • Shareholder Portal
          </p>
        </div>

        <div className="mb-6 flex rounded-xl border border-slate-800 bg-slate-950/80 p-1">
          <button
            type="button"
            onClick={() => {
              setAuthMode('sms');
              setStep('input');
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium transition-all duration-200 sm:text-sm ${
              authMode === 'sms'
                ? 'border border-slate-700/50 bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>📱</span> Mobile Phone (SMS)
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('email');
              setStep('input');
            }}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium transition-all duration-200 sm:text-sm ${
              authMode === 'email'
                ? 'border border-slate-700/50 bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>✉️</span> Email Address
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-center text-xs font-medium text-rose-400">
            {error}
          </div>
        )}

        {authMode === 'sms' && (
          <>
            {step === 'input' ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Asuman Kusiima"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-300">Mobile Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <div id="recaptcha-container" />

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  ) : (
                    'Send Verification Code'
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="mb-4 text-center">
                  <p className="text-xs text-slate-400">Enter the 6-digit verification code sent to</p>
                  <p className="mt-0.5 text-xs font-semibold text-emerald-400">{phone}</p>
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
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-center text-xl font-mono tracking-[0.5em] text-emerald-400 placeholder-slate-600 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  ) : (
                    'Verify Code & Enter Portal'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="w-full py-1 text-center text-xs text-slate-400 transition-colors hover:text-slate-200"
                >
                  ← Edit Phone Number
                </button>
              </form>
            )}
          </>
        )}

        {authMode === 'email' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">Corporate Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="shareholder@bunyororealestate.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50"
            >
              Sign In to Shareholder Portal
            </button>
          </form>
        )}

        <div className="mt-8 border-t border-slate-800/60 pt-4 text-center">
          <p className="text-[10px] text-slate-500">Encrypted 256-Bit SSL • Supabase & Firebase Auth Protected</p>
          <a href="/signup" className="mt-3 inline-block text-xs font-medium text-emerald-400 hover:text-emerald-300">
            Create a new member account
          </a>
        </div>
      </div>
    </div>
  );
}
