'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { firebaseAuth } from '@/utils/firebase'
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth'

export default function AuthPage() {
  const supabase = createClient()
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form State
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [awaitingOtp, setAwaitingOtp] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {},
          'expired-callback': () => {
            alert('reCAPTCHA expired. Please request a new SMS code.')
          }
        })
      } catch (err) {
        console.error('Firebase Recaptcha init error:', err)
      }
    }
  }, [])

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone) {
      alert('Please enter a valid mobile phone number with country code.')
      return
    }
    setLoading(true)

    try {
      const appVerifier = window.recaptchaVerifier
      const confirmation = await signInWithPhoneNumber(firebaseAuth, phone, appVerifier)
      setConfirmationResult(confirmation)
      setAwaitingOtp(true)
    } catch (error: any) {
      alert(`SMS Dispatch Failed: ${error.message}`)
      if (window.recaptchaVerifier && window.grecaptcha) {
        window.recaptchaVerifier.render().then((widgetId: any) => {
          window.grecaptcha.reset(widgetId)
        })
      }
    }
    setLoading(false)
  }

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirmationResult) return
    setLoading(true)

    try {
      const userCredential = await confirmationResult.confirm(otpCode)
      const firebaseUser = userCredential.user

      const { error } = await supabase.from('profiles').upsert({
        id: firebaseUser.uid,
        phone: firebaseUser.phoneNumber || phone,
        full_name: fullName || 'Shareholder',
        role: 'shareholder',
        status: 'pending'
      })

      if (error) console.error('Profile sync notice:', error.message)

      window.location.href = '/dashboard'
    } catch (error: any) {
      alert(`Invalid SMS Code: ${error.message}`)
    }
    setLoading(false)
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      if (error) alert(error.message)
      else window.location.href = '/dashboard'
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
      else window.location.href = '/dashboard'
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div id="recaptcha-container"></div>

      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
            Bunyoro Omuhama Real Estates LTD
          </span>
          <h1 className="text-xl font-extrabold text-white">Shareholder Portal</h1>
        </div>

        {/* Auth Method Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setAuthMethod('phone'); setAwaitingOtp(false); }}
            className={`py-2 rounded-lg transition ${authMethod === 'phone' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            📱 Mobile Phone (SMS)
          </button>
          <button
            type="button"
            onClick={() => { setAuthMethod('email'); setAwaitingOtp(false); }}
            className={`py-2 rounded-lg transition ${authMethod === 'email' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            ✉️ Email Address
          </button>
        </div>

        {/* PHONE OTP MODE */}
        {authMethod === 'phone' && !awaitingOtp && (
          <form onSubmit={handleSendPhoneOtp} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Asuman Kusiima"
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Mobile Phone (Include Country Code)
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+971552372079 or +256700000000"
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-amber-400 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition shadow-lg"
            >
              {loading ? 'Sending SMS...' : 'Send Free SMS Verification Code'}
            </button>
          </form>
        )}

        {/* VERIFY OTP CODE MODE */}
        {authMethod === 'phone' && awaitingOtp && (
          <form onSubmit={handleVerifyPhoneOtp} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 text-center">
                Enter 6-Digit Code sent to <span className="text-amber-400">{phone}</span>
              </label>
              <input
                type="text"
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-amber-400 font-mono text-center text-xl tracking-widest focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition shadow-lg"
            >
              {loading ? 'Verifying Code...' : 'Verify Code & Enter Portal'}
            </button>
            <button
              type="button"
              onClick={() => setAwaitingOtp(false)}
              className="w-full text-xs text-slate-400 hover:text-white underline text-center block pt-1"
            >
              ← Change Phone Number
            </button>
          </form>
        )}

        {/* EMAIL MODE */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailAuth} className="space-y-4 text-sm">
            {isSignUp && (
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Asuman Kusiima"
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@example.com"
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition"
            >
              {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Register'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

declare global {
  interface Window {
    recaptchaVerifier: any
    grecaptcha: any
  }
}
