import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { createAttendanceCheckInSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createAttendanceCheckInSchema.parse(body);

    const supabase = await createClient();

    // Check if there's already an open attendance log for this appointment
    if (validatedData.appointment_id) {
      const { data: existing } = await supabase
        .from('attendance_logs')
        .select('id')
        .eq('appointment_id', validatedData.appointment_id)
        .is('check_out_time', null)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: 'Client is already checked in for this appointment' },
          { status: 400 }
        );
      }
    }

    // Create check-in log
    const checkInTime = validatedData.check_in_time 
      ? new Date(validatedData.check_in_time).toISOString()
      : new Date().toISOString();

    const { data, error } = await supabase
      .from('attendance_logs')
      .insert([{
        client_id: validatedData.client_id,
        appointment_id: validatedData.appointment_id || null,
        check_in_time: checkInTime,
        source: validatedData.source,
        notes: validatedData.notes || null,
      }])
      .select(`
        *,
        clients:client_id (name),
        appointments:appointment_id (title, date, start_time)
      `)
      .single();

    if (error) {
      console.error('Error creating check-in:', error);
      return NextResponse.json(
        { error: 'Failed to check in', details: error.message },
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
    console.error('Error in POST /api/attendance/check-in:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




