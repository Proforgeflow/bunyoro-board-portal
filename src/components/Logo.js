'use client';

import Link from 'next/link';

export default function Logo({ className = '' }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Compact Emblem (Strict 32x32px bounding box) */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 via-slate-800 to-slate-950 p-[1px] border border-amber-500/30 shadow-sm group-hover:border-amber-400 transition-all">
        <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center overflow-hidden">
          <img
            src="/logo.png"
            alt="BMRE"
            className="w-full h-full object-contain p-0.5"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.style.display = 'block';
            }}
          />
          <span className="hidden text-amber-400 font-black text-xs tracking-tighter">BM</span>
        </div>
      </div>

      {/* Clean Typography Block */}
      <div className="flex flex-col">
        <span className="text-white font-bold tracking-tight text-xs leading-none group-hover:text-amber-400 transition-colors">
          BUNYORO MUHAMA
        </span>
        <span className="text-[9px] font-semibold text-slate-400 tracking-wider uppercase leading-tight mt-0.5">
          Real Estates LTD
        </span>
      </div>
    </Link>
  );
}
