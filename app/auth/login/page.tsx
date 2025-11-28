'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { loginAction } from './actions';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) {
        setError(result.error);
      }
      // If no error, redirect happens in the server action
    });
  };

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
              Dashboard Login
            </h1>
            <p className="text-sm text-gray-400">
              Access your coaching dashboard
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
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                placeholder="coach@krfitness.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-gray-100 placeholder:text-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                placeholder="Enter your password"
              />
            </div>
            
            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 text-base font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 premium-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="relative z-10">
                {isPending ? 'Signing in...' : 'Sign In'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-red-400 hover:text-red-300 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

