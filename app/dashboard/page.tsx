'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function DashboardPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [minutes, setMinutes] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    async function loadDashboardData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/signup'
        return
      }
      setUser(user)

      // 1. Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profileData)

      // 2. Fetch published board minutes
      const { data: minutesData } = await supabase
        .from('board_minutes')
        .select('*')
        .order('created_at', { ascending: false })

      setMinutes(minutesData || [])

      // 3. Fetch business events
      const { data: eventsData } = await supabase
        .from('business_events')
        .select('*')
        .order('created_at', { ascending: false })

      setEvents(eventsData || [])
      setLoading(false)
    }
    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <p className="text-slate-400 text-sm">Loading shareholder portal...</p>
      </div>
    )
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome, {profile?.full_name || user?.email}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Bunyoro Omuhama Real Estates LTD - Shareholder Portal
            </p>
          </div>

          {/* Executive Admin Button */}
          {isAdmin && (
            <a
              href="/admin"
              className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition border border-amber-500/50 shadow-lg shadow-amber-900/30"
            >
              Admin Studio
            </a>
          )}
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <span className="text-xs text-slate-400 uppercase font-semibold">Account Role</span>
            <p className="text-lg font-bold text-amber-400 mt-1 uppercase">{profile?.role || 'member'}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <span className="text-xs text-slate-400 uppercase font-semibold">KYC Status</span>
            <p className="text-lg font-bold text-emerald-400 mt-1 uppercase">{profile?.status || 'approved'}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <span className="text-xs text-slate-400 uppercase font-semibold">Shares Owned</span>
            <p className="text-lg font-bold text-white mt-1">{profile?.shares_count || 1} Share(s)</p>
          </div>
        </div>

        {/* Section: Business Events */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">📅 Business Events & Briefings</h2>
              <p className="text-xs text-slate-400 mt-0.5">Upcoming corporate meetings, investor briefings, and real estate site visits</p>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">
              {events.length} Event(s)
            </span>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-800 rounded-lg">
              No upcoming business events scheduled yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((event) => (
                <div key={event.id} className="bg-slate-950 border border-slate-800/80 rounded-lg p-4 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-2.5 py-0.5 rounded font-medium">
                        {event.type || 'General Event'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {event.event_date ? new Date(event.event_date).toLocaleDateString() : 'TBA'}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base">{event.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {event.location && (
                    <div className="pt-2 border-t border-slate-900 flex items-center gap-1.5 text-xs text-slate-400">
                      <span>📍</span>
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section: Board Meeting Minutes */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">📜 Board Meeting Minutes</h2>
              <p className="text-xs text-slate-400 mt-0.5">Official governance documentation and executive decision logs</p>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-mono">
              {minutes.length} Document(s)
            </span>
          </div>

          {minutes.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-800 rounded-lg">
              No board minutes have been published yet.
            </div>
          ) : (
            <div className="space-y-3">
              {minutes.map((item) => (
                <div key={item.id} className="bg-slate-950 border border-slate-800/80 rounded-lg p-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="font-semibold text-amber-400 text-base">{item.title}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      {item.category && (
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                          {item.category}
                        </span>
                      )}
                      <span className="text-slate-500 font-mono">
                        {item.meeting_date || new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {item.summary || item.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}