import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const workoutPlanSchema = z.object({
  client_id: z.string().uuid(),
  title: z.string().min(1),
  goal: z.string().optional(),
  experience_level: z.string().optional(),
  days_per_week: z.number().int().optional(),
  equipment: z.string().optional(),
  plan_data: z.any(), // JSON object
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = workoutPlanSchema.parse(body);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('workout_plans')
      .insert([
        {
          client_id: validatedData.client_id,
          title: validatedData.title,
          goal: validatedData.goal || null,
          experience_level: validatedData.experience_level || null,
          days_per_week: validatedData.days_per_week || null,
          equipment: validatedData.equipment || null,
          plan_data: validatedData.plan_data,
        },
      ])
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
    console.error('Error in POST /api/workout-plans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

