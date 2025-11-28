import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const updateRecurringSessionSchema = z.object({
  days_of_week: z.array(z.number().min(0).max(6)).min(1).optional(),
  start_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  duration_minutes: z.number().min(15).max(480).optional(),
  title: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  is_active: z.boolean().optional(),
});

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
    const validatedData = updateRecurringSessionSchema.parse(body);

    const supabase = await createClient();

    const updateData: any = {};
    if (validatedData.days_of_week !== undefined) updateData.days_of_week = validatedData.days_of_week;
    if (validatedData.start_time !== undefined) updateData.start_time = validatedData.start_time;
    if (validatedData.duration_minutes !== undefined) updateData.duration_minutes = validatedData.duration_minutes;
    if (validatedData.title !== undefined) updateData.title = validatedData.title || null;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes || null;
    if (validatedData.is_active !== undefined) updateData.is_active = validatedData.is_active;

    const { data, error } = await supabase
      .from('recurring_sessions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating recurring session:', error);
      return NextResponse.json(
        { error: 'Failed to update recurring session', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Recurring session not found' },
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
    console.error('Error in PATCH /api/recurring-sessions/[id]:', error);
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
      .from('recurring_sessions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting recurring session:', error);
      return NextResponse.json(
        { error: 'Failed to delete recurring session', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error in DELETE /api/recurring-sessions/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




