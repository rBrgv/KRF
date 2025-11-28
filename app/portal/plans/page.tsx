import { redirect } from 'next/navigation';
import { getClientByUserId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { Dumbbell, Apple, Calendar, Clock } from 'lucide-react';
import { WorkoutLogging } from '@/components/portal/WorkoutLogging';

export default async function PortalPlansPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const client = await getClientByUserId(user.id);

  if (!client) {
    redirect('/portal');
  }

  // Fetch active workout plan with full details
  const { data: workoutAssignment } = await supabase
    .from('client_workout_assignments')
    .select(`
      *,
      workout_plans:workout_plan_id (*)
    `)
    .eq('client_id', client.id)
    .eq('is_active', true)
    .limit(1)
    .single();

  let workoutPlanDetails = null;
  if (workoutAssignment?.workout_plan_id) {
    const { data: plan } = await supabase
      .from('workout_plans')
      .select(`
        *,
        workout_plan_days (
          *,
          workout_plan_exercises (
            *,
            exercises:exercise_id (*)
          )
        )
      `)
      .eq('id', workoutAssignment.workout_plan_id)
      .single();

    if (plan) {
      workoutPlanDetails = plan;
    }
  }

  // Fetch active meal plan with items
  const { data: mealAssignment } = await supabase
    .from('client_meal_plan_assignments')
    .select(`
      *,
      meal_plans:meal_plan_id (*)
    `)
    .eq('client_id', client.id)
    .eq('is_active', true)
    .limit(1)
    .single();

  let mealPlanDetails = null;
  if (mealAssignment?.meal_plan_id) {
    const { data: plan } = await supabase
      .from('meal_plans')
      .select(`
        *,
        meal_plan_items (*)
      `)
      .eq('id', mealAssignment.meal_plan_id)
      .single();

    if (plan) {
      mealPlanDetails = plan;
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">My Plans</h1>
            <p className="text-gray-400 text-lg">View your active workout and nutrition plans</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Workout Plan */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Workout Plan</h2>
                {workoutAssignment && (
                  <p className="text-sm text-gray-400">
                    Started {formatDate(workoutAssignment.start_date)}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="p-6">
            {workoutPlanDetails ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {workoutPlanDetails.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1.5 text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                      {workoutPlanDetails.goal_type.replace('_', ' ')}
                    </span>
                    <span className="px-3 py-1.5 text-sm font-medium bg-green-500/20 text-green-300 border border-green-500/30 rounded-full">
                      {workoutPlanDetails.level}
                    </span>
                  </div>
                  {workoutPlanDetails.notes && (
                    <p className="text-sm text-gray-300 mb-4">{workoutPlanDetails.notes}</p>
                  )}
                </div>

                {workoutPlanDetails.workout_plan_days && workoutPlanDetails.workout_plan_days.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="font-bold text-white text-lg">Plan Structure</h4>
                    {workoutPlanDetails.workout_plan_days.map((day: any) => (
                      <div key={day.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30 rounded-xl p-4">
                        <h5 className="font-bold text-white mb-3">
                          Day {day.day_index}: {day.title}
                        </h5>
                        {day.workout_plan_exercises && day.workout_plan_exercises.length > 0 ? (
                          <div className="space-y-2 mt-3">
                            {day.workout_plan_exercises.map((exercise: any) => (
                              <div
                                key={exercise.id}
                                className="text-sm text-gray-300 bg-gray-800/30 p-3 rounded-lg border border-gray-700/30"
                              >
                                <span className="font-semibold text-white">
                                  {exercise.exercises?.name || 'Unknown Exercise'}
                                </span>
                                {' • '}
                                <span>
                                  {exercise.sets} sets × {exercise.reps} reps
                                </span>
                                {exercise.rest_seconds > 0 && (
                                  <span className="text-gray-400">
                                    {' • '}{exercise.rest_seconds}s rest
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">No exercises added</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No days configured in this plan</p>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400">No active workout plan assigned</p>
                <p className="text-sm text-gray-500 mt-2">
                  Contact your trainer to get a workout plan
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Meal Plan */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Meal Plan</h2>
                {mealAssignment && (
                  <p className="text-sm text-gray-400">
                    Started {formatDate(mealAssignment.start_date)}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="p-6">
            {mealPlanDetails ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {mealPlanDetails.title}
                  </h3>
                  <span className="inline-block px-3 py-1.5 text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full mb-4">
                    {mealPlanDetails.goal_type.replace('_', ' ')}
                  </span>
                  {mealPlanDetails.notes && (
                    <p className="text-sm text-gray-300 mb-4">{mealPlanDetails.notes}</p>
                  )}
                </div>

                {mealPlanDetails.meal_plan_items && mealPlanDetails.meal_plan_items.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="font-bold text-white text-lg">Daily Meals</h4>
                    {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
                      const items = mealPlanDetails.meal_plan_items.filter(
                        (item: any) => item.meal_type === mealType
                      );
                      if (items.length === 0) return null;

                      const mealLabels: Record<string, string> = {
                        breakfast: 'Breakfast',
                        lunch: 'Lunch',
                        dinner: 'Dinner',
                        snack: 'Snack',
                      };

                      return (
                        <div key={mealType} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30 rounded-xl p-4">
                          <h5 className="font-bold text-white mb-3">
                            {mealLabels[mealType]}
                          </h5>
                          <div className="space-y-2">
                            {items.map((item: any) => {
                              const totalCal = Number(item.calories || 0);
                              const totalProtein = Number(item.protein_g || 0);
                              const totalCarbs = Number(item.carbs_g || 0);
                              const totalFats = Number(item.fats_g || 0);

                              return (
                                <div key={item.id} className="bg-gray-800/30 p-3 rounded-lg border border-gray-700/30">
                                  <p className="font-semibold text-white mb-2">{item.name}</p>
                                  <div className="flex flex-wrap gap-3 text-xs">
                                    <span className="text-red-400 font-semibold">
                                      {totalCal.toFixed(0)} cal
                                    </span>
                                    <span className="text-blue-400">
                                      {totalProtein.toFixed(1)}g P
                                    </span>
                                    <span className="text-green-400">
                                      {totalCarbs.toFixed(1)}g C
                                    </span>
                                    <span className="text-yellow-400">
                                      {totalFats.toFixed(1)}g F
                                    </span>
                                  </div>
                                  {item.notes && (
                                    <p className="text-xs text-gray-400 mt-2">{item.notes}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-400">No meals configured in this plan</p>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Apple className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400">No active meal plan assigned</p>
                <p className="text-sm text-gray-500 mt-2">
                  Contact your trainer to get a meal plan
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Workout Logging Section */}
      {workoutPlanDetails && (
        <div className="mt-8">
          <WorkoutLogging clientId={client.id} />
        </div>
      )}
    </div>
  );
}

