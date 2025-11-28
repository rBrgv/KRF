import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function GET(request: NextRequest) {
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({
        error: 'Keys not configured',
        keyId: keyId ? 'SET' : 'NOT SET',
        keySecret: keySecret ? 'SET' : 'NOT SET',
      }, { status: 500 });
    }

    // Test Razorpay initialization
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Try to create a test order
    const testOrder = await razorpay.orders.create({
      amount: 10000, // ₹100
      currency: 'INR',
      receipt: `test_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Razorpay keys are working',
      orderId: testOrder.id,
      keyIdPrefix: keyId.substring(0, 10) + '...',
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Razorpay test failed',
      message: error.message,
      description: error.description,
      statusCode: error.statusCode,
    }, { status: 500 });
  }
}

