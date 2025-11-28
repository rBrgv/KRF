import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { ClientDetail } from '@/components/dashboard/ClientDetail';

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const { id } = await params;

  // Fetch client directly from Supabase
  const supabase = await createClient();
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (clientError || !client) {
    console.error('Error fetching client:', clientError);
    redirect('/dashboard/clients');
  }

  // Fetch linked lead if exists
  let lead = null;
  if (client.lead_id) {
    const { data: leadData, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', client.lead_id)
      .single();
    if (!leadError && leadData) {
      lead = leadData;
    }
  }

  // Fetch appointments
  const { data: appointments, error: appointmentsError } = await supabase
    .from('appointments')
    .select('*')
    .eq('client_id', id)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true });

  if (appointmentsError) {
    console.error('Error fetching appointments:', appointmentsError);
  }

  // Fetch recurring sessions
  const { data: recurringSessions, error: recurringSessionsError } = await supabase
    .from('recurring_sessions')
    .select('*')
    .eq('client_id', id)
    .order('created_at', { ascending: false });

  if (recurringSessionsError) {
    console.error('Error fetching recurring sessions:', recurringSessionsError);
  }

  // Fetch workout assignments
  const { data: workoutAssignments, error: workoutAssignmentsError } = await supabase
    .from('client_workout_assignments')
    .select(`
      *,
      workout_plans:workout_plan_id (*)
    `)
    .eq('client_id', id)
    .order('created_at', { ascending: false });

  if (workoutAssignmentsError) {
    console.error('Error fetching workout assignments:', workoutAssignmentsError);
  }

  // Fetch recent completion logs
  const { data: completionLogs, error: completionLogsError } = await supabase
    .from('workout_completion_logs')
    .select(`
      *,
      workout_plans:workout_plan_id (*),
      workout_plan_days:workout_plan_day_id (*)
    `)
    .eq('client_id', id)
    .order('date', { ascending: false })
    .limit(10);

  if (completionLogsError) {
    console.error('Error fetching completion logs:', completionLogsError);
  }

  // Fetch meal plan assignments
  const { data: mealPlanAssignments, error: mealPlanAssignmentsError } = await supabase
    .from('client_meal_plan_assignments')
    .select(`
      *,
      meal_plans:meal_plan_id (*)
    `)
    .eq('client_id', id)
    .order('created_at', { ascending: false });

  if (mealPlanAssignmentsError) {
    console.error('Error fetching meal plan assignments:', mealPlanAssignmentsError);
  }

  // Fetch recent nutrition logs with food entries
  const { data: nutritionLogs, error: nutritionLogsError } = await supabase
    .from('nutrition_logs')
    .select(`
      *,
      food_log_entries (
        id,
        serving_size_g,
        calories,
        protein_g,
        carbs_g,
        fats_g,
        meal_type,
        foods:food_id (
          id,
          name,
          category,
          description
        )
      )
    `)
    .eq('client_id', id)
    .order('date', { ascending: false })
    .limit(10);

  if (nutritionLogsError) {
    console.error('Error fetching nutrition logs:', nutritionLogsError);
  }

  // Fetch attendance logs
  const { data: attendanceLogs, error: attendanceLogsError } = await supabase
    .from('attendance_logs')
    .select(`
      *,
      appointments:appointment_id (title, date, start_time)
    `)
    .eq('client_id', id)
    .order('check_in_time', { ascending: false })
    .limit(20);

  if (attendanceLogsError) {
    console.error('Error fetching attendance logs:', attendanceLogsError);
  }

  // Calculate attendance summary (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const { count: sessionsLast30Days } = await supabase
    .from('attendance_logs')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', id)
    .gte('check_in_time', thirtyDaysAgo.toISOString());

  return (
    <ClientDetail
      client={client}
      lead={lead}
      appointments={appointments || []}
      recurringSessions={recurringSessions || []}
      workoutAssignments={workoutAssignments || []}
      completionLogs={completionLogs || []}
      mealPlanAssignments={mealPlanAssignments || []}
      nutritionLogs={nutritionLogs || []}
      attendanceLogs={attendanceLogs || []}
      sessionsLast30Days={sessionsLast30Days || 0}
    />
  );
}

