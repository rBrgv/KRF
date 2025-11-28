import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { updateMealPlanSchema } from '@/lib/validations';

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

    // Fetch plan with items
    const { data: plan, error: planError } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('id', id)
      .single();

    if (planError || !plan) {
      return NextResponse.json(
        { error: 'Meal plan not found' },
        { status: 404 }
      );
    }

    // Fetch items
    const { data: items, error: itemsError } = await supabase
      .from('meal_plan_items')
      .select('*')
      .eq('meal_plan_id', id)
      .order('meal_type', { ascending: true })
      .order('order_index', { ascending: true });

    if (itemsError) {
      console.error('Error fetching meal plan items:', itemsError);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...plan,
        items: items || [],
      },
    });
  } catch (error: any) {
    console.error('Error in GET /api/nutrition/meal-plans/[id]:', error);
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
    const validatedData = updateMealPlanSchema.parse(body);

    const supabase = await createClient();

    const updateData: any = {};
    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.goal_type !== undefined) updateData.goal_type = validatedData.goal_type;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes || null;

    const { data, error } = await supabase
      .from('meal_plans')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating meal plan:', error);
      return NextResponse.json(
        { error: 'Failed to update meal plan', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Meal plan not found' },
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
    console.error('Error in PATCH /api/nutrition/meal-plans/[id]:', error);
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
      .from('client_meal_plan_assignments')
      .select('id')
      .eq('meal_plan_id', id)
      .limit(1);

    if (assignments && assignments.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete meal plan that is assigned to clients' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('meal_plans')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting meal plan:', error);
      return NextResponse.json(
        { error: 'Failed to delete meal plan', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error in DELETE /api/nutrition/meal-plans/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




