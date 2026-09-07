'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [members, setMembers] = useState([]);
  const [totalCapital, setTotalCapital] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchBoardData = async () => {
    try {
      const { data, error } = await supabase.from('board_members').select('*');
      if (error) {
        setErrorMsg(error.message);
      } else if (data) {
        setMembers(data);
        const total = data.reduce((sum, item) => sum + Number(item.total_contributions_ugx || 0), 0);
        setTotalCapital(total);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <header className="max-w-6xl mx-auto flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">Bunyoro Muhama Real Estates LTD</h1>
          <p className="text-slate-400 text-sm">Board of Governors Governance Portal</p>
        </div>
        <div className="bg-emerald-950 border border-emerald-500/40 px-4 py-2 rounded-lg text-right">
          <p className="text-xs text-emerald-400 font-semibold tracking-wider">TOTAL TREASURY BALANCE</p>
          <p className="text-2xl font-mono text-emerald-300">UGX {totalCapital.toLocaleString()}</p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto mt-8">
        {loading && <p className="text-slate-400">Loading board records...</p>}
        {errorMsg && (
          <div className="text-red-400 bg-red-950/50 p-4 rounded border border-red-800">
            <p className="font-bold">Database Error:</p>
            <p className="text-sm mt-1">{errorMsg}</p>
          </div>
        )}
        {!loading && !errorMsg && members.length === 0 && (
          <p className="text-slate-400">No board member records found in Supabase table.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {members.map((m) => (
            <div key={m.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-4">
                <img
                  src={m.photo_url || 'https://via.placeholder.com/150'}
                  alt={m.full_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
                />
                <div>
                  <h2 className="font-bold text-lg">{m.full_name}</h2>
                  <p className="text-xs text-slate-400">Age: {m.age} | {m.residential_address}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800/80 text-sm space-y-1">
                <p className="text-slate-400">
                  Next of Kin: <span className="text-slate-200">{m.next_of_kin_name} ({m.next_of_kin_age} yrs)</span>
                </p>
                <p className="text-slate-400">Total Contribution:</p>
                <p className="text-xl font-mono font-bold text-emerald-400">
                  UGX {Number(m.total_contributions_ugx).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}