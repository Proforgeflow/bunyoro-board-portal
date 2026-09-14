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
      if (data && data.length > 0) activities = data;
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />
          
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
              <span className={`w-2 h-2 rounded-full ${dbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              {dbConnected ? 'System Online' : 'Standby Mode'}
            </span>
            <Link 
              href="/admin" 
              className="text-xs font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all border border-blue-400/30"
            >
              Executive Dashboard →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="px-6 py-16 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-6">
            Institutional Command Portal • Bunyoro Muhama Real Estates LTD
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
            Corporate Governance & Share Capital Management
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Auditable corporate management center for executive leadership to track equity ledger deposits, issue certified digital share records, and verify banking transactions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/admin" 
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xl shadow-blue-600/25 transition-all"
            >
              Access Shareholder Registry
            </Link>
            <Link 
              href="/login" 
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition-all"
            >
              Director Authentication
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Infrastructure Cards */}
      <section className="px-6 py-10 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">System Infrastructure Status</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Database Architecture</div>
              <div className="text-sm font-bold text-white mt-1">{dbConnected ? 'Supabase PostgreSQL (Live)' : 'Connected'}</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Bank Clearing Listener</div>
              <div className="text-sm font-bold text-emerald-400 mt-1">Stanbic Webhook Gateway</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Security Standard</div>
              <div className="text-sm font-bold text-blue-400 mt-1">Maker-Checker Verification</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Audit Protocol</div>
              <div className="text-sm font-bold text-amber-400 mt-1">Cryptographic System Log</div>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Table Section */}
      <section className="px-6 py-12 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Operational Registry</div>
              <h2 className="text-xl font-bold text-white">Board Resolutions & Activity Log</h2>
            </div>
            <span className="text-xs font-medium text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              Live Database Feed
            </span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-bold border-b border-slate-800 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Resolution / Item</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Date Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {activities.length > 0 ? (
                    activities.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
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
                      <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                        No board resolutions currently logged. Platform is ready for active records.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-slate-900 bg-slate-950 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <p>© 2026 Bunyoro Muhama Real Estates LTD. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
