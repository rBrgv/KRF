'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Camera, Target, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface BodyMeasurement {
  id: string;
  date: string;
  weight_kg: number | null;
  body_fat_percentage: number | null;
  waist_cm: number | null;
  chest_cm: number | null;
  arms_cm: number | null;
  thighs_cm: number | null;
  notes: string | null;
}

interface ProgressPhoto {
  id: string;
  photo_url: string;
  date: string;
  view_type: string;
  is_milestone: boolean;
}

interface ClientGoal {
  id: string;
  title: string;
  goal_type: string;
  target_value: number | null;
  current_value: number;
  status: string;
  target_date: string | null;
}

interface ClientProgressViewProps {
  clientId: string;
}

export function ClientProgressView({ clientId }: ClientProgressViewProps) {
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [goals, setGoals] = useState<ClientGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'measurements' | 'photos' | 'goals'>('overview');

  useEffect(() => {
    fetchData();
  }, [clientId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [measurementsRes, photosRes, goalsRes] = await Promise.all([
        fetch(`/api/progress/measurements?client_id=${clientId}&limit=30`),
        fetch(`/api/progress/photos?client_id=${clientId}&limit=20`),
        fetch(`/api/goals?client_id=${clientId}&status=active`),
      ]);

      if (measurementsRes.ok) {
        const data = await measurementsRes.json();
        setMeasurements(data.data || []);
      }

      if (photosRes.ok) {
        const data = await photosRes.json();
        setPhotos(data.data || []);
      }

      if (goalsRes.ok) {
        const data = await goalsRes.json();
        setGoals(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading progress data...</div>
      </div>
    );
  }

  const latestMeasurement = measurements[0];
  const firstMeasurement = measurements[measurements.length - 1];
  const milestonePhotos = photos.filter((p) => p.is_milestone);
  const activeGoals = goals.filter((g) => g.status === 'active');

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700">
        <button
          onClick={() => setSelectedTab('overview')}
          className={`px-4 py-2 font-medium transition-colors ${
            selectedTab === 'overview'
              ? 'text-red-400 border-b-2 border-red-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setSelectedTab('measurements')}
          className={`px-4 py-2 font-medium transition-colors ${
            selectedTab === 'measurements'
              ? 'text-red-400 border-b-2 border-red-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Measurements
        </button>
        <button
          onClick={() => setSelectedTab('photos')}
          className={`px-4 py-2 font-medium transition-colors ${
            selectedTab === 'photos'
              ? 'text-red-400 border-b-2 border-red-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Photos
        </button>
        <button
          onClick={() => setSelectedTab('goals')}
          className={`px-4 py-2 font-medium transition-colors ${
            selectedTab === 'goals'
              ? 'text-red-400 border-b-2 border-red-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Goals
        </button>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Measurements</p>
                  <p className="text-2xl font-bold text-white">{measurements.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Progress Photos</p>
                  <p className="text-2xl font-bold text-white">{photos.length}</p>
                </div>
                <Camera className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Goals</p>
                  <p className="text-2xl font-bold text-white">{activeGoals.length}</p>
                </div>
                <Target className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Milestones</p>
                  <p className="text-2xl font-bold text-white">{milestonePhotos.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Weight Progress */}
          {latestMeasurement && firstMeasurement && latestMeasurement.weight_kg && firstMeasurement.weight_kg && (
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Weight Progress</h3>
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-sm text-gray-400">Starting Weight</p>
                  <p className="text-2xl font-bold text-white">{firstMeasurement.weight_kg} kg</p>
                  <p className="text-xs text-gray-500">{formatDate(firstMeasurement.date)}</p>
                </div>
                <div className="flex-1">
                  <div className="h-1 bg-gray-700 rounded-full mb-2">
                    <div
                      className="h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                      style={{
                        width: `${Math.min(100, ((firstMeasurement.weight_kg - latestMeasurement.weight_kg) / firstMeasurement.weight_kg) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Current Weight</p>
                  <p className="text-2xl font-bold text-white">{latestMeasurement.weight_kg} kg</p>
                  <p className="text-xs text-gray-500">{formatDate(latestMeasurement.date)}</p>
                </div>
              </div>
              {latestMeasurement.weight_kg < firstMeasurement.weight_kg && (
                <p className="text-sm text-green-400 mt-2">
                  Lost {Math.abs(latestMeasurement.weight_kg - firstMeasurement.weight_kg).toFixed(1)} kg
                </p>
              )}
            </div>
          )}

          {/* Latest Photos */}
          {photos.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Latest Progress Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {photos.slice(0, 4).map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50"
                  >
                    <div className="relative aspect-square">
                      <img
                        src={photo.photo_url}
                        alt={`${photo.view_type} - ${formatDate(photo.date)}`}
                        className="w-full h-full object-cover"
                      />
                      {photo.is_milestone && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
                          ⭐
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-gray-400 capitalize">{photo.view_type}</p>
                      <p className="text-xs text-gray-500">{formatDate(photo.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Active Goals</h3>
              <div className="space-y-3">
                {activeGoals.slice(0, 3).map((goal) => {
                  const progress = goal.target_value
                    ? Math.min(100, (goal.current_value / goal.target_value) * 100)
                    : 0;
                  return (
                    <div
                      key={goal.id}
                      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">{goal.title}</h4>
                        <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
                      </div>
                      {goal.target_value && (
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Measurements Tab */}
      {selectedTab === 'measurements' && (
        <div className="space-y-4">
          {measurements.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50">
              <p className="text-gray-400">No measurements recorded yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Weight</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Body Fat</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Waist</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Chest</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Arms</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Thighs</th>
                  </tr>
                </thead>
                <tbody>
                  {measurements.map((m) => (
                    <tr key={m.id} className="border-b border-gray-800">
                      <td className="py-3 px-4 text-white">{formatDate(m.date)}</td>
                      <td className="py-3 px-4 text-gray-300">{m.weight_kg ? `${m.weight_kg} kg` : '-'}</td>
                      <td className="py-3 px-4 text-gray-300">{m.body_fat_percentage ? `${m.body_fat_percentage}%` : '-'}</td>
                      <td className="py-3 px-4 text-gray-300">{m.waist_cm ? `${m.waist_cm} cm` : '-'}</td>
                      <td className="py-3 px-4 text-gray-300">{m.chest_cm ? `${m.chest_cm} cm` : '-'}</td>
                      <td className="py-3 px-4 text-gray-300">{m.arms_cm ? `${m.arms_cm} cm` : '-'}</td>
                      <td className="py-3 px-4 text-gray-300">{m.thighs_cm ? `${m.thighs_cm} cm` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Photos Tab */}
      {selectedTab === 'photos' && (
        <div className="space-y-4">
          {photos.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50">
              <p className="text-gray-400">No progress photos uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border border-gray-700/50"
                >
                  <div className="relative aspect-square">
                    <img
                      src={photo.photo_url}
                      alt={`${photo.view_type} - ${formatDate(photo.date)}`}
                      className="w-full h-full object-cover"
                    />
                    {photo.is_milestone && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
                        Milestone
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white capitalize">{photo.view_type}</span>
                      <span className="text-xs text-gray-400">{formatDate(photo.date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Goals Tab */}
      {selectedTab === 'goals' && (
        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50">
              <p className="text-gray-400">No active goals set</p>
            </div>
          ) : (
            goals.map((goal) => {
              const progress = goal.target_value
                ? Math.min(100, (goal.current_value / goal.target_value) * 100)
                : 0;
              return (
                <div
                  key={goal.id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{goal.title}</h3>
                    <span className="text-sm text-gray-400 capitalize">{goal.goal_type.replace('_', ' ')}</span>
                  </div>
                  {goal.target_value && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Progress</span>
                        <span className="text-sm font-medium text-white">
                          {goal.current_value} / {goal.target_value} ({Math.round(progress)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {goal.target_date && (
                    <p className="text-sm text-gray-400">
                      Target Date: {formatDate(goal.target_date)}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}



