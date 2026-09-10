'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Header from '@/components/Header'

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
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (profile) setCurrentProfile(profile)
    }

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

  // Dynamic Live Calculated Metrics
  const totalCapitalUGX = members.reduce((sum, m) => sum + (Number(m.capital_ugx) || 0), 0)
  const approvedCount = members.filter((m) => m.status === 'approved' || m.status === 'verified').length
  const pendingCount = members.filter((m) => m.status === 'pending' || !m.status).length

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400 font-mono text-sm">
        <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping mr-2"></span>
        Syncing Executive Command Studio...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-12">
      <Header
        fullName={currentProfile?.full_name || currentProfile?.email || currentProfile?.phone}
        status={currentProfile?.status || 'pending'}
        role={currentProfile?.role || 'shareholder'}
        onSignOut={handleSignOut}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div>
            <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-widest">Executive Command Studio</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">Bunyoro Omuhama Real Estates LTD</h1>
            <p className="text-xs sm:text-sm text-slate-400">Shareholder Registry & Capital Portal</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center bg-slate-950/80 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-emerald-400">LIVE REALTIME</span>
          </div>
        </div>

        {/* Dynamic Analytics KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <p className="text-xs font-mono uppercase text-slate-400">Total Share Capital</p>
            <p className="text-xl sm:text-2xl font-mono font-bold text-amber-400 mt-2">
              {totalCapitalUGX.toLocaleString()} <span className="text-xs text-amber-500">UGX</span>
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <p className="text-xs font-mono uppercase text-slate-400">Verified Shareholders</p>
            <p className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 mt-2">{approvedCount}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <p className="text-xs font-mono uppercase text-slate-400">Pending Review</p>
            <p className="text-xl sm:text-2xl font-mono font-bold text-amber-500 mt-2">{pendingCount}</p>
          </div>
        </div>

        {/* Member Directory */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-white">Shareholder Directory ({members.length})</h2>
          </div>

          {/* Responsive Table for Desktop View (Hidden on Small Screens) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Member</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Capital (UGX)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-semibold text-white">{m.full_name || 'N/A'}</td>
                    <td className="p-3 text-xs text-slate-400 font-mono">{m.phone || m.email || m.id}</td>
                    <td className="p-3 font-mono text-amber-400 font-bold">{Number(m.capital_ugx || 0).toLocaleString()} UGX</td>
                    <td className="p-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        m.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {m.status || 'pending'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button 
                        onClick={() => { setEditingMember(m); setCapitalInput(m.capital_ugx || '0'); }}
                        className="text-xs px-3 py-1 bg-slate-800 text-amber-400 border border-slate-700 rounded-lg hover:bg-slate-700 transition"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => toggleStatus(m.id, m.status)}
                        disabled={updatingId === m.id}
                        className={`text-xs px-3 py-1 text-white rounded-lg transition ${
                          m.status === 'approved' ? 'bg-amber-700 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-500'
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

          {/* Touch-Friendly Card View for Mobile Screens (Hidden on Medium+ Screens) */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {members.map((m) => (
              <div key={m.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-white text-base">{m.full_name || 'N/A'}</p>
                    <p className="text-xs font-mono text-slate-400">{m.phone || m.email || 'No contact info'}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    m.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {m.status || 'pending'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                  <div>
                    <p className="text-[10px] font-mono text-slate-500 uppercase">Capital Contribution</p>
                    <p className="text-sm font-mono font-bold text-amber-400">{Number(m.capital_ugx || 0).toLocaleString()} UGX</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setEditingMember(m); setCapitalInput(m.capital_ugx || '0'); }}
                      className="text-xs px-2.5 py-1 bg-slate-800 text-amber-400 border border-slate-700 rounded-lg"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => toggleStatus(m.id, m.status)}
                      className={`text-xs px-2.5 py-1 text-white rounded-lg ${
                        m.status === 'approved' ? 'bg-amber-700' : 'bg-emerald-600'
                      }`}
                    >
                      {m.status === 'approved' ? 'Pending' : 'Approve'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSaveCapital} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 max-w-sm w-full shadow-2xl">
            <h3 className="font-bold text-white text-base">Update Equity Capital</h3>
            <p className="text-xs text-slate-400">{editingMember.full_name || editingMember.email}</p>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Amount (UGX)</label>
              <input 
                type="number" 
                value={capitalInput} 
                onChange={(e) => setCapitalInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-3 text-amber-400 font-mono rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingMember(null)} className="px-3 py-2 text-xs font-semibold text-slate-400">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white rounded-xl">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}