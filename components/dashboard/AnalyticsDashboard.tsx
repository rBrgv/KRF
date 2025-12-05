'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';

interface AnalyticsData {
  summary: {
    totalLeads: number;
    leadsThisWeek: number;
    conversionRate: number;
    eventRevenueThisMonth: number;
  };
  leadsBySource: Array<{ source: string; count: number }>;
  leadsByStatus: Array<{ status: string; count: number }>;
  leadsOverTime: Array<{ date: string; count: number }>;
  eventRegistrations: Array<{
    event_id: string;
    event_title: string;
    registrations: number;
    revenue: number;
  }>;
  utmBreakdown: {
    topSources: Array<{ source: string; count: number }>;
    topCampaigns: Array<{ campaign: string; count: number }>;
  };
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  contacted: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  qualified: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  converted: 'bg-green-500/20 text-green-400 border border-green-500/30',
  not_interested: 'bg-red-500/20 text-red-400 border border-red-500/30',
  lost: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
};

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="premium-card rounded-2xl p-8 text-center">
        <p className="text-gray-400">Loading analytics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="premium-card rounded-2xl p-8 text-center">
        <p className="text-red-400">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="premium-card rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Leads</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent">
                {data.summary.totalLeads}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <Users className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>

        <div className="premium-card rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Leads This Week</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent">
                {data.summary.leadsThisWeek}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <TrendingUp className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>

        <div className="premium-card rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Conversion Rate</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent">
                {data.summary.conversionRate}%
              </p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <Target className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>

        <div className="premium-card rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Event Revenue (Month)</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent">
                ₹{data.summary.eventRevenueThisMonth}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <DollarSign className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Leads by Source */}
      <div className="premium-card rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
        <h2 className="text-xl font-semibold text-white mb-4">Leads by Source</h2>
        {data.leadsBySource.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 font-semibold text-gray-300">Source</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-300">Count</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-300">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {data.leadsBySource.map((item) => {
                  const percentage =
                    data.summary.totalLeads > 0
                      ? ((item.count / data.summary.totalLeads) * 100).toFixed(1)
                      : '0';
                  return (
                    <tr key={item.source} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-medium text-white">{item.source || 'Unknown'}</span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-300">{item.count}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-gray-300">{percentage}%</span>
                          <div className="w-24 bg-gray-800 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No leads data available</p>
        )}
      </div>

      {/* Leads by Status */}
      <div className="premium-card rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
        <h2 className="text-xl font-semibold text-white mb-4">Leads by Status</h2>
        {data.leadsByStatus.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 font-semibold text-gray-300">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-300">Count</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-300">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {data.leadsByStatus.map((item) => {
                  const percentage =
                    data.summary.totalLeads > 0
                      ? ((item.count / data.summary.totalLeads) * 100).toFixed(1)
                      : '0';
                  return (
                    <tr key={item.status} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            statusColors[item.status] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-300">{item.count}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-gray-300">{percentage}%</span>
                          <div className="w-24 bg-gray-800 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No status data available</p>
        )}
      </div>

      {/* Event Registrations */}
      <div className="premium-card rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
        <h2 className="text-xl font-semibold text-white mb-4">Event Registrations & Revenue</h2>
        {data.eventRegistrations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 font-semibold text-gray-300">Event</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-300">
                    Registrations
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-300">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.eventRegistrations.map((item) => (
                  <tr key={item.event_id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-medium text-white">{item.event_title}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-300">{item.registrations}</td>
                    <td className="py-3 px-4 text-right font-semibold text-red-400">₹{item.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No event registrations available</p>
        )}
      </div>

      {/* UTM Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="premium-card rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
          <h2 className="text-xl font-semibold text-white mb-4">Top UTM Sources</h2>
          {data.utmBreakdown.topSources.length > 0 ? (
            <div className="space-y-3">
              {data.utmBreakdown.topSources.map((item, index) => (
                <div key={item.source} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-6">{index + 1}.</span>
                    <span className="font-medium text-white">{item.source}</span>
                  </div>
                  <span className="text-gray-300 font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No UTM source data available</p>
          )}
        </div>

        <div className="premium-card rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
          <h2 className="text-xl font-semibold text-white mb-4">Top UTM Campaigns</h2>
          {data.utmBreakdown.topCampaigns.length > 0 ? (
            <div className="space-y-3">
              {data.utmBreakdown.topCampaigns.map((item, index) => (
                <div key={item.campaign} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-6">{index + 1}.</span>
                    <span className="font-medium text-white">{item.campaign}</span>
                  </div>
                  <span className="text-gray-300 font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No UTM campaign data available</p>
          )}
        </div>
      </div>

      {/* Leads Over Time (Simple List) */}
      <div className="premium-card rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
        <h2 className="text-xl font-semibold text-white mb-4">Leads Over Time (Last 30 Days)</h2>
        {data.leadsOverTime.length > 0 ? (
          <div className="space-y-2">
            {data.leadsOverTime.map((item) => (
              <div key={item.date} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <span className="text-gray-300">
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (item.count /
                            Math.max(...data.leadsOverTime.map((d) => d.count))) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="font-semibold w-8 text-right text-gray-300">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No leads data for the last 30 days</p>
        )}
      </div>
    </div>
  );
}

