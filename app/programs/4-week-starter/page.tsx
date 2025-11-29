import type { Metadata } from 'next';
import { Suspense } from 'react';
import { StarterProgramContent } from './components/StarterProgramContent';

export const metadata: Metadata = {
  title: '4 Weeks Starter Program | Affordable Online Training | KR Fitness',
  description:
    '4-week structured workout plan with guidance and accountability. Perfect for people who want a plan, guidance, and accountability without spending big. Build consistency, strength & discipline in just 30 days.',
  keywords: '4 week fitness program, starter workout plan, affordable online training, beginner fitness program, structured workout plan, KR Fitness',
  openGraph: {
    title: '4 Weeks Starter Program | KR Fitness',
    description: 'Best for people who want a plan, guidance, and accountability without spending big.',
    type: 'website',
  },
  alternates: {
    canonical: '/programs/4-week-starter',
  },
};

export default function FourWeekStarterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-xl">Loading...</div>
          </div>
        </div>
      }
    >
      <StarterProgramContent />
    </Suspense>
  );
}

