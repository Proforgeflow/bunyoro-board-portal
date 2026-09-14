'use client';

import Link from 'next/link';

export default function Logo({ width = 180, className = '' }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-blue-600 to-slate-900 p-[1px] shadow-md shadow-blue-500/10 group-hover:shadow-blue-500/30 transition-all">
        <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center overflow-hidden">
          <img
            src="/logo.png"
            alt="Bunyoro Muhama Real Estates LTD"
            className="w-full h-full object-contain p-1"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.style.display = 'flex';
            }}
          />
          <span className="hidden text-amber-400 font-black text-lg tracking-tighter">B</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-white font-extrabold tracking-tight text-sm leading-none group-hover:text-blue-400 transition-colors">
          BUNYORO MUHAMA
        </span>
        <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase leading-tight">
          Real Estates LTD • Portal
        </span>
      </div>
    </Link>
  );
}
