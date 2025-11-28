import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    const payload = JSON.stringify(body);

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const supabase = await createClient();
    const event = body.event;
    const payment = body.payload?.payment?.entity;

    if (!payment) {
      return NextResponse.json({ received: true });
    }

    // Find payment by order_id
    const { data: paymentRecord, error: findError } = await supabase
      .from('payments')
      .select('*')
      .eq('provider_order_id', payment.order_id)
      .single();

    if (findError || !paymentRecord) {
      console.error('Payment record not found:', payment.order_id);
      return NextResponse.json({ received: true });
    }

    if (event === 'payment.captured' || event === 'payment.authorized') {
      // Payment successful
      const { error: updatePaymentError } = await supabase
        .from('payments')
        .update({
          status: 'success',
          provider_payment_id: payment.id,
          raw_payload: payment,
        })
        .eq('id', paymentRecord.id);

      if (updatePaymentError) {
        console.error('Error updating payment:', updatePaymentError);
      }

      // Find registration by payment_id or by order notes
      let registration = null;
      if (paymentRecord.raw_payload?.notes?.event_registration_id) {
        const { data } = await supabase
          .from('event_registrations')
          .select('id')
          .eq('id', paymentRecord.raw_payload.notes.event_registration_id)
          .single();
        registration = data;
      } else {
        const { data } = await supabase
          .from('event_registrations')
          .select('id')
          .eq('payment_id', paymentRecord.id)
          .single();
        registration = data;
      }

      if (registration) {
        await supabase
          .from('event_registrations')
          .update({
            status: 'confirmed',
            payment_id: paymentRecord.id,
          })
          .eq('id', registration.id);
      }
    } else if (event === 'payment.failed') {
      // Payment failed
      await supabase
        .from('payments')
        .update({
          status: 'failed',
          provider_payment_id: payment.id,
          raw_payload: payment,
        })
        .eq('id', paymentRecord.id);

      // Find registration by payment_id or by order notes
      let registration = null;
      if (paymentRecord.raw_payload?.notes?.event_registration_id) {
        const { data } = await supabase
          .from('event_registrations')
          .select('id')
          .eq('id', paymentRecord.raw_payload.notes.event_registration_id)
          .single();
        registration = data;
      } else {
        const { data } = await supabase
          .from('event_registrations')
          .select('id')
          .eq('payment_id', paymentRecord.id)
          .single();
        registration = data;
      }

      if (registration) {
        await supabase
          .from('event_registrations')
          .update({
            status: 'payment_failed',
          })
          .eq('id', registration.id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

