'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit2, Trash2 } from 'lucide-react';
import { MealPlanItemForm } from './MealPlanItemForm';

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

interface MealPlan {
  id: string;
  title: string;
  goal_type: string;
  notes: string | null;
  items: MealPlanItem[];
}

interface MealPlanEditorProps {
  planId: string;
  initialPlan: MealPlan;
}

const mealTypeLabels: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

const goalTypeLabels: Record<string, string> = {
  weight_loss: 'Weight Loss',
  maintenance: 'Maintenance',
  muscle_gain: 'Muscle Gain',
  medical_condition: 'Medical Condition',
};

export function MealPlanEditor({ planId, initialPlan }: MealPlanEditorProps) {
  const router = useRouter();
  const [plan, setPlan] = useState<MealPlan>(initialPlan);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MealPlanItem | null>(null);
  const [expandedMealTypes, setExpandedMealTypes] = useState<Set<string>>(new Set(['breakfast', 'lunch', 'dinner', 'snack']));

  const fetchPlan = async () => {
    try {
      const response = await fetch(`/api/nutrition/meal-plans/${planId}`);
      const result = await response.json();
      if (result.success) {
        setPlan(result.data);
      }
    } catch (error) {
      console.error('Error fetching plan:', error);
    }
  };

  const toggleMealType = (mealType: string) => {
    const newExpanded = new Set(expandedMealTypes);
    if (newExpanded.has(mealType)) {
      newExpanded.delete(mealType);
    } else {
      newExpanded.add(mealType);
    }
    setExpandedMealTypes(newExpanded);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this meal item?')) return;

    try {
      const response = await fetch(`/api/nutrition/meal-plan-items/${itemId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchPlan();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('An error occurred');
    }
  };

  // Group items by meal type
  const itemsByMealType = (plan.items || []).reduce((acc, item) => {
    if (!acc[item.meal_type]) {
      acc[item.meal_type] = [];
    }
    acc[item.meal_type].push(item);
    return acc;
  }, {} as Record<string, MealPlanItem[]>);

  // Calculate totals
  const totalCalories = (plan.items || []).reduce((sum, item) => sum + Number(item.calories || 0), 0);
  const totalProtein = (plan.items || []).reduce((sum, item) => sum + Number(item.protein_g || 0), 0);
  const totalCarbs = (plan.items || []).reduce((sum, item) => sum + Number(item.carbs_g || 0), 0);
  const totalFats = (plan.items || []).reduce((sum, item) => sum + Number(item.fats_g || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/nutrition"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Nutrition</span>
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{plan.title}</h1>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
                {goalTypeLabels[plan.goal_type] || plan.goal_type}
              </span>
            </div>
            {plan.notes && (
              <p className="text-gray-400 mt-2">{plan.notes}</p>
            )}
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowItemForm(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Meal Item
          </button>
        </div>
      </div>

      {/* Totals Summary */}
      {(plan.items || []).length > 0 && (
        <div className="premium-card rounded-xl p-6 mb-6 border border-gray-800/50">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Totals</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Calories</p>
              <p className="text-2xl font-bold text-red-400">{totalCalories.toFixed(0)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Protein</p>
              <p className="text-2xl font-bold text-blue-400">{totalProtein.toFixed(1)}g</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Carbs</p>
              <p className="text-2xl font-bold text-green-400">{totalCarbs.toFixed(1)}g</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Fats</p>
              <p className="text-2xl font-bold text-yellow-400">{totalFats.toFixed(1)}g</p>
            </div>
          </div>
        </div>
      )}

      {/* Meal Items by Type */}
      <div className="space-y-4">
        {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
          const items = itemsByMealType[mealType] || [];
          const mealTotalCalories = items.reduce((sum, item) => sum + Number(item.calories || 0), 0);
          const mealTotalProtein = items.reduce((sum, item) => sum + Number(item.protein_g || 0), 0);
          const mealTotalCarbs = items.reduce((sum, item) => sum + Number(item.carbs_g || 0), 0);
          const mealTotalFats = items.reduce((sum, item) => sum + Number(item.fats_g || 0), 0);

          return (
            <div key={mealType} className="premium-card rounded-xl p-6 border border-gray-800/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleMealType(mealType)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {expandedMealTypes.has(mealType) ? '▼' : '▶'}
                  </button>
                  <h3 className="text-lg font-semibold text-white">
                    {mealTypeLabels[mealType]}
                  </h3>
                  {items.length > 0 && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setShowItemForm(true);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              </div>

              {expandedMealTypes.has(mealType) && (
                <>
                  {items.length > 0 ? (
                    <>
                      <div className="space-y-2 mb-4">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className="premium-card rounded-lg p-4 border border-gray-800/50 bg-gray-900/30"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-white mb-2">{item.name}</h4>
                                <div className="grid grid-cols-4 gap-2 text-sm">
                                  <div>
                                    <span className="text-gray-400">Cal:</span>{' '}
                                    <span className="text-red-400 font-semibold">{Number(item.calories || 0).toFixed(0)}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">P:</span>{' '}
                                    <span className="text-blue-400 font-semibold">{Number(item.protein_g || 0).toFixed(1)}g</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">C:</span>{' '}
                                    <span className="text-green-400 font-semibold">{Number(item.carbs_g || 0).toFixed(1)}g</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400">F:</span>{' '}
                                    <span className="text-yellow-400 font-semibold">{Number(item.fats_g || 0).toFixed(1)}g</span>
                                  </div>
                                </div>
                                {item.notes && (
                                  <p className="text-xs text-gray-400 mt-2">{item.notes}</p>
                                )}
                              </div>
                              <div className="flex gap-2 ml-4">
                                <button
                                  onClick={() => {
                                    setEditingItem(item);
                                    setShowItemForm(true);
                                  }}
                                  className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-gray-800/50">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Meal Total:</span>
                          <div className="flex gap-4">
                            <span className="text-red-400 font-semibold">{mealTotalCalories.toFixed(0)} cal</span>
                            <span className="text-blue-400">{mealTotalProtein.toFixed(1)}g P</span>
                            <span className="text-green-400">{mealTotalCarbs.toFixed(1)}g C</span>
                            <span className="text-yellow-400">{mealTotalFats.toFixed(1)}g F</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No items added yet. Click "Add" to get started.
                    </p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Item Form Modal */}
      {showItemForm && (
        <MealPlanItemForm
          planId={planId}
          item={editingItem || undefined}
          onClose={() => {
            setShowItemForm(false);
            setEditingItem(null);
          }}
          onSuccess={() => {
            setShowItemForm(false);
            setEditingItem(null);
            fetchPlan();
          }}
        />
      )}
    </div>
  );
}




