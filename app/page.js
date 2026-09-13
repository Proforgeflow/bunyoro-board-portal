export const dynamic = 'force-dynamic';
const highlights = [
  { label: 'Board Members', value: '48', detail: 'active governance leaders' },
  { label: 'Committee Tracks', value: '14', detail: 'operational and strategic workstreams' },
  { label: 'Decision Cycle', value: '24h', detail: 'workflow turnaround target' },
  { label: 'Compliance Index', value: '98.4%', detail: 'policy adherence and review coverage' },
];

const features = [
  {
    title: 'Board & Council Management',
    description:
      'Track membership, roles, attendance, appointments and governance calendars across every board and council body.',
    accent: 'Strategic oversight',
  },
  {
    title: 'Secure Decision Workflow',
    description:
      'Route resolutions, approvals, and delegated actions through a transparent, auditable approval chain.',
    accent: 'Audit-ready',
  },
  {
    title: 'Agenda & Minutes Automation',
    description:
      'Prepare meeting packs, distribute agendas, collect minute approvals and archive institutional records in one place.',
    accent: 'Paperless operations',
  },
  {
    title: 'Document Control & Compliance',
    description:
      'Manage policies, procurement records, board packs, and statutory documents with version control and access governance.',
    accent: 'Policy confidence',
  },
  {
    title: 'Institutional Reporting',
    description:
      'Generate executive dashboards, committee summaries, and performance reports for leadership and oversight bodies.',
    accent: 'Executive visibility',
  },
  {
    title: 'Stakeholder Collaboration',
    description:
      'Coordinate meetings with directors, secretariats, legal advisors, and external partners in a secure environment.',
    accent: 'Cross-team alignment',
  },
];

const activities = [
  { item: 'Board annual calendar', status: 'Published', owner: 'Secretariat' },
  { item: 'Governance review packet', status: 'Under review', owner: 'Legal' },
  { item: 'Committee budget approval', status: 'Approved', owner: 'Finance' },
  { item: 'External compliance audit', status: 'Scheduled', owner: 'Risk' },
];

const roadmap = [
  'Institutional governance planning and board representation',
  'Committee preparation, agenda assembly, and resolutions tracking',
  'Secure approval flow with escalation and signature trails',
  'Executive reporting, compliance monitoring, and archival continuity',
];

export default function HomePage() {
  return (
    <main>
      <header className="topbar">
        <div className="container-shell flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Bunyoro Omuhama logo" className="h-12 w-12 rounded-full border border-sky-500/30 bg-slate-950/60 object-cover shadow-lg shadow-sky-500/20" />
            <div>
              <div className="text-lg font-black tracking-wide">Bunyoro Board Portal</div>
              <div className="text-xs muted uppercase tracking-[0.2em]">Governance system</div>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-slate-200 md:flex">
            <a href="#features">Features</a>
            <a href="#operations">Operations</a>
            <a href="#governance">Governance</a>
            <a href="#contact">Contact</a>
          </nav>
          <a
            href="/admin"
            className="rounded-full border border-sky-400/40 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-100 transition hover:bg-sky-500/20"
          >
            Open dashboard
          </a>
        </div>
      </header>

      <section className="section-shell pt-10 pb-8 md:pt-16">
        <div className="container-shell">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="status-pill status-live">Institutional command center</span>
              <h1 className="mt-6 max-w-xl text-4xl font-black tracking-tight text-white md:text-6xl">
                Governance made visible, trackable, and accountable.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                A secure, role-aware board portal built for public institutions, councils, and executive leadership to manage decisions, records, approvals, and reporting with confidence.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#features"
                  className="rounded-full bg-sky-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-300"
                >
                  Explore features
                </a>
                <a
                  href="/signup"
                  className="rounded-full border border-emerald-400/60 bg-emerald-500/10 px-5 py-3 text-sm font-bold text-emerald-100 transition hover:bg-emerald-500/20"
                >
                  Join as member
                </a>
                <a
                  href="/admin"
                  className="rounded-full border border-slate-500/60 bg-slate-800/60 px-5 py-3 text-sm font-bold text-slate-100 transition hover:border-slate-400"
                >
                  View equity dashboard
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-6">
                {['Board-ready', 'Audit trail', 'Role security', 'Executive reporting'].map((tag) => (
                  <span key={tag} className="rounded-full border border-slate-600/70 bg-slate-900/60 px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card grid-pattern p-5 md:p-7">
              <div className="rounded-2xl border border-sky-400/20 bg-slate-950/70 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Executive snapshot</p>
                    <h2 className="mt-2 text-2xl font-bold text-white">Quarterly governance pulse</h2>
                  </div>
                  <span className="status-pill status-live">Live</span>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {highlights.map((item) => (
                    <div key={item.label} className="metric-card">
                      <div className="text-3xl font-black text-white">{item.value}</div>
                      <div className="mt-3 text-sm font-semibold text-slate-200">{item.label}</div>
                      <div className="mt-1 text-xs text-slate-400">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section-shell">
        <div className="container-shell">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-300">Core features</p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">Built for institutional operations at scale.</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="glass-card p-6">
                <div className="mb-4 inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-sky-200">
                  {feature.accent}
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="operations" className="section-shell">
        <div className="container-shell">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="glass-card p-5 md:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Operational view</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Board activity dashboard</h2>
                </div>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">
                  Updated today
                </span>
              </div>

              <div className="table-panel mt-6">
                <table>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Status</th>
                      <th>Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((row) => (
                      <tr key={row.item}>
                        <td className="font-medium text-slate-100">{row.item}</td>
                        <td>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              row.status === 'Approved'
                                ? 'bg-emerald-500/10 text-emerald-200'
                                : row.status === 'Under review'
                                  ? 'bg-amber-500/10 text-amber-200'
                                  : 'bg-sky-500/10 text-sky-200'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="text-slate-300">{row.owner}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div id="governance" className="glass-card p-5 md:p-7">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Governance model</p>
              <h2 className="mt-2 text-2xl font-bold text-white">How the platform supports institutional decision-making.</h2>

              <div className="mt-6 space-y-4">
                {roadmap.map((step, index) => (
                  <div key={step} className="flex gap-4 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-400/15 text-sm font-black text-sky-200">
                      {index + 1}
                    </div>
                    <p className="leading-7 text-slate-200">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pb-16">
        <div className="container-shell">
          <div className="glass-card p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Institutional readiness</p>
                <h2 className="mt-2 text-3xl font-black text-white">Prepared for governance, compliance, continuity, and service delivery.</h2>
              </div>
              <a
                href="/admin"
                className="rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-200"
              >
                View administration panel
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="border-t border-slate-800/80 py-8 text-slate-400">
        <div className="container-shell flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="brand-mark">B</div>
            <div>
              <div className="font-bold text-slate-200">Bunyoro Board Portal</div>
              <div className="text-xs uppercase tracking-[0.18em]">Institutional governance platform</div>
            </div>
          </div>
          <div className="text-sm">Built to support visibility, accountability, and informed decision-making.</div>
        </div>
      </footer>
    </main>
  );
}

