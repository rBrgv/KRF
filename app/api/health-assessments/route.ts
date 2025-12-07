import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateScores, calculateBMI } from '@/lib/scoring';
import { getOverallCategory, getRecommendations } from '@/lib/recommendations';
import { successResponse, validationErrorResponse, serverErrorResponse } from '@/lib/api/response';
import { checkDuplicateLead, mergeSources, mergeGoals } from '@/lib/leads/duplicate-check';
import { formatDate } from '@/lib/utils';
import { z } from 'zod';

// Validation schema
const healthAssessmentSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  phone: z.string()
    .length(10, 'Phone must be exactly 10 digits')
    .regex(/^[6-9]\d{9}$/, 'Phone number must start with 6, 7, 8, or 9'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  goal: z.string().optional().or(z.literal('')), // Add goal field (optional for backward compatibility)
  ageGroup: z.string().min(1, 'Age group is required'),
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
      email: validated.email.trim(),
      age_group: validated.ageGroup,
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
    
    // Create or update a lead from the assessment
    let leadId: string | null = null;
    try {
      // Use provided goal text or extract from answers if available
      const goalText = validated.goal?.trim() || '';
      const goalAnswer = validated.answers.first_outcome || validated.answers.desired_feeling;
      const goalMap: Record<string, string> = {
        'lighter_energetic': 'Feel lighter & energetic',
        'pain_reduction': 'Pain reduction',
        'inch_fat_loss': 'Visible inch loss / fat loss',
        'strength_improvement': 'Strength improvement',
        'out_of_medication': 'Get out of medication',
        'confident': 'Confident',
        'strong': 'Strong',
        'pain_free': 'Pain-free',
        'leaner_lighter': 'Leaner & lighter',
        'more_energetic': 'More energetic',
      };
      const goal = goalText || goalMap[goalAnswer] || 'Health & Fitness Assessment';
      
      // Check for duplicate lead (same phone or email)
      const { isDuplicate, existingLead } = await checkDuplicateLead(
        supabase,
        validated.phone.trim(),
        validated.email.trim()
      );

      if (isDuplicate && existingLead) {
        // Use existing lead ID
        leadId = existingLead.id;
        
        // Update existing lead with assessment info
        const assessmentNote = `Health Assessment (${formatDate(new Date().toISOString())}): Score ${scores.overall}/100 (${categoryLabels[category]})`;
        const updatedNotes = existingLead.notes
          ? `${existingLead.notes}\n\n${assessmentNote}`
          : assessmentNote;
        
        const mergedSource = mergeSources(existingLead.source, 'health_assessment');
        const mergedGoal = mergeGoals(existingLead.goal, goal);
        
        await supabase
          .from('leads')
          .update({
            notes: updatedNotes,
            source: mergedSource,
            goal: mergedGoal || existingLead.goal,
            // Update email if it was missing
            email: existingLead.email || validated.email.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingLead.id);
        
        // Link assessment to existing lead
        await supabase
          .from('health_assessments')
          .update({
            converted_to_lead: true,
            lead_id: existingLead.id,
          })
          .eq('id', data.id);
        
        console.log('[Health Assessments API] Linked assessment to existing lead:', existingLead.id);
      } else {
        // No duplicate found, create new lead
        const { data: leadData, error: leadError } = await supabase
          .from('leads')
          .insert([
            {
              name: validated.name.trim(),
              phone: validated.phone.trim(),
              email: validated.email.trim(),
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
          
          console.log('[Health Assessments API] Created new lead:', leadId);
        }
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


