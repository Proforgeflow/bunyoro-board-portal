import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Navigation Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-amber-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
              BO
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-tight">
                Bunyoro Omuhama
              </span>
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold block">
                Real Estates LTD • Institutional Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
            >
              Register Equity Share
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-800/60">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Official Shareholder & Land Subdivision Ledger
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
              Transparent Real-Estate Equity & Land Allocation Platform
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Empowering members of Bunyoro Omuhama Real Estates LTD to pool capital, acquire strategic land holdings in Hoima and Bunyoro, track equity share percentages, and secure proportional subplot allocations.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold rounded-xl text-sm shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 text-center"
              >
                Become a Shareholder
              </Link>
              <Link
                href="/admin"
                className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold rounded-xl text-sm transition-all text-center"
              >
                Launch Executive Dashboard →
              </Link>
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-2">Institutional Framework</h2>
            <p className="text-2xl sm:text-3xl font-bold text-white">How Our Real-Estate Equity System Works</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-2xl flex items-center justify-center mb-6">
                🏛️
              </div>
              <h3 className="text-lg font-bold text-white mb-2">1. Capital Contribution</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Shareholders deposit capital into audited corporate investment accounts. Every shilling contributed directly increases relative equity ownership.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-2xl flex items-center justify-center mb-6">
                📐
              </div>
              <h3 className="text-lg font-bold text-white mb-2">2. Land Subdivision</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Strategic acreage acquired in Hoima City and surrounding Bunyoro regions is surveyed and partitioned into titled subplots according to strict legal standards.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 hover:border-emerald-500/40 transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 text-2xl flex items-center justify-center mb-6">
                📊
              </div>
              <h3 className="text-lg font-bold text-white mb-2">3. Proportional Allocation</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Subplots and dividend yields are assigned transparently based on each member's verified equity percentage recorded in the live portal.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Bunyoro Omuhama Real Estates LTD. All rights reserved.</p>
          <p className="mt-1">Regulated Institutional Portal • Hoima City, Uganda & Dubai, UAE</p>
        </div>
      </footer>
    </div>
  );
}
