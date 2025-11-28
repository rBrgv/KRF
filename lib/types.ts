// ============================================================================
// SUPABASE TYPES
// ============================================================================

export type NotificationType = 'appointment_reminder' | 'payment_reminder' | 'membership_expiry' | 'general';
export type NotificationChannel = 'email' | 'whatsapp';
export type NotificationStatus = 'pending' | 'sent' | 'failed';

export interface NotificationPayload {
  subject?: string;
  body?: string;
  whatsapp_text?: string;
  appointment_id?: string;
  membership_id?: string;
  [key: string]: any;
}

export interface Notification {
  id: string;
  client_id: string;
  type: NotificationType;
  channel: NotificationChannel;
  scheduled_at: string;
  sent_at: string | null;
  status: NotificationStatus;
  payload: NotificationPayload;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationWithClient extends Notification {
  clients?: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  };
}

