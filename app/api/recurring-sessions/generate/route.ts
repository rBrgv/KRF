import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { client_id, weeks_ahead = 4 } = body;

    const supabase = await createClient();

    // Fetch active recurring sessions
    let query = supabase
      .from('recurring_sessions')
      .select('*')
      .eq('is_active', true);

    if (client_id) {
      query = query.eq('client_id', client_id);
    }

    const { data: sessions, error: sessionsError } = await query;

    if (sessionsError) {
      console.error('Error fetching recurring sessions:', sessionsError);
      return NextResponse.json(
        { error: 'Failed to fetch recurring sessions', details: sessionsError.message },
        { status: 500 }
      );
    }

    if (!sessions || sessions.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No active recurring sessions found',
        generated: 0 
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + (weeks_ahead * 7));

    const appointmentsToCreate: any[] = [];

    // Generate appointments for each recurring session
    for (const session of sessions) {
      const [hours, minutes] = session.start_time.split(':').map(Number);
      const durationMs = session.duration_minutes * 60000;

      // Generate appointments for the specified weeks ahead
      for (let week = 0; week < weeks_ahead; week++) {
        for (const dayOfWeek of session.days_of_week) {
          const appointmentDate = new Date(today);
          const daysUntilDay = (dayOfWeek - today.getDay() + 7) % 7;
          appointmentDate.setDate(today.getDate() + daysUntilDay + (week * 7));

          // Skip if date is in the past or beyond end date
          if (appointmentDate < today || appointmentDate > endDate) {
            continue;
          }

          // Check if appointment already exists
          const dateStr = appointmentDate.toISOString().split('T')[0];
          const { data: existing } = await supabase
            .from('appointments')
            .select('id')
            .eq('client_id', session.client_id)
            .eq('date', dateStr)
            .eq('start_time', session.start_time)
            .single();

          if (existing) {
            continue; // Skip if appointment already exists
          }

          // Calculate end time
          const startDateTime = new Date(appointmentDate);
          startDateTime.setHours(hours, minutes, 0, 0);
          const endDateTime = new Date(startDateTime.getTime() + durationMs);
          const endTime = `${endDateTime.getHours().toString().padStart(2, '0')}:${endDateTime.getMinutes().toString().padStart(2, '0')}`;

          appointmentsToCreate.push({
            client_id: session.client_id,
            title: session.title || `Session - ${DAYS[dayOfWeek]}`,
            date: dateStr,
            start_time: session.start_time,
            end_time: endTime,
            type: 'recurring',
            notes: session.notes,
          });
        }
      }
    }

    if (appointmentsToCreate.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No new appointments to generate (all may already exist)',
        generated: 0 
      });
    }

    // Insert appointments in batches
    const { data: createdAppointments, error: insertError } = await supabase
      .from('appointments')
      .insert(appointmentsToCreate)
      .select();

    if (insertError) {
      console.error('Error creating appointments:', insertError);
      return NextResponse.json(
        { error: 'Failed to create appointments', details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      generated: createdAppointments?.length || 0,
      appointments: createdAppointments 
    });
  } catch (error: any) {
    console.error('Error in POST /api/recurring-sessions/generate:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




