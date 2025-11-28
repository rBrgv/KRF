import { NextRequest, NextResponse } from 'next/server';
import { sendWhatsApp } from '@/lib/whatsapp';
import { requireAdminOrTrainer } from '@/lib/api/auth';

/**
 * Test WhatsApp integration
 * POST /api/whatsapp/test
 * Body: { phone: string, message?: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authResult = await requireAdminOrTrainer();
    if (authResult instanceof Response) {
      return authResult;
    }

    const body = await request.json();
    const { phone, message } = body;

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Check environment variables
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    const diagnostics = {
      accessTokenConfigured: !!accessToken,
      accessTokenLength: accessToken?.length || 0,
      phoneNumberIdConfigured: !!phoneNumberId,
      phoneNumberId: phoneNumberId,
      apiVersion: 'v21.0',
    };

    if (!accessToken || !phoneNumberId) {
      return NextResponse.json({
        success: false,
        error: 'WhatsApp credentials not configured',
        diagnostics,
      }, { status: 500 });
    }

    // Test sending a message
    const testMessage = message || 'Test message from KR Fitness WhatsApp integration';
    
    const result = await sendWhatsApp({
      to: phone,
      message: testMessage,
    });

    return NextResponse.json({
      success: result.success,
      error: result.error,
      messageId: result.messageId,
      diagnostics,
    });
  } catch (error: any) {
    console.error('[WhatsApp Test] Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}


