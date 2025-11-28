import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

// ============================================================================
// NOTIFICATIONS DEBUG ENDPOINT
// ============================================================================
// GET /api/notifications/debug
// Shows recent notifications with full details including Resend email IDs

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const supabase = await createClient();

    // Fetch recent notifications
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select(`
        *,
        clients:client_id (
          id,
          name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[Debug] Error fetching notifications:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notifications', details: error.message },
        { status: 500 }
      );
    }

    // Format response with Resend tracking links
    const formatted = (notifications || []).map((notif: any) => {
      const payload = notif.payload || {};
      const resendEmailId = payload.resend_email_id;
      
      return {
        id: notif.id,
        client: notif.clients ? {
          name: notif.clients.name,
          email: notif.clients.email,
        } : null,
        type: notif.type,
        channel: notif.channel,
        status: notif.status,
        subject: payload.subject || 'N/A',
        scheduled_at: notif.scheduled_at,
        sent_at: notif.sent_at,
        error_message: notif.error_message,
        resend_email_id: resendEmailId,
        resend_tracking_url: resendEmailId ? `https://resend.com/emails/${resendEmailId}` : null,
        created_at: notif.created_at,
      };
    });

    return NextResponse.json({
      success: true,
      count: formatted.length,
      notifications: formatted,
      note: 'Check resend_tracking_url to see actual delivery status in Resend dashboard',
    });
  } catch (error: any) {
    console.error('[Debug] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}




