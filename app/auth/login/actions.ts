'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getUserRole } from '@/lib/auth';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data?.user) {
    // Check user role and redirect accordingly
    const role = await getUserRole();
    
    // If no profile exists, create one as admin (for existing users)
    if (!role) {
      try {
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({
            id: data.user.id,
            email: data.user.email || '',
            role: 'admin', // Default existing users to admin
            full_name: data.user.email || '',
          });

        if (!insertError) {
          redirect('/dashboard');
          return;
        }
      } catch (err) {
        console.error('Error creating profile:', err);
      }
      // Fallback: redirect to dashboard for existing users
      redirect('/dashboard');
      return;
    }
    
    if (role === 'client') {
      redirect('/portal');
    } else {
      // Admin or trainer goes to dashboard
      redirect('/dashboard');
    }
  }

  return { error: 'Login failed' };
}

