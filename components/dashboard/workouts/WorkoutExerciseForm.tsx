'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
}

interface WorkoutPlanExercise {
  id: string;
  exercise_id: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  order_index: number;
  notes: string | null;
}

interface WorkoutExerciseFormProps {
  dayId: string;
  exercise?: WorkoutPlanExercise;
  onClose: () => void;
  onSuccess: () => void;
}

export function WorkoutExerciseForm({ dayId, exercise, onClose, onSuccess }: WorkoutExerciseFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loadingExercises, setLoadingExercises] = useState(true);
  const [formData, setFormData] = useState({
    exercise_id: exercise?.exercise_id || '',
    sets: exercise?.sets || 3,
    reps: exercise?.reps || '10',
    rest_seconds: exercise?.rest_seconds || 60,
    order_index: exercise?.order_index || 0,
    notes: exercise?.notes || '',
  });

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    setLoadingExercises(true);
    try {
      const response = await fetch('/api/workouts/exercises');
      const result = await response.json();
      if (result.success) {
        setExercises(result.data);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoadingExercises(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = exercise?.id
        ? `/api/workouts/plans/exercises/${exercise.id}`
        : `/api/workouts/plans/days/${dayId}/exercises`;
      const method = exercise?.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise_id: formData.exercise_id,
          sets: formData.sets,
          reps: formData.reps,
          rest_seconds: formData.rest_seconds,
          order_index: formData.order_index,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save exercise');
      }
    } catch (error) {
      console.error('Error saving exercise:', error);
      alert('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="premium-card rounded-2xl p-8 max-w-xl w-full border border-gray-800/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {exercise?.id ? 'Edit Exercise' : 'Add Exercise'}
          </h2>
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
              Exercise *
            </label>
            {loadingExercises ? (
              <div className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-400">
                Loading exercises...
              </div>
            ) : (
              <select
                value={formData.exercise_id}
                onChange={(e) => setFormData({ ...formData, exercise_id: e.target.value })}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select Exercise</option>
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sets *
              </label>
              <input
                type="number"
                min="1"
                value={formData.sets}
                onChange={(e) => setFormData({ ...formData, sets: parseInt(e.target.value) || 1 })}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reps *
              </label>
              <input
                type="text"
                value={formData.reps}
                onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                placeholder="10 or 8-10"
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rest (seconds)
              </label>
              <input
                type="number"
                min="0"
                value={formData.rest_seconds}
                onChange={(e) => setFormData({ ...formData, rest_seconds: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Order Index
            </label>
            <input
              type="number"
              min="0"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving || !formData.exercise_id}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : exercise?.id ? 'Update' : 'Add'}
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




