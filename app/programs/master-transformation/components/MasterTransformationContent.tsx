'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ScrollAnimation } from '@/components/ScrollAnimation';
import { BookingSlotForm } from '@/components/forms/BookingSlotForm';
import { BookingSuccessModal } from '@/components/modals/BookingSuccessModal';
import { Check, Target, Calendar, MessageCircle, TrendingUp, Video, Award, Zap, Shield, ArrowRight } from 'lucide-react';

export function MasterTransformationContent() {
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
              <span className="inline-block px-4 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-6">
                ₹5,899 • 12 Weeks • Guaranteed Results
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                Master Transformation
                <br />
                <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  Program
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Your signature, high-value <span className="text-red-400 font-semibold">12-week program</span> to get serious, guaranteed transformation.
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
                Comprehensive 12-week transformation with personalized coaching and guaranteed results
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              {
                icon: <Target className="w-8 h-8 text-red-400" />,
                title: 'Personalized Workout Plans',
                description: 'Tailored to your goals, fitness level, and lifestyle',
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-red-400" />,
                title: 'Advanced Nutrition Coaching',
                description: 'Meal planning and nutrition strategies for optimal results',
              },
              {
                icon: <Calendar className="w-8 h-8 text-red-400" />,
                title: 'Daily Accountability',
                description: 'Progress tracking and daily check-ins to keep you on track',
              },
              {
                icon: <MessageCircle className="w-8 h-8 text-red-400" />,
                title: 'Weekly 1-on-1 Coaching',
                description: 'Personalized calls to adjust your plan and keep you motivated',
              },
              {
                icon: <Zap className="w-8 h-8 text-red-400" />,
                title: 'Unlimited WhatsApp Support',
                description: 'Get answers, form checks, and motivation anytime',
              },
              {
                icon: <Video className="w-8 h-8 text-red-400" />,
                title: 'Form Correction Videos',
                description: 'Technique guidance and form correction for perfect execution',
              },
              {
                icon: <Award className="w-8 h-8 text-red-400" />,
                title: 'Mindset Coaching',
                description: 'Habit transformation and mental strength building',
              },
              {
                icon: <Shield className="w-8 h-8 text-red-400" />,
                title: 'Money-Back Guarantee',
                description: 'Guaranteed results or your money back',
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
              <div className="inline-block px-4 py-1.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-xs font-semibold uppercase tracking-wider text-yellow-400 mb-6">
                Perfect For
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8">
                This Program Is Perfect If You:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                {[
                  'Are serious about transformation',
                  'Want guaranteed results',
                  'Need personalized attention',
                  'Want the most comprehensive program',
                  'Are ready to invest in yourself',
                  'Want professional coaching at the highest level',
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
              Ready for Your Master Transformation?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Book a consultation to start your 12-week journey to guaranteed transformation.
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
          serviceName="Master Transformation Program"
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

