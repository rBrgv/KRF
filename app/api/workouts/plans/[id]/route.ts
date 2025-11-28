import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { updateWorkoutPlanSchema } from '@/lib/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const supabase = await createClient();

    // Fetch plan with days and exercises
    const { data: plan, error: planError } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('id', id)
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        { error: 'Workout plan not found' },
        { status: 404 }
      );
    }

    // Fetch days
    const { data: days, error: daysError } = await supabase
      .from('workout_plan_days')
      .select('*')
      .eq('workout_plan_id', id)
      .order('day_index', { ascending: true });

    if (daysError) {
      console.error('Error fetching days:', daysError);
    }

    // Fetch exercises for each day
    const daysWithExercises = await Promise.all(
      (days || []).map(async (day) => {
        const { data: exercises, error: exercisesError } = await supabase
          .from('workout_plan_exercises')
          .select(`
            *,
            exercises:exercise_id (*)
          `)
          .eq('workout_plan_day_id', day.id)
          .order('order_index', { ascending: true });

        if (exercisesError) {
          console.error('Error fetching exercises:', exercisesError);
        }

        return {
          ...day,
          exercises: exercises || [],
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        ...plan,
        days: daysWithExercises,
      },
    });
  } catch (error: any) {
    console.error('Error in GET /api/workouts/plans/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateWorkoutPlanSchema.parse(body);

    const supabase = await createClient();

    const updateData: any = {};
    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.goal_type !== undefined) updateData.goal_type = validatedData.goal_type;
    if (validatedData.level !== undefined) updateData.level = validatedData.level;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes || null;

    const { data, error } = await supabase
      .from('workout_plans')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating workout plan:', error);
      return NextResponse.json(
        { error: 'Failed to update workout plan', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Workout plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error in PATCH /api/workouts/plans/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const supabase = await createClient();

    // Check if plan is assigned to any clients
    const { data: assignments } = await supabase
      .from('client_workout_assignments')
      .select('id')
      .eq('workout_plan_id', id)
      .limit(1);

    if (assignments && assignments.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete workout plan that is assigned to clients' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('workout_plans')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting workout plan:', error);
      return NextResponse.json(
        { error: 'Failed to delete workout plan', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error in DELETE /api/workouts/plans/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




