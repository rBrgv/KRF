import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { createWorkoutCompletionLogSchema, updateWorkoutCompletionLogSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createWorkoutCompletionLogSchema.parse(body);

    const supabase = await createClient();

    // Check if log already exists for this client/day/date
    const { data: existing } = await supabase
      .from('workout_completion_logs')
      .select('id')
      .eq('client_id', validatedData.client_id)
      .eq('workout_plan_day_id', validatedData.workout_plan_day_id)
      .eq('date', validatedData.date)
      .single();

    if (existing) {
      // Update existing log
      const updateData: any = {};
      if (validatedData.status !== undefined) updateData.status = validatedData.status;
      if (validatedData.notes !== undefined) updateData.notes = validatedData.notes || null;

      const { data, error } = await supabase
        .from('workout_completion_logs')
        .update(updateData)
        .eq('id', existing.id)
        .select(`
          *,
          workout_plan_days:workout_plan_day_id (*),
          workout_plans:workout_plan_id (*)
        `)
        .single();

      if (error) {
        console.error('Error updating completion log:', error);
        return NextResponse.json(
          { error: 'Failed to update completion log', details: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data }, { status: 200 });
    }

    // Create new log
    const { data, error } = await supabase
      .from('workout_completion_logs')
      .insert([validatedData])
      .select(`
        *,
        workout_plan_days:workout_plan_day_id (*),
        workout_plans:workout_plan_id (*)
      `)
      .single();

    if (error) {
      console.error('Error creating completion log:', error);
      return NextResponse.json(
        { error: 'Failed to create completion log', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST /api/workouts/completion-logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { getPaginationParams } = await import('@/lib/api/auth');
    const { limit } = getPaginationParams(request, 50, 100);
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');
    const workoutPlanId = searchParams.get('workout_plan_id');
    const date = searchParams.get('date');

    const supabase = await createClient();

    let query = supabase
      .from('workout_completion_logs')
      .select(`
        *,
        workout_plan_days:workout_plan_day_id (*),
        workout_plans:workout_plan_id (*)
      `)
      .order('date', { ascending: false })
      .limit(limit);

    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    if (workoutPlanId) {
      query = query.eq('workout_plan_id', workoutPlanId);
    }
    if (date) {
      query = query.eq('date', date);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching completion logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch completion logs', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    console.error('Error in GET /api/workouts/completion-logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


