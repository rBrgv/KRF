'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const workoutPlanSchema = z.object({
  goal: z.string().min(10, 'Goal must be at least 10 characters'),
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  daysPerWeek: z.number().int().min(1).max(7),
  equipment: z.string().optional(),
});

type WorkoutPlanForm = z.infer<typeof workoutPlanSchema>;

interface WorkoutPlan {
  weeks: Array<{
    weekNumber: number;
    focus: string;
    days: Array<{
      dayNumber: number;
      focus: string;
      exercises: Array<{
        name: string;
        sets: number;
        reps: string;
        rest: string;
        notes: string;
      }>;
    }>;
    notes: string;
  }>;
  summary: string;
}

export function WorkoutPlanGenerator() {
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [clientId, setClientId] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [formValues, setFormValues] = useState<WorkoutPlanForm | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<WorkoutPlanForm>({
    resolver: zodResolver(workoutPlanSchema),
    defaultValues: {
      daysPerWeek: 3,
    },
  });

  // Fetch clients for save option
  useEffect(() => {
    fetch('/api/clients?limit=100')
      .then((res) => res.json())
      .then((data) => setClients(data.data || []))
      .catch(console.error);
  }, []);

  const onSubmit = async (data: WorkoutPlanForm) => {
    setIsGenerating(true);
    setFormValues(data);
    try {
      const response = await fetch('/api/ai/generate-workout-plan', {
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

  const handleSaveToClient = async () => {
    if (!clientId || !plan) {
      alert('Please select a client and generate a plan first');
      return;
    }

    try {
      const response = await fetch('/api/workout-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: clientId,
          title: `4-Week Workout Plan`,
          goal: formValues?.goal || plan.summary || '',
          experience_level: formValues?.experience || 'intermediate',
          days_per_week: formValues?.daysPerWeek || plan.weeks?.[0]?.days?.length || 3,
          equipment: formValues?.equipment || '',
          plan_data: plan,
        }),
      });

      if (response.ok) {
        alert('Workout plan saved to client!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save plan');
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('An error occurred');
    }
  };

  return (
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Generated Plan</h2>
          {plan && (
            <div className="flex gap-2">
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="">Select client...</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSaveToClient}
                className="bg-green-600 text-white px-4 py-1 rounded text-sm hover:bg-green-700"
              >
                Save to Client
              </button>
            </div>
          )}
        </div>
        {plan ? (
          <div className="space-y-6 max-h-[600px] overflow-y-auto">
            {plan.summary && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Program Summary</h3>
                <p className="text-sm text-gray-700">{plan.summary}</p>
              </div>
            )}
            {plan.weeks?.map((week) => (
              <div key={week.weekNumber} className="border-b pb-4">
                <h3 className="font-semibold text-lg mb-2">
                  Week {week.weekNumber}: {week.focus}
                </h3>
                {week.days?.map((day) => (
                  <div key={day.dayNumber} className="ml-4 mb-4">
                    <h4 className="font-semibold mb-2">
                      Day {day.dayNumber}: {day.focus}
                    </h4>
                    <div className="space-y-2">
                      {day.exercises?.map((exercise, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded text-sm">
                          <p className="font-semibold">{exercise.name}</p>
                          <p className="text-gray-600">
                            {exercise.sets} sets × {exercise.reps} | Rest: {exercise.rest}
                          </p>
                          {exercise.notes && (
                            <p className="text-gray-500 text-xs mt-1">{exercise.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {week.notes && (
                  <p className="text-sm text-gray-600 mt-2 ml-4">{week.notes}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Fill out the form and generate a workout plan.</p>
        )}
      </div>
    </div>
  );
}

