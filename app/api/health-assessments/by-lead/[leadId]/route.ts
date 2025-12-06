import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getOverallCategory } from '@/lib/recommendations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await params;
    const supabase = await createClient();
    
    // Fetch health assessment linked to this lead
    const { data, error } = await supabase
      .from('health_assessments')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No assessment found
        return NextResponse.json({ success: false, assessment: null });
      }
      console.error('[Health Assessments API] Error fetching assessment:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch assessment' },
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json({ success: false, assessment: null });
    }
    
    // Format the response
    const category = getOverallCategory(data.overall_score);
    
    return NextResponse.json({
      success: true,
      assessment: {
        id: data.id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        age_group: data.age_group,
        overall_score: data.overall_score,
        physical_score: data.physical_score,
        lifestyle_score: data.lifestyle_score,
        nutrition_score: data.nutrition_score,
        mental_score: data.mental_score,
        pain_mobility_score: data.pain_mobility_score,
        goal_readiness_score: data.goal_readiness_score,
        category,
        bmi: data.bmi,
        height_cm: data.height_cm,
        weight_kg: data.weight_kg,
        raw_answers: data.raw_answers,
        created_at: data.created_at,
      },
    });
  } catch (error: any) {
    console.error('[Health Assessments API] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

