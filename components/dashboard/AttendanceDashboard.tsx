'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Download } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface AttendanceSummary {
  summary: {
    total_sessions: number;
    total_attended: number;
    attendance_rate: number;
    total_hours: number;
  };
  by_client: Array<{
    client_id: string;
    client_name: string;
    total_sessions: number;
    total_attended: number;
    attendance_rate: number;
    total_hours: number;
  }>;
}

interface AttendanceDashboardProps {
  initialStartDate?: string;
  initialEndDate?: string;
  initialClientId?: string;
  initialProgramType?: string;
}

export function AttendanceDashboard({
  initialStartDate,
  initialEndDate,
  initialClientId,
  initialProgramType,
}: AttendanceDashboardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([]);
  const [filters, setFilters] = useState({
    start_date: initialStartDate || '',
    end_date: initialEndDate || '',
    client_id: initialClientId || '',
    program_type: initialProgramType || '',
  });

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [filters]);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients?limit=1000');
      const result = await response.json();
      if (result.success && result.data) {
        setClients(result.data.map((c: any) => ({ id: c.id, name: c.name })));
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.start_date) params.set('start_date', filters.start_date);
      if (filters.end_date) params.set('end_date', filters.end_date);
      if (filters.client_id) params.set('client_id', filters.client_id);
      if (filters.program_type) params.set('program_type', filters.program_type);

      const response = await fetch(`/api/attendance/summary?${params.toString()}`);
      const result = await response.json();
      if (result.success) {
        setSummary(result.data);
      }
    } catch (error) {
      console.error('Error fetching attendance summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL
    const params = new URLSearchParams();
    if (newFilters.start_date) params.set('start_date', newFilters.start_date);
    if (newFilters.end_date) params.set('end_date', newFilters.end_date);
    if (newFilters.client_id) params.set('client_id', newFilters.client_id);
    if (newFilters.program_type) params.set('program_type', newFilters.program_type);
    router.push(`/dashboard/attendance?${params.toString()}`);
  };

  const handleDownloadCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.start_date) params.set('start_date', filters.start_date);
      if (filters.end_date) params.set('end_date', filters.end_date);
      if (filters.client_id) params.set('client_id', filters.client_id);
      if (filters.program_type) params.set('program_type', filters.program_type);

      const response = await fetch(`/api/attendance/export?${params.toString()}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to export CSV');
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('An error occurred while exporting');
    }
  };

  const programTypes = ['silver', 'gold', 'platinum', 'weight_loss', 'weight_gain', 'strength_conditioning', 'medical_condition', 'rehab'];
  const programLabels: Record<string, string> = {
    silver: 'Silver',
    gold: 'Gold',
    platinum: 'Platinum',
    weight_loss: 'Weight Loss',
    weight_gain: 'Weight Gain',
    strength_conditioning: 'Strength & Conditioning',
    medical_condition: 'Medical Condition',
    rehab: 'Rehabilitation',
  };

  return (
    <div>
      {/* Filters */}
      <div className="premium-card rounded-2xl p-6 mb-6 border border-gray-800/50">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              min={filters.start_date}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Client
            </label>
            <select
              value={filters.client_id}
              onChange={(e) => handleFilterChange('client_id', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Clients</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Program
            </label>
            <select
              value={filters.program_type}
              onChange={(e) => handleFilterChange('program_type', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Programs</option>
              {programTypes.map((type) => (
                <option key={type} value={type}>
                  {programLabels[type]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleDownloadCSV}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {loading ? (
        <div className="premium-card rounded-2xl p-12 text-center border border-gray-800/50">
          <p className="text-gray-400">Loading attendance data...</p>
        </div>
      ) : summary ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="premium-card rounded-xl p-6 border border-gray-800/50">
              <p className="text-sm text-gray-400 mb-2">Total Sessions</p>
              <p className="text-3xl font-bold text-white">{summary.summary.total_sessions}</p>
            </div>
            <div className="premium-card rounded-xl p-6 border border-gray-800/50">
              <p className="text-sm text-gray-400 mb-2">Total Attended</p>
              <p className="text-3xl font-bold text-green-400">{summary.summary.total_attended}</p>
            </div>
            <div className="premium-card rounded-xl p-6 border border-gray-800/50">
              <p className="text-sm text-gray-400 mb-2">Attendance Rate</p>
              <p className="text-3xl font-bold text-blue-400">{summary.summary.attendance_rate.toFixed(1)}%</p>
            </div>
            <div className="premium-card rounded-xl p-6 border border-gray-800/50">
              <p className="text-sm text-gray-400 mb-2">Total Hours</p>
              <p className="text-3xl font-bold text-yellow-400">{summary.summary.total_hours.toFixed(1)}</p>
            </div>
          </div>

          {/* Per-Client Breakdown */}
          <div className="premium-card rounded-2xl overflow-hidden border border-gray-800/50">
            <div className="p-6 border-b border-gray-800/50">
              <h2 className="text-xl font-semibold text-white">Attendance by Client</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-900/50 border-b border-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Scheduled
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Attended
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Rate
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                    Hours
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {summary.by_client.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      No attendance data found
                    </td>
                  </tr>
                ) : (
                  summary.by_client.map((client) => (
                    <tr key={client.client_id} className="hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        {client.client_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {client.total_sessions}
                      </td>
                      <td className="px-6 py-4 text-sm text-green-400 font-semibold">
                        {client.total_attended}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${
                            client.attendance_rate >= 80 ? 'text-green-400' :
                            client.attendance_rate >= 60 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {client.attendance_rate.toFixed(1)}%
                          </span>
                          <div className="flex-1 bg-gray-800 rounded-full h-2 max-w-[100px]">
                            <div
                              className={`h-2 rounded-full ${
                                client.attendance_rate >= 80 ? 'bg-green-500' :
                                client.attendance_rate >= 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(client.attendance_rate, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {client.total_hours.toFixed(1)}h
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="premium-card rounded-2xl p-12 text-center border border-gray-800/50">
          <p className="text-gray-400">No data available</p>
        </div>
      )}
    </div>
  );
}




