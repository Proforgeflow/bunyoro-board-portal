'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CandidateSignup() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nin: '',
    password: '',
    confirmPassword: '',
    termsAgreed: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error for specific field on type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Client-side Validation Logic
  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().split(' ').length < 2) {
      newErrors.fullName = 'Please enter your official full name (at least first & last name).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please provide a valid corporate or personal email address.';
    }

    if (!formData.phone.trim() || formData.phone.length < 9) {
      newErrors.phone = 'Valid phone number required (e.g. +256 700 000000 or +971 50 0000000).';
    }

    if (!formData.nin.trim() || formData.nin.length < 5) {
      newErrors.nin = 'National ID (NIN) or Passport Number is required for KYC compliance.';
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.termsAgreed) {
      newErrors.termsAgreed = 'You must agree to the Bunyoro Muhama Real Estates constitution & terms.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setLoading(true);

    try {
      // 1. Register User in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone_number: formData.phone,
            nin: formData.nin,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Upsert profile into public.profiles table
        const { error: profileError } = await supabase.from('profiles').upsert([
          {
            id: authData.user.id,
            full_name: formData.fullName,
            email: formData.email,
            phone_number: formData.phone,
            status: 'pending_verification',
            updated_at: new Date().toISOString(),
          },
        ]);

        if (profileError) throw profileError;

        // 3. Log audit action
        await supabase.from('audit_logs').insert([
          {
            user_id: authData.user.id,
            action: 'CANDIDATE_REGISTERED',
            details: `Candidate registered: ${formData.fullName} (${formData.email})`,
          },
        ]);

        // 4. Redirect directly to Member Dashboard
        router.push('/dashboard');
      }
    } catch (err) {
      setServerError(err.message || 'An unexpected registration error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      
      {/* Branding Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-2xl font-black mb-3">
          BM
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Bunyoro Muhama Real Estates LTD
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Candidate Onboarding & Member Portal Registration
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        
        {serverError && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">
            ⚠️ {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
              Full Legal Name <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Asuman Kusiima"
              className={`w-full bg-slate-950 border ${
                errors.fullName ? 'border-rose-500' : 'border-slate-800 focus:border-amber-500'
              } rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all`}
            />
            {errors.fullName && <p className="text-rose-400 text-[11px] mt-1">{errors.fullName}</p>}
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
                Email Address <span className="text-amber-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@domain.com"
                className={`w-full bg-slate-950 border ${
                  errors.email ? 'border-rose-500' : 'border-slate-800 focus:border-amber-500'
                } rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all`}
              />
              {errors.email && <p className="text-rose-400 text-[11px] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
                Phone / WhatsApp <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+256..."
                className={`w-full bg-slate-950 border ${
                  errors.phone ? 'border-rose-500' : 'border-slate-800 focus:border-amber-500'
                } rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all`}
              />
              {errors.phone && <p className="text-rose-400 text-[11px] mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* National ID / Passport */}
          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
              National ID (NIN) / Passport No. <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              name="nin"
              value={formData.nin}
              onChange={handleChange}
              placeholder="e.g. CM1234567890"
              className={`w-full bg-slate-950 border ${
                errors.nin ? 'border-rose-500' : 'border-slate-800 focus:border-amber-500'
              } rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all`}
            />
            {errors.nin && <p className="text-rose-400 text-[11px] mt-1">{errors.nin}</p>}
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
                Password <span className="text-amber-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full bg-slate-950 border ${
                  errors.password ? 'border-rose-500' : 'border-slate-800 focus:border-amber-500'
                } rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all`}
              />
              {errors.password && <p className="text-rose-400 text-[11px] mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">
                Confirm Password <span className="text-amber-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full bg-slate-950 border ${
                  errors.confirmPassword ? 'border-rose-500' : 'border-slate-800 focus:border-amber-500'
                } rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all`}
              />
              {errors.confirmPassword && <p className="text-rose-400 text-[11px] mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="pt-2">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="termsAgreed"
                checked={formData.termsAgreed}
                onChange={handleChange}
                className="mt-0.5 rounded border-slate-800 bg-slate-950 text-amber-500 focus:ring-amber-500 h-4 w-4"
              />
              <span className="text-xs text-slate-400 leading-tight">
                I agree to the <strong className="text-slate-200">Bunyoro Muhama Real Estates LTD Constitution</strong>, governance policy, and identity verification terms.
              </span>
            </label>
            {errors.termsAgreed && <p className="text-rose-400 text-[11px] mt-1">{errors.termsAgreed}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-amber-600 hover:bg-amber-500 text-white font-black py-3 px-4 rounded-xl text-sm tracking-wide shadow-lg shadow-amber-600/20 transition-all disabled:opacity-50"
          >
            {loading ? 'Processing Onboarding...' : 'Submit Candidate Registration'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-800/80 pt-4 text-xs text-slate-500">
          Already registered?{' '}
          <a href="/dashboard" className="text-amber-400 font-bold hover:underline">
            Access Member Portal
          </a>
        </div>
      </div>
    </div>
  );
}