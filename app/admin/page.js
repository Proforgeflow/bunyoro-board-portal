'use client';
import { useEffect, useMemo, useState } from 'react';
import { formatCurrency, seedMembers, storageKey } from '@/lib/members';

export default function AdminPage() {
  const [members, setMembers] = useState(seedMembers);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMembers(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load members from storage', error);
    }
  }, []);

  const summary = useMemo(() => {
    const totalCapital = members.reduce((sum, member) => sum + Number(member.capitalContributed || 0), 0);
    const totalEquity = members.reduce((sum, member) => sum + Number(member.equityShare || 0), 0);
    const activeMembers = members.filter((member) => member.status === 'Active').length;
    const averageContribution = members.length ? totalCapital / members.length : 0;

    return {
      totalCapital,
      totalEquity,
      activeMembers,
      averageContribution,
    };
  }, [members]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="container-shell flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Bunyoro Omuhama logo" className="h-12 w-12 rounded-full border border-amber-400/40 object-cover" />
            <div>
              <div className="text-lg font-black">Bunyoro Board Portal</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Member equity dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-200">
              System healthy
            </div>
            <a href="/signup" className="rounded-full bg-sky-400 px-4 py-2 text-sm font-bold text-slate-950">
              New member
            </a>
          </div>
        </div>
      </header>

      <div className="container-shell py-10">
        <section className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">Members & equity overview</p>
          <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">Real estate capital contribution tracker</h1>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="glass-card p-5">
            <div className="text-sm text-slate-400">Total capital raised</div>
            <div className="mt-4 text-3xl font-black text-white">{formatCurrency(summary.totalCapital)}</div>
            <div className="mt-2 text-sm text-slate-300">Across all members</div>
          </div>

          <div className="glass-card p-5">
            <div className="text-sm text-slate-400">Total equity share</div>
            <div className="mt-4 text-3xl font-black text-white">{summary.totalEquity}%</div>
            <div className="mt-2 text-sm text-slate-300">Portfolio allocation</div>
          </div>

          <div className="glass-card p-5">
            <div className="text-sm text-slate-400">Active members</div>
            <div className="mt-4 text-3xl font-black text-white">{summary.activeMembers}</div>
            <div className="mt-2 text-sm text-slate-300">Accounts in good standing</div>
          </div>

          <div className="glass-card p-5">
            <div className="text-sm text-slate-400">Average contribution</div>
            <div className="mt-4 text-3xl font-black text-white">{formatCurrency(summary.averageContribution)}</div>
            <div className="mt-2 text-sm text-slate-300">Per member</div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="glass-card p-5 md:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Member register</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Equity contribution per member</h2>
              </div>
              <a href="/signup" className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950">
                Add member
              </a>
            </div>

            <div className="table-panel mt-6">
              <table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>City</th>
                    <th>Equity</th>
                    <th>Contribution</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <div className="font-semibold text-slate-100">{member.fullName}</div>
                        <div className="text-xs text-slate-400">{member.role}</div>
                      </td>
                      <td className="text-slate-300">{member.city}</td>
                      <td className="text-slate-100">{member.equityShare}%</td>
                      <td className="text-slate-100">{formatCurrency(member.capitalContributed)}</td>
                      <td>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                          member.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-200'
                            : member.status === 'Pending'
                              ? 'bg-amber-500/10 text-amber-200'
                              : 'bg-slate-700 text-slate-200'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card p-5 md:p-7">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Portfolio signal</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Capital allocation snapshot</h2>

            <div className="mt-6 space-y-5">
              {members.map((member) => {
                const contributionPercent = Math.min((member.capitalContributed / member.capitalTarget) * 100, 100);

                return (
                  <div key={member.id}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-200">{member.fullName}</span>
                      <span className="text-slate-400">{formatCurrency(member.capitalContributed)}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400"
                        style={{ width: `${contributionPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

