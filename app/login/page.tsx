'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function AuthPage() {
  const supabase = createClient()
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form State
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [awaitingOtp, setAwaitingOtp] = useState(false)

  // Email Auth
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

  // Phone Auth (SMS OTP)
  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        data: { full_name: fullName },
      },
    })

    if (error) {
      alert(error.message)
    } else {
      setAwaitingOtp(true)
    }
    setLoading(false)
  }

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otpCode,
      type: 'sms',
    })

    if (error) {
      alert(error.message)
    } else {
      window.location.href = '/dashboard'
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl max-w-md w-full shadow-2xl space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">Bunyoro Omuhama Real Estates LTD</span>
          <h1 className="text-xl font-extrabold text-white">Shareholder Portal</h1>
        </div>

        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setAuthMethod('email'); setAwaitingOtp(false); }}
            className={`py-2 rounded-lg transition ${authMethod === 'email' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Email Address
          </button>
          <button
            type="button"
            onClick={() => { setAuthMethod('phone'); setAwaitingOtp(false); }}
            className={`py-2 rounded-lg transition ${authMethod === 'phone' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Mobile Phone
          </button>
        </div>

        {/* EMAIL FORM */}
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
              {loading ? 'Processing...' : isSignUp ? 'Create Shareholder Account' : 'Sign In to Dashboard'}
            </button>
          </form>
        )}

        {/* MOBILE PHONE FORM */}
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
              <label className="block text-xs font-mono text-slate-400 mb-1">Mobile Phone Number (International Format)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+256700000000"
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition"
            >
              {loading ? 'Sending SMS Code...' : 'Send SMS Verification Code'}
            </button>
          </form>
        )}

        {/* OTP VERIFICATION FORM */}
        {authMethod === 'phone' && awaitingOtp && (
          <form onSubmit={handleVerifyPhoneOtp} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Enter 6-Digit SMS Code sent to {phone}</label>
              <input
                type="text"
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-amber-400 font-mono text-center text-lg tracking-widest focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition"
            >
              {loading ? 'Verifying Code...' : 'Verify & Enter Portal'}
            </button>
          </form>
        )}

        {authMethod === 'email' && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Register'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
