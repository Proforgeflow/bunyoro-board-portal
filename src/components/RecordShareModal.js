'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function RecordShareModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    member_name: '',
    phone_number: '',
    role: 'Board Member',
    shares_count: 10,
    payment_channel: 'Stanbic Bank',
    payment_status: 'Approved',
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (supabase) {
      const { error } = await supabase.from('member_shares').insert([
        {
          member_name: formData.member_name,
          phone_number: formData.phone_number,
          role: formData.role,
          shares_count: parseInt(formData.shares_count, 10),
          payment_channel: formData.payment_channel,
          payment_status: formData.payment_status,
        },
      ]);

      if (error) {
        alert(`Error recording share deposit: ${error.message}`);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    setIsOpen(false);
    setFormData({
      member_name: '',
      phone_number: '',
      role: 'Board Member',
      shares_count: 10,
      payment_channel: 'Stanbic Bank',
      payment_status: 'Approved',
    });
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-blue-600/20 transition-colors"
      >
        + Record Share Deposit
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">Record Member Share Deposit</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Member Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.member_name}
                  onChange={(e) => setFormData({ ...formData, member_name: e.target.value })}
                  placeholder="e.g. Akiiki Grace"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    placeholder="+256 700 000000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Governance Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Board Member">Board Member</option>
                    <option value="Chairperson Board Executive">Chairperson Board Executive</option>
                    <option value="Executive Member">Executive Member</option>
                    <option value="Shareholder">Shareholder</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Shares Allotted</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.shares_count}
                    onChange={(e) => setFormData({ ...formData, shares_count: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <div className="text-[10px] text-slate-500 mt-1">
                    Value: UGX {(Number(formData.shares_count || 0) * 100000).toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Payment Channel</label>
                  <select
                    value={formData.payment_channel}
                    onChange={(e) => setFormData({ ...formData, payment_channel: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Stanbic Bank">Stanbic Bank</option>
                    <option value="Mobile Money">Mobile Money</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Maker-Checker Status</label>
                <select
                  value={formData.payment_status}
                  onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Approved">Approved (Verified in Stanbic / MoMo)</option>
                  <option value="Pending">Pending (Awaiting Verification)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-600/20 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Recording...' : 'Save & Post to Ledger'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
