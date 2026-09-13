import './globals.css';

export const metadata = {
  title: 'Bunyoro Board Portal | Real Estate & Shareholder Equity Platform',
  description: 'Official shareholder investment ledger, real-estate land subdivision portal, and executive board portal for Bunyoro Omuhama Real Estates LTD.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
