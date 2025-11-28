import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const manualPaymentSchema = z.object({
  event_registration_id: z.string().uuid(),
  payment_mode: z.enum(['cash', 'gpay', 'other']),
  amount_in_inr: z.number().int().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = manualPaymentSchema.parse(body);

    const supabase = await createClient();

    // Get registration
    const { data: registration, error: regError } = await supabase
      .from('event_registrations')
      .select('*')
      .eq('id', validatedData.event_registration_id)
      .single();

    if (regError || !registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    // Create manual payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert([
        {
          provider: 'manual',
          status: 'success',
          amount_in_inr: validatedData.amount_in_inr,
          currency: 'INR',
          raw_payload: {
            payment_mode: validatedData.payment_mode,
            marked_by: 'coach',
          },
        },
      ])
      .select()
      .single();

    if (paymentError) {
      console.error('Error creating payment:', paymentError);
      return NextResponse.json(
        { error: 'Failed to create payment record', details: paymentError.message },
        { status: 500 }
      );
    }

    // Update registration
    const { error: updateError } = await supabase
      .from('event_registrations')
      .update({
        status: 'confirmed',
        payment_id: payment.id,
        payment_mode: validatedData.payment_mode,
      })
      .eq('id', validatedData.event_registration_id);

    if (updateError) {
      console.error('Error updating registration:', updateError);
      return NextResponse.json(
        { error: 'Failed to update registration', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: payment });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST /api/payments/manual:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

