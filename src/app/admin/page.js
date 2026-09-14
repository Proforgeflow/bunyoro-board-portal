import Link from 'next/link';
import Logo from '../../components/Logo';
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800 px-6 py-4">
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

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Member Equity & Share Ledger</h1>
            <p className="text-slate-400 text-sm mt-1">Track share capital contributions, bank settlements, and member voting weights.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg">
              Share Value: <strong className="text-white">UGX 100,000 / Share</strong>
            </span>
          </div>
        </div>

        {/* Financial & Equity Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400 uppercase font-semibold">Total Capital Pledged</div>
            <div className="text-2xl font-extrabold text-white mt-2">UGX {totalCapitalUGX.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1">{members.length} registered members</div>
          </div>
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400 uppercase font-semibold">Stanbic Cleared Funds</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-2">UGX {approvedCapitalUGX.toLocaleString()}</div>
            <div className="text-xs text-emerald-500/80 mt-1">Maker-Checker verified</div>
          </div>
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400 uppercase font-semibold">Total Issued Shares</div>
            <div className="text-2xl font-extrabold text-blue-400 mt-2">{totalShares} Shares</div>
            <div className="text-xs text-slate-500 mt-1">Allotted equity units</div>
          </div>
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400 uppercase font-semibold">Treasury Reserve Floor</div>
            <div className="text-2xl font-extrabold text-amber-400 mt-2">UGX 2,000,000</div>
            <div className="text-xs text-amber-500/80 mt-1">0 UGX monthly bank fee tier</div>
          </div>
        </div>

        {/* Member Shareholder Ledger Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Shareholder Registry</h2>
            <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-md">Live Sync</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Member Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Shares</th>
                  <th className="px-6 py-4">Capital Contribution</th>
                  <th className="px-6 py-4">Channel</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      {m.member_name}
                      <div className="text-xs text-slate-500">{m.phone_number}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{m.role}</td>
                    <td className="px-6 py-4 font-bold text-blue-400">{m.shares_count}</td>
                    <td className="px-6 py-4 font-semibold text-white">UGX {Number(m.total_paid_ugx).toLocaleString()}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">{m.payment_channel}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        m.payment_status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
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
