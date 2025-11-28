'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface WorkoutPlanDay {
  id: string;
  day_index: number;
  title: string;
  notes: string | null;
}

interface WorkoutDayFormProps {
  planId: string;
  day?: WorkoutPlanDay;
  existingDays: WorkoutPlanDay[];
  onClose: () => void;
  onSuccess: () => void;
}

export function WorkoutDayForm({ planId, day, existingDays, onClose, onSuccess }: WorkoutDayFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    day_index: day?.day_index || (existingDays.length > 0 ? Math.max(...existingDays.map(d => d.day_index)) + 1 : 1),
    title: day?.title || '',
    notes: day?.notes || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = day?.id
        ? `/api/workouts/plans/days/${day.id}`
        : `/api/workouts/plans/${planId}/days`;
      const method = day?.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day_index: formData.day_index,
          title: formData.title,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save day');
      }
    } catch (error) {
      console.error('Error saving day:', error);
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
            {day?.id ? 'Edit Day' : 'Add Day'}
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
              Day Index *
            </label>
            <input
              type="number"
              min="1"
              value={formData.day_index}
              onChange={(e) => setFormData({ ...formData, day_index: parseInt(e.target.value) || 1 })}
              required
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <p className="text-xs text-gray-400 mt-1">Day number in the plan (e.g., 1, 2, 3...)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Day 1 - Upper Body"
              required
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
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
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : day?.id ? 'Update' : 'Create'}
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




