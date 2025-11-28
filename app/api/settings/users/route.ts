import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/api/auth';
import { successResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api/response';
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string().min(1),
  phone: z.string().optional(),
  role: z.enum(['admin', 'trainer']),
});

const updateUserSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(1).optional(),
  phone: z.string().optional().nullable(),
  role: z.enum(['admin', 'trainer']).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof Response) return authResult;

    const supabase = await createClient();

    // Get all users with admin or trainer role
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .in('role', ['admin', 'trainer'])
      .order('created_at', { ascending: false });

    if (error) {
      return serverErrorResponse('Failed to fetch users', error.message);
    }

    return Response.json(successResponse(data || []));
  } catch (error: any) {
    return serverErrorResponse('Internal server error', error.message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof Response) return authResult;

    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    const supabase = await createClient();

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: validatedData.full_name,
      },
    });

    if (authError || !authData.user) {
      return serverErrorResponse('Failed to create user', authError?.message || 'Unknown error');
    }

    // Update user profile with role
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .update({
        role: validatedData.role,
        full_name: validatedData.full_name,
        phone: validatedData.phone || null,
      })
      .eq('id', authData.user.id)
      .select()
      .single();

    if (profileError) {
      // If profile update fails, try to create it
      const { data: newProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: validatedData.email,
          role: validatedData.role,
          full_name: validatedData.full_name,
          phone: validatedData.phone || null,
        })
        .select()
        .single();

      if (createError) {
        return serverErrorResponse('Failed to create user profile', createError.message);
      }

      return Response.json(successResponse(newProfile), { status: 201 });
    }

    return Response.json(successResponse(profileData), { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return validationErrorResponse(error.errors);
    }
    return serverErrorResponse('Internal server error', error.message);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof Response) return authResult;

    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    const supabase = await createClient();

    const updateData: any = {};
    if (validatedData.full_name !== undefined) updateData.full_name = validatedData.full_name;
    if (validatedData.phone !== undefined) updateData.phone = validatedData.phone;
    if (validatedData.role !== undefined) updateData.role = validatedData.role;

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', validatedData.id)
      .select()
      .single();

    if (error) {
      return serverErrorResponse('Failed to update user', error.message);
    }

    return Response.json(successResponse(data));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return validationErrorResponse(error.errors);
    }
    return serverErrorResponse('Internal server error', error.message);
  }
}



