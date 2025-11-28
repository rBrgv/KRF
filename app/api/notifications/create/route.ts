import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { NotificationPayload } from '@/lib/types';

// ============================================================================
// MANUAL NOTIFICATION CREATION API
// ============================================================================
// Allows admins to manually create and schedule email notifications
// POST /api/notifications/create

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      client_id,
      subject,
      body: emailBody,
      whatsapp_text,
      scheduled_at, // ISO string or null for immediate send
      type = 'general',
      channel = 'email', // 'email' or 'whatsapp'
      template, // Optional WhatsApp template
    } = body;

    // Validation
    if (!client_id) {
      return NextResponse.json(
        { error: 'client_id is required' },
        { status: 400 }
      );
    }

    if (channel === 'email' && (!subject || !emailBody)) {
      return NextResponse.json(
        { error: 'subject and body are required for email notifications' },
        { status: 400 }
      );
    }

    if (channel === 'whatsapp' && !whatsapp_text && !emailBody) {
      return NextResponse.json(
        { error: 'whatsapp_text or body is required for WhatsApp notifications' },
        { status: 400 }
      );
    }

    // Verify client exists
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id, name, email, phone')
      .eq('id', client_id)
      .single();

    if (clientError || !client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    if (channel === 'email' && !client.email) {
      return NextResponse.json(
        { error: 'Client does not have an email address' },
        { status: 400 }
      );
    }

    if (channel === 'whatsapp' && !client.phone) {
      return NextResponse.json(
        { error: 'Client does not have a phone number' },
        { status: 400 }
      );
    }

    // Determine scheduled_at time
    let scheduledAt: Date;
    if (scheduled_at) {
      scheduledAt = new Date(scheduled_at);
      if (isNaN(scheduledAt.getTime())) {
        return NextResponse.json(
          { error: 'Invalid scheduled_at date' },
          { status: 400 }
        );
      }
    } else {
      // Send immediately (schedule for now)
      scheduledAt = new Date();
    }

    // Create payload
    const payload: NotificationPayload = {
      subject: channel === 'email' ? subject : undefined,
      body: emailBody || whatsapp_text,
      whatsapp_text: whatsapp_text || emailBody,
      template: template || undefined,
    };

    // Insert notification
    const { data: notification, error: insertError } = await supabase
      .from('notifications')
      .insert({
        client_id,
        type,
        channel,
        scheduled_at: scheduledAt.toISOString(),
        status: 'pending', // Will be sent by cron
        payload,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating notification:', insertError);
      console.error('Insert data:', {
        client_id,
        type,
        channel: 'email',
        scheduled_at: scheduledAt.toISOString(),
        status: 'pending',
        payload,
      });
      
      // Check if it's a constraint violation
      if (insertError.message?.includes('check constraint') || insertError.message?.includes('type')) {
        return NextResponse.json(
          { 
            error: 'Database constraint error. The notification type "general" may not be allowed yet. Please run migration 018_update_notifications_type.sql',
            details: insertError.message 
          },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to create notification', details: insertError.message },
        { status: 500 }
      );
    }

    // If scheduled for immediate send (within 1 minute), send it now
    if (scheduledAt <= new Date(Date.now() + 60000)) {
      try {
        if (channel === 'email') {
          const { sendEmail } = await import('@/lib/email');
          const result = await sendEmail({
            to: client.email!,
            subject: subject!,
            body: emailBody!,
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
              console.log(`[Notifications] Email sent - Resend ID: ${result.emailId}, To: ${client.email}`);
            }
          } else {
            await supabase
              .from('notifications')
              .update({
                status: 'failed',
                error_message: result.error || 'Unknown error',
              })
              .eq('id', notification.id);
          }
        } else if (channel === 'whatsapp') {
          const { sendWhatsApp } = await import('@/lib/whatsapp');
          const result = await sendWhatsApp({
            to: client.phone!,
            message: whatsapp_text || emailBody!,
            template: template || undefined,
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
          } else {
            await supabase
              .from('notifications')
              .update({
                status: 'failed',
                error_message: result.error || 'Unknown error',
              })
              .eq('id', notification.id);
          }
        }
      } catch (error: any) {
        console.error(`Error sending ${channel} immediately:`, error);
        // Notification is still created, will be retried by cron
      }
    }

    return NextResponse.json({
      success: true,
      notification,
      message: scheduledAt <= new Date() ? `${channel === 'email' ? 'Email' : 'WhatsApp'} sent` : `${channel === 'email' ? 'Email' : 'WhatsApp'} scheduled`,
    });
  } catch (error: any) {
    console.error('Error in POST /api/notifications/create:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

