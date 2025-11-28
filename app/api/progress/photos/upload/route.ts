import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/api/auth';
import { successResponse, serverErrorResponse, unauthorizedResponse, errorResponse } from '@/lib/api/response';

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    const { user, profile } = authResult;
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const clientId = formData.get('client_id') as string;
    const date = formData.get('date') as string;
    const viewType = formData.get('view_type') as string;

    if (!file || !clientId || !date || !viewType) {
      return errorResponse('Missing required fields: file, client_id, date, view_type', 'BAD_REQUEST', undefined, 400);
    }

    const supabase = await createClient();

    // If client, can only upload for themselves
    if (profile?.role === 'client') {
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (clientError) {
        console.error('Error fetching client:', clientError);
        return serverErrorResponse('Failed to verify client', clientError.message);
      }

      if (!client || client.id !== clientId) {
        console.error('Client ID mismatch:', { clientId, clientIdFromDb: client?.id, userId: user.id });
        return unauthorizedResponse();
      }
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return errorResponse('File must be an image', 'BAD_REQUEST', undefined, 400);
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return errorResponse('File size must be less than 10MB', 'BAD_REQUEST', undefined, 400);
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${clientId}/${date}/${viewType}_${Date.now()}.${fileExt}`;

    console.log('Upload attempt:', {
      clientId,
      fileName,
      fileSize: file.size,
      fileType: file.type,
      userRole: profile?.role,
    });

    // Convert File to ArrayBuffer then Buffer (required for Supabase Storage)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    // Note: We don't check bucket existence first as it may fail due to RLS policies
    // Instead, we'll catch the error and provide helpful messages
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('progress-photos')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      console.error('Error details:', JSON.stringify(uploadError, null, 2));
      
      // Provide more helpful error messages
      const errorMessage = uploadError.message || '';
      
      if (errorMessage.includes('new row violates row-level security') || 
          errorMessage.includes('permission denied') ||
          errorMessage.includes('RLS')) {
        return serverErrorResponse(
          'Permission denied',
          'You do not have permission to upload photos. Please check your storage policies. Make sure the "Clients can upload own photos" policy is active.',
          403
        );
      }
      
      if (errorMessage.includes('Bucket not found') || 
          errorMessage.includes('does not exist')) {
        return serverErrorResponse(
          'Storage bucket not found',
          'The "progress-photos" bucket does not exist or is not accessible. Please create it in Supabase Dashboard → Storage and ensure it is set to Public.',
          404
        );
      }
      
      if (errorMessage.includes('duplicate') || errorMessage.includes('already exists')) {
        // Try with a different filename
        const retryFileName = `${clientId}/${date}/${viewType}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { data: retryData, error: retryError } = await supabase.storage
          .from('progress-photos')
          .upload(retryFileName, buffer, {
            contentType: file.type,
            upsert: false,
          });
        
        if (retryError) {
          return serverErrorResponse('Failed to upload photo', retryError.message);
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('progress-photos')
          .getPublicUrl(retryFileName);
        
        return Response.json(
          successResponse({
            photo_url: publicUrl,
            file_name: retryFileName,
          })
        );
      }
      
      return serverErrorResponse(
        'Failed to upload photo', 
        errorMessage || 'Unknown error occurred. Please check browser console for details.'
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('progress-photos')
      .getPublicUrl(fileName);

    return Response.json(
      successResponse({
        photo_url: publicUrl,
        file_name: fileName,
      })
    );
  } catch (error: any) {
    return serverErrorResponse('Internal server error', error.message);
  }
}

