import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services - KR Fitness | Personal Training Programs',
  description:
    'Explore our personalized training programs: weight loss, weight gain, strength & conditioning, and rehabilitation. Find the perfect program for your fitness goals.',
  openGraph: {
    title: 'Services - KR Fitness',
    description: 'Explore our personalized training programs for all fitness goals.',
    type: 'website',
  },
};

const services = [
  {
    slug: 'weight-loss',
    title: 'Transform through weight loss',
    description: 'Customized weight loss programs designed to help you shed pounds safely and sustainably.',
    icon: '🔥',
  },
  {
    slug: 'weight-gain',
    title: 'Transform through weight gain',
    description: 'Structured muscle-building programs for healthy weight gain and strength development.',
    icon: '💪',
  },
  {
    slug: 'strength-conditioning',
    title: 'Strength & Conditioning',
    description: 'Build functional strength and improve athletic performance with our conditioning programs.',
    icon: '🏋️',
  },
  {
    slug: 'medical-condition',
    title: 'Improve a medical condition',
    description: 'Recovery-focused training programs for injury rehabilitation and medical condition management.',
    icon: '🏥',
  },
  {
    slug: 'silver-program',
    title: 'Silver Program',
    description: 'If you prefer to workout alone and at your own pace, then this option would suit you.',
    icon: '🥈',
  },
  {
    slug: 'gold-program',
    title: 'Gold Program',
    description: 'Working out in a group can be fun and motivating. This program is designed for a small group of 2 to 3 like minded individuals, to work out in our studio.',
    icon: '🥇',
  },
  {
    slug: 'platinum-program',
    title: 'Platinum Program',
    description: 'This Online customized training program is designed for those who want to improve their running or walking posture and strength. If you are someone who likes to workout using weights or resistance band at home or your apartment gym, the Den package is for you.',
    icon: '💎',
  },
];

export default function ServicesPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
            Our Programs
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 text-white">Our Services</h1>
          <p className="text-center text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Personalized training programs designed to help you achieve your fitness goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group premium-card rounded-2xl p-8 hover:border-red-500/50 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
            >
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
              <h2 className="text-2xl font-bold mb-3 text-white">{service.title}</h2>
              <p className="text-gray-400 leading-relaxed mb-4 text-sm">{service.description}</p>
              <div className="flex items-center gap-2 text-red-400 font-semibold mt-6 group-hover:gap-3 transition-all">
                <span>Learn More</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
              <div className="mt-4 h-1 w-0 bg-gradient-to-r from-red-600 to-red-700 group-hover:w-full transition-all duration-300 rounded-full"></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
