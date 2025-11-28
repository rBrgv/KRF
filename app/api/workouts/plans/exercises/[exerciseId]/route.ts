import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { updateWorkoutPlanExerciseSchema } from '@/lib/validations';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { exerciseId } = await params;
    const body = await request.json();
    const validatedData = updateWorkoutPlanExerciseSchema.parse(body);

    const supabase = await createClient();

    const updateData: any = {};
    if (validatedData.exercise_id !== undefined) updateData.exercise_id = validatedData.exercise_id;
    if (validatedData.sets !== undefined) updateData.sets = validatedData.sets;
    if (validatedData.reps !== undefined) updateData.reps = validatedData.reps;
    if (validatedData.rest_seconds !== undefined) updateData.rest_seconds = validatedData.rest_seconds;
    if (validatedData.order_index !== undefined) updateData.order_index = validatedData.order_index;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes || null;

    const { data, error } = await supabase
      .from('workout_plan_exercises')
      .update(updateData)
      .eq('id', exerciseId)
      .select(`
        *,
        exercises:exercise_id (*)
      `)
      .single();

    if (error) {
      console.error('Error updating workout plan exercise:', error);
      return NextResponse.json(
        { error: 'Failed to update workout plan exercise', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Workout plan exercise not found' },
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
    console.error('Error in PATCH /api/workouts/plans/exercises/[exerciseId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ exerciseId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { exerciseId } = await params;
    const supabase = await createClient();

    const { error } = await supabase
      .from('workout_plan_exercises')
      .delete()
      .eq('id', exerciseId);

    if (error) {
      console.error('Error deleting workout plan exercise:', error);
      return NextResponse.json(
        { error: 'Failed to delete workout plan exercise', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error in DELETE /api/workouts/plans/exercises/[exerciseId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




