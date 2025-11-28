import type { Metadata } from 'next';
import { TransformationGallery } from '@/components/TransformationGallery';
import { TransformationTestimonials } from '@/components/TransformationTestimonials';
import { ScrollAnimation } from '@/components/ScrollAnimation';

export const metadata: Metadata = {
  title: 'Transformations - KR Fitness | Real Results',
  description:
    'See real transformation results from our clients. Before and after photos, success stories, and testimonials from KR Fitness clients.',
  openGraph: {
    title: 'Transformations - KR Fitness',
    description: 'See real transformation results from our clients.',
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
