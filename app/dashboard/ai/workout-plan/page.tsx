'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const workoutPlanSchema = z.object({
  goal: z.string().min(10, 'Please describe your fitness goal'),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  daysPerWeek: z.number().min(1).max(7),
  equipment: z.string().optional(),
});

type WorkoutPlanData = z.infer<typeof workoutPlanSchema>;

export default function WorkoutPlanGeneratorPage() {
  const [plan, setPlan] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkoutPlanData>({
    resolver: zodResolver(workoutPlanSchema),
    defaultValues: {
      daysPerWeek: 3,
    },
  });

  const onSubmit = async (data: WorkoutPlanData) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/workout-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setPlan(result.plan);
      } else {
        alert(result.error || 'Failed to generate workout plan');
      }
    } catch (error) {
      console.error('Error generating workout plan:', error);
      alert('An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">AI Workout Plan Generator</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Plan Details</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fitness Goal *
              </label>
              <textarea
                {...register('goal')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Lose 10kg in 3 months, build muscle, improve endurance..."
              />
              {errors.goal && (
                <p className="text-red-600 text-sm mt-1">{errors.goal.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level *
              </label>
              <select
                {...register('experience')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select...</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {errors.experience && (
                <p className="text-red-600 text-sm mt-1">{errors.experience.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Days per Week *
              </label>
              <input
                {...register('daysPerWeek', { valueAsNumber: true })}
                type="number"
                min="1"
                max="7"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              {errors.daysPerWeek && (
                <p className="text-red-600 text-sm mt-1">{errors.daysPerWeek.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Equipment
              </label>
              <input
                {...register('equipment')}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Dumbbells, Resistance bands, Gym access..."
              />
            </div>
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50"
            >
              {isGenerating ? 'Generating Plan...' : 'Generate Workout Plan'}
            </button>
          </form>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Plan</h2>
          {plan ? (
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm">
                {JSON.stringify(plan, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-gray-500">Fill out the form and generate a workout plan.</p>
          )}
        </div>
      </div>
    </div>
  );
}

