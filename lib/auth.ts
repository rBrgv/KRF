import { createClient } from '@/lib/supabase/server';

export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error('[getCurrentUser] Error:', error.message);
      return null;
    }

    if (!user) {
      console.log('[getCurrentUser] No user found');
      return null;
    }

    console.log('[getCurrentUser] User found:', user.email);
    return user;
  } catch (err) {
    console.error('[getCurrentUser] Exception:', err);
    return null;
  }
}

export async function getUserProfile() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('[getUserProfile] Error:', profileError.message);
      return null;
    }

    return {
      ...user,
      profile,
    };
  } catch (err) {
    console.error('[getUserProfile] Exception:', err);
    return null;
  }
}

export async function getUserRole(): Promise<'client' | 'admin' | 'trainer' | null> {
  try {
    const userWithProfile = await getUserProfile();
    if (!userWithProfile?.profile) {
      return null;
    }
    return userWithProfile.profile.role as 'client' | 'admin' | 'trainer';
  } catch (err) {
    console.error('[getUserRole] Exception:', err);
    return null;
  }
}

export async function getClientByUserId(userId: string) {
  try {
    const supabase = await createClient();
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('[getClientByUserId] Error:', error.message);
      return null;
    }

    return client;
  } catch (err) {
    console.error('[getClientByUserId] Exception:', err);
    return null;
  }
}

