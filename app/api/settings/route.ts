import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/api/auth';
import { successResponse, serverErrorResponse, validationErrorResponse } from '@/lib/api/response';
import { z } from 'zod';

const updateSettingsSchema = z.object({
  settings: z.array(z.object({
    key: z.string(),
    value: z.string().nullable(),
  })),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof Response) return authResult;

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const supabase = await createClient();

    let query = supabase
      .from('settings')
      .select('*')
      .order('category', { ascending: true })
      .order('key', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      return serverErrorResponse('Failed to fetch settings', error.message);
    }

    // Convert array to object for easier access
    const settingsObject: Record<string, string> = {};
    (data || []).forEach(setting => {
      settingsObject[setting.key] = setting.value || '';
    });

    return Response.json(successResponse({
      settings: data || [],
      settingsObject,
    }));
  } catch (error: any) {
    return serverErrorResponse('Internal server error', error.message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof Response) return authResult;

    const body = await request.json();
    const validatedData = updateSettingsSchema.parse(body);

    const supabase = await createClient();

    // Update settings in a transaction-like manner
    const updates = validatedData.settings.map(async (setting) => {
      const { data, error } = await supabase
        .from('settings')
        .update({ value: setting.value })
        .eq('key', setting.key)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update setting ${setting.key}: ${error.message}`);
      }

      return data;
    });

    const results = await Promise.all(updates);

    return Response.json(successResponse({
      updated: results.length,
      settings: results,
    }));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return validationErrorResponse(error.errors);
    }
    return serverErrorResponse('Internal server error', error.message);
  }
}



