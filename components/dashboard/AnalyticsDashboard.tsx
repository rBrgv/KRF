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
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-purple-100 text-purple-800',
  converted: 'bg-green-100 text-green-800',
  not_interested: 'bg-red-100 text-red-800',
  lost: 'bg-gray-100 text-gray-800',
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
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-red-600">Failed to load analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Leads</p>
              <p className="text-3xl font-bold">{data.summary.totalLeads}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Leads This Week</p>
              <p className="text-3xl font-bold">{data.summary.leadsThisWeek}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
              <p className="text-3xl font-bold">{data.summary.conversionRate}%</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Event Revenue (Month)</p>
              <p className="text-3xl font-bold">₹{data.summary.eventRevenueThisMonth}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Leads by Source */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Leads by Source</h2>
        {data.leadsBySource.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Source</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Count</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {data.leadsBySource.map((item) => {
                  const percentage =
                    data.summary.totalLeads > 0
                      ? ((item.count / data.summary.totalLeads) * 100).toFixed(1)
                      : '0';
                  return (
                    <tr key={item.source} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-medium">{item.source || 'Unknown'}</span>
                      </td>
                      <td className="py-3 px-4 text-right">{item.count}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span>{percentage}%</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-600 h-2 rounded-full"
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
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Leads by Status</h2>
        {data.leadsByStatus.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Count</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {data.leadsByStatus.map((item) => {
                  const percentage =
                    data.summary.totalLeads > 0
                      ? ((item.count / data.summary.totalLeads) * 100).toFixed(1)
                      : '0';
                  return (
                    <tr key={item.status} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            statusColors[item.status] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">{item.count}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span>{percentage}%</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-600 h-2 rounded-full"
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
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Event Registrations & Revenue</h2>
        {data.eventRegistrations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Event</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Registrations
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.eventRegistrations.map((item) => (
                  <tr key={item.event_id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium">{item.event_title}</span>
                    </td>
                    <td className="py-3 px-4 text-right">{item.registrations}</td>
                    <td className="py-3 px-4 text-right font-semibold">₹{item.revenue}</td>
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
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Top UTM Sources</h2>
          {data.utmBreakdown.topSources.length > 0 ? (
            <div className="space-y-3">
              {data.utmBreakdown.topSources.map((item, index) => (
                <div key={item.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-6">{index + 1}.</span>
                    <span className="font-medium">{item.source}</span>
                  </div>
                  <span className="text-gray-700 font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No UTM source data available</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Top UTM Campaigns</h2>
          {data.utmBreakdown.topCampaigns.length > 0 ? (
            <div className="space-y-3">
              {data.utmBreakdown.topCampaigns.map((item, index) => (
                <div key={item.campaign} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm w-6">{index + 1}.</span>
                    <span className="font-medium">{item.campaign}</span>
                  </div>
                  <span className="text-gray-700 font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No UTM campaign data available</p>
          )}
        </div>
      </div>

      {/* Leads Over Time (Simple List) */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Leads Over Time (Last 30 Days)</h2>
        {data.leadsOverTime.length > 0 ? (
          <div className="space-y-2">
            {data.leadsOverTime.map((item) => (
              <div key={item.date} className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-700">
                  {new Date(item.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (item.count /
                            Math.max(...data.leadsOverTime.map((d) => d.count))) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="font-semibold w-8 text-right">{item.count}</span>
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

