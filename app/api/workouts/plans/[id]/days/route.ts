import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { createWorkoutPlanDaySchema, updateWorkoutPlanDaySchema } from '@/lib/validations';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: workoutPlanId } = await params;
    const body = await request.json();
    const validatedData = createWorkoutPlanDaySchema.parse({
      ...body,
      workout_plan_id: workoutPlanId,
    });

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('workout_plan_days')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      console.error('Error creating workout plan day:', error);
      return NextResponse.json(
        { error: 'Failed to create workout plan day', details: error.message },
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
    console.error('Error in POST /api/workouts/plans/[id]/days:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: workoutPlanId } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('workout_plan_days')
      .select('*')
      .eq('workout_plan_id', workoutPlanId)
      .order('day_index', { ascending: true });

    if (error) {
      console.error('Error fetching workout plan days:', error);
      return NextResponse.json(
        { error: 'Failed to fetch workout plan days', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    console.error('Error in GET /api/workouts/plans/[id]/days:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




