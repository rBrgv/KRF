import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, messageId, messageText, messageType, template } = body;

    if (!phoneNumber || !messageText) {
      return NextResponse.json(
        { error: 'phoneNumber and messageText are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Try to find client by phone number
    const normalizedPhone = phoneNumber.replace(/\D/g, '');
    let clientId: string | null = null;

    // Try to find client
    const { data: clients } = await supabase
      .from('clients')
      .select('id, phone')
      .limit(10);

    if (clients) {
      for (const client of clients) {
        const clientPhone = client.phone?.replace(/\D/g, '') || '';
        if (clientPhone === normalizedPhone || 
            clientPhone === normalizedPhone.slice(-10) || 
            clientPhone === normalizedPhone.slice(-11)) {
          clientId = client.id;
          break;
        }
      }
    }

    const { error } = await supabase
      .from('whatsapp_messages')
      .insert({
        client_id: clientId,
        phone_number: normalizedPhone,
        direction: 'outbound',
        message_id: messageId || null,
        message_text: messageText,
        message_type: messageType || 'text',
        status: 'sent',
        metadata: template ? { template } : {},
      });

    if (error) {
      console.error('[WhatsApp API] Error storing message:', error);
      return NextResponse.json(
        { error: 'Failed to store message' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[WhatsApp API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

