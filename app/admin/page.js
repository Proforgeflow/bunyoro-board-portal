'use client'

interface HeaderProps {
  fullName?: string
  status?: string
  role?: string
  onSignOut: () => void
}

export default function Header({ fullName, status, role, onSignOut }: HeaderProps) {
  const isVerified = status === 'approved' || status === 'verified'

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 bg-slate-900 px-6 py-4">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-white">{fullName || 'Shareholder Member'}</h1>
        
        {/* Executive Status Badge */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            isVerified
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isVerified ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
            }`}
          />
          {isVerified ? 'Verified Shareholder' : 'Pending Verification'}
        </span>

        {role === 'admin' && (
          <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-mono font-bold text-amber-400 border border-amber-500/30">
            ADMIN
          </span>
        )}
      </div>

      <button
        onClick={onSignOut}
        className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-red-950 hover:text-red-400 hover:border-red-900"
      >
        Sign Out 🚪
      </button>
    </header>
  )
}