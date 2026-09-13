'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { seedMembers, storageKey } from '@/lib/members';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Kampala',
    role: 'Member',
    equityShare: '10',
    capitalContributed: '1000000',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const nextMember = {
        id: `MEM-${Date.now().toString().slice(-6)}`,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        city: form.city,
        role: form.role,
        equityShare: Number(form.equityShare) || 0,
        capitalContributed: Number(form.capitalContributed) || 0,
        capitalTarget: 10000000,
        status: 'Pending',
        joinedAt: new Date().toISOString().slice(0, 10),
        propertyUnits: Math.max(1, Math.round(Number(form.equityShare) / 10)),
      };

      const savedMembers = (() => {
        try {
          const stored = localStorage.getItem(storageKey);
          if (!stored) return seedMembers;
          const parsed = JSON.parse(stored);
          return Array.isArray(parsed) ? parsed : seedMembers;
        } catch {
          return seedMembers;
        }
      })();

      const updatedMembers = [nextMember, ...savedMembers];
      localStorage.setItem(storageKey, JSON.stringify(updatedMembers));
      router.push('/admin');
    } catch (err) {
      console.error(err);
      setError('Unable to create member account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/85 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="mb-8 flex items-center gap-4">
          <img src="/logo.png" alt="Bunyoro Omuhama logo" className="h-16 w-16 rounded-full border border-emerald-400/40 object-cover" />
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">Member signup</p>
            <h1 className="mt-2 text-3xl font-black text-white">Create Bunyoro Omuhama account</h1>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-slate-400">Full name</label>
            <input name="fullName" required value={form.fullName} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" placeholder="e.g. Asuman Kusiima" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-slate-400">Email</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" placeholder="member@example.com" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-slate-400">Phone</label>
            <input name="phone" type="tel" required value={form.phone} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" placeholder="+256700000000" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-slate-400">City</label>
            <input name="city" value={form.city} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-slate-400">Role</label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500">
              <option>Member</option>
              <option>Investor</option>
              <option>Director</option>
              <option>Board Member</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-slate-400">Equity share (%)</label>
            <input name="equityShare" type="number" min="1" max="100" value={form.equityShare} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.14em] text-slate-400">Capital contribution</label>
            <input name="capitalContributed" type="number" min="0" value={form.capitalContributed} onChange={handleChange} className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-emerald-500" />
          </div>

          <div className="md:col-span-2 flex items-center justify-between gap-4 pt-2">
            <a href="/login" className="text-sm text-slate-400 hover:text-slate-200">Back to login</a>
            <button type="submit" disabled={loading} className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create member account'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
