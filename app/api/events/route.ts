import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const eventSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  image_url: z.union([
    z.string().url(),
    z.literal(''),
    z.null(),
    z.undefined(),
  ]).optional().nullable().transform((val) => (val === '' || val === undefined ? null : val)),
  start_datetime: z.string().datetime(),
  end_datetime: z.string().datetime().optional().nullable(),
  price_in_inr: z.number().int().min(0),
  max_capacity: z.number().int().positive().optional().nullable(),
  is_active: z.boolean().default(true),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('[Event API] Creating event with data:', JSON.stringify(body, null, 2));
    } catch (parseError: any) {
      console.error('[Event API] Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body', message: parseError.message },
        { status: 400 }
      );
    }
    
    // Validate data
    let validatedData;
    try {
      // Clean up image_url - convert empty string to null
      if (body.image_url === '' || body.image_url === null || body.image_url === undefined) {
        body.image_url = null;
      }
      
      validatedData = eventSchema.parse(body);
      console.log('[Event API] Validated data:', JSON.stringify(validatedData, null, 2));
    } catch (validationError: any) {
      if (validationError.name === 'ZodError') {
        console.error('[Event API] Validation error:', JSON.stringify(validationError.errors, null, 2));
        return NextResponse.json(
          { 
            error: 'Validation error', 
            details: validationError.errors,
            message: validationError.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
          },
          { status: 400 }
        );
      }
      throw validationError;
    }

    const supabase = await createClient();

    // Check if slug already exists (only if not updating existing event)
    const { data: existingEvent, error: slugCheckError } = await supabase
      .from('events')
      .select('id, title, slug')
      .eq('slug', validatedData.slug)
      .maybeSingle();

    // If we found an existing event with this slug, it's a duplicate
    if (existingEvent) {
      console.error('[Event API] Slug already exists:', {
        slug: validatedData.slug,
        existingEventId: existingEvent.id,
        existingEventTitle: existingEvent.title,
      });
      return NextResponse.json(
        { 
          error: 'An event with this slug already exists',
          message: `The slug "${validatedData.slug}" is already in use by event "${existingEvent.title}". Please choose a different slug.`,
          code: 'DUPLICATE_SLUG',
          existingEvent: {
            id: existingEvent.id,
            title: existingEvent.title,
          },
        },
        { status: 400 }
      );
    }

    // If there was an error checking (other than "not found"), log it but continue
    if (slugCheckError && slugCheckError.code !== 'PGRST116') {
      console.warn('[Event API] Error checking slug (continuing anyway):', slugCheckError);
    }

    // Remove image_url if it's null (column might not exist in database)
    const { image_url, ...restData } = validatedData;
    const insertData: Record<string, any> = { ...restData };
    if (image_url !== null && image_url !== undefined && image_url !== '') {
      insertData.image_url = image_url;
    }

    console.log('[Event API] Inserting data (image_url removed if null):', JSON.stringify(insertData, null, 2));

    const { data, error } = await supabase
      .from('events')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('[Event API] Error creating event:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });

      // Check if it's a unique constraint violation (slug)
      if (error.code === '23505' || error.message?.includes('unique') || error.message?.includes('duplicate')) {
        return NextResponse.json(
          { 
            error: 'An event with this slug already exists',
            message: `The slug "${validatedData.slug}" is already in use. Please choose a different slug.`,
            code: 'DUPLICATE_SLUG',
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { 
          error: 'Failed to create event', 
          details: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    console.log('[Event API] Event created successfully:', data.id);
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error('[Event API] TOP LEVEL Exception in POST /api/events:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      error: String(error),
      type: typeof error,
      constructor: error?.constructor?.name,
    });

    // Handle specific error types
    if (error?.name === 'ZodError') {
      console.error('[Event API] Validation error:', error.errors);
      return NextResponse.json(
        { 
          error: 'Validation error', 
          details: error.errors,
          message: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
        },
        { status: 400 }
      );
    }

    // If it's already a Response (from auth), try to convert it
    if (error instanceof Response) {
      try {
        const status = error.status;
        const errorData = await error.json().catch(() => ({ error: 'Error' }));
        return NextResponse.json(errorData, { status });
      } catch (e) {
        return NextResponse.json({ error: 'Authentication error' }, { status: 401 });
      }
    }

    // Return detailed error in development, generic in production
    const isDev = process.env.NODE_ENV === 'development';
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: isDev ? (error?.message || 'An unexpected error occurred') : 'An unexpected error occurred',
        ...(isDev && { stack: error?.stack }),
      },
      { status: 500 }
    );
  }
}

