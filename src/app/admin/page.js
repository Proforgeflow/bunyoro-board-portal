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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans print:bg-white print:text-black">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800 px-6 py-4 print:hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo width={160} />
            <span className="text-xs font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
              Admin & Governance Panel
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
              ← Return to Portal
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 print:p-0 print:max-w-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 print:mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white print:text-black print:text-2xl">Member Equity & Share Ledger</h1>
            <p className="text-slate-400 text-sm mt-1 print:text-slate-600">Bunyoro Board Portal • Official Institutional Shareholder Registry</p>
          </div>
          <div className="flex items-center gap-3 print:hidden">
            <ExportButtons members={members} />
            <RecordShareModal />
          </div>
        </div>

        {/* Financial & Equity Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 print:grid-cols-4 print:gap-4 print:mb-6">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 print:p-4">
            <div className="text-xs text-slate-400 uppercase font-semibold print:text-slate-700">Total Capital Pledged</div>
            <div className="text-2xl font-extrabold text-white mt-2 print:text-black print:text-lg">UGX {totalCapitalUGX.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1 print:text-slate-600">{members.length} registered members</div>
          </div>
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 print:p-4">
            <div className="text-xs text-slate-400 uppercase font-semibold print:text-slate-700">Stanbic Cleared Funds</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-2 print:text-black print:text-lg">UGX {approvedCapitalUGX.toLocaleString()}</div>
            <div className="text-xs text-emerald-500/80 mt-1 print:text-slate-600">Maker-Checker verified</div>
          </div>
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 print:p-4">
            <div className="text-xs text-slate-400 uppercase font-semibold print:text-slate-700">Total Issued Shares</div>
            <div className="text-2xl font-extrabold text-blue-400 mt-2 print:text-black print:text-lg">{totalShares} Shares</div>
            <div className="text-xs text-slate-500 mt-1 print:text-slate-600">Allotted equity units</div>
          </div>
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300 print:p-4">
            <div className="text-xs text-slate-400 uppercase font-semibold print:text-slate-700">Treasury Reserve Floor</div>
            <div className="text-2xl font-extrabold text-amber-400 mt-2 print:text-black print:text-lg">UGX 2,000,000</div>
            <div className="text-xs text-amber-500/80 mt-1 print:text-slate-600">0 UGX monthly bank fee tier</div>
          </div>
        </div>

        {/* Shareholder Registry Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden print:bg-white print:border-slate-300">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between print:border-slate-300 print:py-2">
            <h2 className="text-lg font-bold text-white print:text-black">Shareholder Registry</h2>
            <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-md print:hidden">Live Sync</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 print:text-black print:text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-800 print:bg-slate-100 print:text-black print:border-slate-300">
                <tr>
                  <th className="px-6 py-4 print:px-3 print:py-2">Member Name</th>
                  <th className="px-6 py-4 print:px-3 print:py-2">Role</th>
                  <th className="px-6 py-4 print:px-3 print:py-2">Shares</th>
                  <th className="px-6 py-4 print:px-3 print:py-2">Capital Contribution</th>
                  <th className="px-6 py-4 print:px-3 print:py-2">Channel</th>
                  <th className="px-6 py-4 print:px-3 print:py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-white print:text-black print:px-3 print:py-2">
                      {m.member_name}
                      <div className="text-xs text-slate-500 print:text-slate-600">{m.phone_number}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 print:text-slate-700 print:px-3 print:py-2">{m.role}</td>
                    <td className="px-6 py-4 font-bold text-blue-400 print:text-black print:px-3 print:py-2">{m.shares_count}</td>
                    <td className="px-6 py-4 font-semibold text-white print:text-black print:px-3 print:py-2">UGX {Number(m.total_paid_ugx).toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs text-slate-400 print:text-slate-700 print:px-3 print:py-2">{m.payment_channel}</td>
                    <td className="px-6 py-4 print:px-3 print:py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        m.payment_status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 print:text-black print:border-slate-300' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 print:text-black print:border-slate-300'
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
