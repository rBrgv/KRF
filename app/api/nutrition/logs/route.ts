import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { createNutritionLogSchema, updateNutritionLogSchema } from '@/lib/validations';
import { successResponse, validationErrorResponse, serverErrorResponse, unauthorizedResponse } from '@/lib/api/response';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { food_entries, ...logData } = body;
    const validatedData = createNutritionLogSchema.parse(logData);

    const supabase = await createClient();

    // Check if user is a client - if so, verify they're logging for themselves
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'client') {
      // Client can only log for themselves
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client || client.id !== validatedData.client_id) {
        return NextResponse.json(
          { error: 'You can only log nutrition for your own account' },
          { status: 403 }
        );
      }
    }
    // Admin/trainer can log for any client

    // Check if log already exists for this client/date
    const { data: existing } = await supabase
      .from('nutrition_logs')
      .select('id')
      .eq('client_id', validatedData.client_id)
      .eq('date', validatedData.date)
      .single();

    if (existing) {
      // Update existing log
      const updateData: any = {};
      if (validatedData.total_calories !== undefined) updateData.total_calories = validatedData.total_calories;
      if (validatedData.total_protein_g !== undefined) updateData.total_protein_g = validatedData.total_protein_g;
      if (validatedData.total_carbs_g !== undefined) updateData.total_carbs_g = validatedData.total_carbs_g;
      if (validatedData.total_fats_g !== undefined) updateData.total_fats_g = validatedData.total_fats_g;
      if (validatedData.notes !== undefined) updateData.notes = validatedData.notes || null;
      if (validatedData.source !== undefined) updateData.source = validatedData.source;

      const { data, error } = await supabase
        .from('nutrition_logs')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating nutrition log:', error);
        return NextResponse.json(
          { error: 'Failed to update nutrition log', details: error.message },
          { status: 500 }
        );
      }

      // Delete existing food entries and create new ones if provided
      if (food_entries && Array.isArray(food_entries)) {
        await supabase.from('food_log_entries').delete().eq('nutrition_log_id', existing.id);
        
        if (food_entries.length > 0) {
          const entriesToInsert = food_entries.map((entry: any) => ({
            nutrition_log_id: existing.id,
            food_id: entry.food_id,
            serving_size_g: entry.serving_size_g,
            calories: entry.calories,
            protein_g: entry.protein_g,
            carbs_g: entry.carbs_g,
            fats_g: entry.fats_g,
            meal_type: entry.meal_type || null,
          }));

          await supabase.from('food_log_entries').insert(entriesToInsert);
        }
      }

      return NextResponse.json({ success: true, data }, { status: 200 });
    }

    // Create new log
    const { data, error } = await supabase
      .from('nutrition_logs')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      console.error('Error creating nutrition log:', error);
      return NextResponse.json(
        { error: 'Failed to create nutrition log', details: error.message },
        { status: 500 }
      );
    }

    // Insert food entries if provided
        if (food_entries && Array.isArray(food_entries) && food_entries.length > 0) {
          const entriesToInsert = food_entries.map((entry: any) => ({
            nutrition_log_id: data.id,
            food_id: entry.food_id,
            serving_size_g: entry.serving_size_g,
            calories: entry.calories,
            protein_g: entry.protein_g,
            carbs_g: entry.carbs_g,
            fats_g: entry.fats_g,
            meal_type: entry.meal_type || null,
          }));

      const { error: entriesError } = await supabase
        .from('food_log_entries')
        .insert(entriesToInsert);

      if (entriesError) {
        console.error('Error creating food log entries:', entriesError);
        // Don't fail the whole request, just log the error
      }
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error in POST /api/nutrition/logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { getPaginationParams } = await import('@/lib/api/auth');
    const { limit } = getPaginationParams(request, 50, 100);
    const { searchParams } = new URL(request.url);
    let clientId = searchParams.get('client_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    const supabase = await createClient();

    // Check if user is a client - if so, they can only view their own logs
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'client') {
      // Client can only view their own logs
      const { data: client } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!client) {
        return NextResponse.json(
          { error: 'Client profile not found' },
          { status: 404 }
        );
      }

      // Force client_id to be their own
      clientId = client.id;
    }
    // Admin/trainer can view any client's logs

    let query = supabase
      .from('nutrition_logs')
      .select(`
        *,
        clients:client_id (name),
        food_log_entries (
          id,
          serving_size_g,
          calories,
          protein_g,
          carbs_g,
          fats_g,
          meal_type,
          foods:food_id (
            id,
            name,
            category,
            description
          )
        )
      `)
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
      console.error('Error fetching nutrition logs:', error);
      return serverErrorResponse('Failed to fetch nutrition logs', error.message);
    }

    return Response.json(successResponse(data || []));
  } catch (error: any) {
    console.error('Error in GET /api/nutrition/logs:', error);
    return serverErrorResponse('Internal server error', error.message);
  }
}

