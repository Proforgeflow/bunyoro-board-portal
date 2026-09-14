import Link from 'next/link';
import Logo from '../components/Logo';
import { createClient } from '@supabase/supabase-js';

// Initialize build-safe Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const revalidate = 0; // Dynamic real-time updates

export default async function Home() {
  // Fallback defaults matching exact institutional standard
  let metrics = { active_members: 48, committee_tracks: 14, decision_cycle_hours: 24, compliance_index: 98.4 };
  let activityItems = [
    { item: 'Board annual calendar', status: 'Published', owner: 'Secretariat', badge_color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
    { item: 'Governance review packet', status: 'Under review', owner: 'Legal', badge_color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
    { item: 'Committee budget approval', status: 'Approved', owner: 'Finance', badge_color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
    { item: 'External compliance audit', status: 'Scheduled', owner: 'Risk', badge_color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' }
  ];

  // Fetch live operational data from Supabase if connected
  if (supabase) {
    const { data: metricsData } = await supabase.from('board_metrics').select('*').single();
    if (metricsData) metrics = metricsData;

    const { data: activityData } = await supabase.from('board_activities').select('*').order('created_at', { ascending: false });
    if (activityData && activityData.length > 0) activityItems = activityData;
  }

  const features = [
    { title: 'Board & Council Management', category: 'Strategic oversight', desc: 'Track membership, roles, attendance, appointments and governance calendars across every board and council body.' },
    { title: 'Secure Decision Workflow', category: 'Audit-ready', desc: 'Route resolutions, approvals, and delegated actions through a transparent, auditable approval chain.' },
    { title: 'Agenda & Minutes Automation', category: 'Paperless operations', desc: 'Prepare meeting packs, distribute agendas, collect minute approvals and archive institutional records in one place.' },
    { title: 'Document Control & Compliance', category: 'Policy confidence', desc: 'Manage policies, procurement records, board packs, and statutory documents with version control and access governance.' },
    { title: 'Institutional Reporting', category: 'Executive visibility', desc: 'Generate executive dashboards, committee summaries, and performance reports for leadership and oversight bodies.' },
    { title: 'Stakeholder Collaboration', category: 'Cross-team alignment', desc: 'Coordinate meetings with directors, secretariats, legal advisors, and external partners in a secure environment.' },
  ];

  const steps = [
    'Institutional governance planning and board representation',
    'Committee preparation, agenda assembly, and resolutions tracking',
    'Secure approval flow with escalation and signature trails',
    'Executive reporting, compliance monitoring, and archival continuity',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo width={160} />
            <nav className="hidden md:flex gap-6 text-sm text-slate-400 font-medium">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#activity" className="hover:text-white transition-colors">Operations</a>
              <a href="#model" className="hover:text-white transition-colors">Governance</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors">
              Sign In
            </Link>
            <Link href="/admin" className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-600/20">
              Open Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16 border-b border-slate-800/60 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
            Institutional Command Center
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            Governance made visible, trackable, and accountable.
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            A secure, role-aware board portal built for public institutions, councils, and executive leadership to manage decisions, records, approvals, and reporting with confidence.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <a href="#features" className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium border border-slate-700 transition-colors">
              Explore features
            </a>
            <Link href="/signup" className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors shadow-lg shadow-blue-600/20">
              Join as member
            </Link>
            <Link href="/admin" className="px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium border border-slate-800 transition-colors">
              View equity dashboard
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium uppercase tracking-wider">
            <span>✓ Board-ready</span>
            <span>✓ Audit trail</span>
            <span>✓ Role security</span>
            <span>✓ Executive reporting</span>
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <section className="px-6 py-12 border-b border-slate-800/60 bg-slate-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">Executive Snapshot • Quarterly Governance Pulse</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-3xl md:text-4xl font-extrabold text-blue-400 mb-1">{metrics.active_members}</div>
              <div className="text-sm font-semibold text-white">Board Members</div>
              <div className="text-xs text-slate-400 mt-1">active governance leaders</div>
            </div>
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-3xl md:text-4xl font-extrabold text-blue-400 mb-1">{metrics.committee_tracks}</div>
              <div className="text-sm font-semibold text-white">Committee Tracks</div>
              <div className="text-xs text-slate-400 mt-1">operational and strategic workstreams</div>
            </div>
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-3xl md:text-4xl font-extrabold text-blue-400 mb-1">{metrics.decision_cycle_hours}h</div>
              <div className="text-sm font-semibold text-white">Decision Cycle</div>
              <div className="text-xs text-slate-400 mt-1">workflow turnaround target</div>
            </div>
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-3xl md:text-4xl font-extrabold text-blue-400 mb-1">{metrics.compliance_index}%</div>
              <div className="text-sm font-semibold text-white">Compliance Index</div>
              <div className="text-xs text-slate-400 mt-1">policy adherence and review coverage</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="px-6 py-20 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Core Features</div>
            <h2 className="text-3xl font-bold text-white">Built for institutional operations at scale.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{f.category}</span>
                <h3 className="text-lg font-bold text-white mt-1 mb-3">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Board Activity Dashboard */}
      <section id="activity" className="px-6 py-20 border-b border-slate-800/60 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Operational View</div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Board activity dashboard</h2>
            </div>
            <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700 w-fit">Updated today</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {activityItems.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{row.item}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${row.badge_color}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{row.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Governance Model */}
      <section id="model" className="px-6 py-20 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Governance Model</div>
            <h2 className="text-3xl font-bold text-white">How the platform supports institutional decision-making.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-slate-900 border border-slate-800 relative">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                  {idx + 1}
                </div>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-800 pt-12">
          <div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">Institutional Readiness</div>
            <p className="text-slate-400 text-sm">Prepared for governance, compliance, continuity, and service delivery.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors shadow-lg shadow-blue-600/20">
              View administration panel
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-3">
            <Logo width={120} />
            <span>Institutional governance platform</span>
          </div>
          <p>Built to support visibility, accountability, and informed decision-making.</p>
        </div>
      </footer>
    </div>
  );
}
