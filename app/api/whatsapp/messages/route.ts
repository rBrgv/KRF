import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdminOrTrainer } from '@/lib/api/auth';
import { successResponse, serverErrorResponse } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdminOrTrainer();
    if (authResult instanceof Response) {
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');
    const phoneNumber = searchParams.get('phone_number');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!clientId && !phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'client_id or phone_number is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    let query = supabase
      .from('whatsapp_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (clientId) {
      query = query.eq('client_id', clientId);
    } else if (phoneNumber) {
      // Normalize phone number for matching
      const normalizedPhone = phoneNumber.replace(/\D/g, '');
      query = query.eq('phone_number', normalizedPhone);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[WhatsApp Messages API] Error:', error);
      return serverErrorResponse('Failed to fetch messages', error.message);
    }

    return NextResponse.json(successResponse(data || []));
  } catch (error: any) {
    console.error('[WhatsApp Messages API] Unexpected error:', error);
    return serverErrorResponse('Internal server error', error.message);
  }
}



