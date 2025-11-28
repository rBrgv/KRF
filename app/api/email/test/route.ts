import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

// ============================================================================
// EMAIL TEST ENDPOINT
// ============================================================================
// POST /api/email/test
// Test email sending functionality

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { to, subject = 'Test Email from KR Fitness', body: emailBody = 'This is a test email to verify email sending is working.' } = body;

    if (!to) {
      return NextResponse.json(
        { error: 'Email address (to) is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email address format' },
        { status: 400 }
      );
    }

    console.log('[Email Test] Sending test email to:', to);

    const result = await sendEmail({
      to,
      subject,
      body: emailBody,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        emailId: result.emailId,
        resendUrl: result.emailId ? `https://resend.com/emails/${result.emailId}` : null,
        note: 'Check your inbox (and spam folder). If not received, check the Resend dashboard link above.',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to send test email',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[Email Test] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}




