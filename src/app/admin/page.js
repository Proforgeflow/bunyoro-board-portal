'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMembers, formatUGX } from '@/lib/members';

export default function AdminDashboard() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setMembers(getMembers());
  }, []);

  const totalCapital = members.reduce((sum, m) => sum + (Number(m.capitalContributed) || 0), 0);
  const totalTarget = members.reduce((sum, m) => sum + (Number(m.capitalTarget) || Number(m.capitalContributed) || 0), 0);
  const avgContribution = members.length > 0 ? totalCapital / members.length : 0;

  const filteredMembers = members.filter(m =>
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-500 to-amber-500 text-slate-950 font-black flex items-center justify-center text-base">
                BO
              </div>
              <span className="font-bold text-white text-base hidden sm:inline">Bunyoro Board Portal</span>
            </Link>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-semibold">
              Executive View
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 transition-colors"
            >
              + Register Member
            </Link>
            <Link
              href="/login"
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Exit
            </Link>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="text-xs uppercase font-bold text-slate-400">Total Capital Raised</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-2 font-mono">
              {formatUGX(totalCapital)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Across all registered members</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="text-xs uppercase font-bold text-slate-400">Portfolio Equity Allocated</div>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-2">
              100.0%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Proportional share distribution</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="text-xs uppercase font-bold text-slate-400">Active Shareholders</div>
            <div className="text-xl sm:text-2xl font-black text-sky-400 mt-2">
              {members.length} Members
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Verified & Pending audit</div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="text-xs uppercase font-bold text-slate-400">Avg Contribution</div>
            <div className="text-xl sm:text-2xl font-black text-purple-400 mt-2 font-mono">
              {formatUGX(avgContribution)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Per individual account</div>
          </div>
        </div>

        {/* Shareholder Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">Shareholder Register & Equity Distribution</h2>
              <p className="text-xs text-slate-400">Official ledger detailing member capital and subplot entitlements</p>
            </div>

            <input
              type="text"
              placeholder="Filter by name, location, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 w-full sm:w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Member Details</th>
                  <th className="px-5 py-3.5">City / Location</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Capital Contributed</th>
                  <th className="px-5 py-3.5">Equity Share</th>
                  <th className="px-5 py-3.5">Property / Subplot</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-bold text-white text-sm">{member.fullName}</div>
                      <div className="text-[11px] text-slate-500">{member.email}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{member.city}</td>
                    <td className="px-5 py-4 text-slate-300 font-medium">{member.role}</td>
                    <td className="px-5 py-4 font-mono font-bold text-emerald-400 text-sm">
                      {formatUGX(member.capitalContributed)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-amber-400 text-sm">{member.equityShare}%</span>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{member.propertyUnits || 'Pending'}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        member.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        member.status === 'Institutional' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
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
      </main>
    </div>
  );
}
