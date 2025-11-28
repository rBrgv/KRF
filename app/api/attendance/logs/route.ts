import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth, getPaginationParams } from '@/lib/api/auth';
import { successResponse, serverErrorResponse } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const { limit } = getPaginationParams(request, 50, 100);

    const supabase = await createClient();

    let query = supabase
      .from('attendance_logs')
      .select(`
        *,
        clients:client_id (id, name),
        appointments:appointment_id (id, title, date, start_time, end_time)
      `)
      .order('check_in_time', { ascending: false })
      .limit(limit);

    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    if (startDate) {
      query = query.gte('check_in_time', startDate);
    }
    if (endDate) {
      query = query.lte('check_in_time', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching attendance logs:', error);
      return serverErrorResponse('Failed to fetch attendance logs', error.message);
    }

    return Response.json(successResponse(data || []));
  } catch (error: any) {
    console.error('Error in GET /api/attendance/logs:', error);
    return serverErrorResponse('Internal server error', error.message);
  }
}


