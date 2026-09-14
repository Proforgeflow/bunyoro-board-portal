import Link from 'next/link';
import Logo from '../../components/Logo';
import RecordShareModal from '../../components/RecordShareModal';
import ExportButtons from '../../components/ExportButtons';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const revalidate = 0;

export default async function AdminDashboard() {
  let members = [];
  let dbError = null;

  if (supabase) {
    const { data, error } = await supabase.from('member_shares').select('*').order('created_at', { ascending: false });
    if (error) {
      dbError = error.message;
    } else if (data) {
      members = data;
    }
  }

  const totalShares = members.reduce((sum, m) => sum + Number(m.shares_count || 0), 0);
  const totalCapitalUGX = members.reduce((sum, m) => sum + Number(m.total_paid_ugx || 0), 0);
  const approvedCapitalUGX = members.filter(m => m.payment_status === 'Approved').reduce((sum, m) => sum + Number(m.total_paid_ugx || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden print:bg-white print:text-black">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 px-6 py-3.5 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-all">
              ← Main Portal
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 print:p-0 print:max-w-none">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 print:mb-4">
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1 print:hidden">
              Bunyoro Muhama Real Estates LTD
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight print:text-black print:text-xl">
              Member Equity & Share Ledger
            </h1>
            <p className="text-slate-400 text-xs mt-1 print:text-slate-600">
              Official audit registry of share capital deposits and Stanbic bank clearings.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <ExportButtons members={members} />
            <RecordShareModal />
          </div>
        </div>

        {/* Real Dynamic Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 print:grid-cols-3 print:gap-4 print:mb-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider print:text-slate-700">Total Capital Pledged</div>
            <div className="text-2xl font-black text-white mt-1 print:text-black">UGX {totalCapitalUGX.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500 mt-1 print:text-slate-600">{members.length} registered entries</div>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider print:text-slate-700">Stanbic Cleared Funds</div>
            <div className="text-2xl font-black text-emerald-400 mt-1 print:text-black">UGX {approvedCapitalUGX.toLocaleString()}</div>
            <div className="text-[11px] text-emerald-500/80 mt-1 print:text-slate-600">Verified settlements</div>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300">
            <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider print:text-slate-700">Total Issued Shares</div>
            <div className="text-2xl font-black text-blue-400 mt-1 print:text-black">{totalShares} Shares</div>
            <div className="text-[11px] text-slate-500 mt-1 print:text-slate-600">UGX 100,000 per unit</div>
          </div>
        </div>

        {/* Share Registry Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden print:bg-white print:border-slate-300">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between print:border-slate-300 print:py-2">
            <h2 className="text-sm font-bold text-white print:text-black">Shareholder Registry</h2>
            <span className="text-[11px] text-slate-400 print:hidden">
              Showing <strong className="text-white">{members.length}</strong> record(s)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 print:text-black">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800 tracking-wider print:bg-slate-100 print:text-black print:border-slate-300">
                <tr>
                  <th className="px-6 py-3.5 print:px-3 print:py-2">Member Name</th>
                  <th className="px-6 py-3.5 print:px-3 print:py-2">Role</th>
                  <th className="px-6 py-3.5 print:px-3 print:py-2">Shares</th>
                  <th className="px-6 py-3.5 print:px-3 print:py-2">Capital Contribution</th>
                  <th className="px-6 py-3.5 print:px-3 print:py-2">Channel</th>
                  <th className="px-6 py-3.5 print:px-3 print:py-2">Status</th>
                  <th className="px-6 py-3.5 text-right print:hidden">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 print:divide-slate-200">
                {members.length > 0 ? (
                  members.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-800/40 print:hover:bg-transparent">
                      <td className="px-6 py-3.5 font-semibold text-white print:text-black print:px-3 print:py-2">
                        {m.member_name}
                        <div className="text-[10px] text-slate-500 font-normal print:text-slate-600">{m.phone_number}</div>
                      </td>
                      <td className="px-6 py-3.5 text-slate-400 print:text-slate-700 print:px-3 print:py-2">{m.role}</td>
                      <td className="px-6 py-3.5 font-bold text-blue-400 print:text-black print:px-3 print:py-2">{m.shares_count}</td>
                      <td className="px-6 py-3.5 font-bold text-white print:text-black print:px-3 print:py-2">UGX {Number(m.total_paid_ugx).toLocaleString()}</td>
                      <td className="px-6 py-3.5 text-slate-400 print:text-slate-700 print:px-3 print:py-2">{m.payment_channel}</td>
                      <td className="px-6 py-3.5 print:px-3 print:py-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          m.payment_status === 'Approved' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 print:text-black print:border-slate-300' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20 print:text-black print:border-slate-300'
                        }`}>
                          {m.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right print:hidden">
                        <Link
                          href={`/certificates/${m.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white text-[11px] font-semibold transition-all"
                        >
                          Certificate →
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500 text-xs">
                      No share transactions logged yet. Click <strong className="text-white">+ Record Share Deposit</strong> above to enter your first verified entry.
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
