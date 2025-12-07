import { SupabaseClient } from '@supabase/supabase-js';

export interface DuplicateLeadResult {
  isDuplicate: boolean;
  existingLead: any | null;
}

/**
 * Check if a lead with the same phone or email already exists
 * @param supabase - Supabase client instance
 * @param phone - Phone number (will be normalized to 10 digits)
 * @param email - Email address (optional)
 * @returns Object with isDuplicate flag and existing lead if found
 */
export async function checkDuplicateLead(
  supabase: SupabaseClient,
  phone: string,
  email?: string | null
): Promise<DuplicateLeadResult> {
  // Normalize phone to 10 digits (remove any non-digits)
  const phoneDigits = phone.replace(/\D/g, '').slice(0, 10);
  
  if (phoneDigits.length !== 10) {
    // Invalid phone, can't check for duplicates
    return { isDuplicate: false, existingLead: null };
  }
  
  // Build query - check by phone OR email
  let query = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);
  
  // Build OR condition based on what's provided
  if (email && email.trim()) {
    // Both phone and email provided - check either
    query = query.or(`phone.eq.${phoneDigits},email.eq.${email.trim()}`);
  } else {
    // Only phone provided
    query = query.eq('phone', phoneDigits);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('[Duplicate Check] Error checking for duplicate lead:', error);
    return { isDuplicate: false, existingLead: null };
  }
  
  if (data && data.length > 0) {
    return { isDuplicate: true, existingLead: data[0] };
  }
  
  return { isDuplicate: false, existingLead: null };
}

/**
 * Merge sources into a comma-separated string, avoiding duplicates
 */
export function mergeSources(existingSource: string | null, newSource: string): string {
  if (!existingSource) return newSource;
  
  const sources = existingSource.split(',').map(s => s.trim());
  if (!sources.includes(newSource)) {
    sources.push(newSource);
  }
  return sources.join(', ');
}

/**
 * Merge goals, keeping both if different
 */
export function mergeGoals(existingGoal: string | null, newGoal: string | null): string | null {
  if (!newGoal) return existingGoal;
  if (!existingGoal) return newGoal;
  if (existingGoal === newGoal) return existingGoal;
  
  // If goals are different, combine them
  return `${existingGoal} | ${newGoal}`;
}


