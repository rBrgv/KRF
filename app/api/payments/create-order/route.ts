import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay with validation
const getRazorpayInstance = () => {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured. Please set NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[Payment Order] Full request body:', JSON.stringify(body, null, 2));
    
    const { event_registration_id, amount_in_inr } = body;

    console.log('[Payment Order] Request received:', {
      event_registration_id,
      amount_in_inr,
      event_registration_id_type: typeof event_registration_id,
      amount_in_inr_type: typeof amount_in_inr,
      hasKeyId: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
    });

    if (!event_registration_id || !amount_in_inr) {
      console.error('[Payment Order] Missing required fields:', {
        hasRegistrationId: !!event_registration_id,
        hasAmount: !!amount_in_inr,
        registrationId: event_registration_id,
        amount: amount_in_inr,
      });
      return NextResponse.json(
        { 
          error: 'event_registration_id and amount_in_inr are required',
          received: {
            event_registration_id: event_registration_id || null,
            amount_in_inr: amount_in_inr || null,
          }
        },
        { status: 400 }
      );
    }

    // Validate amount - convert to number if string
    let amount = amount_in_inr;
    if (typeof amount_in_inr === 'string') {
      amount = parseFloat(amount_in_inr);
      if (isNaN(amount)) {
        console.error('[Payment Order] Invalid amount (cannot parse):', amount_in_inr);
        return NextResponse.json(
          { 
            error: 'amount_in_inr must be a valid number',
            received: amount_in_inr,
            receivedType: typeof amount_in_inr,
          },
          { status: 400 }
        );
      }
    }

    if (typeof amount !== 'number' || isNaN(amount)) {
      console.error('[Payment Order] Invalid amount (not a number):', {
        amount,
        original: amount_in_inr,
        type: typeof amount,
      });
      return NextResponse.json(
        { 
          error: 'amount_in_inr must be a valid number',
          received: amount_in_inr,
          receivedType: typeof amount_in_inr,
          parsed: amount,
        },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      console.error('[Payment Order] Invalid amount (must be positive):', {
        amount,
        original: amount_in_inr,
      });
      return NextResponse.json(
        { 
          error: 'amount_in_inr must be greater than 0',
          received: amount_in_inr,
          parsed: amount,
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get registration and event details
    console.log('[Payment Order] Fetching registration:', event_registration_id);
    const { data: registration, error: regError } = await supabase
      .from('event_registrations')
      .select('*, events:event_id(title)')
      .eq('id', event_registration_id)
      .single();

    if (regError) {
      console.error('[Payment Order] Registration fetch error:', regError);
      return NextResponse.json(
        { error: 'Registration not found', details: regError.message },
        { status: 404 }
      );
    }

    if (!registration) {
      console.error('[Payment Order] Registration not found for ID:', event_registration_id);
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    console.log('[Payment Order] Registration found:', {
      id: registration.id,
      event_id: registration.event_id,
      status: registration.status,
    });

    // Initialize Razorpay
    const razorpay = getRazorpayInstance();

    // Create Razorpay order
    const amountInPaise = Math.round(amount * 100); // Convert to paise
    console.log('[Payment Order] Amount conversion:', {
      amountInINR: amount,
      amountInPaise: amountInPaise,
    });

    // Generate receipt (max 40 chars for Razorpay)
    // Use first 8 chars of registration ID + timestamp (last 8 digits)
    const regIdShort = event_registration_id.substring(0, 8);
    const timestamp = Date.now().toString().slice(-8);
    const receipt = `reg${regIdShort}${timestamp}`;
    
    // Ensure receipt is max 40 chars
    const receiptFinal = receipt.length > 40 ? receipt.substring(0, 40) : receipt;

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptFinal,
      notes: {
        event_registration_id: event_registration_id,
      },
    };

    console.log('[Payment Order] Creating Razorpay order with options:', {
      amount: options.amount,
      currency: options.currency,
      receipt: options.receipt,
      amountType: typeof options.amount,
    });

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(options);
      console.log('[Payment Order] Razorpay order created:', razorpayOrder.id);
    } catch (razorpayError: any) {
      console.error('[Payment Order] Razorpay API error:', {
        message: razorpayError.message,
        description: razorpayError.description,
        error: razorpayError.error,
        statusCode: razorpayError.statusCode,
        field: razorpayError.field,
        reason: razorpayError.reason,
        fullError: JSON.stringify(razorpayError, Object.getOwnPropertyNames(razorpayError)),
      });
      throw razorpayError;
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert([
        {
          provider: 'razorpay',
          provider_order_id: razorpayOrder.id,
          status: 'created',
          amount_in_inr: amount_in_inr,
          currency: 'INR',
          raw_payload: razorpayOrder,
        },
      ])
      .select()
      .single();

    if (paymentError) {
      console.error('Error creating payment record:', paymentError);
      return NextResponse.json(
        { error: 'Failed to create payment record', details: paymentError.message },
        { status: 500 }
      );
    }

    // Link payment to registration (optional, will be updated on success)
    await supabase
      .from('event_registrations')
      .update({ payment_id: payment.id })
      .eq('id', event_registration_id);

    return NextResponse.json({
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      event_title: registration.events?.title,
      payment_id: payment.id,
    });
  } catch (error: any) {
    console.error('[Payment Order] Error creating Razorpay order:', {
      message: error.message,
      description: error.description,
      field: error.field,
      source: error.source,
      step: error.step,
      reason: error.reason,
      metadata: error.metadata,
      statusCode: error.statusCode,
      error: error.error,
      stack: error.stack,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });

    // Return more detailed error information
    const errorMessage = error.description || error.error?.description || error.message || 'Failed to create payment order';
    const errorDetails = {
      error: errorMessage,
      ...(error.field && { field: error.field }),
      ...(error.reason && { reason: error.reason }),
      ...(error.statusCode && { statusCode: error.statusCode }),
      ...(error.error && { razorpayError: error.error }),
    };

    return NextResponse.json(
      errorDetails,
      { status: error.statusCode || 500 }
    );
  }
}
