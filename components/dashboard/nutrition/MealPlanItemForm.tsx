'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface MealPlanItem {
  id: string;
  meal_type: string;
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  notes: string | null;
  order_index: number;
}

interface MealPlanItemFormProps {
  planId: string;
  item?: MealPlanItem;
  onClose: () => void;
  onSuccess: () => void;
}

export function MealPlanItemForm({ planId, item, onClose, onSuccess }: MealPlanItemFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    meal_type: item?.meal_type || 'breakfast',
    name: item?.name || '',
    calories: item?.calories || 0,
    protein_g: item?.protein_g || 0,
    carbs_g: item?.carbs_g || 0,
    fats_g: item?.fats_g || 0,
    notes: item?.notes || '',
    order_index: item?.order_index || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const url = item?.id
        ? `/api/nutrition/meal-plan-items/${item.id}`
        : `/api/nutrition/meal-plans/${planId}/items`;
      const method = item?.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meal_type: formData.meal_type,
          name: formData.name,
          calories: parseFloat(formData.calories.toString()) || 0,
          protein_g: parseFloat(formData.protein_g.toString()) || 0,
          carbs_g: parseFloat(formData.carbs_g.toString()) || 0,
          fats_g: parseFloat(formData.fats_g.toString()) || 0,
          notes: formData.notes || null,
          order_index: formData.order_index,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save meal item');
      }
    } catch (error) {
      console.error('Error saving meal item:', error);
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
            {item?.id ? 'Edit Meal Item' : 'Add Meal Item'}
          </h2>
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
                Meal Type *
              </label>
              <select
                value={formData.meal_type}
                onChange={(e) => setFormData({ ...formData, meal_type: e.target.value })}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Oats + Whey"
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
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
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: parseFloat(e.target.value) || 0 })}
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
                value={formData.protein_g}
                onChange={(e) => setFormData({ ...formData, protein_g: parseFloat(e.target.value) || 0 })}
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
                value={formData.carbs_g}
                onChange={(e) => setFormData({ ...formData, carbs_g: parseFloat(e.target.value) || 0 })}
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
                value={formData.fats_g}
                onChange={(e) => setFormData({ ...formData, fats_g: parseFloat(e.target.value) || 0 })}
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
              rows={2}
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving || !formData.name}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : item?.id ? 'Update' : 'Add'}
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




