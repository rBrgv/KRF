// ============================================================================
// HEALTH ASSESSMENT SCORING LOGIC
// ============================================================================

import { ScoreBreakdown } from './types/health-assessment';

/**
 * Helper to get value from answer (handles arrays for multiple-choice questions)
 * For arrays, returns the first value (or you can implement averaging logic)
 */
function getAnswerValue(answer: any): any {
  if (Array.isArray(answer)) {
    return answer.length > 0 ? answer[0] : null;
  }
  return answer;
}

/**
 * Helper to check if any value in array matches
 */
function hasAnswerValue(answer: any, values: string[]): boolean {
  if (Array.isArray(answer)) {
    return answer.some(val => values.includes(val));
  }
  return values.includes(answer);
}

/**
 * Calculate BMI from height (cm) and weight (kg)
 */
export function calculateBMI(heightCm: number, weightKg: number): number {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    return 0;
  }
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(2));
}

/**
 * Calculate all category scores from answers
 */
export function calculateScores(answers: Record<string, any>): ScoreBreakdown {
  // Physical Score (0-25)
  const physicalScore = calculatePhysicalScore(answers);
  
  // Nutrition Score (0-15)
  const nutritionScore = calculateNutritionScore(answers);
  
  // Lifestyle Score (0-15)
  const lifestyleScore = calculateLifestyleScore(answers);
  
  // Mental Score (0-20)
  const mentalScore = calculateMentalScore(answers);
  
  // Pain/Mobility Score (0-10)
  const painMobilityScore = calculatePainMobilityScore(answers);
  
  // Goal Readiness Score (0-15)
  const goalReadinessScore = calculateGoalReadinessScore(answers);
  
  // Overall Score (sum of all categories, max 100)
  const overall = Math.round(
    physicalScore + 
    nutritionScore + 
    lifestyleScore + 
    mentalScore + 
    painMobilityScore + 
    goalReadinessScore
  );
  
  return {
    overall: Math.min(100, Math.max(0, overall)),
    physical: Math.round(physicalScore),
    lifestyle: Math.round(lifestyleScore),
    nutrition: Math.round(nutritionScore),
    mental: Math.round(mentalScore),
    pain_mobility: Math.round(painMobilityScore),
    goal_readiness: Math.round(goalReadinessScore),
  } as ScoreBreakdown;
}

/**
 * Physical Health Score (0-25)
 * Based on: energy_level, daily_rest, tired_after_waking
 */
function calculatePhysicalScore(answers: Record<string, any>): number {
  let score = 0;
  
  // Energy level → 0-8.33 points
  const energy = getAnswerValue(answers.energy_level) || 'low_energy';
  const energyPoints: Record<string, number> = {
    'always_energetic': 8.33,
    'few_hours': 6.25,
    'only_morning': 4.17,
    'low_energy': 2.08,
  };
  score += energyPoints[energy] || 0;
  
  // Daily rest (sleep + breaks) → 0-8.33 points
  const rest = getAnswerValue(answers.daily_rest) || 'less_5';
  const restPoints: Record<string, number> = {
    '8_plus': 8.33,
    '6_7': 6.25,
    '5_6': 4.17,
    'less_5': 2.08,
  };
  score += restPoints[rest] || 0;
  
  // Tired after waking → 0-8.34 points
  const tired = getAnswerValue(answers.tired_after_waking) || 'almost_daily';
  const tiredPoints: Record<string, number> = {
    'never': 8.34,
    'sometimes': 6.25,
    'often': 4.17,
    'almost_daily': 2.08,
  };
  score += tiredPoints[tired] || 0;
  
  return Math.min(25, score);
}

/**
 * Nutrition Score (0-15)
 * Based on: nutrition_attention
 */
function calculateNutritionScore(answers: Record<string, any>): number {
  let score = 0;
  
  // Nutrition attention → 0-15 points
  const nutrition = getAnswerValue(answers.nutrition_attention) || 'dont_think';
  const nutritionPoints: Record<string, number> = {
    'plan_meals': 15,
    'try_not_consistent': 10,
    'eat_available': 5,
    'dont_think': 2.5,
  };
  score += nutritionPoints[nutrition] || 0;
  
  return Math.min(15, score);
}

/**
 * Lifestyle Score (0-15)
 * Based on: daily_rest (already counted in physical, but keeping for structure)
 * This is now part of physical score, so return 0 or merge logic
 */
function calculateLifestyleScore(answers: Record<string, any>): number {
  // Lifestyle is now part of physical score (daily_rest)
  // Keeping this function for structure but returning 0
  // Or you can add other lifestyle factors here
  return 0;
}

/**
 * Mental Fitness Score (0-20)
 * Based on: stress_level, fitness_barrier
 */
function calculateMentalScore(answers: Record<string, any>): number {
  let score = 0;
  
  // Stress level → 0-10 points
  const stress = getAnswerValue(answers.stress_level) || 'very_high';
  const stressPoints: Record<string, number> = {
    'very_low': 10,
    'manageable': 7.5,
    'high': 5,
    'very_high': 2.5,
  };
  score += stressPoints[stress] || 0;
  
  // Fitness barrier (multiple choice - count barriers, fewer = better) → 0-10 points
  const barriers = Array.isArray(answers.fitness_barrier) ? answers.fitness_barrier : 
                   (answers.fitness_barrier ? [answers.fitness_barrier] : []);
  // Fewer barriers = higher score
  const barrierCount = barriers.length;
  const barrierPoints = Math.max(0, 10 - (barrierCount * 2.5)); // 0 barriers = 10, 1 = 7.5, 2 = 5, 3 = 2.5, 4 = 0
  score += barrierPoints;
  
  return Math.min(20, score);
}

/**
 * Pain/Mobility Score (0-10)
 * Based on: pain_experience
 */
function calculatePainMobilityScore(answers: Record<string, any>): number {
  let score = 0;
  
  // Pain experience → 0-10 points (reverse: no pain = high score)
  const pain = getAnswerValue(answers.pain_experience) || 'often_daily';
  const painPoints: Record<string, number> = {
    'no_pain': 10,
    'rarely': 7.5,
    'sometimes': 5,
    'often_daily': 2.5,
  };
  score += painPoints[pain] || 0;
  
  return Math.min(10, score);
}

/**
 * Goal Readiness Score (0-15)
 * Based on: desired_feeling, medical_condition, current_activity, last_proud_moment, first_outcome
 */
function calculateGoalReadinessScore(answers: Record<string, any>): number {
  let score = 0;
  
  // Desired feeling (multiple choice - more positive feelings = better) → 0-3 points
  const feelings = Array.isArray(answers.desired_feeling) ? answers.desired_feeling : 
                   (answers.desired_feeling ? [answers.desired_feeling] : []);
  const feelingCount = feelings.length;
  score += Math.min(3, feelingCount * 0.75); // 1 feeling = 0.75, 2 = 1.5, 3 = 2.25, 4+ = 3
  
  // Medical condition (no condition = better) → 0-3 points
  const medical = getAnswerValue(answers.medical_condition) || 'medication_rehab';
  const medicalPoints: Record<string, number> = {
    'no_condition': 3,
    'thyroid_pcos_diabetes_bp': 2,
    'surgery_injury': 1.5,
    'medication_rehab': 1,
  };
  score += medicalPoints[medical] || 0;
  
  // Current activity (multiple choice - active = better) → 0-3 points
  const activities = Array.isArray(answers.current_activity) ? answers.current_activity : 
                     (answers.current_activity ? [answers.current_activity] : []);
  const hasActivity = !activities.includes('not_active') && activities.length > 0;
  score += hasActivity ? 3 : 1; // Active = 3, not active = 1
  
  // Last proud moment (recent = better) → 0-3 points
  const proud = getAnswerValue(answers.last_proud_moment) || 'never_felt';
  const proudPoints: Record<string, number> = {
    'recently': 3,
    'months_ago': 2,
    'years_ago': 1,
    'never_felt': 0.5,
  };
  score += proudPoints[proud] || 0;
  
  // First outcome (clear goal = better) → 0-3 points
  const outcome = getAnswerValue(answers.first_outcome) || 'lighter_energetic';
  const outcomePoints: Record<string, number> = {
    'lighter_energetic': 3,
    'pain_reduction': 2.5,
    'inch_fat_loss': 2.5,
    'strength_improvement': 2,
    'out_of_medication': 1.5,
  };
  score += outcomePoints[outcome] || 0;
  
  return Math.min(15, score);
}

