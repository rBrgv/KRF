import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

// ============================================================================
// WHATSAPP WEBHOOK ENDPOINT
// ============================================================================
// Receives incoming messages from WhatsApp Business API
// POST /api/whatsapp/webhook

/**
 * Verify webhook signature (optional but recommended)
 */
function verifyWebhookSignature(body: string, signature: string): boolean {
  const webhookSecret = process.env.WHATSAPP_WEBHOOK_SECRET || '';
  if (!webhookSecret) {
    // If no secret configured, skip verification (not recommended for production)
    console.warn('[WhatsApp Webhook] No webhook secret configured. Skipping signature verification.');
    return true;
  }

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Format phone number for storage (normalize to E.164 without +)
 */
function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If starts with country code, use as is
  if (cleaned.startsWith('91') && cleaned.length >= 12) {
    return cleaned;
  }
  
  // If 10 digits, assume India and add country code
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  
  // If 11 digits starting with 0, remove 0 and add 91
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `91${cleaned.substring(1)}`;
  }
  
  return cleaned;
}

export async function GET(request: NextRequest) {
  // Webhook verification (Meta sends GET request to verify webhook)
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'your_verify_token_here';

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[WhatsApp Webhook] Verification successful');
    return new NextResponse(challenge, { status: 200 });
  } else {
    console.error('[WhatsApp Webhook] Verification failed');
    return new NextResponse('Forbidden', { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-hub-signature-256') || '';

    // Verify webhook signature (optional but recommended)
    if (signature && !verifyWebhookSignature(body, signature.replace('sha256=', ''))) {
      console.error('[WhatsApp Webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const data = JSON.parse(body);

    // Handle different webhook event types
    if (data.object === 'whatsapp_business_account') {
      const entries = data.entry || [];
      
      for (const entry of entries) {
        const changes = entry.changes || [];
        
        for (const change of changes) {
          if (change.field === 'messages') {
            const value = change.value;
            
            // Handle incoming messages
            if (value.messages) {
              for (const message of value.messages) {
                await processIncomingMessage(message, value);
              }
            }
            
            // Handle status updates (delivered, read, etc.)
            if (value.statuses) {
              for (const status of value.statuses) {
                await processStatusUpdate(status);
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('[WhatsApp Webhook] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Process incoming message
 */
async function processIncomingMessage(message: any, value: any) {
  try {
    const supabase = await createClient();
    
    const phoneNumber = message.from; // WhatsApp phone number (with country code, no +)
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    const messageText = message.text?.body || message.type || 'Unknown message type';
    const messageType = message.type || 'text';
    const messageId = message.id;
    const timestamp = parseInt(message.timestamp) * 1000; // Convert to milliseconds
    
    console.log('[WhatsApp Webhook] Incoming message:', {
      from: phoneNumber,
      normalized: normalizedPhone,
      text: messageText,
      type: messageType,
      id: messageId,
    });

    // Store message in database
    const { data, error } = await supabase
      .from('whatsapp_messages')
      .insert({
        phone_number: normalizedPhone,
        direction: 'inbound',
        message_id: messageId,
        message_text: messageText,
        message_type: messageType,
        status: 'delivered', // Incoming messages are always delivered
        whatsapp_timestamp: new Date(timestamp).toISOString(),
        metadata: {
          raw_message: message,
          contact_name: value.contacts?.[0]?.profile?.name,
        },
      })
      .select()
      .single();

    if (error) {
      console.error('[WhatsApp Webhook] Error storing message:', error);
    } else {
      console.log('[WhatsApp Webhook] Message stored:', data.id);
    }
  } catch (error: any) {
    console.error('[WhatsApp Webhook] Error processing incoming message:', error);
  }
}

/**
 * Process status updates (delivered, read, etc.)
 */
async function processStatusUpdate(status: any) {
  try {
    const supabase = await createClient();
    
    const messageId = status.id;
    const newStatus = status.status; // sent, delivered, read, failed
    
    console.log('[WhatsApp Webhook] Status update:', {
      messageId,
      status: newStatus,
    });

    // Update message status
    await supabase
      .from('whatsapp_messages')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('message_id', messageId);
  } catch (error: any) {
    console.error('[WhatsApp Webhook] Error processing status update:', error);
  }
}



