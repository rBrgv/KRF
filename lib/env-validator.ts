/**
 * Environment variable validator
 * Call this at application startup to ensure all required env vars are set
 */

export function validateEnvironment() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];

  const missing: string[] = [];

  required.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    const error = `Missing required environment variables: ${missing.join(', ')}`;
    console.error('[Env]', error);
    // In production, we might want to throw, but in dev we can be more lenient
    if (process.env.NODE_ENV === 'production') {
      throw new Error(error);
    }
  } else {
    console.log('[Env] All required environment variables are set');
  }
}

// Validate on module load (for server-side code)
if (typeof window === 'undefined') {
  validateEnvironment();
}



