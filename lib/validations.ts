import { z } from 'zod';

// Lead schemas
export const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  goal: z.string().optional(),
  source: z.string().optional(),
  utm_source: z.string().nullable().optional(),
  utm_medium: z.string().nullable().optional(),
  utm_campaign: z.string().nullable().optional(),
  utm_content: z.string().nullable().optional(),
  referrer: z.string().nullable().optional(),
});

export const updateLeadSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(10).optional(),
  goal: z.string().optional(),
  status: z.enum(['new', 'contacted', 'converted', 'not_interested']).optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  client_id: z.string().uuid().optional().nullable(),
});

// Client schemas
export const createClientSchema = z.object({
  lead_id: z.string().uuid().optional().nullable(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  goal: z.string().optional(),
  program_start_date: z.string().optional(), // ISO date string
  subscription_type: z.enum(['3_month', 'monthly', 'yearly']).optional().nullable(),
  program_type: z.enum(['silver', 'gold', 'platinum', 'weight_loss', 'weight_gain', 'strength_conditioning', 'medical_condition', 'rehab']).optional().nullable(),
  notes: z.string().optional(),
});

export const updateClientSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(10).optional(),
  goal: z.string().optional(),
  program_start_date: z.string().optional(),
  subscription_type: z.enum(['3_month', 'monthly', 'yearly']).optional().nullable(),
  program_type: z.enum(['silver', 'gold', 'platinum', 'weight_loss', 'weight_gain', 'strength_conditioning', 'medical_condition', 'rehab']).optional().nullable(),
  notes: z.string().optional(),
});

// Appointment schemas
export const createAppointmentSchema = z.object({
  client_id: z.string().uuid().optional().nullable(),
  title: z.string().min(1, 'Title is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format').optional(),
  type: z.enum(['studio', 'online', 'consultation']).optional(),
  notes: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  client_id: z.string().uuid().optional().nullable(),
  title: z.string().min(1).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  start_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  end_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  type: z.enum(['studio', 'online', 'consultation']).optional(),
  notes: z.string().optional(),
});

// Exercise schemas
export const createExerciseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['push', 'pull', 'legs', 'full_body', 'cardio', 'core', 'flexibility', 'other']),
  equipment: z.enum(['dumbbells', 'barbell', 'bodyweight', 'machine', 'cable', 'kettlebell', 'resistance_band', 'other']),
  muscle_group: z.enum(['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'glutes', 'core', 'cardio', 'full_body', 'other']),
  description: z.string().optional().nullable(),
  demo_url: z.string().url().optional().nullable().or(z.literal('')),
});

export const updateExerciseSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.enum(['push', 'pull', 'legs', 'full_body', 'cardio', 'core', 'flexibility', 'other']).optional(),
  equipment: z.enum(['dumbbells', 'barbell', 'bodyweight', 'machine', 'cable', 'kettlebell', 'resistance_band', 'other']).optional(),
  muscle_group: z.enum(['chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'glutes', 'core', 'cardio', 'full_body', 'other']).optional(),
  description: z.string().optional().nullable(),
  demo_url: z.string().url().optional().nullable().or(z.literal('')),
});

// Workout Plan schemas
export const createWorkoutPlanSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  goal_type: z.enum(['weight_loss', 'strength', 'muscle_gain', 'general_fitness', 'rehab', 'endurance', 'flexibility', 'other']),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  notes: z.string().optional().nullable(),
});

export const updateWorkoutPlanSchema = z.object({
  title: z.string().min(1).optional(),
  goal_type: z.enum(['weight_loss', 'strength', 'muscle_gain', 'general_fitness', 'rehab', 'endurance', 'flexibility', 'other']).optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  notes: z.string().optional().nullable(),
});

// Workout Plan Day schemas
export const createWorkoutPlanDaySchema = z.object({
  workout_plan_id: z.string().uuid(),
  day_index: z.number().int().positive(),
  title: z.string().min(1, 'Title is required'),
  notes: z.string().optional().nullable(),
});

export const updateWorkoutPlanDaySchema = z.object({
  day_index: z.number().int().positive().optional(),
  title: z.string().min(1).optional(),
  notes: z.string().optional().nullable(),
});

// Workout Plan Exercise schemas
export const createWorkoutPlanExerciseSchema = z.object({
  workout_plan_day_id: z.string().uuid(),
  exercise_id: z.string().uuid(),
  sets: z.number().int().positive(),
  reps: z.string().min(1, 'Reps is required'),
  rest_seconds: z.number().int().nonnegative().default(60),
  order_index: z.number().int().nonnegative().default(0),
  notes: z.string().optional().nullable(),
});

export const updateWorkoutPlanExerciseSchema = z.object({
  exercise_id: z.string().uuid().optional(),
  sets: z.number().int().positive().optional(),
  reps: z.string().min(1).optional(),
  rest_seconds: z.number().int().nonnegative().optional(),
  order_index: z.number().int().nonnegative().optional(),
  notes: z.string().optional().nullable(),
});

// Client Workout Assignment schemas
export const createClientWorkoutAssignmentSchema = z.object({
  client_id: z.string().uuid(),
  workout_plan_id: z.string().uuid(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  is_active: z.boolean().default(true),
  notes: z.string().optional().nullable(),
});

export const updateClientWorkoutAssignmentSchema = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  is_active: z.boolean().optional(),
  notes: z.string().optional().nullable(),
});

// Workout Completion Log schemas
export const createWorkoutCompletionLogSchema = z.object({
  client_id: z.string().uuid(),
  workout_plan_id: z.string().uuid(),
  workout_plan_day_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  status: z.enum(['completed', 'partially_completed', 'skipped']),
  notes: z.string().optional().nullable(),
});

export const updateWorkoutCompletionLogSchema = z.object({
  status: z.enum(['completed', 'partially_completed', 'skipped']).optional(),
  notes: z.string().optional().nullable(),
});

// Meal Plan schemas
export const createMealPlanSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  goal_type: z.enum(['weight_loss', 'maintenance', 'muscle_gain', 'medical_condition']),
  notes: z.string().optional().nullable(),
});

export const updateMealPlanSchema = z.object({
  title: z.string().min(1).optional(),
  goal_type: z.enum(['weight_loss', 'maintenance', 'muscle_gain', 'medical_condition']).optional(),
  notes: z.string().optional().nullable(),
});

// Meal Plan Item schemas
export const createMealPlanItemSchema = z.object({
  meal_plan_id: z.string().uuid(),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  name: z.string().min(1, 'Name is required'),
  calories: z.number().nonnegative().default(0),
  protein_g: z.number().nonnegative().default(0),
  carbs_g: z.number().nonnegative().default(0),
  fats_g: z.number().nonnegative().default(0),
  notes: z.string().optional().nullable(),
  order_index: z.number().int().nonnegative().default(0),
});

export const updateMealPlanItemSchema = z.object({
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional(),
  name: z.string().min(1).optional(),
  calories: z.number().nonnegative().optional(),
  protein_g: z.number().nonnegative().optional(),
  carbs_g: z.number().nonnegative().optional(),
  fats_g: z.number().nonnegative().optional(),
  notes: z.string().optional().nullable(),
  order_index: z.number().int().nonnegative().optional(),
});

// Client Meal Plan Assignment schemas
export const createClientMealPlanAssignmentSchema = z.object({
  client_id: z.string().uuid(),
  meal_plan_id: z.string().uuid(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  is_active: z.boolean().default(true),
  notes: z.string().optional().nullable(),
});

export const updateClientMealPlanAssignmentSchema = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  is_active: z.boolean().optional(),
  notes: z.string().optional().nullable(),
});

// Nutrition Log schemas
export const createNutritionLogSchema = z.object({
  client_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  total_calories: z.number().nonnegative().default(0),
  total_protein_g: z.number().nonnegative().default(0),
  total_carbs_g: z.number().nonnegative().default(0),
  total_fats_g: z.number().nonnegative().default(0),
  notes: z.string().optional().nullable(),
  source: z.enum(['manual', 'from_plan']).default('manual'),
});

export const updateNutritionLogSchema = z.object({
  total_calories: z.number().nonnegative().optional(),
  total_protein_g: z.number().nonnegative().optional(),
  total_carbs_g: z.number().nonnegative().optional(),
  total_fats_g: z.number().nonnegative().optional(),
  notes: z.string().optional().nullable(),
  source: z.enum(['manual', 'from_plan']).optional(),
});

// Attendance Log schemas
export const createAttendanceCheckInSchema = z.object({
  client_id: z.string().uuid(),
  appointment_id: z.string().uuid().optional().nullable(),
  check_in_time: z.string().optional(), // ISO timestamp, defaults to now
  source: z.enum(['manual', 'kiosk', 'app']).default('manual'),
  notes: z.string().optional().nullable(),
});

export const createAttendanceCheckOutSchema = z.object({
  attendance_log_id: z.string().uuid(),
  check_out_time: z.string().optional(), // ISO timestamp, defaults to now
  notes: z.string().optional().nullable(),
});

export const updateAttendanceLogSchema = z.object({
  check_in_time: z.string().optional(),
  check_out_time: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  source: z.enum(['manual', 'kiosk', 'app']).optional(),
});

