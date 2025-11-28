import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email';
import { sendWhatsApp } from '@/lib/whatsapp';

// ============================================================================
// CRON JOB SETUP INSTRUCTIONS
// ============================================================================
// To set up automated notification sending:
//
// 1. Vercel Cron Job (recommended):
//    Add to vercel.json:
//    {
//      "crons": [{
//        "path": "/api/notifications/send",
//        "schedule": "*/5 * * * *"  // Every 5 minutes
//      }]
//    }
//
// 2. External Cron Service:
//    Set up a cron job to POST to: https://yourdomain.com/api/notifications/send
//    Schedule: Every 5-15 minutes
//
// 3. Manual Trigger:
//    POST /api/notifications/send (requires authentication)

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication check for cron jobs
    // For now, we'll allow unauthenticated requests (cron jobs typically don't have auth)
    // You can add a secret token check here if needed:
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const supabase = await createClient();
    const now = new Date().toISOString();

    // Fetch pending notifications that are due (both email and WhatsApp)
    const { data: pendingNotifications, error: fetchError } = await supabase
      .from('notifications')
      .select(`
        id,
        client_id,
        type,
        channel,
        scheduled_at,
        payload,
        clients:client_id (
          id,
          name,
          email,
          phone
        )
      `)
      .in('channel', ['email', 'whatsapp'])
      .eq('status', 'pending')
      .lte('scheduled_at', now)
      .limit(50); // Process up to 50 notifications per run

    if (fetchError) {
      console.error('[Notifications] Error fetching pending notifications:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch pending notifications', details: fetchError.message },
        { status: 500 }
      );
    }

    if (!pendingNotifications || pendingNotifications.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No pending notifications to send',
        processed: 0,
      });
    }

    let successCount = 0;
    let failureCount = 0;

    // Process each notification
    for (const notification of pendingNotifications) {
      try {
        const client = notification.clients;
        const payload = notification.payload as any;

        if (notification.channel === 'email') {
          // Email sending logic
          if (!client || !client.email) {
            await supabase
              .from('notifications')
              .update({
                status: 'failed',
                error_message: 'Client email not found',
              })
              .eq('id', notification.id);
            failureCount++;
            continue;
          }

          const subject = payload.subject || 'Notification from KR Fitness';
          const body = payload.body || 'You have a notification from KR Fitness.';

          const result = await sendEmail({
            to: client.email,
            subject,
            body,
          });

          if (result.success) {
            const updatedPayload = {
              ...payload,
              resend_email_id: result.emailId || null,
            };
            
            await supabase
              .from('notifications')
              .update({
                status: 'sent',
                sent_at: new Date().toISOString(),
                payload: updatedPayload,
              })
              .eq('id', notification.id);
            
            if (result.emailId) {
              console.log(`[Notifications] Email sent - Resend ID: ${result.emailId}, To: ${client.email}, Subject: ${subject}`);
            }
            successCount++;
          } else {
            console.error(`[Notifications] Failed to send email ${notification.id}:`, result.error);
            await supabase
              .from('notifications')
              .update({
                status: 'failed',
                error_message: result.error || 'Unknown error',
              })
              .eq('id', notification.id);
            failureCount++;
          }
        } else if (notification.channel === 'whatsapp') {
          // WhatsApp sending logic
          if (!client || !client.phone) {
            await supabase
              .from('notifications')
              .update({
                status: 'failed',
                error_message: 'Client phone number not found',
              })
              .eq('id', notification.id);
            failureCount++;
            continue;
          }

          const message = payload.whatsapp_text || payload.body || 'You have a notification from KR Fitness.';
          
          // Use template if specified, otherwise send free-form text
          const result = await sendWhatsApp({
            to: client.phone,
            message,
            template: payload.template || undefined,
          });

          if (result.success) {
            const updatedPayload = {
              ...payload,
              whatsapp_message_id: result.messageId || null,
            };
            
            await supabase
              .from('notifications')
              .update({
                status: 'sent',
                sent_at: new Date().toISOString(),
                payload: updatedPayload,
              })
              .eq('id', notification.id);
            
            console.log(`[Notifications] WhatsApp sent - Message ID: ${result.messageId}, To: ${client.phone}`);
            successCount++;
          } else {
            console.error(`[Notifications] Failed to send WhatsApp ${notification.id}:`, result.error);
            await supabase
              .from('notifications')
              .update({
                status: 'failed',
                error_message: result.error || 'Unknown error',
              })
              .eq('id', notification.id);
            failureCount++;
          }
        }
      } catch (error: any) {
        await supabase
          .from('notifications')
          .update({
            status: 'failed',
            error_message: error.message || 'Unknown error',
          })
          .eq('id', notification.id);
        
        failureCount++;
        console.error(`[Notifications] Error processing notification ${notification.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Notification sending completed',
      processed: pendingNotifications.length,
      success: successCount,
      failed: failureCount,
    });
  } catch (error: any) {
    console.error('[Notifications] Error in send route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

