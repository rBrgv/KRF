import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createLeadSchema } from '@/lib/validations';
import { sanitizeSearchInput } from '@/lib/utils/sanitize';
import { successResponse, errorResponse, validationErrorResponse, serverErrorResponse } from '@/lib/api/response';
import { getPaginationParams } from '@/lib/api/auth';
import { requireAdminOrTrainer } from '@/lib/api/auth';
import { checkDuplicateLead, mergeSources, mergeGoals } from '@/lib/leads/duplicate-check';

export async function POST(request: NextRequest) {
  try {
    // POST is public - allows contact form submissions
    // No authentication required for lead creation from public forms
    
    const body = await request.json();
    
    // Validate input using Zod schema
    const validatedData = createLeadSchema.parse(body);

    const supabase = await createClient();

    // Check for duplicate lead (same phone or email)
    const { isDuplicate, existingLead } = await checkDuplicateLead(
      supabase,
      validatedData.phone.trim(),
      validatedData.email?.trim() || null
    );

    if (isDuplicate && existingLead) {
      // Update existing lead instead of creating duplicate
      const newSource = validatedData.source || 'website';
      const mergedSource = mergeSources(existingLead.source, newSource);
      const mergedGoal = mergeGoals(existingLead.goal, validatedData.goal?.trim() || null);
      
      // Update existing lead with new information
      const updateData: any = {
        source: mergedSource,
        updated_at: new Date().toISOString(),
      };
      
      // Update email if it was missing
      if (!existingLead.email && validatedData.email?.trim()) {
        updateData.email = validatedData.email.trim();
      }
      
      // Update goal if provided
      if (mergedGoal) {
        updateData.goal = mergedGoal;
      }
      
      // Update UTM params if new ones provided (prefer new over old)
      if (validatedData.utm_source?.trim()) {
        updateData.utm_source = validatedData.utm_source.trim();
      }
      if (validatedData.utm_medium?.trim()) {
        updateData.utm_medium = validatedData.utm_medium.trim();
      }
      if (validatedData.utm_campaign?.trim()) {
        updateData.utm_campaign = validatedData.utm_campaign.trim();
      }
      if (validatedData.utm_content?.trim()) {
        updateData.utm_content = validatedData.utm_content.trim();
      }
      if (validatedData.referrer?.trim()) {
        updateData.referrer = validatedData.referrer.trim();
      }
      
      const { data: updatedLead, error: updateError } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', existingLead.id)
        .select()
        .single();

      if (updateError) {
        console.error('[Leads API] Error updating existing lead:', updateError);
        return serverErrorResponse('Failed to update existing lead', updateError.message);
      }

      console.log('[Leads API] Updated existing lead (duplicate prevented):', updatedLead.id);
      return Response.json(successResponse(updatedLead), { status: 200 });
    }

    // No duplicate found, create new lead
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name: validatedData.name.trim(),
          email: validatedData.email?.trim() || null,
          phone: validatedData.phone.trim(),
          goal: validatedData.goal?.trim() || null,
          source: validatedData.source || 'website',
          utm_source: validatedData.utm_source?.trim() || null,
          utm_medium: validatedData.utm_medium?.trim() || null,
          utm_campaign: validatedData.utm_campaign?.trim() || null,
          utm_content: validatedData.utm_content?.trim() || null,
          referrer: validatedData.referrer?.trim() || null,
          status: 'new',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[Leads API] Error creating lead:', error);
      return serverErrorResponse('Failed to create lead', error.message);
    }

    console.log('[Leads API] Lead created successfully:', data.id);
    return Response.json(successResponse(data), { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      console.error('[Leads API] Validation error:', error.errors);
      return validationErrorResponse(error.errors);
    }
    console.error('[Leads API] Unexpected error:', error);
    return serverErrorResponse('Internal server error', error.message);
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdminOrTrainer();
    if (authResult instanceof Response) return authResult;

    const { searchParams } = new URL(request.url);
    const { page, limit } = getPaginationParams(request, 20, 100);
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const searchRaw = searchParams.get('search');
    const search = searchRaw ? sanitizeSearchInput(searchRaw) : null;

    const supabase = await createClient();

    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (source) {
      query = query.eq('source', source);
    }
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
      console.error('Error fetching leads:', error);
      return serverErrorResponse('Failed to fetch leads', error.message);
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
    console.error('Error in GET /api/leads:', error);
    return serverErrorResponse('Internal server error', error.message);
  }
}
