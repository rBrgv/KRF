import type { Metadata } from 'next';
import { Suspense } from 'react';
import { BookPageClient } from './components/BookPageClient';

export const metadata: Metadata = {
  title: 'Book Free Consultation - KR Fitness',
  description:
    'Book your free 30-minute consultation with KR Fitness. Get expert advice and a personalized training program tailored to your goals.',
};

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    }>
      <BookPageClient />
    </Suspense>
  );
}
