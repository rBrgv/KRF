import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { createWorkoutPlanExerciseSchema, updateWorkoutPlanExerciseSchema } from '@/lib/validations';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ dayId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { dayId } = await params;
    const body = await request.json();
    const validatedData = createWorkoutPlanExerciseSchema.parse({
      ...body,
      workout_plan_day_id: dayId,
    });

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('workout_plan_exercises')
      .insert([validatedData])
      .select(`
        *,
        exercises:exercise_id (*)
      `)
      .single();

    if (error) {
      console.error('Error creating workout plan exercise:', error);
      return NextResponse.json(
        { error: 'Failed to create workout plan exercise', details: error.message },
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
    console.error('Error in POST /api/workouts/plans/days/[dayId]/exercises:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dayId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { dayId } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('workout_plan_exercises')
      .select(`
        *,
        exercises:exercise_id (*)
      `)
      .eq('workout_plan_day_id', dayId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching workout plan exercises:', error);
      return NextResponse.json(
        { error: 'Failed to fetch workout plan exercises', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    console.error('Error in GET /api/workouts/plans/days/[dayId]/exercises:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




