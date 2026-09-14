'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '../components/Logo';

export default function Home() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const rawActivities = [
    { id: 1, item: '2026 Board Annual Strategic Calendar', status: 'Published', category: 'Secretariat', owner: 'Secretariat Office', priority: 'High', date: 'Sep 14, 2026', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    { id: 2, item: 'Hoima Commercial Land Acquisition Review', status: 'Under review', category: 'Legal', owner: 'Legal & Regulatory', priority: 'Critical', date: 'Sep 12, 2026', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    { id: 3, item: 'Q3 Committee Share Capital Budget Approval', status: 'Approved', category: 'Finance', owner: 'Stanbic Treasury Team', priority: 'Standard', date: 'Sep 10, 2026', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    { id: 4, item: 'Statutory External Compliance Audit Pack', status: 'Scheduled', category: 'Risk', owner: 'Audit & Risk Committee', priority: 'High', date: 'Sep 08, 2026', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
    { id: 5, item: 'Maker-Checker Banking Mandate Resolution', status: 'Approved', category: 'Finance', owner: 'Chairperson Board Executive', priority: 'Critical', date: 'Sep 05, 2026', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  ];

  const filteredActivities = rawActivities.filter((act) => {
    const matchesTab = activeTab === 'All' || act.category === activeTab;
    const matchesSearch = act.item.toLowerCase().includes(searchQuery.toLowerCase()) || act.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const features = [
    { title: 'Board & Council Management', category: 'Strategic Oversight', desc: 'Track membership, roles, attendance, appointments and governance calendars across every board and council body.', icon: '🏛️' },
    { title: 'Secure Decision Workflow', category: 'Audit-Ready', desc: 'Route resolutions, approvals, and delegated actions through a transparent, auditable Maker-Checker approval chain.', icon: '🛡️' },
    { title: 'Agenda & Minutes Automation', category: 'Paperless Operations', desc: 'Prepare meeting packs, distribute agendas, collect minute approvals and archive institutional records seamlessly.', icon: '📄' },
    { title: 'Document Control & Compliance', category: 'Policy Confidence', desc: 'Manage statutory records, land titles, board packs, and procurement files with cryptographic version control.', icon: '🔐' },
    { title: 'Institutional Financial Reporting', category: 'Executive Visibility', desc: 'Generate executive dashboards, committee share ledgers, and Stanbic treasury summaries for oversight bodies.', icon: '📊' },
    { title: 'Stakeholder & Investor Portal', category: 'Cross-Team Alignment', desc: 'Coordinate with directors, legal counsel, bank trustees, and external partners in an encrypted space.', icon: '🤝' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Mesh Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo width={180} />
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#activity" className="hover:text-white transition-colors">Operations</a>
            <a href="#features" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#model" className="hover:text-white transition-colors">Governance</a>
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Stanbic Encrypted
            </span>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl hover:bg-slate-900 transition-all border border-transparent hover:border-slate-800">
              Sign In
            </Link>
            <Link href="/admin" className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all border border-blue-400/30">
              Open Portal Dashboard →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-20 border-b border-slate-800/60">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 shadow-inner">
            <span>✨</span> Institutional Command Center • Bunyoro Muhama Real Estates
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-[1.1]">
            Governance made <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-amber-400">visible, trackable,</span> and accountable.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-normal">
            A high-grade, role-aware governance portal built for executive leadership, shareholders, and public councils to direct capital, verify approvals, and govern institutional decisions with complete audit confidence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link href="/signup" className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 border border-blue-400/30">
              Register Board Access
            </Link>
            <Link href="/admin" className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-800 transition-all shadow-md">
              View Shareholder Ledger
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-900 text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <div className="flex items-center justify-center gap-2"><span className="text-blue-400">✓</span> Board-Ready Architecture</div>
            <div className="flex items-center justify-center gap-2"><span className="text-blue-400">✓</span> Immutable Audit Trail</div>
            <div className="flex items-center justify-center gap-2"><span className="text-blue-400">✓</span> Stanbic Maker-Checker</div>
            <div className="flex items-center justify-center gap-2"><span className="text-blue-400">✓</span> Executive Reporting</div>
          </div>
        </div>
      </section>

      {/* Dynamic Key Performance Metrics */}
      <section className="px-6 py-12 border-b border-slate-800/60 bg-slate-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Executive Pulse • Real-Time Oversight</span>
            <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Live Sync</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-slate-700 transition-all shadow-lg group">
              <div className="text-3xl md:text-5xl font-black text-white group-hover:text-blue-400 transition-colors">48</div>
              <div className="text-sm font-bold text-slate-200 mt-2">Board Members</div>
              <div className="text-xs text-slate-500 mt-1">Active institutional leadership</div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-slate-700 transition-all shadow-lg group">
              <div className="text-3xl md:text-5xl font-black text-blue-400">14</div>
              <div className="text-sm font-bold text-slate-200 mt-2">Committee Workstreams</div>
              <div className="text-xs text-slate-500 mt-1">Operational & strategic tracks</div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-slate-700 transition-all shadow-lg group">
              <div className="text-3xl md:text-5xl font-black text-amber-400">24h</div>
              <div className="text-sm font-bold text-slate-200 mt-2">Decision Cycle SLA</div>
              <div className="text-xs text-slate-500 mt-1">Resolution turnaround target</div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-slate-700 transition-all shadow-lg group">
              <div className="text-3xl md:text-5xl font-black text-emerald-400">98.4%</div>
              <div className="text-sm font-bold text-slate-200 mt-2">Compliance Index</div>
              <div className="text-xs text-slate-500 mt-1">Statutory & audit coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Board Activity Workstream */}
      <section id="activity" className="px-6 py-20 border-b border-slate-800/60 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
            <div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Operational Command</div>
              <h2 className="text-3xl font-extrabold text-white">Board Activity & Resolution Tracker</h2>
            </div>
            
            {/* Filter controls & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter workstreams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-full sm:w-64"
                />
              </div>
              <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
                {['All', 'Secretariat', 'Legal', 'Finance', 'Risk'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-bold border-b border-slate-800 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Resolution Item</th>
                    <th className="px-6 py-4">Department / Workstream</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Responsible Owner</th>
                    <th className="px-6 py-4">Date Logged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredActivities.length > 0 ? (
                    filteredActivities.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-800/50 transition-colors group">
                        <td className="px-6 py-4 font-semibold text-white group-hover:text-blue-300 transition-colors">
                          {row.item}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-slate-400">
                          <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300">
                            {row.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${row.badge}`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-300 text-xs font-medium">{row.owner}</td>
                        <td className="px-6 py-4 text-slate-500 text-xs">{row.date}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-sm">
                        No board workstreams found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section id="features" className="px-6 py-20 border-b border-slate-800/60 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Institutional Capabilities</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">Built for complex corporate operations at scale.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/90 hover:border-slate-700 transition-all hover:-translate-y-1 shadow-xl group">
                <div className="text-3xl mb-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 w-fit">{f.icon}</div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">{f.category}</span>
                <h3 className="text-lg font-extrabold text-white mt-2 mb-3 group-hover:text-blue-400 transition-colors">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance Execution Stepper */}
      <section id="model" className="px-6 py-20 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Governance Framework</div>
            <h2 className="text-3xl font-extrabold text-white">4-Stage institutional decision pipeline.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Strategy & Representation', desc: 'Board representation, committee appointments, and strategic planning.' },
              { num: '02', title: 'Committee Assembly', desc: 'Agenda preparation, paper distribution, and resolution formulation.' },
              { num: '03', title: 'Maker-Checker Approval', desc: 'Encrypted approval chain, escalation flow, and dual bank signatures.' },
              { num: '04', title: 'Audit & Archival', desc: 'Executive reporting, statutory compliance logging, and archival continuity.' },
            ].map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all">
                <div className="text-2xl font-black text-blue-500 mb-4">{step.num}</div>
                <h4 className="text-base font-bold text-white mb-2">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-800/80 pt-10">
          <Logo width={160} />
          <p className="text-xs text-slate-500">
            © 2026 Bunyoro Muhama Real Estates LTD. Institutional Governance Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <Link href="/admin" className="hover:text-white transition-colors">Admin Panel</Link>
            <span>•</span>
            <Link href="/login" className="hover:text-white transition-colors">Member Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
