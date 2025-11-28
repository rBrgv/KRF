import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

// ============================================================================
// SEND EMAIL TO LEAD API
// ============================================================================
// Allows admins to send emails directly to leads
// POST /api/leads/[id]/email

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin or trainer
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'trainer')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    // Fetch lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, name, email')
      .eq('id', id)
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    if (!lead.email) {
      return NextResponse.json(
        { error: 'Lead does not have an email address' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { subject, body: emailBody } = body;

    // Validation
    if (!subject || !emailBody) {
      return NextResponse.json(
        { error: 'subject and body are required' },
        { status: 400 }
      );
    }

    // Send email
    const result = await sendEmail({
      to: lead.email,
      subject,
      body: emailBody,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    // Log email ID for tracking in Resend dashboard
    if (result.emailId) {
      console.log(`[Lead Email] Email sent - Resend ID: ${result.emailId}, To: ${lead.email}`);
      console.log(`[Lead Email] Track email at: https://resend.com/emails/${result.emailId}`);
    }

    return NextResponse.json({
      success: true,
      emailId: result.emailId,
      message: 'Email sent successfully',
    });
  } catch (error: any) {
    console.error('Error in POST /api/leads/[id]/email:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}



