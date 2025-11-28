import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { createAttendanceCheckOutSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createAttendanceCheckOutSchema.parse(body);

    const supabase = await createClient();

    // Fetch the attendance log
    const { data: log, error: fetchError } = await supabase
      .from('attendance_logs')
      .select('*')
      .eq('id', validatedData.attendance_log_id)
      .single();

    if (fetchError || !log) {
      return NextResponse.json(
        { error: 'Attendance log not found' },
        { status: 404 }
      );
    }

    if (log.check_out_time) {
      return NextResponse.json(
        { error: 'Client is already checked out' },
        { status: 400 }
      );
    }

    // Update check-out time
    const checkOutTime = validatedData.check_out_time
      ? new Date(validatedData.check_out_time).toISOString()
      : new Date().toISOString();

    const updateData: any = {
      check_out_time: checkOutTime,
    };
    if (validatedData.notes !== undefined) {
      updateData.notes = validatedData.notes || null;
    }

    const { data, error } = await supabase
      .from('attendance_logs')
      .update(updateData)
      .eq('id', validatedData.attendance_log_id)
      .select(`
        *,
        clients:client_id (name),
        appointments:appointment_id (title, date, start_time)
      `)
      .single();

    if (error) {
      console.error('Error updating check-out:', error);
      return NextResponse.json(
        { error: 'Failed to check out', details: error.message },
        { status: 500 }
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
    console.error('Error in POST /api/attendance/check-out:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




