import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const checkExistingSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional().nullable(),
}).refine(data => data.phone || data.email, {
  message: 'Either phone or email must be provided',
});

function getCategoryFromScore(score: number): 'excellent' | 'good' | 'warning' | 'high_alert' {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'warning';
  return 'high_alert';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = checkExistingSchema.parse(body);
    
    const supabase = await createClient();
    
    // Normalize phone to 10 digits (remove any non-digits) if provided
    const phoneDigits = validated.phone ? validated.phone.replace(/\D/g, '') : null;
    
    // Build query - check by phone OR email
    let query = supabase
      .from('health_assessments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);
    
    // Build OR condition based on what's provided
    if (phoneDigits && validated.email) {
      // Both provided - check either
      query = query.or(`phone.eq.${phoneDigits},email.eq.${validated.email}`);
    } else if (phoneDigits) {
      // Only phone provided
      query = query.eq('phone', phoneDigits);
    } else if (validated.email) {
      // Only email provided
      query = query.eq('email', validated.email);
    } else {
      // Neither provided (shouldn't happen due to refine, but handle gracefully)
      return NextResponse.json(
        { success: false, error: 'Either phone or email must be provided' },
        { status: 400 }
      );
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('[Check Existing] Error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to check existing assessment' },
        { status: 500 }
      );
    }
    
    if (data && data.length > 0) {
      const assessment = data[0];
      
      // Format the response to match AssessmentResult type
      return NextResponse.json({
        success: true,
        assessment: {
          assessmentId: assessment.id,
          name: assessment.name,
          phone: assessment.phone,
          email: assessment.email,
          scores: {
            overall: assessment.overall_score,
            physical: assessment.physical_score,
            nutrition: assessment.nutrition_score,
            lifestyle: assessment.lifestyle_score,
            mental: assessment.mental_score,
            pain_mobility: assessment.pain_mobility_score,
            goal_readiness: assessment.goal_readiness_score,
          },
          category: getCategoryFromScore(assessment.overall_score),
          recommendations: [], // Will be generated on demand if needed
          bmi: assessment.bmi,
          answers: assessment.raw_answers,
          createdAt: assessment.created_at,
        },
      });
    }
    
    return NextResponse.json({ success: false, assessment: null });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    console.error('[Check Existing] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

