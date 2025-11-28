'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface MealPlan {
  id: string;
  title: string;
  goal_type: string;
}

interface MealPlanAssignmentFormProps {
  clientId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function MealPlanAssignmentForm({ clientId, onClose, onSuccess }: MealPlanAssignmentFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [formData, setFormData] = useState({
    meal_plan_id: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_active: true,
    notes: '',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoadingPlans(true);
    try {
      const response = await fetch('/api/nutrition/meal-plans');
      const result = await response.json();
      if (result.success) {
        setPlans(result.data);
      }
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/nutrition/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          meal_plan_id: formData.meal_plan_id,
          start_date: formData.start_date,
          end_date: formData.end_date || null,
          is_active: formData.is_active,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to assign meal plan');
      }
    } catch (error) {
      console.error('Error assigning meal plan:', error);
      alert('An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="premium-card rounded-2xl p-8 max-w-xl w-full border border-gray-800/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Assign Meal Plan</h2>
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
              Meal Plan *
            </label>
            {loadingPlans ? (
              <div className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-400">
                Loading plans...
              </div>
            ) : (
              <select
                value={formData.meal_plan_id}
                onChange={(e) => setFormData({ ...formData, meal_plan_id: e.target.value })}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select Meal Plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.title} ({plan.goal_type.replace('_', ' ')})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                min={formData.start_date}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 rounded bg-gray-900/50 border-gray-700 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-300">
              Active (plan is currently in use)
            </label>
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
              disabled={isSaving || !formData.meal_plan_id}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50"
            >
              {isSaving ? 'Assigning...' : 'Assign Plan'}
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




