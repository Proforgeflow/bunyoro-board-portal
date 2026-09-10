'use client';

import { useState } from 'react';

export default function Logo({ size = 'md', className = '', onClick }) {
  const [hasError, setHasError] = useState(false);

  const dimensions = {
    sm: 'h-12 w-auto',
    md: 'h-24 sm:h-28 w-auto',
    lg: 'h-36 w-auto'
  };

  return (
    <div onClick={onClick} className={`relative inline-block cursor-pointer group ${className}`}>
      <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/40 p-1.5 bg-slate-950 group-hover:border-amber-400 transition-all shadow-xl shadow-amber-500/10">
        {!hasError ? (
          <img
            src="/logo.png"
            alt="Bunyoro Omuhama Real Estate"
            className={`${dimensions[size] || dimensions.md} object-contain rounded-xl group-hover:scale-105 transition-transform duration-300`}
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-3 bg-emerald-950 border border-amber-500 rounded-xl min-w-[100px]">
            <span className="font-black text-amber-400 text-lg">BM</span>
          </div>
        )}
      </div>
    </div>
  );
}