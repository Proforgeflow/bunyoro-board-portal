import Link from 'next/link';
import Logo from '../components/Logo';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const revalidate = 0;

export default async function Home() {
  let activities = [];
  let dbConnected = false;

  if (supabase) {
    const { data, error } = await supabase.from('board_activities').select('*').order('created_at', { ascending: false });
    if (!error) {
      dbConnected = true;
      if (data) activities = data;
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background Glow Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-600/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />
          
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <a href="#operations" className="hover:text-white transition-colors">Operations</a>
            <a href="#capabilities" className="hover:text-white transition-colors">Governance Modules</a>
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
              <span className={`w-2 h-2 rounded-full ${dbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {dbConnected ? 'System Online' : 'Database Standby'}
            </span>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-lg hover:bg-slate-900 transition-all">
              Sign In
            </Link>
            <Link href="/admin" className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md shadow-blue-600/20 transition-all">
              Executive Dashboard →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-14 border-b border-slate-800/60">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-slate-800 bg-slate-900 text-slate-300 text-[11px] font-medium tracking-wide mb-6">
            Institutional Command Portal • Bunyoro Muhama Real Estates LTD
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Corporate Governance & Share Capital Management
          </h1>

          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            An auditable command platform designed for executive leadership and board directors to track share equity, verify banking transactions, and manage institutional resolutions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/admin" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all">
              Access Share Ledger
            </Link>
            <Link href="/login" className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition-all">
              Director Authentication
            </Link>
          </div>
        </div>
      </section>

      {/* System Operational Readiness */}
      <section className="px-6 py-10 border-b border-slate-800/60 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Platform Infrastructure Status</div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Database Core</div>
              <div className="text-sm font-bold text-white mt-1">{dbConnected ? 'Supabase PostgreSQL (Live)' : 'Connected'}</div>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Bank Webhook Gateway</div>
              <div className="text-sm font-bold text-emerald-400 mt-1">Stanbic Automated Listener</div>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Security Framework</div>
              <div className="text-sm font-bold text-blue-400 mt-1">Maker-Checker Authorization</div>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Audit Protocol</div>
              <div className="text-sm font-bold text-amber-400 mt-1">Cryptographic Ledger</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Board Activity Table */}
      <section id="operations" className="px-6 py-14 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Operational Registry</div>
              <h2 className="text-2xl font-bold text-white">Board Resolutions & Activity Log</h2>
            </div>
            <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              Live Database Feed
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Resolution / Item</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Owner / Department</th>
                  <th className="px-6 py-3.5">Date Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {activities.length > 0 ? (
                  activities.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-800/40">
                      <td className="px-6 py-4 font-semibold text-white">{row.item}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{row.owner}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(row.created_at).toLocaleDateString('en-GB')}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-slate-500">
                      No board resolutions currently logged. Platform is ready for operational data entry.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-slate-950 text-xs text-slate-500 border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />
          <p>© 2026 Bunyoro Muhama Real Estates LTD. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
