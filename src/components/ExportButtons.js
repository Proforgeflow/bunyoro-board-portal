'use client';

export default function ExportButtons({ members }) {
  const handleExportCSV = () => {
    if (!members || members.length === 0) return;

    const headers = ['Member Name', 'Phone Number', 'Role', 'Shares Count', 'Total Paid (UGX)', 'Payment Channel', 'Payment Status'];
    const rows = members.map((m) => [
      `"${m.member_name.replace(/"/g, '""')}"`,
      `"${m.phone_number}"`,
      `"${m.role}"`,
      m.shares_count,
      m.total_paid_ugx,
      `"${m.payment_channel}"`,
      `"${m.payment_status}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bunyoro_Shareholder_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="flex items-center gap-2 print:hidden">
      <button
        onClick={handleExportCSV}
        type="button"
        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export CSV
      </button>

      <button
        onClick={handlePrintPDF}
        type="button"
        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print / PDF
      </button>
    </div>
  );
}
