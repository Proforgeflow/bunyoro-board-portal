'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function AdminPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [members, setMembers] = useState<any[]>([])
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [editingMember, setEditingMember] = useState<any | null>(null)
  const [capitalInput, setCapitalInput] = useState<string>('')

  useEffect(() => {
    fetchMembers()

    // Subscribe to live Postgres changes
    const channel = supabase
      .channel('realtime_profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMembers((prev) => [payload.new, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setMembers((prev) =>
              prev.map((m) => (m.id === payload.new.id ? payload.new : m))
            )
          } else if (payload.eventType === 'DELETE') {
            setMembers((prev) => prev.filter((m) => m.id === payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchMembers() {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setMembers(data)
    setLoading(false)
  }

  async function toggleStatus(memberId: string, currentStatus: string) {
    setUpdatingId(memberId)
    const newStatus = currentStatus === 'approved' ? 'pending' : 'approved'
    await supabase.from('profiles').update({ status: newStatus }).eq('id', memberId)
    setUpdatingId(null)
  }

  async function handleSaveCapital(e: React.FormEvent) {
    e.preventDefault()
    if (!editingMember) return
    const numericCapital = parseFloat(capitalInput) || 0
    await supabase.from('profiles').update({ capital_ugx: numericCapital }).eq('id', editingMember.id)
    setEditingMember(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div>
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Executive Command Studio</span>
            <h1 className="text-2xl font-bold text-white mt-1">Member KYC & Equity Capital Management</h1>
            <p className="text-slate-400 text-sm">Bunyoro Omuhama Real Estates LTD — Live Sync Engine</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono text-emerald-400">REALTIME ACTIVE</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white">Shareholder Directory ({members.length})</h2>
          </div>

          {loading ? (
            <p className="text-center py-8 text-slate-500">Connecting to database...</p>
          ) : (
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Member</th>
                  <th className="p-3">Capital (UGX)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-white">{m.full_name || m.email || m.id}</td>
                    <td className="p-3 font-mono text-amber-400">{Number(m.capital_ugx || 0).toLocaleString()} UGX</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded uppercase ${m.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {m.status || 'pending'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button 
                        onClick={() => { setEditingMember(m); setCapitalInput(m.capital_ugx || '0'); }}
                        className="text-xs px-2 py-1 bg-slate-800 text-amber-400 rounded hover:bg-slate-700"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => toggleStatus(m.id, m.status)}
                        disabled={updatingId === m.id}
                        className="text-xs px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-500"
                      >
                        {m.status === 'approved' ? 'Mark Pending' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {editingMember && (
        <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4">
          <form onSubmit={handleSaveCapital} className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 max-w-sm w-full">
            <h3 className="font-bold text-white">Update Capital for {editingMember.full_name || 'Member'}</h3>
            <input 
              type="number" 
              value={capitalInput} 
              onChange={(e) => setCapitalInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-2 text-amber-400 font-mono rounded"
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditingMember(null)} className="px-3 py-1 text-slate-400">Cancel</button>
              <button type="submit" className="px-3 py-1 bg-amber-600 text-white rounded">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}