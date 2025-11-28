'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  category: string;
  equipment: string;
  muscle_group: string;
  description: string | null;
  demo_url: string | null;
}

interface ExerciseFormProps {
  exercise?: Exercise;
  onClose: () => void;
  onSuccess: () => void;
}

export function ExerciseForm({ exercise, onClose, onSuccess }: ExerciseFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: exercise?.name || '',
    category: exercise?.category || 'other',
    equipment: exercise?.equipment || 'other',
    muscle_group: exercise?.muscle_group || 'other',
    description: exercise?.description || '',
    demo_url: exercise?.demo_url || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = exercise?.id
        ? `/api/workouts/exercises/${exercise.id}`
        : '/api/workouts/exercises';
      const method = exercise?.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          description: formData.description || null,
          demo_url: formData.demo_url || null,
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
      <div className="premium-card rounded-2xl p-8 max-w-2xl w-full border border-gray-800/50 max-h-[90vh] overflow-y-auto">
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
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="push">Push</option>
                <option value="pull">Pull</option>
                <option value="legs">Legs</option>
                <option value="full_body">Full Body</option>
                <option value="cardio">Cardio</option>
                <option value="core">Core</option>
                <option value="flexibility">Flexibility</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Equipment *
              </label>
              <select
                value={formData.equipment}
                onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="dumbbells">Dumbbells</option>
                <option value="barbell">Barbell</option>
                <option value="bodyweight">Bodyweight</option>
                <option value="machine">Machine</option>
                <option value="cable">Cable</option>
                <option value="kettlebell">Kettlebell</option>
                <option value="resistance_band">Resistance Band</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Muscle Group *
              </label>
              <select
                value={formData.muscle_group}
                onChange={(e) => setFormData({ ...formData, muscle_group: e.target.value })}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="chest">Chest</option>
                <option value="back">Back</option>
                <option value="shoulders">Shoulders</option>
                <option value="biceps">Biceps</option>
                <option value="triceps">Triceps</option>
                <option value="legs">Legs</option>
                <option value="glutes">Glutes</option>
                <option value="core">Core</option>
                <option value="cardio">Cardio</option>
                <option value="full_body">Full Body</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Demo URL (YouTube or video link)
            </label>
            <input
              type="url"
              value={formData.demo_url}
              onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : exercise?.id ? 'Update' : 'Create'}
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




