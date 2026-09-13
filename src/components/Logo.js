import Link from 'next/link';

export default function Logo({ width = 180, className = '' }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src="/logo.png"
        alt="Bunyoro Muhama Real Estates LTD"
        style={{ width: `${width}px`, height: 'auto', objectFit: 'contain' }}
      />
    </Link>
  );
}
