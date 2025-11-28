import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { updateWorkoutPlanDaySchema } from '@/lib/validations';

export async function PATCH(
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
    const validatedData = updateWorkoutPlanDaySchema.parse(body);

    const supabase = await createClient();

    const updateData: any = {};
    if (validatedData.day_index !== undefined) updateData.day_index = validatedData.day_index;
    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes || null;

    const { data, error } = await supabase
      .from('workout_plan_days')
      .update(updateData)
      .eq('id', dayId)
      .select()
      .single();

    if (error) {
      console.error('Error updating workout plan day:', error);
      return NextResponse.json(
        { error: 'Failed to update workout plan day', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Workout plan day not found' },
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
    console.error('Error in PATCH /api/workouts/plans/days/[dayId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const { error } = await supabase
      .from('workout_plan_days')
      .delete()
      .eq('id', dayId);

    if (error) {
      console.error('Error deleting workout plan day:', error);
      return NextResponse.json(
        { error: 'Failed to delete workout plan day', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error in DELETE /api/workouts/plans/days/[dayId]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




