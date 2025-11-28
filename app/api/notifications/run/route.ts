import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { NotificationType, NotificationPayload } from '@/lib/types';

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================
// These can be moved to environment variables or a config file later

const APPOINTMENT_REMINDER_HOURS_AHEAD = 24; // Send reminder 24 hours before appointment
const MEMBERSHIP_EXPIRY_DAYS_AHEAD = 7; // Send reminder 7 days before membership expires

// ============================================================================
// CRON JOB SETUP INSTRUCTIONS
// ============================================================================
// To set up automated notification generation:
//
// 1. Vercel Cron Job (recommended):
//    Add to vercel.json:
//    {
//      "crons": [{
//        "path": "/api/notifications/run",
//        "schedule": "*/15 * * * *"  // Every 15 minutes
//      }]
//    }
//
// 2. External Cron Service:
//    Set up a cron job to POST to: https://yourdomain.com/api/notifications/run
//    Schedule: Every 15 minutes
//
// 3. Manual Trigger:
//    POST /api/notifications/run (requires authentication)

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
    const now = new Date();

    // ========================================================================
    // 1. GENERATE APPOINTMENT REMINDERS
    // ========================================================================
    const reminderTime = new Date(now.getTime() + APPOINTMENT_REMINDER_HOURS_AHEAD * 60 * 60 * 1000);
    const reminderTimeStart = new Date(reminderTime.getTime() - 15 * 60 * 1000); // 15 min window
    const reminderTimeEnd = new Date(reminderTime.getTime() + 15 * 60 * 1000);

    const { data: upcomingAppointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select(`
        id,
        client_id,
        title,
        date,
        start_time,
        type,
        clients:client_id (
          id,
          name,
          email,
          phone
        )
      `)
      .gte('date', now.toISOString().split('T')[0])
      .lte('date', reminderTimeEnd.toISOString().split('T')[0])
      .not('client_id', 'is', null);

    if (appointmentsError) {
      console.error('[Notifications] Error fetching appointments:', appointmentsError);
    } else if (upcomingAppointments) {
      for (const appointment of upcomingAppointments) {
        if (!appointment.client_id) {
          continue;
        }

        // Calculate appointment datetime
        const appointmentDate = new Date(`${appointment.date}T${appointment.start_time}`);
        const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        // Only create reminder if within the reminder window
        if (hoursUntilAppointment > 0 && hoursUntilAppointment <= APPOINTMENT_REMINDER_HOURS_AHEAD + 1) {
          const scheduledAt = new Date(appointmentDate.getTime() - APPOINTMENT_REMINDER_HOURS_AHEAD * 60 * 60 * 1000);
          
          const payload: NotificationPayload = {
            subject: `Reminder: ${appointment.title || 'Appointment'} - ${new Date(appointmentDate).toLocaleDateString()}`,
            body: `Hi ${appointment.clients?.[0]?.name || 'Client'},\n\nThis is a reminder that you have an appointment scheduled:\n\n` +
                  `Title: ${appointment.title || 'Appointment'}\n` +
                  `Date: ${new Date(appointmentDate).toLocaleDateString()}\n` +
                  `Time: ${appointment.start_time}\n` +
                  (appointment.type ? `Type: ${appointment.type}\n` : '') +
                  `\nWe look forward to seeing you!\n\nBest regards,\nKR Fitness Team`,
            whatsapp_text: `Hi ${appointment.clients?.[0]?.name || 'Client'}! Reminder: You have an appointment on ${new Date(appointmentDate).toLocaleDateString()} at ${appointment.start_time}. See you soon! - KR Fitness`,
            appointment_id: appointment.id,
          };

          // Create email notification if client has email
          const client = appointment.clients?.[0];
          if (client?.email) {
            const { data: existingEmail } = await supabase
              .from('notifications')
              .select('id')
              .eq('client_id', appointment.client_id)
              .eq('type', 'appointment_reminder')
              .eq('channel', 'email')
              .eq('status', 'pending')
              .gte('scheduled_at', reminderTimeStart.toISOString())
              .lte('scheduled_at', reminderTimeEnd.toISOString())
              .single();

            if (!existingEmail) {
              await supabase.from('notifications').insert({
                client_id: appointment.client_id,
                type: 'appointment_reminder',
                channel: 'email',
                scheduled_at: scheduledAt.toISOString(),
                status: 'pending',
                payload,
              });
            }
          }

          // Create WhatsApp notification if client has phone
          if (client?.phone) {
            const { data: existingWhatsApp } = await supabase
              .from('notifications')
              .select('id')
              .eq('client_id', appointment.client_id)
              .eq('type', 'appointment_reminder')
              .eq('channel', 'whatsapp')
              .eq('status', 'pending')
              .gte('scheduled_at', reminderTimeStart.toISOString())
              .lte('scheduled_at', reminderTimeEnd.toISOString())
              .single();

            if (!existingWhatsApp) {
              await supabase.from('notifications').insert({
                client_id: appointment.client_id,
                type: 'appointment_reminder',
                channel: 'whatsapp',
                scheduled_at: scheduledAt.toISOString(),
                status: 'pending',
                payload,
              });
            }
          }
        }
      }
    }

    // ========================================================================
    // 2. GENERATE MEMBERSHIP EXPIRY REMINDERS
    // ========================================================================
    // NOTE: This assumes a client_memberships table exists with end_date field
    // If the table doesn't exist, this section will be skipped gracefully
    
    const expiryDate = new Date(now.getTime() + MEMBERSHIP_EXPIRY_DAYS_AHEAD * 24 * 60 * 60 * 1000);
    const expiryDateStart = new Date(expiryDate.getTime() - 1 * 24 * 60 * 60 * 1000);
    const expiryDateEnd = new Date(expiryDate.getTime() + 1 * 24 * 60 * 60 * 1000);

    try {
      // Check if client_memberships table exists by attempting a query
      const { data: expiringMemberships, error: membershipsError } = await supabase
        .from('client_memberships')
        .select(`
          id,
          client_id,
          end_date,
          clients:client_id (
            id,
            name,
            email
          )
        `)
        .gte('end_date', expiryDateStart.toISOString().split('T')[0])
        .lte('end_date', expiryDateEnd.toISOString().split('T')[0])
        .not('client_id', 'is', null);

      if (!membershipsError && expiringMemberships) {
        for (const membership of expiringMemberships) {
          if (!membership.client_id) {
            continue;
          }

          const scheduledAt = new Date(now.getTime() + (MEMBERSHIP_EXPIRY_DAYS_AHEAD - 1) * 24 * 60 * 60 * 1000);
          
          // Handle clients as array or single object
          const client = Array.isArray(membership.clients) ? membership.clients[0] : membership.clients;
          const clientName = client?.name || 'Valued Client';
          const clientEmail = client?.email;
          const clientPhone = client?.phone;

          const payload: NotificationPayload = {
            subject: `Membership Expiring Soon - ${new Date(membership.end_date).toLocaleDateString()}`,
            body: `Hi ${clientName},\n\nThis is a reminder that your membership is expiring soon:\n\n` +
                  `Expiry Date: ${new Date(membership.end_date).toLocaleDateString()}\n` +
                  `Days Remaining: ${MEMBERSHIP_EXPIRY_DAYS_AHEAD}\n\n` +
                  `Please renew your membership to continue enjoying our services.\n\n` +
                  `Best regards,\nKR Fitness Team`,
            whatsapp_text: `Hi ${clientName}! Your membership expires on ${new Date(membership.end_date).toLocaleDateString()}. Renew now to continue! - KR Fitness`,
            membership_id: membership.id,
          };

          // Create email notification if client has email
          if (clientEmail) {
            const { data: existingEmail } = await supabase
              .from('notifications')
              .select('id')
              .eq('client_id', membership.client_id)
              .eq('type', 'membership_expiry')
              .eq('channel', 'email')
              .eq('status', 'pending')
              .gte('scheduled_at', now.toISOString())
              .lte('scheduled_at', expiryDateEnd.toISOString())
              .single();

            if (!existingEmail) {
              await supabase.from('notifications').insert({
                client_id: membership.client_id,
                type: 'membership_expiry',
                channel: 'email',
                scheduled_at: scheduledAt.toISOString(),
                status: 'pending',
                payload,
              });
            }
          }

          // Create WhatsApp notification if client has phone
          if (clientPhone) {
            const { data: existingWhatsApp } = await supabase
              .from('notifications')
              .select('id')
              .eq('client_id', membership.client_id)
              .eq('type', 'membership_expiry')
              .eq('channel', 'whatsapp')
              .eq('status', 'pending')
              .gte('scheduled_at', now.toISOString())
              .lte('scheduled_at', expiryDateEnd.toISOString())
              .single();

            if (!existingWhatsApp) {
              await supabase.from('notifications').insert({
                client_id: membership.client_id,
                type: 'membership_expiry',
                channel: 'whatsapp',
                scheduled_at: scheduledAt.toISOString(),
                status: 'pending',
                payload,
              });
            }
          }
        }
      }
    } catch (error) {
      // Table doesn't exist or query failed - skip membership reminders
      console.log('[Notifications] client_memberships table not found or query failed. Skipping membership expiry reminders.');
    }

    return NextResponse.json({
      success: true,
      message: 'Notification generation completed',
      config: {
        appointment_reminder_hours_ahead: APPOINTMENT_REMINDER_HOURS_AHEAD,
        membership_expiry_days_ahead: MEMBERSHIP_EXPIRY_DAYS_AHEAD,
      },
    });
  } catch (error: any) {
    console.error('[Notifications] Error in run route:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}




