import type { Metadata } from 'next';
import { ServicesPageClient } from './components/ServicesPageClient';

export const metadata: Metadata = {
  title: 'Gym Services in Bangalore | Online Gym Training Programs | KR Fitness',
  description:
    'Best gym services in Bangalore with personalized training programs: weight loss, weight gain, strength & conditioning, and rehabilitation. Online gym training available. Find the perfect gym program for your fitness goals in Bengaluru.',
  keywords: 'gym services bangalore, gym programs bangalore, online gym training, gym training programs, fitness services bangalore, gym near me bangalore, personal training gym bangalore',
  openGraph: {
    title: 'Gym Services in Bangalore | Online Gym Training - KR Fitness',
    description: 'Best gym services in Bangalore with personalized training programs. Online gym training available for all fitness goals.',
    type: 'website',
  },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
