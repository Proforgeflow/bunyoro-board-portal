'use client';
import Logo from '../../components/Logo';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { addMember } from '@/lib/members';

const normalizePhoneNumber = (rawValue) => {
  const value = (rawValue || '').trim();
  if (!value) return '';

  const cleaned = value.replace(/[\s()\-]/g, '');
  if (!cleaned) return '';

  if (cleaned.startsWith('+')) return cleaned;
  if (/^\d{10,15}$/.test(cleaned)) return `+${cleaned}`;

  return cleaned;
};

const isSupportedPhoneNumber = (rawValue) => {
  const value = normalizePhoneNumber(rawValue);
  const supportedPatterns = [
    /^\+1\d{10}$/,
    /^\+971\d{9,10}$/,
    /^\+966\d{9,10}$/,
    /^\+256\d{9,10}$/,
    /^\+\d{11,15}$/,
  ];

  return supportedPatterns.some((pattern) => pattern.test(value));
};

export default function SignupPage() {
  const router = useRouter();
  const [authMethod, setAuthMethod] = useState('sms');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+256',
    role: 'Shareholder',
    shares: '',
    amountPaid: '',
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (e) {}
      }
    };
  }, []);

  const setupRecaptcha = () => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: () => {},
          'expired-callback': () => {
            setErrorMsg('reCAPTCHA expired. Please retry.');
          },
        }
      );
    }
  };

  // Step 1: Send SMS OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (authMethod === 'sms') {
        const normalizedPhone = normalizePhoneNumber(formData.phone);

        if (!isSupportedPhoneNumber(normalizedPhone)) {
          setErrorMsg('Use a valid full phone number with country code, e.g. +1..., +971..., +966..., or +256....');
          return;
        }

        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        const confirmation = await signInWithPhoneNumber(auth, normalizedPhone, appVerifier);
        setFormData((prev) => ({ ...prev, phone: normalizedPhone }));
        setConfirmationResult(confirmation);
      } else {
        // Standard Direct Email Sign-up
        await addMember(formData);
        router.push('/admin');
      }
    } catch (err) {
      console.error('Auth Error:', err);

      if (err?.code === 'auth/operation-not-allowed') {
        setErrorMsg('Phone sign-in is disabled in your Firebase project. Go to Firebase Console → Authentication → Sign-in method → Phone → Enable it, then try again.');
      } else if (err?.code === 'auth/invalid-phone-number') {
        setErrorMsg('The phone number format is invalid. Include the country code, for example +256..., +971..., +966..., or +1....');
      } else if (err?.message?.includes('region') || err?.message?.includes('SMS unable to be sent')) {
        setErrorMsg('Firebase blocked SMS from this region. Enable Phone Authentication and confirm the project/region is allowed for OTP delivery.');
      } else {
        setErrorMsg(err.message || 'Failed to send SMS code. Check phone number format.');
      }

      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.render().then((widgetId) => {
            if (window.grecaptcha) window.grecaptcha.reset(widgetId);
          });
        } catch (e) {}
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm OTP & Save Shareholder to Supabase
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await confirmationResult.confirm(verificationCode);
      await addMember(formData);
      router.push('/admin');
    } catch (err) {
      console.error('OTP Verification Error:', err);
      setErrorMsg('Invalid code. Please enter the 6-digit SMS code sent to your phone.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Header & Logo */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-[1px] shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center overflow-hidden">
              <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18M5 21V9l7-5 7 5v12" />
                <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
                <path d="M9 9h6M9 13h6" />
                <circle cx="12" cy="6" r="1" fill="currentColor" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wider text-white uppercase leading-tight">Bunyoro Muhama</h1>
            <span className="text-[11px] font-semibold text-amber-400 tracking-widest uppercase block">Real Estates LTD</span>
          </div>
        </div>
        <Link href="/admin" className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-amber-400 transition">
          Admin Dashboard →
        </Link>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-8">
        <div className="lg:col-span-6 space-y-6">
          <span className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Accredited Shareholder Portal
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Bunyoro Muhama Real Estates LTD
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            Official investment platform for estate portfolio management, share capital distribution, and verified contribution tracking.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-amber-400 font-bold mb-1 flex items-center gap-2 text-sm">🏛️ Shares Ledger</div>
              <p className="text-xs text-slate-400">Real-time tracking of individual & collective shareholder capital balances.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-amber-400 font-bold mb-1 flex items-center gap-2 text-sm">🛡️ Firebase Auth</div>
              <p className="text-xs text-slate-400">Multi-factor SMS OTP identity verification backed by Supabase storage.</p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm relative">
            <h3 className="text-xl font-bold text-white mb-1">Member Registration</h3>
            <p className="text-xs text-slate-400 mb-6">Verify your phone number to register your shares.</p>

            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => { setAuthMethod('sms'); setConfirmationResult(null); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition ${authMethod === 'sms' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                📱 Mobile Phone (SMS)
              </button>
              <button
                type="button"
                onClick={() => { setAuthMethod('email'); setConfirmationResult(null); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition ${authMethod === 'email' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                ✉️ Email Address
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
                {errorMsg}
              </div>
            )}

            {!confirmationResult ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
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

                {authMethod === 'sms' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Phone Number (with Country Code)</label>
                    <input
                      type="tel"
                      required
                      placeholder="+256700000000 / +971500000000 / +966500000000 / +15551234567"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                ) : (
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

                <div id="recaptcha-container" className="my-2 min-h-[1px]">
        <div className="flex justify-center mb-6"><Logo width={200} height={70} /></div></div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-lg shadow-lg shadow-amber-500/20 transition mt-2 text-sm"
                >
                  {loading ? 'Sending Code...' : authMethod === 'sms' ? 'Send Verification Code (SMS)' : 'Complete Registration'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300 mb-2">
                  SMS Code sent to <span className="font-bold">{formData.phone}</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">6-Digit Verification Code</label>
                  <input
                    type="text"
                    required
                    placeholder="123456"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500 text-center tracking-widest text-lg font-mono"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-lg shadow-lg shadow-amber-500/20 transition text-sm"
                >
                  {loading ? 'Verifying Code...' : 'Verify Code & Complete Sign Up'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmationResult(null)}
                  className="w-full text-xs text-slate-400 hover:text-white pt-2"
                >
                  ← Back to change phone number
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <p className="text-[11px] text-slate-500">
                🔒 Encrypted 256-Bit SSL • Firebase Phone Auth & Supabase DB
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto w-full border-t border-slate-800 pt-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Bunyoro Muhama Real Estates LTD. All rights reserved.
      </footer>
    </div>
  );
}


