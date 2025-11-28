import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { createWorkoutPlanSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createWorkoutPlanSchema.parse(body);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('workout_plans')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      console.error('Error creating workout plan:', error);
      return NextResponse.json(
        { error: 'Failed to create workout plan', details: error.message },
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
    console.error('Error in POST /api/workouts/plans:', error);
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
    const goalType = searchParams.get('goal_type');
    const level = searchParams.get('level');
    const search = searchParams.get('search');

    const supabase = await createClient();

    let query = supabase
      .from('workout_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (goalType) {
      query = query.eq('goal_type', goalType);
    }
    if (level) {
      query = query.eq('level', level);
    }
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching workout plans:', error);
      return NextResponse.json(
        { error: 'Failed to fetch workout plans', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    console.error('Error in GET /api/workouts/plans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




