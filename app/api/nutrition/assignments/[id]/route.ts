import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { updateClientMealPlanAssignmentSchema } from '@/lib/validations';

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
    const validatedData = updateClientMealPlanAssignmentSchema.parse(body);

    const supabase = await createClient();

    const updateData: any = {};
    if (validatedData.start_date !== undefined) updateData.start_date = validatedData.start_date;
    if (validatedData.end_date !== undefined) updateData.end_date = validatedData.end_date || null;
    if (validatedData.is_active !== undefined) updateData.is_active = validatedData.is_active;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes || null;

    const { data, error } = await supabase
      .from('client_meal_plan_assignments')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        meal_plans:meal_plan_id (*)
      `)
      .single();

    if (error) {
      console.error('Error updating assignment:', error);
      return NextResponse.json(
        { error: 'Failed to update assignment', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Assignment not found' },
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
    console.error('Error in PATCH /api/nutrition/assignments/[id]:', error);
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

    const { error } = await supabase
      .from('client_meal_plan_assignments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting assignment:', error);
      return NextResponse.json(
        { error: 'Failed to delete assignment', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error in DELETE /api/nutrition/assignments/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




