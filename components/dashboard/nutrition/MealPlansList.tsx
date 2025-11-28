'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Eye, Filter } from 'lucide-react';
import Link from 'next/link';
import { MealPlanForm } from './MealPlanForm';

interface MealPlan {
  id: string;
  title: string;
  goal_type: string;
  notes: string | null;
  created_at: string;
}

export function MealPlansList() {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MealPlan | null>(null);
  const [search, setSearch] = useState('');
  const [goalFilter, setGoalFilter] = useState('');

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (goalFilter) params.set('goal_type', goalFilter);

      const response = await fetch(`/api/nutrition/meal-plans?${params.toString()}`);
      const result = await response.json();
      if (result.success) {
        setPlans(result.data);
      }
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [search, goalFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this meal plan?')) return;

    try {
      const response = await fetch(`/api/nutrition/meal-plans/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchPlans();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete meal plan');
      }
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      alert('An error occurred');
    }
  };

  const goalTypes = ['weight_loss', 'maintenance', 'muscle_gain', 'medical_condition'];
  const goalTypeLabels: Record<string, string> = {
    weight_loss: 'Weight Loss',
    maintenance: 'Maintenance',
    muscle_gain: 'Muscle Gain',
    medical_condition: 'Medical Condition',
  };

  return (
    <div>
      {/* Header and Filters */}
      <div className="premium-card rounded-2xl p-6 mb-6 border border-gray-800/50">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search meal plans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={goalFilter}
              onChange={(e) => setGoalFilter(e.target.value)}
              className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Goals</option>
              {goalTypes.map((goal) => (
                <option key={goal} value={goal}>
                  {goalTypeLabels[goal]}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              setEditingPlan(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Plan
          </button>
        </div>
      </div>

      {/* Plans Table */}
      <div className="premium-card rounded-2xl overflow-hidden border border-gray-800/50">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading meal plans...</div>
        ) : plans.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 mb-4">No meal plans found</p>
            <button
              onClick={() => {
                setEditingPlan(null);
                setShowForm(true);
              }}
              className="text-red-400 hover:text-red-300"
            >
              Create your first meal plan
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-900/50 border-b border-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Goal
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-900/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-white">{plan.title}</div>
                    {plan.notes && (
                      <div className="text-xs text-gray-400 mt-1 line-clamp-1">{plan.notes}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      {goalTypeLabels[plan.goal_type] || plan.goal_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(plan.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/nutrition/plans/${plan.id}`}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                        title="View/Edit"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Plan Form Modal */}
      {showForm && (
        <MealPlanForm
          plan={editingPlan || undefined}
          onClose={() => {
            setShowForm(false);
            setEditingPlan(null);
          }}
          onSuccess={() => {
            setShowForm(false);
            setEditingPlan(null);
            fetchPlans();
          }}
        />
      )}
    </div>
  );
}




