// ============================================================================
// HEALTH ASSESSMENT QUESTIONS CONFIGURATION
// ============================================================================

import { Question } from './types/health-assessment';

export const QUESTIONS: Question[] = [
  // ============================================================================
  // SECTION 1: PHYSICAL HEALTH & ENERGY (3 Questions)
  // ============================================================================
  {
    id: 'energy_level',
    section: 'physical',
    type: 'choice',
    question: 'How energetic do you feel throughout the day?',
    choices: [
      { value: 'always_energetic', label: 'Always energetic' },
      { value: 'few_hours', label: 'Energetic for a few hours' },
      { value: 'only_morning', label: 'Energetic only in the morning' },
      { value: 'low_energy', label: 'Low energy most of the day' },
    ],
    required: true,
  },
  {
    id: 'daily_rest',
    section: 'physical',
    type: 'choice',
    question: 'How much rest do you give your body daily (sleep + breaks)?',
    choices: [
      { value: '8_plus', label: '8 hours or more' },
      { value: '6_7', label: '6–7 hours' },
      { value: '5_6', label: '5–6 hours' },
      { value: 'less_5', label: 'Less than 5 hours' },
    ],
    required: true,
  },
  {
    id: 'tired_after_waking',
    section: 'physical',
    type: 'choice',
    question: 'How often do you feel tired even after waking up?',
    choices: [
      { value: 'never', label: 'Never' },
      { value: 'sometimes', label: 'Sometimes' },
      { value: 'often', label: 'Often' },
      { value: 'almost_daily', label: 'Almost every day' },
    ],
    required: true,
  },

  // ============================================================================
  // SECTION 2: PAIN & MOBILITY (1 Question)
  // ============================================================================
  {
    id: 'pain_experience',
    section: 'pain',
    type: 'choice',
    question: 'Do you experience pain in neck, back, knee, or other areas?',
    choices: [
      { value: 'no_pain', label: 'No pain' },
      { value: 'rarely', label: 'Rarely' },
      { value: 'sometimes', label: 'Sometimes' },
      { value: 'often_daily', label: 'Often / Daily' },
    ],
    required: true,
  },

  // ============================================================================
  // SECTION 3: NUTRITION (1 Question)
  // ============================================================================
  {
    id: 'nutrition_attention',
    section: 'lifestyle',
    type: 'choice',
    question: 'How much attention do you give to what you eat?',
    choices: [
      { value: 'plan_meals', label: 'I plan my meals' },
      { value: 'try_not_consistent', label: 'I try to eat correct but not consistent' },
      { value: 'eat_available', label: 'I eat whatever is available' },
      { value: 'dont_think', label: "I don't think about it" },
    ],
    required: true,
  },

  // ============================================================================
  // SECTION 4: MENTAL FITNESS & STRESS (2 Questions)
  // ============================================================================
  {
    id: 'stress_level',
    section: 'mental',
    type: 'choice',
    question: 'What is your current stress level?',
    choices: [
      { value: 'very_low', label: 'Very low' },
      { value: 'manageable', label: 'Manageable' },
      { value: 'high', label: 'High' },
      { value: 'very_high', label: 'Very high' },
    ],
    required: true,
  },
  {
    id: 'fitness_barrier',
    section: 'mental',
    type: 'choice',
    question: 'When you think about starting fitness, what usually stops you?',
    choices: [
      { value: 'dont_know_start', label: "I don't know where to start" },
      { value: 'tired_lazy', label: 'I feel tired or lazy' },
      { value: 'not_consistent', label: 'I feel I may not stay consistent' },
      { value: 'postpone', label: 'I postpone and say "I will start later"' },
    ],
    multiple: true,
    required: true,
  },

  // ============================================================================
  // SECTION 5: GOAL & MOTIVATION (5 Questions)
  // ============================================================================
  {
    id: 'desired_feeling',
    section: 'goal',
    type: 'choice',
    question: 'If you start fitness today, how do you want to feel in your body?',
    choices: [
      { value: 'confident', label: 'Confident' },
      { value: 'strong', label: 'Strong' },
      { value: 'pain_free', label: 'Pain-free' },
      { value: 'leaner_lighter', label: 'Leaner & lighter' },
      { value: 'more_energetic', label: 'More energetic' },
    ],
    multiple: true,
    required: true,
  },
  {
    id: 'medical_condition',
    section: 'goal',
    type: 'choice',
    question: 'Do you have any medical condition or currently taking any medication?',
    choices: [
      { value: 'no_condition', label: 'No medical condition' },
      { value: 'thyroid_pcos_diabetes_bp', label: 'Thyroid / PCOS(D) / Diabetes / BP' },
      { value: 'surgery_injury', label: 'Surgery / Injury' },
      { value: 'medication_rehab', label: 'Currently under medication / rehab / physio' },
    ],
    required: true,
  },
  {
    id: 'current_activity',
    section: 'goal',
    type: 'choice',
    question: 'Are you currently involved in any activity or sport?',
    choices: [
      { value: 'gym_workouts', label: 'Gym workouts' },
      { value: 'running_marathon', label: 'Running / Marathon' },
      { value: 'trekking_cycling', label: 'Trekking / Cycling' },
      { value: 'badminton_sports', label: 'Badminton / Sports' },
      { value: 'not_active', label: 'Not active currently' },
    ],
    multiple: true,
    required: true,
  },
  {
    id: 'last_proud_moment',
    section: 'goal',
    type: 'choice',
    question: 'When was the last time you felt truly proud of your fitness or body?',
    choices: [
      { value: 'recently', label: 'Recently' },
      { value: 'months_ago', label: 'Months ago' },
      { value: 'years_ago', label: 'Years ago' },
      { value: 'never_felt', label: 'Never felt' },
    ],
    required: true,
  },
  {
    id: 'first_outcome',
    section: 'goal',
    type: 'choice',
    question: 'What is the first outcome you want to notice after starting fitness?',
    choices: [
      { value: 'lighter_energetic', label: 'Feel lighter & energetic' },
      { value: 'pain_reduction', label: 'Pain reduction' },
      { value: 'inch_fat_loss', label: 'Visible inch loss / fat loss' },
      { value: 'strength_improvement', label: 'Strength improvement' },
      { value: 'out_of_medication', label: 'Get out of medication' },
    ],
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


