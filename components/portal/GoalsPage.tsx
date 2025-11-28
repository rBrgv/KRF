'use client';

import { useState, useEffect } from 'react';
import { Target, Plus, X, CheckCircle, Circle, Pause, XCircle, TrendingUp, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ClientGoal {
  id: string;
  goal_type: string;
  title: string;
  description: string | null;
  target_value: number | null;
  current_value: number;
  target_date: string | null;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  notes: string | null;
  completed_at: string | null;
}

interface Achievement {
  id: string;
  achievement_type: string;
  title: string;
  description: string | null;
  badge_url: string | null;
  earned_at: string;
}

interface GoalsPageProps {
  clientId: string;
}

export function GoalsPage({ clientId }: GoalsPageProps) {
  const [goals, setGoals] = useState<ClientGoal[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchData();
  }, [clientId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [goalsRes, achievementsRes] = await Promise.all([
        fetch(`/api/goals?client_id=${clientId}`),
        fetch(`/api/achievements?client_id=${clientId}`),
      ]);

      if (goalsRes.ok) {
        const goalsData = await goalsRes.json();
        setGoals(goalsData.data || []);
      }

      if (achievementsRes.ok) {
        const achievementsData = await achievementsRes.json();
        setAchievements(achievementsData.data || []);
      }
    } catch (error) {
      console.error('Error fetching goals data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const goalData = {
      client_id: clientId,
      goal_type: formData.get('goal_type') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string || null,
      target_value: formData.get('target_value') ? parseFloat(formData.get('target_value') as string) : null,
      current_value: parseFloat(formData.get('current_value') as string) || 0,
      target_date: formData.get('target_date') as string || null,
      priority: formData.get('priority') as string || 'medium',
      notes: formData.get('notes') as string || null,
    };

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData),
      });

      if (response.ok) {
        setShowGoalForm(false);
        fetchData();
        alert('Goal created successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create goal');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('An error occurred');
    }
  };

  const updateGoalProgress = async (goalId: string, newValue: number) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: goalId,
          current_value: newValue,
        }),
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'paused':
        return <Pause className="w-5 h-5 text-yellow-400" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Circle className="w-5 h-5 text-blue-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const filteredGoals = goals.filter((goal) => {
    if (selectedStatus === 'all') return true;
    return goal.status === selectedStatus;
  });

  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading goals...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Goals</h1>
          <p className="text-gray-400">Set and track your fitness goals</p>
        </div>
        <button
          onClick={() => setShowGoalForm(true)}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active Goals</p>
              <p className="text-2xl font-bold text-white">{activeGoals.length}</p>
            </div>
            <Target className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-white">{completedGoals.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Achievements</p>
              <p className="text-2xl font-bold text-white">{achievements.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedStatus('all')}
          className={`px-4 py-2 rounded-lg transition-all ${
            selectedStatus === 'all'
              ? 'bg-red-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setSelectedStatus('active')}
          className={`px-4 py-2 rounded-lg transition-all ${
            selectedStatus === 'active'
              ? 'bg-red-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setSelectedStatus('completed')}
          className={`px-4 py-2 rounded-lg transition-all ${
            selectedStatus === 'completed'
              ? 'bg-red-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50">
            <Target className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400">No goals yet</p>
            <p className="text-sm text-gray-500 mt-2">Set your first goal to get started!</p>
          </div>
        ) : (
          filteredGoals.map((goal) => {
            const progress = goal.target_value
              ? Math.min(100, (goal.current_value / goal.target_value) * 100)
              : 0;

            return (
              <div
                key={goal.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(goal.status)}
                      <h3 className="text-xl font-bold text-white">{goal.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(
                          goal.priority
                        )}`}
                      >
                        {goal.priority}
                      </span>
                    </div>
                    {goal.description && (
                      <p className="text-gray-300 mb-2">{goal.description}</p>
                    )}
                    {goal.target_date && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        Target: {formatDate(goal.target_date)}
                      </div>
                    )}
                  </div>
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

                {goal.status === 'active' && goal.target_value && (
                  <div className="flex gap-2 mt-4">
                    <input
                      type="number"
                      placeholder="Update progress"
                      className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const value = parseFloat(e.currentTarget.value);
                          if (!isNaN(value)) {
                            updateGoalProgress(goal.id, value);
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                )}

                {goal.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-300">{goal.notes}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 border border-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  {achievement.badge_url ? (
                    <img
                      src={achievement.badge_url}
                      alt={achievement.title}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{achievement.title}</h3>
                    {achievement.description && (
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(achievement.earned_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goal Form Modal */}
      {showGoalForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Goal</h2>
              <button
                onClick={() => setShowGoalForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Goal Type</label>
                <select
                  name="goal_type"
                  required
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                >
                  <option value="weight_loss">Weight Loss</option>
                  <option value="weight_gain">Weight Gain</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="strength">Strength</option>
                  <option value="endurance">Endurance</option>
                  <option value="body_fat">Body Fat Reduction</option>
                  <option value="measurements">Measurements</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  maxLength={200}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  placeholder="e.g., Lose 10kg in 3 months"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Target Value</label>
                  <input
                    type="number"
                    name="target_value"
                    step="0.1"
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                    placeholder="e.g., 10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Value</label>
                  <input
                    type="number"
                    name="current_value"
                    step="0.1"
                    defaultValue={0}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Target Date</label>
                <input
                  type="date"
                  name="target_date"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                <select
                  name="priority"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium" selected>Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                <textarea
                  name="notes"
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
                >
                  Create Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowGoalForm(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



