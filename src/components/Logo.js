import Image from 'next/image';
import Link from 'next/link';

export default function Logo({ width = 180, height = 60, className = '' }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        src="/logo.png"
        alt="Bunyoro Muhama Real Estates LTD"
        width={width}
        height={height}
        priority
        style={{ objectFit: 'contain' }}
      />
    </Link>
  );
}
