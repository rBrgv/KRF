// ============================================================================
// HEALTH ASSESSMENT SCORING LOGIC
// ============================================================================

import { ScoreBreakdown } from './types/health-assessment';

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
 * Based on: energy, stairs, flexibility, exercise frequency, daily steps
 */
function calculatePhysicalScore(answers: Record<string, any>): number {
  let score = 0;
  
  // Energy level (1-5 scale) → 0-5 points
  const energy = parseInt(answers.physical_energy) || 1;
  score += (energy - 1) * 1.25; // 1→0, 2→1.25, 3→2.5, 4→3.75, 5→5
  
  // Stairs (yes/no) → 0-5 points
  const stairs = answers.physical_stairs || 'no';
  score += stairs === 'yes' ? 5 : 0;
  
  // Flexibility (choice) → 0-5 points
  const flexibility = answers.physical_flexibility || 'very_limited';
  const flexibilityPoints: Record<string, number> = {
    'very_flexible': 5,
    'moderate': 3.5,
    'somewhat_limited': 2,
    'very_limited': 0.5,
  };
  score += flexibilityPoints[flexibility] || 0;
  
  // Exercise frequency → 0-5 points
  const exerciseFreq = answers.physical_exercise_frequency || 'none';
  const exercisePoints: Record<string, number> = {
    'none': 0,
    '1-2': 1.5,
    '3-4': 3,
    '5-6': 4.5,
    'daily': 5,
  };
  score += exercisePoints[exerciseFreq] || 0;
  
  // Daily steps → 0-5 points
  const steps = answers.physical_daily_steps || 'under_3000';
  const stepsPoints: Record<string, number> = {
    'under_3000': 0,
    '3000-5000': 1.5,
    '5000-8000': 3,
    '8000-10000': 4.5,
    'over_10000': 5,
  };
  score += stepsPoints[steps] || 0;
  
  return Math.min(25, score);
}

/**
 * Nutrition Score (0-15)
 * Based on: breakfast, outside food, sugar, water, fruits, late-night eating
 */
function calculateNutritionScore(answers: Record<string, any>): number {
  let score = 0;
  
  // Breakfast (never skip = good) → 0-2.5 points
  const breakfast = answers.lifestyle_skip_breakfast || 'always';
  const breakfastPoints: Record<string, number> = {
    'never': 2.5,
    'rarely': 2,
    'sometimes': 1.5,
    'often': 1,
    'always': 0,
  };
  score += breakfastPoints[breakfast] || 0;
  
  // Outside food (less = better) → 0-2.5 points
  const outsideFood = answers.lifestyle_outside_food || 'daily';
  const outsideFoodPoints: Record<string, number> = {
    'rarely': 2.5,
    'weekly': 2,
    'often': 1.5,
    'daily': 0.5,
  };
  score += outsideFoodPoints[outsideFood] || 0;
  
  // Sugar consumption (low = better) → 0-2.5 points
  const sugar = answers.lifestyle_sugar || 'high';
  const sugarPoints: Record<string, number> = {
    'very_low': 2.5,
    'low': 2,
    'moderate': 1.5,
    'high': 0.5,
  };
  score += sugarPoints[sugar] || 0;
  
  // Water intake (more = better) → 0-2.5 points
  const water = answers.lifestyle_water || 'under_1';
  const waterPoints: Record<string, number> = {
    'under_1': 0.5,
    '1-2': 1.5,
    '2-3': 2.5,
    'over_3': 2.5,
  };
  score += waterPoints[water] || 0;
  
  // Fruits (more = better) → 0-2.5 points
  const fruits = answers.lifestyle_fruits || 'rarely';
  const fruitsPoints: Record<string, number> = {
    'rarely': 0.5,
    'weekly': 1.5,
    'often': 2,
    'daily': 2.5,
  };
  score += fruitsPoints[fruits] || 0;
  
  // Late-night eating (never = better) → 0-2.5 points
  const lateNight = answers.lifestyle_late_night || 'often';
  const lateNightPoints: Record<string, number> = {
    'never': 2.5,
    'rarely': 2,
    'sometimes': 1.5,
    'often': 0.5,
  };
  score += lateNightPoints[lateNight] || 0;
  
  return Math.min(15, score);
}

/**
 * Lifestyle Score (0-15)
 * Based on: sleep duration, sleep quality
 */
function calculateLifestyleScore(answers: Record<string, any>): number {
  let score = 0;
  
  // Sleep duration (7-8 hours = optimal) → 0-7.5 points
  const sleepDuration = answers.lifestyle_sleep_duration || 'under_5';
  const sleepDurationPoints: Record<string, number> = {
    'under_5': 1,
    '5-6': 3,
    '6-7': 5,
    '7-8': 7.5,
    'over_8': 6,
  };
  score += sleepDurationPoints[sleepDuration] || 0;
  
  // Sleep quality (1-5 scale) → 0-7.5 points
  const sleepQuality = parseInt(answers.lifestyle_sleep_quality) || 1;
  score += (sleepQuality - 1) * 1.875; // 1→0, 2→1.875, 3→3.75, 4→5.625, 5→7.5
  
  return Math.min(15, score);
}

/**
 * Mental Fitness Score (0-20)
 * Based on: confidence, stress management, consistency, emotional eating, work/life stress
 */
function calculateMentalScore(answers: Record<string, any>): number {
  let score = 0;
  
  // Confidence (choice, higher = better) → 0-4 points
  const confidence = answers.mental_confidence || 'not_confident';
  const confidencePoints: Record<string, number> = {
    'very_confident': 4,
    'confident': 3.5,
    'moderate': 2.5,
    'somewhat': 1.5,
    'not_confident': 0.5,
  };
  score += confidencePoints[confidence] || 0;
  
  // Stress management (choice, higher = better) → 0-4 points
  const stressMgmt = answers.mental_stress_management || 'very_poor';
  const stressMgmtPoints: Record<string, number> = {
    'excellent': 4,
    'good': 3.5,
    'moderate': 2.5,
    'poor': 1.5,
    'very_poor': 0.5,
  };
  score += stressMgmtPoints[stressMgmt] || 0;
  
  // Consistency (choice, higher = better) → 0-4 points
  const consistency = answers.mental_consistency || 'very_inconsistent';
  const consistencyPoints: Record<string, number> = {
    'very_consistent': 4,
    'consistent': 3.5,
    'moderate': 2.5,
    'inconsistent': 1.5,
    'very_inconsistent': 0.5,
  };
  score += consistencyPoints[consistency] || 0;
  
  // Emotional eating (choice, lower = better, reverse) → 0-4 points
  const emotionalEating = answers.mental_emotional_eating || 'very_often';
  const emotionalEatingPoints: Record<string, number> = {
    'never': 4,
    'rarely': 3.5,
    'sometimes': 2.5,
    'often': 1.5,
    'very_often': 0.5,
  };
  score += emotionalEatingPoints[emotionalEating] || 0;
  
  // Work/life stress (choice, lower = better, reverse) → 0-4 points
  const workLifeStress = answers.mental_work_life_stress || 'very_significantly';
  const workLifeStressPoints: Record<string, number> = {
    'not_at_all': 4,
    'slightly': 3.5,
    'moderately': 2.5,
    'significantly': 1.5,
    'very_significantly': 0.5,
  };
  score += workLifeStressPoints[workLifeStress] || 0;
  
  return Math.min(20, score);
}

/**
 * Pain/Mobility Score (0-10)
 * Based on: back pain, knee pain, neck/shoulder, sitting hours, toe touch, surgery history
 */
function calculatePainMobilityScore(answers: Record<string, any>): number {
  let score = 10; // Start with full score, deduct for issues
  
  // Back pain (frequency choice, never = best) → deduct 0-2 points
  const backPain = answers.pain_back || 'daily';
  const backPainDeduction: Record<string, number> = {
    'never': 0,
    'rarely': 0.5,
    'sometimes': 1,
    'often': 1.5,
    'daily': 2,
  };
  score -= backPainDeduction[backPain] || 0;
  
  // Knee pain (frequency choice, never = best) → deduct 0-2 points
  const kneePain = answers.pain_knee || 'daily';
  const kneePainDeduction: Record<string, number> = {
    'never': 0,
    'rarely': 0.5,
    'sometimes': 1,
    'often': 1.5,
    'daily': 2,
  };
  score -= kneePainDeduction[kneePain] || 0;
  
  // Neck/shoulder (frequency choice, never = best) → deduct 0-2 points
  const neckShoulder = answers.pain_neck_shoulder || 'daily';
  const neckShoulderDeduction: Record<string, number> = {
    'never': 0,
    'rarely': 0.5,
    'sometimes': 1,
    'often': 1.5,
    'daily': 2,
  };
  score -= neckShoulderDeduction[neckShoulder] || 0;
  
  // Sitting hours (more = worse) → deduct 0-1.5 points
  const sitting = answers.pain_sitting_hours || 'over_10';
  const sittingDeduction: Record<string, number> = {
    'under_4': 0,
    '4-6': 0.5,
    '6-8': 1,
    '8-10': 1.5,
    'over_10': 1.5,
  };
  score -= sittingDeduction[sitting] || 0;
  
  // Toe touch (yes/no) → deduct 0-1 point
  const toeTouch = answers.pain_toe_touch || 'no';
  score -= toeTouch === 'no' ? 1 : 0;
  
  // Surgery history (none = best) → deduct 0-1.5 points
  const surgery = answers.pain_surgery_history || 'major';
  const surgeryDeduction: Record<string, number> = {
    'none': 0,
    'minor': 0.5,
    'moderate': 1,
    'major': 1.5,
  };
  score -= surgeryDeduction[surgery] || 0;
  
  return Math.max(0, Math.min(10, score));
}

/**
 * Goal Readiness Score (0-15)
 * Based on: timeline, weekly commitment, preference, motivation
 */
function calculateGoalReadinessScore(answers: Record<string, any>): number {
  let score = 0;
  
  // Timeline (realistic = better) → 0-3.75 points
  const timeline = answers.goal_timeline || '1_month';
  const timelinePoints: Record<string, number> = {
    '1_month': 1, // Unrealistic
    '3_months': 2.5,
    '6_months': 3.5,
    '1_year': 3.75,
    'long_term': 3.75, // Best
  };
  score += timelinePoints[timeline] || 0;
  
  // Weekly commitment (more = better) → 0-3.75 points
  const commitment = answers.goal_weekly_commitment || '1-2';
  const commitmentPoints: Record<string, number> = {
    '1-2': 1.5,
    '3-4': 3,
    '5-6': 3.75,
    'daily': 3.5, // Slightly less (sustainability)
  };
  score += commitmentPoints[commitment] || 0;
  
  // Preference (any is good, studio slightly better) → 0-3.75 points
  const preference = answers.goal_preference || 'home';
  const preferencePoints: Record<string, number> = {
    'studio': 3.75,
    'home': 3,
    'online': 3,
    'mixed': 3.5,
  };
  score += preferencePoints[preference] || 0;
  
  // Motivation (1-5 scale, higher = better) → 0-3.75 points
  const motivation = parseInt(answers.goal_motivation) || 1;
  score += (motivation - 1) * 0.9375; // 1→0, 2→0.9375, 3→1.875, 4→2.8125, 5→3.75
  
  return Math.min(15, score);
}

