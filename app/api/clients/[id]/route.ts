import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateClientSchema } from '@/lib/validations';
import { getCurrentUser } from '@/lib/auth';

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
    const validatedData = updateClientSchema.parse(body);

    const supabase = await createClient();

    // Build update object
    const updateData: any = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.email !== undefined) updateData.email = validatedData.email || null;
    if (validatedData.phone !== undefined) updateData.phone = validatedData.phone;
    if (validatedData.goal !== undefined) updateData.goal = validatedData.goal || null;
    if (validatedData.program_start_date !== undefined) updateData.program_start_date = validatedData.program_start_date || null;
    if (validatedData.subscription_type !== undefined) updateData.subscription_type = validatedData.subscription_type || null;
    if (validatedData.program_type !== undefined) updateData.program_type = validatedData.program_type || null;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes || null;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('clients')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating client:', error);
      return NextResponse.json(
        { error: 'Failed to update client', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Client not found' },
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
    console.error('Error in PATCH /api/clients/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
