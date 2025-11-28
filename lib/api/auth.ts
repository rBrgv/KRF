/**
 * Shared authentication utilities for API routes
 */

import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { unauthorizedResponse, forbiddenResponse } from './response';
import { NextRequest } from 'next/server';

export type UserRole = 'admin' | 'trainer' | 'client';

export interface AuthCheckResult {
  user: any;
  profile: {
    id: string;
    role: UserRole;
  } | null;
}

/**
 * Check if user is authenticated
 * Returns user and profile, or null if not authenticated
 */
export async function requireAuth(): Promise<AuthCheckResult | Response> {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return unauthorizedResponse();
    }

    const supabase = await createClient();
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('[requireAuth] Profile error:', profileError);
      // If profile doesn't exist, still return unauthorized
      return unauthorizedResponse();
    }

    return {
      user,
      profile: profile || null,
    };
  } catch (error: any) {
    console.error('[requireAuth] Exception:', error);
    return unauthorizedResponse();
  }
}

/**
 * Require admin or trainer role
 */
export async function requireAdminOrTrainer(): Promise<AuthCheckResult | Response> {
  const authResult = await requireAuth();
  
  if (authResult instanceof Response) {
    return authResult;
  }

  const { profile } = authResult;
  
  if (!profile || (profile.role !== 'admin' && profile.role !== 'trainer')) {
    return forbiddenResponse('Admin or trainer access required');
  }

  return authResult;
}

/**
 * Require admin role only
 */
export async function requireAdmin(): Promise<AuthCheckResult | Response> {
  const authResult = await requireAuth();
  
  if (authResult instanceof Response) {
    return authResult;
  }

  const { profile } = authResult;
  
  if (!profile || profile.role !== 'admin') {
    return forbiddenResponse('Admin access required');
  }

  return authResult;
}

/**
 * Get pagination parameters with max limit
 */
export function getPaginationParams(
  request: NextRequest,
  defaultLimit: number = 20,
  maxLimit: number = 100
): { page: number; limit: number } {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(searchParams.get('limit') || String(defaultLimit), 10))
  );

  return { page, limit };
}

