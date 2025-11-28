import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth, getPaginationParams } from '@/lib/api/auth';
import { successResponse, serverErrorResponse, validationErrorResponse, unauthorizedResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';

const createWaterIntakeSchema = z.object({
  client_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  amount_ml: z.number().int().min(0),
  goal_ml: z.number().int().min(1).optional(),
});

const updateWaterIntakeSchema = createWaterIntakeSchema.partial().extend({
  id: z.string().uuid(),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { user, profile } = authResult;
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');
    const date = searchParams.get('date');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const { limit } = getPaginationParams(request, 100, 365);

    const supabase = await createClient();

    // If client, can only view their own logs
    if (profile?.role === 'client') {
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client) {
        return unauthorizedResponse();
      }

      let query = supabase
        .from('water_intake_logs')
        .select('*')
        .eq('client_id', client.id)
        .order('date', { ascending: false })
        .limit(limit);

      if (date) {
        query = query.eq('date', date);
      } else {
        if (startDate) {
          query = query.gte('date', startDate);
        }
        if (endDate) {
          query = query.lte('date', endDate);
        }
      }

      const { data, error } = await query;

      if (error) {
        return serverErrorResponse('Failed to fetch water intake logs', error.message);
      }

      return Response.json(successResponse(data || []));
    }

    // Admin/trainer can view any client's logs
    let query = supabase
      .from('water_intake_logs')
      .select('*, clients:client_id (id, name)')
      .order('date', { ascending: false })
      .limit(limit);

    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    if (date) {
      query = query.eq('date', date);
    } else {
      if (startDate) {
        query = query.gte('date', startDate);
      }
      if (endDate) {
        query = query.lte('date', endDate);
      }
    }

    const { data, error } = await query;

    if (error) {
      return serverErrorResponse('Failed to fetch water intake logs', error.message);
    }

    return Response.json(successResponse(data || []));
  } catch (error: any) {
    return serverErrorResponse('Internal server error', error.message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { user, profile } = authResult;
    const body = await request.json();
    const validatedData = createWaterIntakeSchema.parse(body);

    const supabase = await createClient();

    // If client, can only log for themselves
    if (profile?.role === 'client') {
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client || client.id !== validatedData.client_id) {
        return unauthorizedResponse();
      }
    }

    // Check if log already exists for this date
    const { data: existing } = await supabase
      .from('water_intake_logs')
      .select('id')
      .eq('client_id', validatedData.client_id)
      .eq('date', validatedData.date)
      .single();

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('water_intake_logs')
        .update({
          amount_ml: validatedData.amount_ml,
          goal_ml: validatedData.goal_ml || 2000,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        return serverErrorResponse('Failed to update water intake log', error.message);
      }

      return Response.json(successResponse(data), { status: 200 });
    }

    // Create new
    const { data, error } = await supabase
      .from('water_intake_logs')
      .insert({
        client_id: validatedData.client_id,
        date: validatedData.date,
        amount_ml: validatedData.amount_ml,
        goal_ml: validatedData.goal_ml || 2000,
      })
      .select()
      .single();

    if (error) {
      return serverErrorResponse('Failed to create water intake log', error.message);
    }

    return Response.json(successResponse(data), { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return validationErrorResponse(error.errors);
    }
    return serverErrorResponse('Internal server error', error.message);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { user, profile } = authResult;
    const body = await request.json();
    const validatedData = updateWaterIntakeSchema.parse(body);

    const supabase = await createClient();

    // Fetch log to check ownership
    const { data: log } = await supabase
      .from('water_intake_logs')
      .select('client_id')
      .eq('id', validatedData.id)
      .single();

    if (!log) {
      return errorResponse('Water intake log not found', 'NOT_FOUND', undefined, 404);
    }

    // If client, can only update their own logs
    if (profile?.role === 'client') {
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client || client.id !== log.client_id) {
        return unauthorizedResponse();
      }
    }

    const updateData: any = {};
    if (validatedData.amount_ml !== undefined) updateData.amount_ml = validatedData.amount_ml;
    if (validatedData.goal_ml !== undefined) updateData.goal_ml = validatedData.goal_ml;

    const { data, error } = await supabase
      .from('water_intake_logs')
      .update(updateData)
      .eq('id', validatedData.id)
      .select()
      .single();

    if (error) {
      return serverErrorResponse('Failed to update water intake log', error.message);
    }

    return Response.json(successResponse(data));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return validationErrorResponse(error.errors);
    }
    return serverErrorResponse('Internal server error', error.message);
  }
}

