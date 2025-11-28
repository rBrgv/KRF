import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { updateNutritionLogSchema } from '@/lib/validations';

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
    const validatedData = updateNutritionLogSchema.parse(body);

    const supabase = await createClient();

    const updateData: any = {};
    if (validatedData.total_calories !== undefined) updateData.total_calories = validatedData.total_calories;
    if (validatedData.total_protein_g !== undefined) updateData.total_protein_g = validatedData.total_protein_g;
    if (validatedData.total_carbs_g !== undefined) updateData.total_carbs_g = validatedData.total_carbs_g;
    if (validatedData.total_fats_g !== undefined) updateData.total_fats_g = validatedData.total_fats_g;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes || null;
    if (validatedData.source !== undefined) updateData.source = validatedData.source;

    const { data, error } = await supabase
      .from('nutrition_logs')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        clients:client_id (name)
      `)
      .single();

    if (error) {
      console.error('Error updating nutrition log:', error);
      return NextResponse.json(
        { error: 'Failed to update nutrition log', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Nutrition log not found' },
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
    console.error('Error in PATCH /api/nutrition/logs/[id]:', error);
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
      .from('nutrition_logs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting nutrition log:', error);
      return NextResponse.json(
        { error: 'Failed to delete nutrition log', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error in DELETE /api/nutrition/logs/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




