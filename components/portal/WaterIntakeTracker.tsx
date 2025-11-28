'use client';

import { useState, useEffect } from 'react';
import { Droplet, Plus, Minus, Target, TrendingUp } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface WaterIntakeLog {
  id: string;
  date: string;
  amount_ml: number;
  goal_ml: number;
}

interface WaterIntakeTrackerProps {
  clientId: string;
}

export function WaterIntakeTracker({ clientId }: WaterIntakeTrackerProps) {
  const [todayLog, setTodayLog] = useState<WaterIntakeLog | null>(null);
  const [weeklyLogs, setWeeklyLogs] = useState<WaterIntakeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [goalMl, setGoalMl] = useState(2000);

  const today = new Date().toISOString().split('T')[0];
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStartStr = weekStart.toISOString().split('T')[0];

  useEffect(() => {
    fetchData();
  }, [clientId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [todayRes, weekRes] = await Promise.all([
        fetch(`/api/water-intake?client_id=${clientId}&date=${today}`),
        fetch(`/api/water-intake?client_id=${clientId}&start_date=${weekStartStr}&limit=7`),
      ]);

      if (todayRes.ok) {
        const data = await todayRes.json();
        const logs = data.data || [];
        if (logs.length > 0) {
          setTodayLog(logs[0]);
          setGoalMl(logs[0].goal_ml || 2000);
        }
      }

      if (weekRes.ok) {
        const data = await weekRes.json();
        setWeeklyLogs(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching water intake:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWater = async (amount: number) => {
    setIsSaving(true);
    try {
      const newAmount = (todayLog?.amount_ml || 0) + amount;
      const response = await fetch('/api/water-intake', {
        method: todayLog ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          todayLog
            ? {
                id: todayLog.id,
                amount_ml: newAmount,
              }
            : {
                client_id: clientId,
                date: today,
                amount_ml: newAmount,
                goal_ml: goalMl,
              }
        ),
      });

      if (response.ok) {
        fetchData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update water intake');
      }
    } catch (error) {
      console.error('Error updating water intake:', error);
      alert('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const updateGoal = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(
        todayLog
          ? `/api/water-intake`
          : '/api/water-intake',
        {
          method: todayLog ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            todayLog
              ? {
                  id: todayLog.id,
                  goal_ml: goalMl,
                }
              : {
                  client_id: clientId,
                  date: today,
                  amount_ml: 0,
                  goal_ml: goalMl,
                }
          ),
        }
      );

      if (response.ok) {
        fetchData();
        alert('Goal updated!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update goal');
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      alert('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  const currentAmount = todayLog?.amount_ml || 0;
  const progress = Math.min(100, (currentAmount / goalMl) * 100);
  const weeklyTotal = weeklyLogs.reduce((sum, log) => sum + log.amount_ml, 0);
  const weeklyAverage = weeklyLogs.length > 0 ? weeklyTotal / weeklyLogs.length : 0;

  return (
    <div className="space-y-6">
      {/* Today's Water Intake */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Droplet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Today's Water Intake</h3>
              <p className="text-sm text-gray-400">{formatDate(today)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{currentAmount}ml</p>
            <p className="text-sm text-gray-400">of {goalMl}ml goal</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">{Math.round(progress)}% complete</span>
            <span className="text-gray-400">{goalMl - currentAmount}ml remaining</span>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[250, 500, 750, 1000].map((amount) => (
            <button
              key={amount}
              onClick={() => addWater(amount)}
              disabled={isSaving}
              className="px-4 py-3 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="font-semibold">+{amount}ml</span>
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Custom amount (ml)"
            min="0"
            className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const amount = parseInt(e.currentTarget.value);
                if (!isNaN(amount) && amount > 0) {
                  addWater(amount);
                  e.currentTarget.value = '';
                }
              }
            }}
          />
        </div>

        {/* Goal Setting */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-400">Daily Goal:</span>
            <input
              type="number"
              value={goalMl}
              onChange={(e) => setGoalMl(parseInt(e.target.value) || 2000)}
              min="500"
              max="10000"
              step="100"
              className="w-24 px-3 py-1 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm"
            />
            <span className="text-sm text-gray-400">ml</span>
            <button
              onClick={updateGoal}
              disabled={isSaving}
              className="ml-auto px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              Update Goal
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">This Week</h3>
          <TrendingUp className="w-5 h-5 text-blue-400" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Intake</p>
            <p className="text-2xl font-bold text-white">{weeklyTotal.toLocaleString()}ml</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Daily Average</p>
            <p className="text-2xl font-bold text-white">{Math.round(weeklyAverage)}ml</p>
          </div>
        </div>
        {weeklyLogs.length > 0 && (
          <div className="mt-4 space-y-2">
            {weeklyLogs.map((log) => {
              const dayProgress = Math.min(100, (log.amount_ml / log.goal_ml) * 100);
              return (
                <div key={log.id} className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 w-20">
                    {formatDate(log.date)}
                  </span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${dayProgress}%` }}
                    />
                  </div>
                  <span className="text-sm text-white w-20 text-right">
                    {log.amount_ml}ml
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}



