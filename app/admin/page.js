'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function IntegratedAdminStudio() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('members');
  const [loading, setLoading] = useState(true);

  const [members, setMembers] = useState([]);
  const [editingCapital, setEditingCapital] = useState({});

  useEffect(() => {
    verifyAdminAndLoad();
  }, []);

  async function verifyAdminAndLoad() {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      router.push('/');
      return;
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();

    if (profile?.role !== 'admin') {
      alert('Access Denied: Executive Admin Authorization Required.');
      router.push('/dashboard');
      return;
    }

    await refreshMembers();
    setLoading(false);
  }

  async function refreshMembers() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setMembers(data || []);
  }

  async function updateMemberEquity(id, status, capital, location) {
    const { error } = await supabase.from('profiles').update({
      status,
      capital_contributed: Number(capital),
      location: location || 'Hoima, Uganda'
    }).eq('id', id);

    if (error) {
      alert('Error updating member: ' + error.message);
    } else {
      alert('Member equity & location updated successfully!');
      refreshMembers();
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-400 font-bold text-xs uppercase">Authenticating Executive Credentials...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-white">Executive Command Studio</h1>
            <p className="text-xs text-amber-400 font-bold uppercase">Member KYC & Equity Capital Management</p>
          </div>
          <button onClick={() => router.push('/dashboard')} className="bg-slate-800 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold">Back to Member View</button>
        </header>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-x-auto">
          <h2 className="text-sm font-black uppercase text-white mb-4">Shareholder Directory & Capital Control</h2>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="p-3">Member</th>
                <th className="p-3">Location</th>
                <th className="p-3">Capital (UGX)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {members.map((m) => {
                const currentCap = editingCapital[m.id]?.capital ?? m.capital_contributed;
                const currentLoc = editingCapital[m.id]?.location ?? m.location;

                return (
                  <tr key={m.id}>
                    <td className="p-3 font-bold text-white">{m.full_name || m.email}</td>
                    <td className="p-3">
                      <input
                        type="text"
                        value={currentLoc || ''}
                        onChange={(e) => setEditingCapital({ ...editingCapital, [m.id]: { ...editingCapital[m.id], location: e.target.value } })}
                        className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-white w-32 outline-none"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        value={currentCap || 0}
                        onChange={(e) => setEditingCapital({ ...editingCapital, [m.id]: { ...editingCapital[m.id], capital: e.target.value } })}
                        className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-amber-400 font-bold w-36 outline-none"
                      />
                    </td>
                    <td className="p-3 uppercase font-black text-[10px] text-amber-400">{m.status}</td>
                    <td className="p-3 text-right space-x-2">
                      <button onClick={() => updateMemberEquity(m.id, 'approved', currentCap, currentLoc)} className="bg-emerald-500 text-slate-950 font-black px-3 py-1.5 rounded-lg">Save & Approve</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}