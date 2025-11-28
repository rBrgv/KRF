'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Calendar, Clock, Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface WorkoutPlanDay {
  id: string;
  day_index: number;
  title: string;
  workout_plan_exercises: Array<{
    id: string;
    sets: number;
    reps: number;
    rest_seconds: number | null;
    exercises: {
      name: string;
      video_url: string | null;
      form_notes: string | null;
    } | null;
  }>;
}

interface WorkoutAssignment {
  id: string;
  workout_plan_id: string;
  start_date: string;
  end_date: string | null;
  workout_plans: {
    id: string;
    title: string;
    workout_plan_days: WorkoutPlanDay[];
  } | null;
}

interface CompletionLog {
  id: string;
  workout_plan_day_id: string;
  date: string;
  status: 'completed' | 'partially_completed' | 'skipped';
  notes: string | null;
  workout_plan_days: {
    id: string;
    day_index: number;
    title: string;
  } | null;
}

interface WorkoutLoggingProps {
  clientId: string;
}

export function WorkoutLogging({ clientId }: WorkoutLoggingProps) {
  const [assignments, setAssignments] = useState<WorkoutAssignment[]>([]);
  const [completionLogs, setCompletionLogs] = useState<CompletionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showLogForm, setShowLogForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState<WorkoutPlanDay | null>(null);

  useEffect(() => {
    fetchData();
  }, [clientId, selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignmentsRes, logsRes] = await Promise.all([
        fetch(`/api/workouts/assignments?client_id=${clientId}&is_active=true`),
        fetch(`/api/workouts/completion-logs?client_id=${clientId}&date=${selectedDate}`),
      ]);

      if (assignmentsRes.ok) {
        const data = await assignmentsRes.json();
        setAssignments(data.data || []);
      }

      if (logsRes.ok) {
        const data = await logsRes.json();
        setCompletionLogs(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching workout data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogWorkout = async (dayId: string, status: 'completed' | 'partially_completed' | 'skipped', notes?: string) => {
    if (!assignments[0]?.workout_plan_id) return;

    try {
      const response = await fetch('/api/workouts/completion-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          workout_plan_id: assignments[0].workout_plan_id,
          workout_plan_day_id: dayId,
          date: selectedDate,
          status,
          notes: notes || null,
        }),
      });

      if (response.ok) {
        setShowLogForm(false);
        fetchData();
        alert('Workout logged successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to log workout');
      }
    } catch (error) {
      console.error('Error logging workout:', error);
      alert('An error occurred');
    }
  };

  const getDayStatus = (dayId: string): CompletionLog | null => {
    return completionLogs.find(log => log.workout_plan_day_id === dayId) || null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-400">Loading workout plans...</div>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50">
        <CheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
        <p className="text-gray-400">No active workout plan assigned</p>
        <p className="text-sm text-gray-500 mt-2">Contact your trainer to get a workout plan</p>
      </div>
    );
  }

  const activePlan = assignments[0];
  const planDays = activePlan.workout_plans?.workout_plan_days || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Log Workout</h2>
          <p className="text-gray-400">Mark your workouts as complete</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white"
          />
        </div>
      </div>

      {/* Active Plan Info */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-bold text-white mb-2">
          {activePlan.workout_plans?.title || 'Active Workout Plan'}
        </h3>
        <p className="text-sm text-gray-400">
          Started: {formatDate(activePlan.start_date)}
        </p>
      </div>

      {/* Workout Days */}
      <div className="space-y-4">
        {planDays.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No workout days configured
          </div>
        ) : (
          planDays.map((day) => {
            const log = getDayStatus(day.id);
            const statusColors = {
              completed: 'bg-green-500/20 text-green-300 border-green-500/30',
              partially_completed: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
              skipped: 'bg-red-500/20 text-red-300 border-red-500/30',
            };

            return (
              <div
                key={day.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-white">
                      Day {day.day_index}: {day.title}
                    </h4>
                    {log && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColors[log.status]}`}>
                          {log.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-400">
                          Logged on {formatDate(log.date)}
                        </span>
                      </div>
                    )}
                  </div>
                  {!log && (
                    <button
                      onClick={() => {
                        setSelectedDay(day);
                        setShowLogForm(true);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center gap-2 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Log Workout
                    </button>
                  )}
                </div>

                {/* Exercises */}
                {day.workout_plan_exercises && day.workout_plan_exercises.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {day.workout_plan_exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="bg-gray-800/30 p-3 rounded-lg border border-gray-700/30"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-white">
                              {exercise.exercises?.name || 'Unknown Exercise'}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              {exercise.sets} sets × {exercise.reps} reps
                              {exercise.rest_seconds && ` • ${exercise.rest_seconds}s rest`}
                            </p>
                          </div>
                          {exercise.exercises?.video_url && (
                            <a
                              href={exercise.exercises.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-400 hover:text-blue-300"
                            >
                              Watch Video
                            </a>
                          )}
                        </div>
                        {exercise.exercises?.form_notes && (
                          <p className="text-xs text-gray-500 mt-2">
                            {exercise.exercises.form_notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Log Notes */}
                {log?.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold">Notes:</span> {log.notes}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Log Form Modal */}
      {showLogForm && selectedDay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Log Workout</h3>
              <button
                onClick={() => setShowLogForm(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">Date</p>
                <p className="text-white font-semibold">{formatDate(selectedDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-2">Workout Day</p>
                <p className="text-white font-semibold">
                  Day {selectedDay.day_index}: {selectedDay.title}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-3">Status</p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleLogWorkout(selectedDay.id, 'completed')}
                    className="px-4 py-3 bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Completed
                  </button>
                  <button
                    onClick={() => handleLogWorkout(selectedDay.id, 'partially_completed')}
                    className="px-4 py-3 bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-5 h-5" />
                    Partial
                  </button>
                  <button
                    onClick={() => handleLogWorkout(selectedDay.id, 'skipped')}
                    className="px-4 py-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Skipped
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



