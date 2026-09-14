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
  let members = [
    { id: '1', member_name: 'Leon Akiiki', phone_number: '+256770000001', role: 'Chairperson Board Executive', shares_count: 50, total_paid_ugx: 5000000, payment_status: 'Approved', payment_channel: 'Stanbic Bank' },
    { id: '2', member_name: 'Atwooki Sylivia', phone_number: '+256770000002', role: 'Board Member', shares_count: 30, total_paid_ugx: 3000000, payment_status: 'Approved', payment_channel: 'Stanbic Bank' },
    { id: '3', member_name: 'Asuman Kusiima', phone_number: '+256770000003', role: 'Board Member', shares_count: 40, total_paid_ugx: 4000000, payment_status: 'Approved', payment_channel: 'Mobile Money' },
    { id: '4', member_name: 'Nambiru Olivia', phone_number: '+256770000004', role: 'Executive Member', shares_count: 25, total_paid_ugx: 2500000, payment_status: 'Approved', payment_channel: 'Stanbic Bank' },
    { id: '5', member_name: 'Atugonza Janet', phone_number: '+256770000005', role: 'Board Member', shares_count: 20, total_paid_ugx: 2000000, payment_status: 'Pending', payment_channel: 'Mobile Money' },
    { id: '6', member_name: 'Lilly Princess', phone_number: '+256770000006', role: 'Executive Member', shares_count: 20, total_paid_ugx: 2000000, payment_status: 'Approved', payment_channel: 'Stanbic Bank' },
  ];

  if (supabase) {
    const { data } = await supabase.from('member_shares').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) members = data;
  }

  const totalShares = members.reduce((sum, m) => sum + Number(m.shares_count || 0), 0);
  const totalCapitalUGX = members.reduce((sum, m) => sum + Number(m.total_paid_ugx || 0), 0);
  const approvedCapitalUGX = members.filter(m => m.payment_status === 'Approved').reduce((sum, m) => sum + Number(m.total_paid_ugx || 0), 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden print:bg-white print:text-black">
      {/* Background Mesh Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-blue-600/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none rounded-full print:hidden" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-6 py-4 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo width={170} />
            <span className="hidden sm:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-blue-500/10 text-blue-400 px-3.5 py-1.5 rounded-full border border-blue-500/20">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Executive Treasury & Equity Ledger
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all">
              ← Main Portal
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 print:p-0 print:max-w-none relative z-10">
        {/* Header Title Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6 print:mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3 print:hidden">
              Bunyoro Muhama Real Estates LTD
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight print:text-black print:text-2xl">
              Member Equity & Share Ledger
            </h1>
            <p className="text-slate-400 text-sm mt-1 print:text-slate-600">
              Real-time audit registry of share capital contributions, Stanbic bank clearing, and equity voting weights.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 print:hidden">
            <ExportButtons members={members} />
            <RecordShareModal />
          </div>
        </div>

        {/* Executive Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 print:grid-cols-4 print:gap-4 print:mb-6">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/90 shadow-xl print:bg-slate-50 print:border-slate-300 print:p-4">
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider print:text-slate-700">Total Capital Pledged</div>
            <div className="text-2xl md:text-3xl font-black text-white mt-2 print:text-black print:text-lg">UGX {totalCapitalUGX.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1 print:text-slate-600">{members.length} registered governance members</div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/90 shadow-xl print:bg-slate-50 print:border-slate-300 print:p-4">
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider print:text-slate-700">Stanbic Cleared Funds</div>
            <div className="text-2xl md:text-3xl font-black text-emerald-400 mt-2 print:text-black print:text-lg">UGX {approvedCapitalUGX.toLocaleString()}</div>
            <div className="text-xs text-emerald-500/80 mt-1 print:text-slate-600">Maker-Checker dual verified</div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/90 shadow-xl print:bg-slate-50 print:border-slate-300 print:p-4">
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider print:text-slate-700">Total Issued Shares</div>
            <div className="text-2xl md:text-3xl font-black text-blue-400 mt-2 print:text-black print:text-lg">{totalShares} Shares</div>
            <div className="text-xs text-slate-500 mt-1 print:text-slate-600">UGX 100,000 per share unit</div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/90 shadow-xl print:bg-slate-50 print:border-slate-300 print:p-4">
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider print:text-slate-700">Treasury Reserve Floor</div>
            <div className="text-2xl md:text-3xl font-black text-amber-400 mt-2 print:text-black print:text-lg">UGX 2,000,000</div>
            <div className="text-xs text-amber-500/80 mt-1 print:text-slate-600">0 UGX monthly bank fee tier</div>
          </div>
        </div>

        {/* Shareholder Registry Table Container */}
        <div className="rounded-2xl border border-slate-800/90 bg-slate-900/60 shadow-2xl backdrop-blur-md overflow-hidden print:bg-white print:border-slate-300">
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between print:border-slate-300 print:py-2">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-extrabold text-white print:text-black">Shareholder Registry</h2>
              <span className="text-xs bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-1 rounded-md print:hidden">Live Sync</span>
            </div>
            <span className="text-xs text-slate-400 print:hidden">
              Showing <strong className="text-white">{members.length}</strong> entries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 print:text-black print:text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-bold border-b border-slate-800 tracking-wider print:bg-slate-100 print:text-black print:border-slate-300">
                <tr>
                  <th className="px-6 py-4 print:px-3 print:py-2">Member Name</th>
                  <th className="px-6 py-4 print:px-3 print:py-2">Governance Role</th>
                  <th className="px-6 py-4 print:px-3 print:py-2">Shares</th>
                  <th className="px-6 py-4 print:px-3 print:py-2">Capital Contribution</th>
                  <th className="px-6 py-4 print:px-3 print:py-2">Channel</th>
                  <th className="px-6 py-4 print:px-3 print:py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 print:divide-slate-200">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-white group-hover:text-blue-300 transition-colors print:text-black print:px-3 print:py-2">
                      {m.member_name}
                      <div className="text-xs text-slate-500 font-normal print:text-slate-600">{m.phone_number}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 print:text-slate-700 print:px-3 print:py-2">
                      <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 print:bg-transparent print:border-none print:p-0">
                        {m.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-extrabold text-blue-400 print:text-black print:px-3 print:py-2">{m.shares_count}</td>
                    <td className="px-6 py-4 font-bold text-white print:text-black print:px-3 print:py-2">UGX {Number(m.total_paid_ugx).toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs text-slate-400 print:text-slate-700 print:px-3 print:py-2">{m.payment_channel}</td>
                    <td className="px-6 py-4 print:px-3 print:py-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                        m.payment_status === 'Approved' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 print:text-black print:border-slate-300' 
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20 print:text-black print:border-slate-300'
                      }`}>
                        {m.payment_status}
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
