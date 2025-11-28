'use client';

import { useState } from 'react';
import { ExerciseLibrary } from './workouts/ExerciseLibrary';
import { WorkoutPlansList } from './workouts/WorkoutPlansList';

type Tab = 'exercises' | 'plans';

export function WorkoutsPageContent() {
  const [activeTab, setActiveTab] = useState<Tab>('exercises');

  return (
    <div>
      {/* Tabs */}
      <div className="premium-card rounded-2xl p-2 mb-6 border border-gray-800/50">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('exercises')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'exercises'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Exercise Library
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'plans'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Workout Plans
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'exercises' && <ExerciseLibrary />}
      {activeTab === 'plans' && <WorkoutPlansList />}
    </div>
  );
}




