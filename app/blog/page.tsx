import type { Metadata } from 'next';
import { BlogPreview } from '@/components/BlogPreview';
import { ScrollAnimation } from '@/components/ScrollAnimation';

export const metadata: Metadata = {
  title: 'Blog - KR Fitness | Fitness Tips & Advice',
  description:
    'Read fitness tips, nutrition advice, and success stories from KR Fitness. Expert guidance to help you achieve your fitness goals.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 bg-gray-950">
        <div className="container mx-auto max-w-6xl">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
                Knowledge Hub
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Fitness Blog</h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Expert tips, nutrition advice, and success stories to help you achieve your fitness goals.
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>
      
      <BlogPreview />
    </div>
  );
}
