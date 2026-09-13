'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getMembers, formatUGX } from '@/lib/members';

export default function AdminDashboard() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      try {
        const data = await getMembers();
        setMembers(data);
      } catch (err) {
        console.error('Failed to fetch members:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add Member
        </Link>
      </div>

      {loading ? (
        <p>Loading members from Supabase...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Shares</th>
                <th className="p-3 text-left">Amount Paid</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b">
                  <td className="p-3">{m.name}</td>
                  <td className="p-3">{m.email || 'N/A'}</td>
                  <td className="p-3">{m.role}</td>
                  <td className="p-3">{m.shares}</td>
                  <td className="p-3">{formatUGX(m.amount_paid || m.amountPaid)}</td>
                  <td className="p-3">{m.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
