'use client';

import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Food {
  id: string;
  name: string;
  category: string;
  description?: string;
}

interface FoodLogEntry {
  id: string;
  serving_size_g: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  meal_type: string | null;
  foods: Food | null;
}

interface NutritionLog {
  id: string;
  client_id: string;
  date: string;
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fats_g: number;
  notes: string | null;
  source: string;
  clients?: {
    name: string;
  };
  food_log_entries?: FoodLogEntry[];
}

export function NutritionLogsView() {
  const [logs, setLogs] = useState<NutritionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [clientId, setClientId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [clientId, startDate, endDate]);

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

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (clientId) params.set('client_id', clientId);
      if (startDate) params.set('start_date', startDate);
      if (endDate) params.set('end_date', endDate);

      const response = await fetch(`/api/nutrition/logs?${params.toString()}`);
      const result = await response.json();
      if (result.success) {
        setLogs(result.data);
      }
    } catch (error) {
      console.error('Error fetching nutrition logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="premium-card rounded-2xl p-6 mb-6 border border-gray-800/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Client
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
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
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setClientId('');
                setStartDate('');
                setEndDate('');
              }}
              className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="premium-card rounded-2xl overflow-hidden border border-gray-800/50">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading nutrition logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400">No nutrition logs found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-900/50 border-b border-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Calories
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Protein
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Carbs
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Fats
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Source
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {logs.map((log) => (
                <>
                  <tr key={log.id} className="hover:bg-gray-900/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(log.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {log.clients?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-red-400">
                        {Number(log.total_calories || 0).toFixed(0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-blue-400">
                        {Number(log.total_protein_g || 0).toFixed(1)}g
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-green-400">
                        {Number(log.total_carbs_g || 0).toFixed(1)}g
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-yellow-400">
                        {Number(log.total_fats_g || 0).toFixed(1)}g
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
                        {log.source === 'from_plan' ? 'From Plan' : 'Manual'}
                      </span>
                    </td>
                  </tr>
                  {/* Food Items Row */}
                  {log.food_log_entries && log.food_log_entries.length > 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-900/20">
                        <div className="space-y-3">
                          <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                            Foods Logged:
                          </p>
                          {(() => {
                            // Group entries by meal type
                            const mealGroups: Record<string, FoodLogEntry[]> = {
                              breakfast: [],
                              lunch: [],
                              dinner: [],
                              snacks: [],
                            };

                            log.food_log_entries.forEach((entry) => {
                              const mealType = entry.meal_type || 'snacks';
                              if (mealGroups[mealType]) {
                                mealGroups[mealType].push(entry);
                              } else {
                                mealGroups.snacks.push(entry);
                              }
                            });

                            const mealLabels: Record<string, string> = {
                              breakfast: '🍳 Breakfast',
                              lunch: '🍽️ Lunch',
                              dinner: '🌙 Dinner',
                              snacks: '🍪 Snacks',
                            };

                            return (
                              <div className="space-y-3">
                                {Object.entries(mealGroups).map(([mealType, entries]) => {
                                  if (entries.length === 0) return null;
                                  return (
                                    <div key={mealType} className="space-y-1">
                                      <p className="text-xs font-semibold text-purple-400 mb-1">
                                        {mealLabels[mealType] || mealType}
                                      </p>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {entries.map((entry) => (
                                          <div
                                            key={entry.id}
                                            className="flex items-center justify-between text-sm bg-gray-800/30 rounded px-3 py-2 border border-gray-700/30"
                                          >
                                            <div className="flex-1">
                                              <span className="text-gray-200 font-medium">
                                                {entry.foods?.name || 'Unknown Food'}
                                              </span>
                                              {entry.serving_size_g && (
                                                <span className="text-gray-500 text-xs ml-2">
                                                  ({entry.serving_size_g.toFixed(0)}g)
                                                </span>
                                              )}
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                              <span className="text-red-400">
                                                {entry.calories.toFixed(0)} cal
                                              </span>
                                              <span className="text-blue-400">
                                                P: {entry.protein_g.toFixed(1)}g
                                              </span>
                                              <span className="text-green-400">
                                                C: {entry.carbs_g.toFixed(1)}g
                                              </span>
                                              <span className="text-yellow-400">
                                                F: {entry.fats_g.toFixed(1)}g
                                              </span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })()}
                          {log.notes && (
                            <div className="mt-3 pt-3 border-t border-gray-700/30">
                              <p className="text-xs font-semibold text-gray-400 mb-1">Notes:</p>
                              <p className="text-sm text-gray-300">{log.notes}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

