import type { Metadata } from 'next';
import { TransformationGallery } from '@/components/TransformationGallery';
import { TransformationTestimonials } from '@/components/TransformationTestimonials';
import { ScrollAnimation } from '@/components/ScrollAnimation';

export const metadata: Metadata = {
  title: 'Gym Transformations in Bangalore | Before & After Results | KR Fitness',
  description:
    'See real gym transformation results from our clients in Bangalore. Before and after photos, success stories, and testimonials from KR Fitness gym. Real results from best gym in Bengaluru.',
  keywords: 'gym transformations bangalore, gym results bangalore, before after gym bangalore, gym success stories bengaluru, fitness transformations bangalore gym',
  openGraph: {
    title: 'Gym Transformations in Bangalore | Real Results - KR Fitness',
    description: 'See real gym transformation results from our clients in Bangalore. Before and after photos and success stories.',
    type: 'website',
  },
};

export default function TransformationsPage() {
  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 bg-gray-950">
        <div className="container mx-auto max-w-6xl">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
                Success Stories
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                TRANSFORM WITH SCIENCE...!
              </h1>
              <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">
                Before & After: Real Success Stories
              </p>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Real results from real people. See how our personalized training programs have helped
                clients achieve their fitness goals.
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>
      
      <TransformationGallery />
      
      <TransformationTestimonials />
    </div>
  );
}
