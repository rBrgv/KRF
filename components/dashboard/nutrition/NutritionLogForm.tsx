'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface NutritionLogFormProps {
  clientId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function NutritionLogForm({ clientId, onClose, onSuccess }: NutritionLogFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    total_calories: 0,
    total_protein_g: 0,
    total_carbs_g: 0,
    total_fats_g: 0,
    notes: '',
    source: 'manual' as 'manual' | 'from_plan',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/nutrition/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          date: formData.date,
          total_calories: parseFloat(formData.total_calories.toString()) || 0,
          total_protein_g: parseFloat(formData.total_protein_g.toString()) || 0,
          total_carbs_g: parseFloat(formData.total_carbs_g.toString()) || 0,
          total_fats_g: parseFloat(formData.total_fats_g.toString()) || 0,
          notes: formData.notes || null,
          source: formData.source,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save nutrition log');
      }
    } catch (error) {
      console.error('Error saving nutrition log:', error);
      alert('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="premium-card rounded-2xl p-8 max-w-2xl w-full border border-gray-800/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Log Nutrition Entry</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
                Source
              </label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="manual">Manual Entry</option>
                <option value="from_plan">From Plan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Calories
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.total_calories}
                onChange={(e) => setFormData({ ...formData, total_calories: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Protein (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.total_protein_g}
                onChange={(e) => setFormData({ ...formData, total_protein_g: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Carbs (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.total_carbs_g}
                onChange={(e) => setFormData({ ...formData, total_carbs_g: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fats (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.total_fats_g}
                onChange={(e) => setFormData({ ...formData, total_fats_g: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
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
              disabled={isSaving}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Log'}
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

