import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateAppointmentSchema } from '@/lib/validations';
import { isValidTimeSlot, calculateEndTime } from '@/lib/booking-slots';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching appointment:', error);
      return NextResponse.json(
        { error: 'Failed to fetch appointment', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error in GET /api/appointments/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateAppointmentSchema.parse(body);

    // Get existing appointment to check date if start_time is being updated
    const supabase = await createClient();
    const { data: existingAppointment } = await supabase
      .from('appointments')
      .select('date, start_time')
      .eq('id', id)
      .single();

    const appointmentDate = validatedData.date || existingAppointment?.date;

    // Validate time slot if start_time is being updated
    if (validatedData.start_time && appointmentDate) {
      if (!isValidTimeSlot(appointmentDate, validatedData.start_time)) {
        return NextResponse.json(
          { error: 'Invalid time slot. Please select a valid booking slot.' },
          { status: 400 }
        );
      }
    }

    // Build update object
    const updateData: any = {};
    if (validatedData.client_id !== undefined) {
      updateData.client_id = validatedData.client_id || null;
    }
    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.date !== undefined) updateData.date = validatedData.date;
    if (validatedData.start_time !== undefined) {
      updateData.start_time = validatedData.start_time;
      // Auto-calculate end time (20 minutes after start)
      updateData.end_time = calculateEndTime(validatedData.start_time);
    } else if (validatedData.end_time !== undefined) {
      // Only allow manual end_time if start_time wasn't changed
      updateData.end_time = validatedData.end_time || null;
    }
    if (validatedData.type !== undefined) updateData.type = validatedData.type || null;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes || null;

    const { data, error } = await supabase
      .from('appointments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating appointment:', error);
      return NextResponse.json(
        { error: 'Failed to update appointment', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Appointment not found' },
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
    console.error('Error in PATCH /api/appointments/[id]:', error);
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
    const { id } = await params;
    const supabase = await createClient();

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting appointment:', error);
      return NextResponse.json(
        { error: 'Failed to delete appointment', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/appointments/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

