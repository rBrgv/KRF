'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookingSlotForm } from '@/components/forms/BookingSlotForm';
import { BookingSuccessModal } from '@/components/modals/BookingSuccessModal';

const offlineServices = [
  {
    slug: '1-on-1-personal-training',
    title: '1-on-1 Personal Training (Premium Coaching)',
    description: 'Perfect for people who want personal attention, faster results, and complete guidance.',
    highlights: [
      'Fully customised workouts based on your fitness level, lifestyle & goals',
      '100% personal attention every minute of your session',
      'Faster transformation with deep focus on form, technique & progress',
      'Nutrition guidance tailored to your routine (simple, practical & sustainable)',
      'Injury-safe training with mobility, stability & corrective exercises',
      'Weekly progress tracking (measurements, photos & habit check-in)',
      'Flexible timings based on your schedule',
      'Mindset coaching included to help you stay consistent',
    ],
    perfectFor: 'Perfect for beginners, busy professionals, athletes & transformation-focused people',
  },
  {
    slug: 'small-group-training',
    title: 'Small Group Training (3-4 People Max)',
    description: 'Ideal for people who want the energy of a group but still want coach-level guidance.',
    highlights: [
      'Small batch = personal attention (not like crowded group classes)',
      'More motivation - train with like-minded people who push each other',
      'Affordable pricing with premium training quality',
      'Structured programs for fat loss, muscle gain & strength',
      'Fun, high-energy sessions that make consistency easier',
      'Weekly habit tasks & group challenges',
      'Community support - you don\'t feel alone in your fitness journey',
    ],
    perfectFor: 'Ideal for friends, couples, colleagues or anyone who loves group energy',
  },
];

const onlineServices = [
  {
    slug: '11-day-trial',
    title: '11 Days Free Mindset + Fitness Trial',
    description: 'Perfect for people who are confused, stuck, or scared to start.',
    link: '/programs/11-day-trial',
  },
  {
    slug: '4-week-starter',
    title: '4 Weeks Starter Program',
    description: 'Best for people who want a plan, guidance, and accountability without spending big.',
    link: '/programs/4-week-starter',
  },
  {
    slug: 'master-transformation',
    title: 'Master Transformation Program',
    description: 'Your signature, high-value 12-week program to get serious, guaranteed transformation.',
    link: '/programs/master-transformation',
  },
];

const coachLine = "Trained by Keerthi Raj";

export function ServicesPageClient() {
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    serviceName: string;
    serviceType: 'offline' | 'online';
  }>({ isOpen: false, serviceName: '', serviceType: 'offline' });
  
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    whatsappUrl: string;
  }>({ isOpen: false, whatsappUrl: '' });

  const handleBookingSuccess = (appointmentId: string, leadId: string, whatsappUrl: string) => {
    setBookingModal({ isOpen: false, serviceName: '', serviceType: 'offline' });
    setSuccessModal({ isOpen: true, whatsappUrl });
    // Note: Lead and appointment are now both created and linked
  };

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

        {/* Offline Services Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Offline Services (Studio Training)</h2>
          <p className="text-gray-400 mb-8">Train with us at our studio in Bangalore</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {offlineServices.map((service) => (
              <div key={service.slug} className="premium-card rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{service.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Key Highlights</h4>
                  <ul className="space-y-2">
                    {service.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-300">
                        <span className="text-red-400 mt-1">✓</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <p className="text-gray-400 mb-6 italic">{service.perfectFor}</p>
                <p className="text-sm text-gray-400 mb-6">{coachLine}</p>
                
                <button
                  onClick={() => setBookingModal({ isOpen: true, serviceName: service.title, serviceType: 'offline' })}
                  className="w-full rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 font-semibold hover:from-red-700 hover:to-red-800 transition-all"
                >
                  Book a Free Trial
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Online Services Section */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Online Services (Remote Training)</h2>
          <p className="text-gray-400 mb-8">Train from anywhere with our online programs</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {onlineServices.map((service) => (
              <div key={service.slug} className="premium-card rounded-2xl p-8 hover:border-red-500/50 transition-all">
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">{service.description}</p>
                
                <div className="flex flex-col gap-3">
                  <Link
                    href={service.link}
                    className="text-center rounded-full border border-gray-700 text-gray-300 px-6 py-2 font-semibold hover:border-red-500/50 hover:text-red-400 transition-all"
                  >
                    Learn More
                  </Link>
                  <button
                    onClick={() => setBookingModal({ isOpen: true, serviceName: service.title, serviceType: 'online' })}
                    className="w-full rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 font-semibold hover:from-red-700 hover:to-red-800 transition-all"
                  >
                    Book Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModal.isOpen && (
        <BookingSlotForm
          serviceName={bookingModal.serviceName}
          serviceType={bookingModal.serviceType}
          onClose={() => setBookingModal({ isOpen: false, serviceName: '', serviceType: 'offline' })}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Success Modal */}
      {successModal.isOpen && (
        <BookingSuccessModal
          whatsappUrl={successModal.whatsappUrl}
          onClose={() => setSuccessModal({ isOpen: false, whatsappUrl: '' })}
        />
      )}
    </div>
  );
}

