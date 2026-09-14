import './globals.css';

export const metadata = {
  title: 'Bunyoro Muhama Real Estates LTD - Corporate Portal',
  description: 'Institutional Business & Shareholder Governance Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-emerald-500 selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
