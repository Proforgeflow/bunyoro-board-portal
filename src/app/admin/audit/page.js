import Link from 'next/link';
import Logo from '../../../components/Logo';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const revalidate = 0;

export default async function AuditLogDashboard() {
  let logs = [];
  let dbError = null;

  if (supabase) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      dbError = error.message;
    } else if (data) {
      logs = data;
    }
  }

  const getActionBadge = (action) => {
    if (action.includes('RECORD') || action.includes('INSERT')) {
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
    if (action.includes('APPROVE') || action.includes('DISPATCH')) {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
    if (action.includes('DELETE') || action.includes('ERROR')) {
      return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
    return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden print:bg-white print:text-black">
      {/* Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-b from-amber-500/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none rounded-full print:hidden" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 px-6 py-3.5 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden sm:inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Immutable Audit Monitor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-xs font-semibold text-slate-400 hover:text-white px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
              ← Shareholder Registry
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 print:p-0 print:max-w-none relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              Bunyoro Muhama Real Estates LTD
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Institutional Audit Trail & Event Log
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Cryptographic event log tracking all ledger posts, bank webhook events, and SMS notifications.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl">
              Log Retention: <strong className="text-white">Live Unlimited</strong>
            </span>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">System Events Log</h2>
            <span className="text-[11px] text-slate-400">
              Showing <strong className="text-white">{logs.length}</strong> latest event(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800 tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Timestamp (UTC)</th>
                  <th className="px-6 py-3.5">Actor</th>
                  <th className="px-6 py-3.5">Action Event</th>
                  <th className="px-6 py-3.5">Entity</th>
                  <th className="px-6 py-3.5">IP Address</th>
                  <th className="px-6 py-3.5">Payload Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-3.5 text-slate-400 font-mono text-[11px]">
                        {new Date(log.created_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'medium' })}
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-white">
                        {log.actor_name}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getActionBadge(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                          {log.entity_type} {log.entity_id ? `#${log.entity_id.slice(0, 6)}` : ''}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-slate-500 text-[11px]">
                        {log.ip_address || 'Internal'}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[10px] text-slate-400 max-w-xs truncate">
                        {JSON.stringify(log.payload)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 text-xs">
                      No audit events logged yet. Perform an action in the Shareholder Registry to view incoming logs.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
