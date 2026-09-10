'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Header from '@/components/Header' // Ensure path matches your Header location

export default function DashboardPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [currentProfile, setCurrentProfile] = useState<any | null>(null)
  const [members, setMembers] = useState<any[]>([])
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [editingMember, setEditingMember] = useState<any | null>(null)
  const [capitalInput, setCapitalInput] = useState<string>('')

  useEffect(() => {
    fetchProfileAndMembers()

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
            // Also update header if current user changed
            if (currentProfile && payload.new.id === currentProfile.id) {
              setCurrentProfile(payload.new)
            }
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

  async function fetchProfileAndMembers() {
    setLoading(true)

    // Get currently authenticated user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (profile) setCurrentProfile(profile)
    }

    // Fetch all profiles for the admin table
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (allProfiles) setMembers(allProfiles)
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

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Connecting to database...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Executive Header */}
      <Header
        fullName={currentProfile?.full_name || currentProfile?.email}
        status={currentProfile?.status || 'pending'}
        role={currentProfile?.role || 'shareholder'}
        onSignOut={handleSignOut}
      />

      <main className="max-w-6xl mx-auto space-y-6 p-4 md:p-8">
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

        {/* Shareholder Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white">Shareholder Directory ({members.length})</h2>
          </div>

          <div className="overflow-x-auto">
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
                      <span className={`text-xs px-2 py-1 rounded uppercase font-semibold ${
                        m.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {m.status || 'pending'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button 
                        onClick={() => { setEditingMember(m); setCapitalInput(m.capital_ugx || '0'); }}
                        className="text-xs px-2.5 py-1 bg-slate-800 text-amber-400 border border-slate-700 rounded hover:bg-slate-700 transition"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => toggleStatus(m.id, m.status)}
                        disabled={updatingId === m.id}
                        className={`text-xs px-2.5 py-1 text-white rounded transition ${
                          m.status === 'approved' 
                            ? 'bg-amber-700 hover:bg-amber-600' 
                            : 'bg-emerald-600 hover:bg-emerald-500'
                        }`}
                      >
                        {m.status === 'approved' ? 'Mark Pending' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Capital Update Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSaveCapital} className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-white">Update Capital for {editingMember.full_name || editingMember.email}</h3>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Capital Amount (UGX)</label>
              <input 
                type="number" 
                value={capitalInput} 
                onChange={(e) => setCapitalInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2 text-amber-400 font-mono rounded focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingMember(null)} className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white">Cancel</button>
              <button type="submit" className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white rounded">Save Capital</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}