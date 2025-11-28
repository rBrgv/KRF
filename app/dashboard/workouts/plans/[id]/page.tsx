import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { WorkoutPlanEditor } from '@/components/dashboard/workouts/WorkoutPlanEditor';

export default async function WorkoutPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const { id } = await params;

  // Fetch plan with full details directly from Supabase
  const supabase = await createClient();
  
  const { data: plan, error: planError } = await supabase
    .from('workout_plans')
    .select('*')
    .eq('id', id)
    .single();

  if (planError || !plan) {
    redirect('/dashboard/workouts');
  }

  // Fetch days
  const { data: days, error: daysError } = await supabase
    .from('workout_plan_days')
    .select('*')
    .eq('workout_plan_id', id)
    .order('day_index', { ascending: true });

  // Fetch exercises for each day
  const daysWithExercises = await Promise.all(
    (days || []).map(async (day) => {
      const { data: exercises } = await supabase
        .from('workout_plan_exercises')
        .select(`
          *,
          exercises:exercise_id (*)
        `)
        .eq('workout_plan_day_id', day.id)
        .order('order_index', { ascending: true });

      return {
        ...day,
        exercises: exercises || [],
      };
    })
  );

  const planWithDays = {
    ...plan,
    days: daysWithExercises,
  };

  return (
    <div className="p-4 lg:p-8">
      <WorkoutPlanEditor planId={id} initialPlan={planWithDays} />
    </div>
  );
}

