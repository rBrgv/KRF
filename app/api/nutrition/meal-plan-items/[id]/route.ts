import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { updateMealPlanItemSchema } from '@/lib/validations';

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
    const validatedData = updateMealPlanItemSchema.parse(body);

    const supabase = await createClient();

    const updateData: any = {};
    if (validatedData.meal_type !== undefined) updateData.meal_type = validatedData.meal_type;
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.calories !== undefined) updateData.calories = validatedData.calories;
    if (validatedData.protein_g !== undefined) updateData.protein_g = validatedData.protein_g;
    if (validatedData.carbs_g !== undefined) updateData.carbs_g = validatedData.carbs_g;
    if (validatedData.fats_g !== undefined) updateData.fats_g = validatedData.fats_g;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes || null;
    if (validatedData.order_index !== undefined) updateData.order_index = validatedData.order_index;

    const { data, error } = await supabase
      .from('meal_plan_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating meal plan item:', error);
      return NextResponse.json(
        { error: 'Failed to update meal plan item', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Meal plan item not found' },
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
    console.error('Error in PATCH /api/nutrition/meal-plan-items/[id]:', error);
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
      .from('meal_plan_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting meal plan item:', error);
      return NextResponse.json(
        { error: 'Failed to delete meal plan item', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error in DELETE /api/nutrition/meal-plan-items/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




