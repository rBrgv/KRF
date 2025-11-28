import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth, getPaginationParams } from '@/lib/api/auth';
import { successResponse, serverErrorResponse, validationErrorResponse, unauthorizedResponse } from '@/lib/api/response';
import { z } from 'zod';

const createMeasurementSchema = z.object({
  client_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  weight_kg: z.number().min(0).optional().nullable(),
  body_fat_percentage: z.number().min(0).max(100).optional().nullable(),
  waist_cm: z.number().min(0).optional().nullable(),
  chest_cm: z.number().min(0).optional().nullable(),
  arms_cm: z.number().min(0).optional().nullable(),
  thighs_cm: z.number().min(0).optional().nullable(),
  hips_cm: z.number().min(0).optional().nullable(),
  neck_cm: z.number().min(0).optional().nullable(),
  notes: z.string().optional().nullable(),
});

const updateMeasurementSchema = createMeasurementSchema.partial().extend({
  id: z.string().uuid(),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { user, profile } = authResult;
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const { limit } = getPaginationParams(request, 100, 500);

    const supabase = await createClient();

    // If client, can only view their own measurements
    if (profile?.role === 'client') {
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client) {
        return unauthorizedResponse();
      }

      // Force client_id to be their own
      const query = supabase
        .from('body_measurements')
        .select('*')
        .eq('client_id', client.id)
        .order('date', { ascending: false })
        .limit(limit);

      if (startDate) {
        query.gte('date', startDate);
      }
      if (endDate) {
        query.lte('date', endDate);
      }

      const { data, error } = await query;

      if (error) {
        return serverErrorResponse('Failed to fetch measurements', error.message);
      }

      return Response.json(successResponse(data || []));
    }

    // Admin/trainer can view any client's measurements
    let query = supabase
      .from('body_measurements')
      .select('*, clients:client_id (id, name)')
      .order('date', { ascending: false })
      .limit(limit);

    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      return serverErrorResponse('Failed to fetch measurements', error.message);
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
    const validatedData = createMeasurementSchema.parse(body);

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

    // Check if measurement already exists for this date
    const { data: existing } = await supabase
      .from('body_measurements')
      .select('id')
      .eq('client_id', validatedData.client_id)
      .eq('date', validatedData.date)
      .single();

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('body_measurements')
        .update({
          weight_kg: validatedData.weight_kg ?? null,
          body_fat_percentage: validatedData.body_fat_percentage ?? null,
          waist_cm: validatedData.waist_cm ?? null,
          chest_cm: validatedData.chest_cm ?? null,
          arms_cm: validatedData.arms_cm ?? null,
          thighs_cm: validatedData.thighs_cm ?? null,
          hips_cm: validatedData.hips_cm ?? null,
          neck_cm: validatedData.neck_cm ?? null,
          notes: validatedData.notes ?? null,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        return serverErrorResponse('Failed to update measurement', error.message);
      }

      return Response.json(successResponse(data), { status: 200 });
    }

    // Create new
    const { data, error } = await supabase
      .from('body_measurements')
      .insert({
        client_id: validatedData.client_id,
        date: validatedData.date,
        weight_kg: validatedData.weight_kg ?? null,
        body_fat_percentage: validatedData.body_fat_percentage ?? null,
        waist_cm: validatedData.waist_cm ?? null,
        chest_cm: validatedData.chest_cm ?? null,
        arms_cm: validatedData.arms_cm ?? null,
        thighs_cm: validatedData.thighs_cm ?? null,
        hips_cm: validatedData.hips_cm ?? null,
        neck_cm: validatedData.neck_cm ?? null,
        notes: validatedData.notes ?? null,
      })
      .select()
      .single();

    if (error) {
      return serverErrorResponse('Failed to create measurement', error.message);
    }

    return Response.json(successResponse(data), { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return validationErrorResponse(error.errors);
    }
    return serverErrorResponse('Internal server error', error.message);
  }
}



