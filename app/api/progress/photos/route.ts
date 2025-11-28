import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth, getPaginationParams } from '@/lib/api/auth';
import { successResponse, serverErrorResponse, validationErrorResponse, unauthorizedResponse, errorResponse } from '@/lib/api/response';
import { z } from 'zod';

const createPhotoSchema = z.object({
  client_id: z.string().uuid(),
  photo_url: z.string().url(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  view_type: z.enum(['front', 'side', 'back', 'other']),
  notes: z.string().optional().nullable(),
  is_milestone: z.boolean().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { user, profile } = authResult;
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');
    const viewType = searchParams.get('view_type');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const { limit } = getPaginationParams(request, 50, 200);

    const supabase = await createClient();

    // If client, can only view their own photos
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
        .from('progress_photos')
        .select('*')
        .eq('client_id', client.id)
        .order('date', { ascending: false })
        .limit(limit);

      if (viewType) {
        query = query.eq('view_type', viewType);
      }
      if (startDate) {
        query = query.gte('date', startDate);
      }
      if (endDate) {
        query = query.lte('date', endDate);
      }

      const { data, error } = await query;

      if (error) {
        return serverErrorResponse('Failed to fetch photos', error.message);
      }

      return Response.json(successResponse(data || []));
    }

    // Admin/trainer can view any client's photos
    let query = supabase
      .from('progress_photos')
      .select('*, clients:client_id (id, name)')
      .order('date', { ascending: false })
      .limit(limit);

    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    if (viewType) {
      query = query.eq('view_type', viewType);
    }
    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      return serverErrorResponse('Failed to fetch photos', error.message);
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
    const validatedData = createPhotoSchema.parse(body);

    const supabase = await createClient();

    // If client, can only upload for themselves
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
      .from('progress_photos')
      .insert({
        client_id: validatedData.client_id,
        photo_url: validatedData.photo_url,
        date: validatedData.date,
        view_type: validatedData.view_type,
        notes: validatedData.notes ?? null,
        is_milestone: validatedData.is_milestone,
      })
      .select()
      .single();

    if (error) {
      return serverErrorResponse('Failed to create photo entry', error.message);
    }

    return Response.json(successResponse(data), { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return validationErrorResponse(error.errors);
    }
    return serverErrorResponse('Internal server error', error.message);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { user, profile } = authResult;
    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get('id');

    if (!photoId) {
      return errorResponse('Photo ID is required', 'BAD_REQUEST', undefined, 400);
    }

    const supabase = await createClient();

    // Fetch photo to check ownership
    const { data: photo } = await supabase
      .from('progress_photos')
      .select('client_id, photo_url')
      .eq('id', photoId)
      .single();

    if (!photo) {
      return serverErrorResponse('Photo not found', '', 404);
    }

    // If client, can only delete their own photos
    if (profile?.role === 'client') {
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client || client.id !== photo.client_id) {
        return unauthorizedResponse();
      }
    }

    // Delete from storage (extract path from URL)
    try {
      const photoPath = photo.photo_url.split('/storage/v1/object/public/progress-photos/')[1];
      if (photoPath) {
        await supabase.storage.from('progress-photos').remove([photoPath]);
      }
    } catch (storageError) {
      console.error('Error deleting photo from storage:', storageError);
      // Continue with database deletion even if storage deletion fails
    }

    // Delete from database
    const { error } = await supabase
      .from('progress_photos')
      .delete()
      .eq('id', photoId);

    if (error) {
      return serverErrorResponse('Failed to delete photo', error.message);
    }

    return Response.json(successResponse({ message: 'Photo deleted successfully' }));
  } catch (error: any) {
    return serverErrorResponse('Internal server error', error.message);
  }
}



