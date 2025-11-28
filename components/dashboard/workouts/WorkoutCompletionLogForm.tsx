'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface WorkoutAssignment {
  id: string;
  workout_plan_id: string;
  workout_plans?: {
    id: string;
    title: string;
  };
}

interface WorkoutPlanDay {
  id: string;
  day_index: number;
  title: string;
}

interface WorkoutCompletionLogFormProps {
  clientId: string;
  assignments: WorkoutAssignment[];
  onClose: () => void;
  onSuccess: () => void;
}

export function WorkoutCompletionLogForm({ clientId, assignments, onClose, onSuccess }: WorkoutCompletionLogFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [days, setDays] = useState<WorkoutPlanDay[]>([]);
  const [loadingDays, setLoadingDays] = useState(false);
  const [formData, setFormData] = useState({
    workout_plan_id: '',
    workout_plan_day_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'completed' as 'completed' | 'partially_completed' | 'skipped',
    notes: '',
  });

  useEffect(() => {
    if (assignments.length > 0 && !selectedPlanId) {
      setSelectedPlanId(assignments[0].workout_plan_id);
      setFormData({ ...formData, workout_plan_id: assignments[0].workout_plan_id });
    }
  }, [assignments]);

  useEffect(() => {
    if (selectedPlanId) {
      fetchDays();
    }
  }, [selectedPlanId]);

  const fetchDays = async () => {
    setLoadingDays(true);
    try {
      const response = await fetch(`/api/workouts/plans/${selectedPlanId}/days`);
      const result = await response.json();
      if (result.success) {
        setDays(result.data);
      }
    } catch (error) {
      console.error('Error fetching days:', error);
    } finally {
      setLoadingDays(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/workouts/completion-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          workout_plan_id: formData.workout_plan_id,
          workout_plan_day_id: formData.workout_plan_day_id,
          date: formData.date,
          status: formData.status,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to log completion');
      }
    } catch (error) {
      console.error('Error logging completion:', error);
      alert('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (assignments.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="premium-card rounded-2xl p-8 max-w-xl w-full border border-gray-800/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Log Workout Completion</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-400 mb-6">
            No active workout plans assigned to this client. Please assign a plan first.
          </p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="premium-card rounded-2xl p-8 max-w-xl w-full border border-gray-800/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Log Workout Completion</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Workout Plan *
            </label>
            <select
              value={selectedPlanId}
              onChange={(e) => {
                setSelectedPlanId(e.target.value);
                setFormData({ ...formData, workout_plan_id: e.target.value, workout_plan_day_id: '' });
              }}
              required
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Select Plan</option>
              {assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.workout_plan_id}>
                  {assignment.workout_plans?.title || 'Unknown Plan'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Day *
            </label>
            {loadingDays ? (
              <div className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-400">
                Loading days...
              </div>
            ) : (
              <select
                value={formData.workout_plan_day_id}
                onChange={(e) => setFormData({ ...formData, workout_plan_day_id: e.target.value })}
                required
                disabled={!selectedPlanId || loadingDays}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50"
              >
                <option value="">Select Day</option>
                {days.map((day) => (
                  <option key={day.id} value={day.id}>
                    Day {day.day_index}: {day.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="completed">Completed</option>
                <option value="partially_completed">Partially Completed</option>
                <option value="skipped">Skipped</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving || !formData.workout_plan_id || !formData.workout_plan_day_id}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Logging...' : 'Log Completion'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}




