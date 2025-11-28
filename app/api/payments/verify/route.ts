import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      registration_id,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification data' },
        { status: 400 }
      );
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(text)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature', success: false },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Find payment by order_id
    const { data: paymentRecord } = await supabase
      .from('payments')
      .select('*')
      .eq('provider_order_id', razorpay_order_id)
      .single();

    if (paymentRecord) {
      // Update payment status
      await supabase
        .from('payments')
        .update({
          status: 'success',
          provider_payment_id: razorpay_payment_id,
          razorpay_signature: razorpay_signature,
        })
        .eq('id', paymentRecord.id);

      // Update registration if registration_id provided
      if (registration_id) {
        await supabase
          .from('event_registrations')
          .update({
            status: 'confirmed',
            payment_id: paymentRecord.id,
          })
          .eq('id', registration_id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Payment verification failed', success: false },
      { status: 500 }
    );
  }
}
