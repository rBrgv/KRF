import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAppointmentSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createAppointmentSchema.parse(body);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('appointments')
      .insert([
        {
          client_id: validatedData.client_id || null,
          title: validatedData.title,
          date: validatedData.date,
          start_time: validatedData.start_time,
          end_time: validatedData.end_time || null,
          type: validatedData.type || null,
          notes: validatedData.notes || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating appointment:', error);
      return NextResponse.json(
        { error: 'Failed to create appointment', details: error.message },
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
    console.error('Error in POST /api/appointments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { getPaginationParams } = await import('@/lib/api/auth');
    const { page, limit } = getPaginationParams(request, 50, 100);
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const clientId = searchParams.get('client_id');
    const type = searchParams.get('type');

    const supabase = await createClient();

    let query = supabase
      .from('appointments')
      .select('*, clients:client_id(name)', { count: 'exact' })
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    // Apply filters
    if (date === 'today') {
      const today = new Date().toISOString().split('T')[0];
      query = query.eq('date', today);
    } else if (date) {
      // Check if it's a date string (YYYY-MM-DD) or a week start
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (dateRegex.test(date)) {
        // It's a specific date, get all appointments from that date onwards for the week
        const weekEnd = new Date(date);
        weekEnd.setDate(weekEnd.getDate() + 6);
        query = query.gte('date', date).lte('date', weekEnd.toISOString().split('T')[0]);
      } else {
        query = query.eq('date', date);
      }
    }

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    if (type) {
      query = query.eq('type', type);
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching appointments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch appointments', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: any) {
    console.error('Error in GET /api/appointments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

