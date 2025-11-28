// ============================================================================
// HEALTH ASSESSMENT QUESTIONS CONFIGURATION
// ============================================================================

import { Question } from './types/health-assessment';

export const QUESTIONS: Question[] = [
  // ============================================================================
  // SECTION 1: PHYSICAL HEALTH (6 Questions + 2 Optional)
  // ============================================================================
  {
    id: 'physical_energy',
    section: 'physical',
    type: 'scale',
    question: 'How would you rate your energy level throughout the day?',
    min: 1,
    max: 5,
    required: true,
  },
  {
    id: 'physical_stairs',
    section: 'physical',
    type: 'choice',
    question: 'Can you climb 2 floors of stairs without feeling fatigued?',
    choices: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
    required: true,
  },
  {
    id: 'physical_flexibility',
    section: 'physical',
    type: 'choice',
    question: 'How flexible are you when bending or squatting?',
    choices: [
      { value: 'very_flexible', label: 'Very Flexible' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'somewhat_limited', label: 'Somewhat Limited' },
      { value: 'very_limited', label: 'Very Limited' },
    ],
    required: true,
  },
  {
    id: 'physical_exercise_frequency',
    section: 'physical',
    type: 'choice',
    question: 'How often do you exercise per week?',
    choices: [
      { value: 'none', label: 'Not at all' },
      { value: '1-2', label: '1-2 times' },
      { value: '3-4', label: '3-4 times' },
      { value: '5-6', label: '5-6 times' },
      { value: 'daily', label: 'Daily' },
    ],
    required: true,
  },
  {
    id: 'physical_daily_steps',
    section: 'physical',
    type: 'choice',
    question: 'What is your average daily step count?',
    choices: [
      { value: 'under_3000', label: 'Under 3,000 steps' },
      { value: '3000-5000', label: '3,000 - 5,000 steps' },
      { value: '5000-8000', label: '5,000 - 8,000 steps' },
      { value: '8000-10000', label: '8,000 - 10,000 steps' },
      { value: 'over_10000', label: 'Over 10,000 steps' },
    ],
    required: true,
  },
  {
    id: 'physical_height',
    section: 'physical',
    type: 'numeric',
    question: 'What is your height? (cm)',
    optional: true,
    min: 100,
    max: 250,
    unit: 'cm',
  },
  {
    id: 'physical_weight',
    section: 'physical',
    type: 'numeric',
    question: 'What is your weight? (kg)',
    optional: true,
    min: 30,
    max: 200,
    unit: 'kg',
  },

  // ============================================================================
  // SECTION 2: PAIN & MOBILITY (6 Questions)
  // ============================================================================
  {
    id: 'pain_back',
    section: 'pain',
    type: 'choice',
    question: 'How often do you experience back pain?',
    choices: [
      { value: 'never', label: 'Never' },
      { value: 'rarely', label: 'Rarely (once a month or less)' },
      { value: 'sometimes', label: 'Sometimes (2-3 times per month)' },
      { value: 'often', label: 'Often (weekly)' },
      { value: 'daily', label: 'Daily or almost daily' },
    ],
    required: true,
  },
  {
    id: 'pain_knee',
    section: 'pain',
    type: 'choice',
    question: 'How often do you experience knee pain?',
    choices: [
      { value: 'never', label: 'Never' },
      { value: 'rarely', label: 'Rarely (once a month or less)' },
      { value: 'sometimes', label: 'Sometimes (2-3 times per month)' },
      { value: 'often', label: 'Often (weekly)' },
      { value: 'daily', label: 'Daily or almost daily' },
    ],
    required: true,
  },
  {
    id: 'pain_neck_shoulder',
    section: 'pain',
    type: 'choice',
    question: 'How often do you experience neck or shoulder stiffness?',
    choices: [
      { value: 'never', label: 'Never' },
      { value: 'rarely', label: 'Rarely (once a month or less)' },
      { value: 'sometimes', label: 'Sometimes (2-3 times per month)' },
      { value: 'often', label: 'Often (weekly)' },
      { value: 'daily', label: 'Daily or almost daily' },
    ],
    required: true,
  },
  {
    id: 'pain_sitting_hours',
    section: 'pain',
    type: 'choice',
    question: 'How many hours per day do you spend sitting?',
    choices: [
      { value: 'under_4', label: 'Under 4 hours' },
      { value: '4-6', label: '4-6 hours' },
      { value: '6-8', label: '6-8 hours' },
      { value: '8-10', label: '8-10 hours' },
      { value: 'over_10', label: 'Over 10 hours' },
    ],
    required: true,
  },
  {
    id: 'pain_toe_touch',
    section: 'pain',
    type: 'choice',
    question: 'Can you touch your toes without discomfort?',
    choices: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
    required: true,
  },
  {
    id: 'pain_surgery_history',
    section: 'pain',
    type: 'choice',
    question: 'Do you have any history of surgery or significant injury?',
    choices: [
      { value: 'none', label: 'No surgery or injury' },
      { value: 'minor', label: 'Minor injury (fully recovered)' },
      { value: 'moderate', label: 'Moderate injury (some limitations)' },
      { value: 'major', label: 'Major surgery/injury (ongoing issues)' },
    ],
    required: true,
  },

  // ============================================================================
  // SECTION 3: LIFESTYLE & NUTRITION (8 Questions)
  // ============================================================================
  {
    id: 'lifestyle_skip_breakfast',
    section: 'lifestyle',
    type: 'choice',
    question: 'How often do you skip breakfast?',
    choices: [
      { value: 'never', label: 'Never' },
      { value: 'rarely', label: 'Rarely (1-2 times/week)' },
      { value: 'sometimes', label: 'Sometimes (3-4 times/week)' },
      { value: 'often', label: 'Often (5-6 times/week)' },
      { value: 'always', label: 'Always skip' },
    ],
    required: true,
  },
  {
    id: 'lifestyle_outside_food',
    section: 'lifestyle',
    type: 'choice',
    question: 'How often do you eat outside food (restaurants, takeaways)?',
    choices: [
      { value: 'rarely', label: 'Rarely (1-2 times/month)' },
      { value: 'weekly', label: '1-2 times/week' },
      { value: 'often', label: '3-4 times/week' },
      { value: 'daily', label: 'Almost daily' },
    ],
    required: true,
  },
  {
    id: 'lifestyle_sugar',
    section: 'lifestyle',
    type: 'choice',
    question: 'How would you rate your sugar consumption?',
    choices: [
      { value: 'very_low', label: 'Very low (rarely eat sweets)' },
      { value: 'low', label: 'Low (occasional treats)' },
      { value: 'moderate', label: 'Moderate (daily but controlled)' },
      { value: 'high', label: 'High (multiple times daily)' },
    ],
    required: true,
  },
  {
    id: 'lifestyle_water',
    section: 'lifestyle',
    type: 'choice',
    question: 'How much water do you drink per day?',
    choices: [
      { value: 'under_1', label: 'Under 1 liter' },
      { value: '1-2', label: '1-2 liters' },
      { value: '2-3', label: '2-3 liters' },
      { value: 'over_3', label: 'Over 3 liters' },
    ],
    required: true,
  },
  {
    id: 'lifestyle_fruits',
    section: 'lifestyle',
    type: 'choice',
    question: 'How often do you consume fruits?',
    choices: [
      { value: 'rarely', label: 'Rarely' },
      { value: 'weekly', label: '1-2 times/week' },
      { value: 'often', label: '3-4 times/week' },
      { value: 'daily', label: 'Daily' },
    ],
    required: true,
  },
  {
    id: 'lifestyle_late_night',
    section: 'lifestyle',
    type: 'choice',
    question: 'How often do you eat late at night (after 9 PM)?',
    choices: [
      { value: 'never', label: 'Never' },
      { value: 'rarely', label: 'Rarely (1-2 times/week)' },
      { value: 'sometimes', label: 'Sometimes (3-4 times/week)' },
      { value: 'often', label: 'Often (5+ times/week)' },
    ],
    required: true,
  },
  {
    id: 'lifestyle_sleep_duration',
    section: 'lifestyle',
    type: 'choice',
    question: 'How many hours of sleep do you get per night?',
    choices: [
      { value: 'under_5', label: 'Under 5 hours' },
      { value: '5-6', label: '5-6 hours' },
      { value: '6-7', label: '6-7 hours' },
      { value: '7-8', label: '7-8 hours' },
      { value: 'over_8', label: 'Over 8 hours' },
    ],
    required: true,
  },
  {
    id: 'lifestyle_sleep_quality',
    section: 'lifestyle',
    type: 'scale',
    question: 'How would you rate your sleep quality?',
    min: 1,
    max: 5,
    required: true,
  },

  // ============================================================================
  // SECTION 4: MENTAL FITNESS (5 Questions)
  // ============================================================================
  {
    id: 'mental_confidence',
    section: 'mental',
    type: 'choice',
    question: 'How confident are you in achieving your health goals?',
    choices: [
      { value: 'very_confident', label: 'Very Confident' },
      { value: 'confident', label: 'Confident' },
      { value: 'moderate', label: 'Moderately Confident' },
      { value: 'somewhat', label: 'Somewhat Confident' },
      { value: 'not_confident', label: 'Not Very Confident' },
    ],
    required: true,
  },
  {
    id: 'mental_stress_management',
    section: 'mental',
    type: 'choice',
    question: 'How well do you manage stress?',
    choices: [
      { value: 'excellent', label: 'Excellent' },
      { value: 'good', label: 'Good' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'poor', label: 'Poor' },
      { value: 'very_poor', label: 'Very Poor' },
    ],
    required: true,
  },
  {
    id: 'mental_consistency',
    section: 'mental',
    type: 'choice',
    question: 'How consistent are you with your routines?',
    choices: [
      { value: 'very_consistent', label: 'Very Consistent' },
      { value: 'consistent', label: 'Consistent' },
      { value: 'moderate', label: 'Moderately Consistent' },
      { value: 'inconsistent', label: 'Inconsistent' },
      { value: 'very_inconsistent', label: 'Very Inconsistent' },
    ],
    required: true,
  },
  {
    id: 'mental_emotional_eating',
    section: 'mental',
    type: 'choice',
    question: 'How often do you engage in emotional eating?',
    choices: [
      { value: 'never', label: 'Never' },
      { value: 'rarely', label: 'Rarely' },
      { value: 'sometimes', label: 'Sometimes' },
      { value: 'often', label: 'Often' },
      { value: 'very_often', label: 'Very Often' },
    ],
    required: true,
  },
  {
    id: 'mental_work_life_stress',
    section: 'mental',
    type: 'choice',
    question: 'Does work/life stress significantly affect your health?',
    choices: [
      { value: 'not_at_all', label: 'Not at All' },
      { value: 'slightly', label: 'Slightly' },
      { value: 'moderately', label: 'Moderately' },
      { value: 'significantly', label: 'Significantly' },
      { value: 'very_significantly', label: 'Very Significantly' },
    ],
    required: true,
  },

  // ============================================================================
  // SECTION 5: GOAL READINESS & COMMITMENT (5 Questions)
  // ============================================================================
  {
    id: 'goal_primary',
    section: 'goal',
    type: 'choice',
    question: 'What is your primary health goal?',
    choices: [
      { value: 'weight_loss', label: 'Weight Loss' },
      { value: 'weight_gain', label: 'Weight Gain / Muscle Building' },
      { value: 'strength', label: 'Build Strength' },
      { value: 'flexibility', label: 'Improve Flexibility' },
      { value: 'endurance', label: 'Improve Endurance' },
      { value: 'pain_relief', label: 'Pain Relief / Rehabilitation' },
      { value: 'general_fitness', label: 'General Fitness' },
    ],
    required: true,
  },
  {
    id: 'goal_timeline',
    section: 'goal',
    type: 'choice',
    question: 'What is your desired timeline to achieve your goal?',
    choices: [
      { value: '1_month', label: '1 month' },
      { value: '3_months', label: '3 months' },
      { value: '6_months', label: '6 months' },
      { value: '1_year', label: '1 year' },
      { value: 'long_term', label: 'Long-term lifestyle change' },
    ],
    required: true,
  },
  {
    id: 'goal_weekly_commitment',
    section: 'goal',
    type: 'choice',
    question: 'How many days per week can you commit to training?',
    choices: [
      { value: '1-2', label: '1-2 days' },
      { value: '3-4', label: '3-4 days' },
      { value: '5-6', label: '5-6 days' },
      { value: 'daily', label: 'Daily' },
    ],
    required: true,
  },
  {
    id: 'goal_preference',
    section: 'goal',
    type: 'choice',
    question: 'What is your preferred training method?',
    choices: [
      { value: 'studio', label: 'Studio / Gym' },
      { value: 'home', label: 'Home Workouts' },
      { value: 'online', label: 'Online Coaching' },
      { value: 'mixed', label: 'Mixed (Studio + Home)' },
    ],
    required: true,
  },
  {
    id: 'goal_motivation',
    section: 'goal',
    type: 'scale',
    question: 'How motivated are you to start your fitness journey?',
    min: 1,
    max: 5,
    required: true,
  },
];

// Helper function to get questions by section
export function getQuestionsBySection(section: Question['section']): Question[] {
  return QUESTIONS.filter(q => q.section === section);
}

// Helper function to get question by ID
export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS.find(q => q.id === id);
}

// Get all section names in order
export const SECTIONS: Question['section'][] = [
  'physical',
  'pain',
  'lifestyle',
  'mental',
  'goal',
];


