import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { updateAttendanceLogSchema } from '@/lib/validations';

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
    const validatedData = updateAttendanceLogSchema.parse(body);

    const supabase = await createClient();

    const updateData: any = {};
    if (validatedData.check_in_time !== undefined) {
      updateData.check_in_time = new Date(validatedData.check_in_time).toISOString();
    }
    if (validatedData.check_out_time !== undefined) {
      updateData.check_out_time = validatedData.check_out_time 
        ? new Date(validatedData.check_out_time).toISOString()
        : null;
    }
    if (validatedData.notes !== undefined) {
      updateData.notes = validatedData.notes || null;
    }
    if (validatedData.source !== undefined) {
      updateData.source = validatedData.source;
    }

    const { data, error } = await supabase
      .from('attendance_logs')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        clients:client_id (name),
        appointments:appointment_id (title, date, start_time)
      `)
      .single();

    if (error) {
      console.error('Error updating attendance log:', error);
      return NextResponse.json(
        { error: 'Failed to update attendance log', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Attendance log not found' },
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
    console.error('Error in PATCH /api/attendance/logs/[id]:', error);
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
      .from('attendance_logs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting attendance log:', error);
      return NextResponse.json(
        { error: 'Failed to delete attendance log', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Error in DELETE /api/attendance/logs/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




