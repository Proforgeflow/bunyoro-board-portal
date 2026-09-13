'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { addMember } from '@/lib/members';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Shareholder',
    shares: '',
    amountPaid: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addMember(formData);
      router.push('/admin');
    } catch (err) {
      console.error('Failed to register member:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register New Member</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            type="text"
            required
            className="w-full border p-2 rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            className="w-full border p-2 rounded"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Shares</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={formData.shares}
            onChange={(e) => setFormData({ ...formData, shares: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Amount Paid (UGX)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={formData.amountPaid}
            onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded mt-2"
        >
          {loading ? 'Submitting...' : 'Register Member'}
        </button>
      </form>
      <div className="mt-4 text-sm text-center">
        <Link href="/admin" className="text-blue-600 underline">Back to Admin</Link>
      </div>
    </div>
  );
}
