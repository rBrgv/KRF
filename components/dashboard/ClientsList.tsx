'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { Search } from 'lucide-react';
import Link from 'next/link';

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  goal: string | null;
  program_start_date: string | null;
  subscription_type: '3_month' | 'monthly' | 'yearly' | null;
  program_type: 'silver' | 'gold' | 'platinum' | 'weight_loss' | 'weight_gain' | 'strength_conditioning' | 'medical_condition' | 'rehab' | null;
  created_at: string;
}

const subscriptionLabels: Record<string, string> = {
  '3_month': '3 Month',
  'monthly': 'Monthly',
  'yearly': 'Yearly',
};

const programLabels: Record<string, string> = {
  'silver': 'Silver',
  'gold': 'Gold',
  'platinum': 'Platinum',
  'weight_loss': 'Weight Loss',
  'weight_gain': 'Weight Gain',
  'strength_conditioning': 'Strength & Conditioning',
  'medical_condition': 'Medical Condition',
  'rehab': 'Rehabilitation',
};

const subscriptionColors: Record<string, string> = {
  '3_month': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'monthly': 'bg-green-500/10 text-green-400 border-green-500/30',
  'yearly': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
};

const programColors: Record<string, string> = {
  'silver': 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  'gold': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  'platinum': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  'weight_loss': 'bg-red-500/10 text-red-400 border-red-500/30',
  'weight_gain': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  'strength_conditioning': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
  'medical_condition': 'bg-pink-500/10 text-pink-400 border-pink-500/30',
  'rehab': 'bg-teal-500/10 text-teal-400 border-teal-500/30',
};

interface ClientsListProps {
  initialClients: Client[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  initialSearch?: string;
}

export function ClientsList({ initialClients, pagination, initialSearch }: ClientsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialSearch || '');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('page', '1');
    router.push(`/dashboard/clients?${params.toString()}`);
  };

  return (
    <div>
      <div className="premium-card rounded-2xl p-6 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300"
          >
            Search
          </button>
        </div>
      </div>

      <div className="premium-card rounded-2xl overflow-hidden border border-gray-800/50">
        <table className="w-full">
          <thead className="bg-gray-900/50 border-b border-gray-800/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Program
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Subscription
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Goal
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {initialClients.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12">
                  <div className="text-center">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-lg font-semibold mb-2 text-white">
                      {search ? 'No clients match your search' : 'No clients yet'}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {search
                        ? 'Try a different search term.'
                        : 'Convert leads to clients to start managing their programs.'}
                    </p>
                    {!search && (
                      <Link
                        href="/dashboard/leads"
                        className="inline-block bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300"
                      >
                        View Leads
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              initialClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-900/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-white">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{client.phone}</div>
                    {client.email && (
                      <div className="text-xs text-gray-500">{client.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {client.program_type ? (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${programColors[client.program_type] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                        {programLabels[client.program_type] || client.program_type}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {client.subscription_type ? (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${subscriptionColors[client.subscription_type] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
                        {subscriptionLabels[client.subscription_type] || client.subscription_type}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300">
                      {client.goal || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {formatDate(client.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/dashboard/clients/${client.id}`}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between premium-card rounded-xl p-4">
          <div className="text-sm text-gray-400">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex gap-2">
            {pagination.page > 1 && (
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('page', (pagination.page - 1).toString());
                  router.push(`/dashboard/clients?${params.toString()}`);
                }}
                className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 hover:border-gray-600 transition-colors"
              >
                Previous
              </button>
            )}
            {pagination.page < pagination.totalPages && (
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('page', (pagination.page + 1).toString());
                  router.push(`/dashboard/clients?${params.toString()}`);
                }}
                className="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 hover:border-gray-600 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

