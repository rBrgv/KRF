import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth, getPaginationParams } from '@/lib/api/auth';
import { sanitizeSearchInput } from '@/lib/utils/sanitize';
import { successResponse, serverErrorResponse } from '@/lib/api/response';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { searchParams } = new URL(request.url);
    const searchRaw = searchParams.get('search') || '';
    const search = searchRaw ? sanitizeSearchInput(searchRaw) : '';
    const category = searchParams.get('category') || '';
    const { limit } = getPaginationParams(request, 50, 200);

    const supabase = await createClient();

    let query = supabase
      .from('foods')
      .select('*')
      .order('name', { ascending: true })
      .limit(limit);

    if (search) {
      // Use full-text search for better results
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching foods:', error);
      return serverErrorResponse('Failed to fetch foods', error.message);
    }

    return Response.json(successResponse(data || []));
  } catch (error: any) {
    console.error('Error in GET /api/foods:', error);
    return serverErrorResponse('Internal server error', error.message);
  }
}


