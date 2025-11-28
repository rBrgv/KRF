'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { Search, Download, Filter, Mail } from 'lucide-react';
import Link from 'next/link';
import { LeadEmailForm } from './LeadEmailForm';

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  source: string | null;
  status: string;
  created_at: string;
}

interface LeadsListProps {
  initialLeads: Lead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  initialFilters?: {
    status?: string;
    source?: string;
    search?: string;
  };
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  contacted: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  converted: 'bg-green-500/20 text-green-400 border border-green-500/30',
  not_interested: 'bg-red-500/20 text-red-400 border border-red-500/30',
};

export function LeadsList({ initialLeads, pagination, initialFilters }: LeadsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialFilters?.search || '');
  const [statusFilter, setStatusFilter] = useState(initialFilters?.status || '');
  const [sourceFilter, setSourceFilter] = useState(initialFilters?.source || '');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    if (sourceFilter) params.set('source', sourceFilter);
    params.set('page', '1');
    router.push(`/dashboard/leads?${params.toString()}`);
  };

  const handleFilterChange = (type: 'status' | 'source', value: string) => {
    if (type === 'status') {
      setStatusFilter(value);
    } else {
      setSourceFilter(value);
    }
    // Apply filter immediately
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (type === 'status') {
      if (value) params.set('status', value);
      if (sourceFilter) params.set('source', sourceFilter);
    } else {
      if (statusFilter) params.set('status', statusFilter);
      if (value) params.set('source', value);
    }
    params.set('page', '1');
    router.push(`/dashboard/leads?${params.toString()}`);
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Source', 'Status', 'Created At'].join(','),
      ...initialLeads.map((lead) =>
        [
          `"${lead.name}"`,
          lead.email ? `"${lead.email}"` : '',
          `"${lead.phone}"`,
          lead.source || '',
          lead.status,
          formatDate(lead.created_at),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };


  return (
    <div>
      <div className="premium-card rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
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
          </div>
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="not_interested">Not Interested</option>
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => handleFilterChange('source', e.target.value)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">All Sources</option>
            <option value="website">Website</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="manual">Manual</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Apply
            </button>
            <button
              onClick={handleExport}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2"
              title="Export to CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="premium-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900/30 divide-y divide-gray-800">
            {initialLeads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-semibold mb-2 text-white">
                      {search || statusFilter || sourceFilter
                        ? 'No leads match your filters'
                        : 'No leads yet'}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {search || statusFilter || sourceFilter
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Start capturing leads through your website forms or add them manually.'}
                    </p>
                    {!search && !statusFilter && !sourceFilter && (
                      <Link
                        href="/dashboard/leads/new"
                        className="inline-block bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300"
                      >
                        Add Your First Lead
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              initialLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{lead.name}</div>
                    {lead.email && (
                      <div className="text-sm text-gray-400">{lead.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {lead.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {lead.source || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        statusColors[lead.status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {formatDate(lead.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        View
                      </Link>
                      {lead.email && (
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
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
                  router.push(`/dashboard/leads?${params.toString()}`);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            {pagination.page < pagination.totalPages && (
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('page', (pagination.page + 1).toString());
                  router.push(`/dashboard/leads?${params.toString()}`);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}

      {/* Email Form Modal */}
      {selectedLead && selectedLead.email && (
        <LeadEmailForm
          leadId={selectedLead.id}
          leadName={selectedLead.name}
          leadEmail={selectedLead.email}
          onClose={() => setSelectedLead(null)}
          onSuccess={() => {
            setSelectedLead(null);
          }}
        />
      )}
    </div>
  );
}

