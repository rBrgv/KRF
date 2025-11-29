'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { BookingSlotForm } from '@/components/forms/BookingSlotForm';
import { BookingSuccessModal } from '@/components/modals/BookingSuccessModal';
import { Check, Target, Calendar, MessageCircle, TrendingUp, Users, Zap, ArrowRight } from 'lucide-react';

export function StarterProgramContent() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    whatsappUrl: string;
  }>({ isOpen: false, whatsappUrl: '' });

  const handleBookingSuccess = (appointmentId: string, leadId: string, whatsappUrl: string) => {
    setShowBookingForm(false);
    setSuccessModal({ isOpen: true, whatsappUrl });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-gray-900 via-red-900/10 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_70%)]"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <ScrollAnimation>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-6">
                ₹999 • Beginner Friendly
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                4 Weeks Starter
                <br />
                <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  Program
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Best for people who want a <span className="text-red-400 font-semibold">plan, guidance, and accountability</span> without spending big.
              </p>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="relative py-20 px-4 bg-gray-900">
        <div className="container mx-auto max-w-6xl">
          <ScrollAnimation>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                What You Get
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Everything you need to build consistency, strength & discipline in just 30 days
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: <Calendar className="w-8 h-8 text-red-400" />,
                title: '4-Week Structured Plan',
                description: 'Workout plan for home or gym - no confusion, just follow the plan',
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-red-400" />,
                title: 'Weekly Progress Check-ins',
                description: 'Photos, measurements, and habits tracked weekly for accountability',
              },
              {
                icon: <Target className="w-8 h-8 text-red-400" />,
                title: 'Simple Nutrition Guidance',
                description: 'Easy to follow for busy people - practical and sustainable',
              },
              {
                icon: <MessageCircle className="w-8 h-8 text-red-400" />,
                title: 'WhatsApp Support',
                description: "Questions, form checks & motivation - we're here for you",
              },
              {
                icon: <Zap className="w-8 h-8 text-red-400" />,
                title: 'Goal Clarity Session',
                description: 'Set your transformation roadmap with personalized guidance',
              },
              {
                icon: <Users className="w-8 h-8 text-red-400" />,
                title: 'Affordable + Professional',
                description: 'Perfect balance of affordability and professional coaching',
              },
            ].map((benefit, idx) => (
              <ScrollAnimation key={idx} delay={idx * 100}>
                <div className="premium-card rounded-2xl p-6 h-full transition-all duration-300 hover:scale-[1.02] hover:border-red-500/50">
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Perfect For Section */}
      <section className="relative py-20 px-4 bg-gray-800/50">
        <div className="container mx-auto max-w-4xl">
          <ScrollAnimation>
            <div className="premium-card rounded-2xl p-8 md:p-12 text-center">
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-6">
                Perfect For
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8">
                This Program Is Perfect If You:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                {[
                  'Are confused on how to start',
                  'Need structure and a clear plan',
                  'Want the push to get back on track',
                  'Need accountability without breaking the bank',
                  'Want professional guidance at an affordable price',
                  'Are ready to build consistency in 30 days',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-gray-900 via-red-900/10 to-gray-900">
        <div className="container mx-auto max-w-4xl text-center">
          <ScrollAnimation>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Ready to Start Your 4-Week Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Book a consultation to get started with your personalized 4-week program.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setShowBookingForm(true)}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white px-10 py-4 text-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:scale-105"
              >
                Book Consultation
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border-2 border-gray-700 px-10 py-4 text-lg font-semibold text-gray-200 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 hover:bg-red-500/5 backdrop-blur-sm"
              >
                Have Questions? Contact Us
              </Link>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingSlotForm
          serviceName="4 Weeks Starter Program"
          serviceType="online"
          onClose={() => setShowBookingForm(false)}
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

