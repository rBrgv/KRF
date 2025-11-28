import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { createExerciseSchema, updateExerciseSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createExerciseSchema.parse(body);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('exercises')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      console.error('Error creating exercise:', error);
      return NextResponse.json(
        { error: 'Failed to create exercise', details: error.message },
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
    console.error('Error in POST /api/workouts/exercises:', error);
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
    const category = searchParams.get('category');
    const equipment = searchParams.get('equipment');
    const muscleGroup = searchParams.get('muscle_group');
    const search = searchParams.get('search');

    const supabase = await createClient();

    let query = supabase
      .from('exercises')
      .select('*')
      .order('name', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }
    if (equipment) {
      query = query.eq('equipment', equipment);
    }
    if (muscleGroup) {
      query = query.eq('muscle_group', muscleGroup);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching exercises:', error);
      return NextResponse.json(
        { error: 'Failed to fetch exercises', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    console.error('Error in GET /api/workouts/exercises:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




