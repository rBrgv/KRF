import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClientSchema } from '@/lib/validations';
import { sanitizeSearchInput } from '@/lib/utils/sanitize';
import { successResponse, validationErrorResponse, serverErrorResponse } from '@/lib/api/response';
import { getPaginationParams } from '@/lib/api/auth';
import { requireAdminOrTrainer } from '@/lib/api/auth';

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdminOrTrainer();
    if (authResult instanceof Response) return authResult;

    const body = await request.json();
    const validatedData = createClientSchema.parse(body);

    const supabase = await createClient();

    const { data, error } = await supabase
      .from('clients')
      .insert([
        {
          lead_id: validatedData.lead_id || null,
          name: validatedData.name,
          email: validatedData.email || null,
          phone: validatedData.phone,
          goal: validatedData.goal || null,
          program_start_date: validatedData.program_start_date || null,
          subscription_type: validatedData.subscription_type || null,
          program_type: validatedData.program_type || null,
          notes: validatedData.notes || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating client:', error);
      return serverErrorResponse('Failed to create client', error.message);
    }

    // If linked to a lead, update the lead status to converted
    if (validatedData.lead_id) {
      await supabase
        .from('leads')
        .update({ status: 'converted' })
        .eq('id', validatedData.lead_id);
    }

    return Response.json(successResponse(data), { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return validationErrorResponse(error.errors);
    }
    console.error('Error in POST /api/clients:', error);
    return serverErrorResponse('Internal server error', error.message);
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdminOrTrainer();
    if (authResult instanceof Response) {
      console.error('[Clients API] Auth failed:', authResult.status, authResult.statusText);
      return authResult;
    }

    const { searchParams } = new URL(request.url);
    const { page, limit } = getPaginationParams(request, 20, 100);
    const searchRaw = searchParams.get('search');
    const search = searchRaw ? sanitizeSearchInput(searchRaw) : null;

    const supabase = await createClient();

    let query = supabase
      .from('clients')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply search filter
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('[Clients API] Database error:', error);
      return serverErrorResponse('Failed to fetch clients', error.message);
    }

    return Response.json(
      successResponse(data || [], {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      })
    );
  } catch (error: any) {
    console.error('[Clients API] Unexpected error:', error);
    console.error('[Clients API] Error stack:', error.stack);
    return serverErrorResponse(
      'Internal server error', 
      process.env.NODE_ENV === 'development' ? error.message : undefined
    );
  }
}

