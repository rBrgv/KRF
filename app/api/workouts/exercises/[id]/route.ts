import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { updateExerciseSchema } from '@/lib/validations';

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
    const validatedData = updateExerciseSchema.parse(body);

    const supabase = await createClient();

    const updateData: any = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.category !== undefined) updateData.category = validatedData.category;
    if (validatedData.equipment !== undefined) updateData.equipment = validatedData.equipment;
    if (validatedData.muscle_group !== undefined) updateData.muscle_group = validatedData.muscle_group;
    if (validatedData.description !== undefined) updateData.description = validatedData.description || null;
    if (validatedData.demo_url !== undefined) updateData.demo_url = validatedData.demo_url || null;

    const { data, error } = await supabase
      .from('exercises')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating exercise:', error);
      return NextResponse.json(
        { error: 'Failed to update exercise', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Exercise not found' },
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
    console.error('Error in PATCH /api/workouts/exercises/[id]:', error);
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

    // Check if exercise is used in any workout plans
    const { data: usedInPlans } = await supabase
      .from('workout_plan_exercises')
      .select('id')
      .eq('exercise_id', id)
      .limit(1);

    if (usedInPlans && usedInPlans.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete exercise that is used in workout plans' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('exercises')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting exercise:', error);
      return NextResponse.json(
        { error: 'Failed to delete exercise', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error in DELETE /api/workouts/exercises/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




