import './globals.css';

export const metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Bunyoro Board Portal',
  description:
    'Institutional governance dashboard for board, council, and committee operations.',
  keywords: [
    'board portal',
    'government dashboard',
    'committee management',
    'governance software',
    'institutional operations',
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
