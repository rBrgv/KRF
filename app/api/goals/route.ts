import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth, getPaginationParams } from '@/lib/api/auth';
import { notFoundResponse } from '@/lib/api/response';
import { successResponse, serverErrorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api/response';
import { z } from 'zod';

const createGoalSchema = z.object({
  client_id: z.string().uuid(),
  goal_type: z.enum(['weight_loss', 'weight_gain', 'muscle_gain', 'strength', 'endurance', 'body_fat', 'measurements', 'custom']),
  title: z.string().min(1).max(200),
  description: z.string().optional().nullable(),
  target_value: z.number().optional().nullable(),
  current_value: z.number().default(0),
  target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  notes: z.string().optional().nullable(),
});

const updateGoalSchema = createGoalSchema.partial().extend({
  id: z.string().uuid(),
  status: z.enum(['active', 'completed', 'paused', 'cancelled']).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { user, profile } = authResult;
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');
    const status = searchParams.get('status');
    const { limit } = getPaginationParams(request, 50, 200);

    const supabase = await createClient();

    // If client, can only view their own goals
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
        .from('client_goals')
        .select('*')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        return serverErrorResponse('Failed to fetch goals', error.message);
      }

      return Response.json(successResponse(data || []));
    }

    // Admin/trainer can view any client's goals
    let query = supabase
      .from('client_goals')
      .select('*, clients:client_id (id, name)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      return serverErrorResponse('Failed to fetch goals', error.message);
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
    const validatedData = createGoalSchema.parse(body);

    const supabase = await createClient();

    // If client, can only create goals for themselves
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

    const { data, error } = await supabase
      .from('client_goals')
      .insert({
        client_id: validatedData.client_id,
        goal_type: validatedData.goal_type,
        title: validatedData.title,
        description: validatedData.description ?? null,
        target_value: validatedData.target_value ?? null,
        current_value: validatedData.current_value ?? 0,
        target_date: validatedData.target_date ?? null,
        priority: validatedData.priority,
        notes: validatedData.notes ?? null,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      return serverErrorResponse('Failed to create goal', error.message);
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
    const validatedData = updateGoalSchema.parse(body);

    const supabase = await createClient();

    // Fetch goal to check ownership
    const { data: goal } = await supabase
      .from('client_goals')
      .select('client_id')
      .eq('id', validatedData.id)
      .single();

    if (!goal) {
      return notFoundResponse('Goal');
    }

    // If client, can only update their own goals
    if (profile?.role === 'client') {
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client || client.id !== goal.client_id) {
        return unauthorizedResponse();
      }
    }

    const updateData: any = {};
    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.target_value !== undefined) updateData.target_value = validatedData.target_value;
    if (validatedData.current_value !== undefined) updateData.current_value = validatedData.current_value;
    if (validatedData.target_date !== undefined) updateData.target_date = validatedData.target_date;
    if (validatedData.priority !== undefined) updateData.priority = validatedData.priority;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes;
    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status;
      if (validatedData.status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('client_goals')
      .update(updateData)
      .eq('id', validatedData.id)
      .select()
      .single();

    if (error) {
      return serverErrorResponse('Failed to update goal', error.message);
    }

    return Response.json(successResponse(data));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return validationErrorResponse(error.errors);
    }
    return serverErrorResponse('Internal server error', error.message);
  }
}



