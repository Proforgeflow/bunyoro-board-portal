import Link from 'next/link';
import Logo from '../../../components/Logo';
import PrintCertificateButton from '../../../components/PrintCertificateButton';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const revalidate = 0;

export default async function ShareCertificatePage({ params }) {
  const resolvedParams = await params;
  const memberId = resolvedParams?.id || '1';

  let member = {
    id: memberId,
    member_name: 'Leon Akiiki',
    phone_number: '+256770000001',
    role: 'Chairperson Board Executive',
    shares_count: 50,
    total_paid_ugx: 5000000,
    payment_status: 'Approved',
    payment_channel: 'Stanbic Bank',
    created_at: new Date().toISOString(),
  };

  if (supabase && memberId) {
    const { data } = await supabase.from('member_shares').select('*').eq('id', memberId).single();
    if (data) member = data;
  }

  const certNumber = `BMRE-CERT-${member.id.toString().slice(0, 8).toUpperCase()}`;
  const issueDate = new Date(member.created_at || Date.now()).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 print:p-0 print:bg-white print:text-black flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl flex items-center justify-between mb-6 print:hidden">
        <Link href="/admin" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2">
          ← Back to Shareholder Registry
        </Link>
        <PrintCertificateButton />
      </div>

      <div className="w-full max-w-4xl bg-slate-900 border-8 border-double border-amber-500/40 rounded-2xl p-10 relative shadow-2xl print:border-8 print:border-double print:border-amber-700 print:bg-white print:shadow-none print:p-8">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none print:opacity-10">
          <div className="text-9xl font-black text-amber-500 tracking-tighter">BMRE</div>
        </div>

        <div className="text-center border-b border-amber-500/30 pb-6 mb-8 print:border-amber-700/40">
          <div className="flex justify-center mb-4">
            <Logo width={200} />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-400 tracking-wider uppercase print:text-amber-800">
            Share Ownership Certificate
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest mt-1 print:text-slate-600">
            Bunyoro Muhama Real Estates LTD • Corporate Equity Registry
          </p>
          <div className="inline-block mt-3 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[10px] font-mono font-bold text-amber-400 print:bg-transparent print:text-amber-900 print:border-amber-700">
            Certificate Serial: {certNumber}
          </div>
        </div>

        <div className="text-center max-w-2xl mx-auto space-y-6 my-8">
          <p className="text-sm text-slate-300 italic font-serif print:text-slate-700">
            This is to certify that
          </p>
          
          <div className="text-2xl md:text-3xl font-extrabold text-white border-b-2 border-slate-700 pb-2 print:text-black print:border-slate-400">
            {member.member_name}
          </div>
          
          <p className="text-sm text-slate-300 leading-relaxed font-serif print:text-slate-800">
            is the registered holder of <strong className="text-blue-400 font-sans print:text-black">{member.shares_count} Fully Paid Ordinary Shares</strong> of nominal value <strong className="text-slate-200 font-sans print:text-black">UGX 100,000</strong> each in Bunyoro Muhama Real Estates LTD, fully settled via <strong className="text-slate-200 font-sans print:text-black">{member.payment_channel}</strong>.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-4 text-xs font-sans">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl print:bg-slate-50 print:border-slate-300">
              <span className="text-slate-400 block uppercase font-bold text-[10px] print:text-slate-600">Total Capital Value</span>
              <strong className="text-emerald-400 text-sm print:text-black">UGX {Number(member.total_paid_ugx).toLocaleString()}</strong>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl print:bg-slate-50 print:border-slate-300">
              <span className="text-slate-400 block uppercase font-bold text-[10px] print:text-slate-600">Stanbic Treasury Status</span>
              <strong className="text-blue-400 text-sm print:text-black">{member.payment_status}</strong>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 pt-12 mt-8 border-t border-slate-800 print:border-slate-300 text-center">
          <div>
            <div className="h-10 border-b border-slate-600 mb-2 flex items-end justify-center font-serif italic text-amber-400/80 text-sm print:text-slate-800">
              Leon Akiiki
            </div>
            <span className="text-xs font-bold text-white uppercase tracking-wider block print:text-black">Leon Akiiki</span>
            <span className="text-[10px] text-slate-400 block print:text-slate-600">Chairperson Board Executive</span>
          </div>
          <div>
            <div className="h-10 border-b border-slate-600 mb-2 flex items-end justify-center font-serif italic text-amber-400/80 text-sm print:text-slate-800">
              Asuman Kusiima
            </div>
            <span className="text-xs font-bold text-white uppercase tracking-wider block print:text-black">Secretariat & Legal</span>
            <span className="text-[10px] text-slate-400 block print:text-slate-600">Issued Date: {issueDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
