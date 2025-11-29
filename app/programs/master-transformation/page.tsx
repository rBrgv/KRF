import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MasterTransformationContent } from './components/MasterTransformationContent';

export const metadata: Metadata = {
  title: 'Master Transformation Program | 12-Week Guaranteed Results | KR Fitness',
  description:
    'Your signature, high-value 12-week program to get serious, guaranteed transformation. Personalized workout plans, advanced nutrition coaching, daily accountability, and weekly 1-on-1 coaching calls.',
  keywords: '12 week transformation program, master fitness program, guaranteed results, personalized training, advanced nutrition coaching, KR Fitness',
  openGraph: {
    title: 'Master Transformation Program | KR Fitness',
    description: 'Your signature, high-value 12-week program to get serious, guaranteed transformation.',
    type: 'website',
  },
  alternates: {
    canonical: '/programs/master-transformation',
  },
};

export default function MasterTransformationPage() {
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
      <MasterTransformationContent />
    </Suspense>
  );
}

