import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const recurringSessionSchema = z.object({
  client_id: z.string().uuid(),
  days_of_week: z.array(z.number().min(0).max(6)).min(1, 'At least one day must be selected'),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  duration_minutes: z.number().min(15).max(480),
  title: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  is_active: z.boolean().optional().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = recurringSessionSchema.parse(body);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('recurring_sessions')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      console.error('Error creating recurring session:', error);
      return NextResponse.json(
        { error: 'Failed to create recurring session', details: error.message },
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
    console.error('Error in POST /api/recurring-sessions:', error);
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
    const clientId = searchParams.get('client_id');

    const supabase = await createClient();

    let query = supabase
      .from('recurring_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching recurring sessions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch recurring sessions', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error: any) {
    console.error('Error in GET /api/recurring-sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




