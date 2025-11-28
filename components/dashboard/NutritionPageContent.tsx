'use client';

import { useState } from 'react';
import { MealPlansList } from './nutrition/MealPlansList';
import { NutritionLogsView } from './nutrition/NutritionLogsView';

type Tab = 'meal-plans' | 'logs';

export function NutritionPageContent() {
  const [activeTab, setActiveTab] = useState<Tab>('meal-plans');

  return (
    <div>
      {/* Tabs */}
      <div className="premium-card rounded-2xl p-2 mb-6 border border-gray-800/50">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('meal-plans')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'meal-plans'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Meal Plans
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'logs'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Daily Logs
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'meal-plans' && <MealPlansList />}
      {activeTab === 'logs' && <NutritionLogsView />}
    </div>
  );
}




