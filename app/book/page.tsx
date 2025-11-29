import type { Metadata } from 'next';
import { BookPageClient } from './components/BookPageClient';

export const metadata: Metadata = {
  title: 'Book Free Consultation - KR Fitness',
  description:
    'Book your free 30-minute consultation with KR Fitness. Get expert advice and a personalized training program tailored to your goals.',
};

export default function BookPage() {
  return <BookPageClient />;
}
