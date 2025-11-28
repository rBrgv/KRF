'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 Signup form submitted');
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      console.log('📡 Creating Supabase client...');
      const supabase = createClient();
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        setError('Supabase is not configured. Please check your environment variables.');
        setIsLoading(false);
        return;
      }

      console.log('🔐 Attempting signup for:', email);
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log('📥 Signup response received');
      console.log('Data:', data);
      console.log('Error:', signupError);

      if (signupError) {
        console.error('❌ Signup error:', signupError.message);
        setError(signupError.message);
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        console.log('✅ Signup successful! User:', data.user.email);
        setSuccess(true);
        
        // Wait a moment then redirect to login
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        console.error('❌ No user in response');
        setError('Signup failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error('💥 Exception caught:', err);
      setError(err.message || 'An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-950 to-black px-4 py-12">
        <div className="max-w-md w-full relative z-10">
          <div className="premium-card rounded-2xl p-8 md:p-10 border border-gray-800/50 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
              <p className="text-gray-400">Redirecting to login page...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-950 to-black px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-red-600/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Premium card */}
        <div className="premium-card rounded-2xl p-8 md:p-10 border border-gray-800/50">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-400">
                KR FITNESS STUDIO
              </p>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              Create Account
            </h1>
            <p className="text-sm text-gray-400">
              Sign up for your coaching dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="premium-card border-red-500/30 bg-red-500/10 border px-4 py-3 rounded-xl">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                placeholder="admin@krf.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                placeholder="Confirm your password"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-base font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 premium-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="relative z-10">
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-red-400 hover:text-red-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}




