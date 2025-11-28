import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { createClientWorkoutAssignmentSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createClientWorkoutAssignmentSchema.parse(body);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('client_workout_assignments')
      .insert([validatedData])
      .select(`
        *,
        workout_plans:workout_plan_id (*)
      `)
      .single();

    if (error) {
      console.error('Error creating client workout assignment:', error);
      return NextResponse.json(
        { error: 'Failed to create assignment', details: error.message },
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
    console.error('Error in POST /api/workouts/assignments:', error);
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

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');
    const isActive = searchParams.get('is_active');

    const supabase = await createClient();

    let query = supabase
      .from('client_workout_assignments')
      .select(`
        *,
        workout_plans:workout_plan_id (
          *,
          workout_plan_days (
            *,
            workout_plan_exercises (
              *,
              exercises:exercise_id (*)
            )
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching assignments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch assignments', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    console.error('Error in GET /api/workouts/assignments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


