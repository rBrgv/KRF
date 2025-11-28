// ============================================================================
// HEALTH ASSESSMENT RECOMMENDATIONS LOGIC
// ============================================================================

import { AssessmentCategory, ScoreBreakdown } from './types/health-assessment';

/**
 * Determine overall category based on score
 */
export function getOverallCategory(overall: number): AssessmentCategory {
  if (overall >= 80) return 'excellent';
  if (overall >= 60) return 'good';
  if (overall >= 40) return 'warning';
  return 'high_alert';
}

/**
 * Generate personalized recommendations based on scores and answers
 */
export function getRecommendations(
  scores: ScoreBreakdown,
  answers: Record<string, any>
): string[] {
  const recommendations: string[] = [];
  const category = getOverallCategory(scores.overall);
  
  // Identify weakest categories
  const categoryScores = [
    { name: 'Physical Health', score: scores.physical, max: 25 },
    { name: 'Nutrition', score: scores.nutrition, max: 15 },
    { name: 'Lifestyle', score: scores.lifestyle, max: 15 },
    { name: 'Mental Fitness', score: scores.mental, max: 20 },
    { name: 'Pain & Mobility', score: scores.pain_mobility, max: 10 },
    { name: 'Goal Readiness', score: scores.goal_readiness, max: 15 },
  ];
  
  // Sort by score percentage (lowest first)
  categoryScores.sort((a, b) => (a.score / a.max) - (b.score / b.max));
  
  // Generate recommendations for weakest 3-4 categories
  const weakCategories = categoryScores.slice(0, 4);
  
  for (const cat of weakCategories) {
    if (cat.score / cat.max < 0.6) { // Below 60% of max
      switch (cat.name) {
        case 'Physical Health':
          recommendations.push(...getPhysicalRecommendations(answers));
          break;
        case 'Nutrition':
          recommendations.push(...getNutritionRecommendations(answers));
          break;
        case 'Lifestyle':
          recommendations.push(...getLifestyleRecommendations(answers));
          break;
        case 'Mental Fitness':
          recommendations.push(...getMentalRecommendations(answers));
          break;
        case 'Pain & Mobility':
          recommendations.push(...getPainMobilityRecommendations(answers));
          break;
        case 'Goal Readiness':
          recommendations.push(...getGoalReadinessRecommendations(answers));
          break;
      }
    }
  }
  
  // Add general recommendations based on overall category
  if (category === 'high_alert') {
    recommendations.unshift('🚨 Immediate professional guidance recommended. Book a consultation to create a personalized recovery plan.');
  } else if (category === 'warning') {
    recommendations.unshift('⚠️ Your health needs attention. A structured fitness program can help you improve significantly.');
  } else if (category === 'good') {
    recommendations.unshift('You are on the right track! With professional guidance, you can reach your full potential.');
  } else {
    recommendations.unshift('🌟 Excellent foundation! Let\'s optimize your routine and help you achieve even better results.');
  }
  
  // Ensure we have 4-6 recommendations
  if (recommendations.length < 4) {
    recommendations.push('📞 Book a free consultation at KR Fitness Studio to get personalized guidance.');
  }
  
  // Limit to 6 recommendations
  return recommendations.slice(0, 6);
}

function getPhysicalRecommendations(answers: Record<string, any>): string[] {
  const recs: string[] = [];
  
  const exerciseFreq = answers.physical_exercise_frequency;
  const steps = answers.physical_daily_steps;
  
  if (exerciseFreq === 'none' || exerciseFreq === '1-2') {
    recs.push('💪 Start with 3-4 structured workouts per week. Our trainers can design a beginner-friendly program.');
  }
  
  if (steps === 'under_3000' || steps === '3000-5000') {
    recs.push('🚶 Increase daily activity: Aim for 8,000+ steps daily. Consider walking breaks or using stairs.');
  }
  
  const energy = parseInt(answers.physical_energy) || 1;
  if (energy <= 2) {
    recs.push('⚡ Low energy levels may indicate nutritional gaps or sleep issues. Address these alongside exercise.');
  }
  
  return recs;
}

function getNutritionRecommendations(answers: Record<string, any>): string[] {
  const recs: string[] = [];
  
  const breakfast = answers.lifestyle_skip_breakfast;
  if (breakfast === 'often' || breakfast === 'always') {
    recs.push('🍳 Never skip breakfast! A protein-rich breakfast boosts metabolism and energy throughout the day.');
  }
  
  const sugar = answers.lifestyle_sugar;
  if (sugar === 'high') {
    recs.push('🍬 Reduce sugar intake gradually. Replace sweets with fruits and natural alternatives.');
  }
  
  const water = answers.lifestyle_water;
  if (water === 'under_1') {
    recs.push('💧 Increase water intake to 2-3 liters daily. Proper hydration improves energy and recovery.');
  }
  
  const fruits = answers.lifestyle_fruits;
  if (fruits === 'rarely') {
    recs.push('🍎 Include 2-3 servings of fruits daily for essential vitamins and fiber.');
  }
  
  return recs;
}

function getLifestyleRecommendations(answers: Record<string, any>): string[] {
  const recs: string[] = [];
  
  const sleepDuration = answers.lifestyle_sleep_duration;
  if (sleepDuration === 'under_5' || sleepDuration === '5-6') {
    recs.push('😴 Prioritize 7-8 hours of quality sleep. Sleep is crucial for recovery, muscle growth, and overall health.');
  }
  
  const sleepQuality = parseInt(answers.lifestyle_sleep_quality) || 1;
  if (sleepQuality <= 2) {
    recs.push('🌙 Improve sleep quality: Create a bedtime routine, limit screens before bed, and maintain a consistent schedule.');
  }
  
  return recs;
}

function getMentalRecommendations(answers: Record<string, any>): string[] {
  const recs: string[] = [];
  
  const stressMgmt = answers.mental_stress_management || 'very_poor';
  if (stressMgmt === 'poor' || stressMgmt === 'very_poor') {
    recs.push('🧘 Develop stress management techniques: Meditation, deep breathing, or yoga can significantly improve mental wellness.');
  }
  
  const consistency = answers.mental_consistency || 'very_inconsistent';
  if (consistency === 'inconsistent' || consistency === 'very_inconsistent') {
    recs.push('📅 Build consistency with small, achievable daily habits. Our trainers help create sustainable routines.');
  }
  
  const emotionalEating = answers.mental_emotional_eating || 'very_often';
  if (emotionalEating === 'often' || emotionalEating === 'very_often') {
    recs.push('🍽️ Address emotional eating patterns. Professional guidance can help develop healthier coping mechanisms.');
  }
  
  return recs;
}

function getPainMobilityRecommendations(answers: Record<string, any>): string[] {
  const recs: string[] = [];
  
  const backPain = answers.pain_back || 'never';
  const kneePain = answers.pain_knee || 'never';
  const neckShoulder = answers.pain_neck_shoulder || 'never';
  
  const painFrequency = ['often', 'daily'];
  if (painFrequency.includes(backPain) || painFrequency.includes(kneePain) || painFrequency.includes(neckShoulder)) {
    recs.push('🏥 Consult with our trainers about pain management. Corrective exercises and proper form can alleviate discomfort.');
  }
  
  const sitting = answers.pain_sitting_hours;
  if (sitting === 'over_10' || sitting === '8-10') {
    recs.push('🪑 Reduce sitting time: Take breaks every hour, use a standing desk, and incorporate mobility exercises.');
  }
  
  const toeTouch = answers.pain_toe_touch || 'no';
  if (toeTouch === 'no') {
    recs.push('🤸 Improve flexibility with daily stretching. Our trainers can design a personalized mobility program.');
  }
  
  return recs;
}

function getGoalReadinessRecommendations(answers: Record<string, any>): string[] {
  const recs: string[] = [];
  
  const timeline = answers.goal_timeline;
  if (timeline === '1_month') {
    recs.push('⏰ Set realistic timelines. Sustainable results take time. Our trainers help set achievable milestones.');
  }
  
  const commitment = answers.goal_weekly_commitment;
  if (commitment === '1-2') {
    recs.push('📆 Increase training frequency gradually. Start with 3-4 days per week for optimal results.');
  }
  
  const motivation = parseInt(answers.goal_motivation) || 1;
  if (motivation <= 2) {
    recs.push('🔥 Find your "why". Our trainers help you stay motivated with personalized goals and progress tracking.');
  }
  
  return recs;
}


