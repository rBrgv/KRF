import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth, getPaginationParams } from '@/lib/api/auth';
import { successResponse, serverErrorResponse, unauthorizedResponse } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { user, profile } = authResult;
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');
    const { limit } = getPaginationParams(request, 50, 200);

    const supabase = await createClient();

    // If client, can only view their own achievements
    if (profile?.role === 'client') {
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client) {
        return unauthorizedResponse();
      }

      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('client_id', client.id)
        .order('earned_at', { ascending: false })
        .limit(limit);

      if (error) {
        return serverErrorResponse('Failed to fetch achievements', error.message);
      }

      return Response.json(successResponse(data || []));
    }

    // Admin/trainer can view any client's achievements
    let query = supabase
      .from('achievements')
      .select('*, clients:client_id (id, name)')
      .order('earned_at', { ascending: false })
      .limit(limit);

    if (clientId) {
      query = query.eq('client_id', clientId);
    }

    const { data, error } = await query;

    if (error) {
      return serverErrorResponse('Failed to fetch achievements', error.message);
    }

    return Response.json(successResponse(data || []));
  } catch (error: any) {
    return serverErrorResponse('Internal server error', error.message);
  }
}



