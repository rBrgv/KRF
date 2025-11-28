import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const eventUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  image_url: z.union([
    z.string().url(),
    z.literal(''),
    z.null(),
    z.undefined(),
  ]).optional().nullable().transform((val) => (val === '' || val === undefined ? null : val)),
  start_datetime: z.string().datetime().optional(),
  end_datetime: z.string().datetime().optional().nullable(),
  price_in_inr: z.number().int().min(0).optional(),
  max_capacity: z.number().int().positive().optional().nullable(),
  is_active: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = eventUpdateSchema.parse(body);

    // Remove image_url if it's null or empty (column might not exist in database)
    const { image_url, ...restData } = validatedData;
    const updateData: Record<string, any> = { ...restData };
    if (image_url !== null && image_url !== undefined && image_url !== '') {
      updateData.image_url = image_url;
    }

    console.log('[Event Update API] Updating event with data:', JSON.stringify(updateData, null, 2));

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      return NextResponse.json(
        { error: 'Failed to update event', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error in PATCH /api/events/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

