import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateScores, calculateBMI } from '@/lib/scoring';
import { getOverallCategory, getRecommendations } from '@/lib/recommendations';
import { successResponse, validationErrorResponse, serverErrorResponse } from '@/lib/api/response';
import { z } from 'zod';

// Validation schema
const healthAssessmentSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  phone: z.string()
    .length(10, 'Phone must be exactly 10 digits')
    .regex(/^[6-9]\d{9}$/, 'Phone number must start with 6, 7, 8, or 9'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  goal: z.string().optional().or(z.literal('')), // Add goal field (optional for backward compatibility)
  answers: z.record(z.any()),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validated = healthAssessmentSchema.parse(body);
    
    // Calculate scores
    let scores;
    try {
      scores = calculateScores(validated.answers);
    } catch (scoreError: any) {
      console.error('[Health Assessments API] Error calculating scores:', scoreError);
      return serverErrorResponse('Failed to calculate scores', scoreError.message);
    }
    
    // Calculate BMI if height and weight provided
    let bmi: number | null = null;
    const heightCm = validated.answers.physical_height ? parseInt(validated.answers.physical_height) : null;
    const weightKg = validated.answers.physical_weight ? parseFloat(validated.answers.physical_weight) : null;
    
    if (heightCm && weightKg && heightCm > 0 && weightKg > 0) {
      bmi = calculateBMI(heightCm, weightKg);
    }
    
    // Get category and recommendations
    let category, recommendations;
    try {
      category = getOverallCategory(scores.overall);
      recommendations = getRecommendations(scores, validated.answers);
    } catch (recError: any) {
      console.error('[Health Assessments API] Error generating recommendations:', recError);
      return serverErrorResponse('Failed to generate recommendations', recError.message);
    }
    
    const categoryLabels = {
      excellent: 'Excellent',
      good: 'Good',
      warning: 'Needs Attention',
      high_alert: 'High Alert',
    };
    
    // Save to database
    const supabase = await createClient();
    
    const insertData = {
      name: validated.name.trim(),
      phone: validated.phone.trim(),
      email: validated.email?.trim() || null,
      height_cm: heightCm,
      weight_kg: weightKg,
      bmi: bmi,
      overall_score: scores.overall,
      physical_score: scores.physical,
      lifestyle_score: scores.lifestyle,
      nutrition_score: scores.nutrition,
      mental_score: scores.mental,
      pain_mobility_score: scores.pain_mobility,
      goal_readiness_score: scores.goal_readiness,
      raw_answers: validated.answers,
    };
    
    console.log('[Health Assessments API] Inserting data:', JSON.stringify(insertData, null, 2));
    
    const { data, error } = await supabase
      .from('health_assessments')
      .insert([insertData])
      .select()
      .single();
    
    if (error) {
      console.error('[Health Assessments API] Error saving assessment:', error);
      console.error('[Health Assessments API] Error code:', error.code);
      console.error('[Health Assessments API] Error message:', error.message);
      console.error('[Health Assessments API] Error details:', error.details);
      console.error('[Health Assessments API] Error hint:', error.hint);
      return serverErrorResponse(
        `Failed to save assessment: ${error.message}`,
        `Code: ${error.code}, Details: ${error.details || 'N/A'}, Hint: ${error.hint || 'N/A'}`
      );
    }
    
    // Create a lead from the assessment
    let leadId: string | null = null;
    try {
      // Use provided goal text or extract from answers if available
      const goalText = validated.goal?.trim() || '';
      const goalAnswer = validated.answers.goal_primary;
      const goalMap: Record<string, string> = {
        'weight_loss': 'Weight Loss',
        'weight_gain': 'Weight Gain / Muscle Building',
        'strength': 'Build Strength',
        'flexibility': 'Improve Flexibility',
        'endurance': 'Improve Endurance',
        'pain_relief': 'Pain Relief / Rehabilitation',
        'general_fitness': 'General Fitness',
      };
      const goal = goalText || goalMap[goalAnswer] || 'Health & Fitness Assessment';
      
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert([
          {
            name: validated.name.trim(),
            phone: validated.phone.trim(),
            email: validated.email?.trim() || null,
            goal: goal,
            source: 'health_assessment',
            status: 'new',
            notes: `Health Assessment Score: ${scores.overall}/100 (${categoryLabels[category]}). Generated from health diagnostic system.`,
          },
        ])
        .select()
        .single();
      
      if (leadError) {
        console.error('[Health Assessments API] Error creating lead:', leadError);
        // Don't fail the assessment if lead creation fails, just log it
      } else {
        leadId = leadData.id;
        
        // Update assessment to link it to the lead
        await supabase
          .from('health_assessments')
          .update({
            converted_to_lead: true,
            lead_id: leadId,
          })
          .eq('id', data.id);
      }
    } catch (leadErr) {
      console.error('[Health Assessments API] Error in lead creation process:', leadErr);
      // Continue even if lead creation fails
    }
    
    // Return result
    return NextResponse.json(
      successResponse({
        assessmentId: data.id,
        scores,
        category,
        recommendations,
        bmi,
        name: validated.name.trim(),
        phone: validated.phone.trim(),
        email: validated.email?.trim() || null,
        answers: validated.answers,
        leadId,
      }),
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === 'ZodError') {
      console.error('[Health Assessments API] Validation error:', error.errors);
      return validationErrorResponse(error.errors);
    }
    console.error('[Health Assessments API] Unexpected error:', error);
    return serverErrorResponse('Internal server error', error.message);
  }
}


