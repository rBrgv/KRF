import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateScores, calculateBMI } from '@/lib/scoring';
import { getOverallCategory, getRecommendations } from '@/lib/recommendations';
import { successResponse, validationErrorResponse, serverErrorResponse } from '@/lib/api/response';
import { z } from 'zod';

// Validation schema
const healthAssessmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  answers: z.record(z.any()),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validated = healthAssessmentSchema.parse(body);
    
    // Calculate scores
    const scores = calculateScores(validated.answers);
    
    // Calculate BMI if height and weight provided
    let bmi: number | null = null;
    const heightCm = validated.answers.physical_height ? parseInt(validated.answers.physical_height) : null;
    const weightKg = validated.answers.physical_weight ? parseFloat(validated.answers.physical_weight) : null;
    
    if (heightCm && weightKg && heightCm > 0 && weightKg > 0) {
      bmi = calculateBMI(heightCm, weightKg);
    }
    
    // Get category and recommendations
    const category = getOverallCategory(scores.overall);
    const recommendations = getRecommendations(scores, validated.answers);
    
    const categoryLabels = {
      excellent: 'Excellent',
      good: 'Good',
      warning: 'Needs Attention',
      high_alert: 'High Alert',
    };
    
    // Save to database
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('health_assessments')
      .insert([
        {
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
        },
      ])
      .select()
      .single();
    
    if (error) {
      console.error('[Health Assessments API] Error saving assessment:', error);
      return serverErrorResponse('Failed to save assessment', error.message);
    }
    
    // Create a lead from the assessment
    let leadId: string | null = null;
    try {
      // Extract goal from answers if available
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
      const goal = goalMap[goalAnswer] || 'Health & Fitness Assessment';
      
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


