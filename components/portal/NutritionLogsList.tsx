'use client';

import { formatDate } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface Food {
  id: string;
  name: string;
  category: string;
  description?: string;
}

interface FoodLogEntry {
  id: string;
  serving_size_g: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
  foods: Food | null;
}

interface NutritionLog {
  id: string;
  date: string;
  total_calories: number | string;
  total_protein_g: number | string;
  total_carbs_g: number | string;
  total_fats_g: number | string;
  notes?: string | null;
  source: string;
  food_log_entries?: FoodLogEntry[];
}

interface NutritionLogsListProps {
  logs: NutritionLog[];
}

export function NutritionLogsList({ logs }: NutritionLogsListProps) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-16">
        <Calendar className="w-20 h-20 text-gray-600 mx-auto mb-6 opacity-50" />
        <p className="text-gray-400 text-lg">No nutrition logs yet</p>
        <p className="text-gray-500 text-sm mt-2">Start logging your daily nutrition above</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => {
        const calories = Number(log.total_calories || 0);
        const protein = Number(log.total_protein_g || 0);
        const carbs = Number(log.total_carbs_g || 0);
        const fats = Number(log.total_fats_g || 0);

        return (
          <div
            key={log.id}
            className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-5 border border-gray-700/30 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <h3 className="font-bold text-white text-lg">
                  {formatDate(log.date)}
                </h3>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600/50 rounded-full">
                {log.source === 'from_plan' ? 'From Plan' : 'Manual'}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Calories</p>
                <p className="text-lg font-bold text-red-400">
                  {calories.toFixed(0)} <span className="text-sm text-gray-400">cal</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Protein</p>
                <p className="text-lg font-bold text-blue-400">
                  {protein.toFixed(1)} <span className="text-sm text-gray-400">g</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Carbs</p>
                <p className="text-lg font-bold text-green-400">
                  {carbs.toFixed(1)} <span className="text-sm text-gray-400">g</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Fats</p>
                <p className="text-lg font-bold text-yellow-400">
                  {fats.toFixed(1)} <span className="text-sm text-gray-400">g</span>
                </p>
              </div>
            </div>

            {/* Food Entries - Grouped by Meal Type */}
            {log.food_log_entries && log.food_log_entries.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700/30">
                <p className="text-xs font-semibold text-gray-400 mb-2">Foods Logged:</p>
                {(() => {
                  // Group entries by meal type
                  const mealGroups: Record<string, typeof log.food_log_entries> = {
                    breakfast: [],
                    lunch: [],
                    dinner: [],
                    snack: [],
                    other: [],
                  };

                  log.food_log_entries.forEach((entry) => {
                    const mealType = entry.meal_type || 'other';
                    if (mealGroups[mealType]) {
                      mealGroups[mealType].push(entry);
                    } else {
                      mealGroups.other.push(entry);
                    }
                  });

                  const mealLabels: Record<string, string> = {
                    breakfast: '🍳 Breakfast',
                    lunch: '🍽️ Lunch',
                    dinner: '🌙 Dinner',
                    snack: '🍎 Snacks',
                    other: '📝 Other',
                  };

                  return (
                    <div className="space-y-3">
                      {Object.entries(mealGroups).map(([mealType, entries]) => {
                        if (entries.length === 0) return null;
                        return (
                          <div key={mealType} className="space-y-1">
                            <p className="text-xs font-semibold text-purple-400 mb-1">
                              {mealLabels[mealType]}
                            </p>
                            {entries.map((entry) => (
                              <div
                                key={entry.id}
                                className="flex items-center justify-between text-sm bg-gray-800/30 rounded px-2 py-1"
                              >
                                <span className="text-gray-300">
                                  {entry.foods?.name || 'Unknown Food'}
                                  {entry.serving_size_g && (
                                    <span className="text-gray-500 text-xs ml-2">
                                      ({entry.serving_size_g.toFixed(0)}g)
                                    </span>
                                  )}
                                </span>
                                <span className="text-gray-400 text-xs">
                                  {entry.calories.toFixed(0)} cal
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {log.notes && (
              <div className="mt-3 pt-3 border-t border-gray-700/30">
                <p className="text-sm text-gray-300">{log.notes}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

