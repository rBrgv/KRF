'use client';

import { useState } from 'react';
import { BookingSlotForm } from '@/components/forms/BookingSlotForm';
import { BookingSuccessModal } from '@/components/modals/BookingSuccessModal';
import { Calendar, Clock, Target } from 'lucide-react';

export function BookPageClient() {
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    whatsappUrl: string;
  }>({ isOpen: false, whatsappUrl: '' });

  const handleBookingSuccess = (appointmentId: string, leadId: string, whatsappUrl: string) => {
    setSuccessModal({ isOpen: true, whatsappUrl });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">Book Your Free Consultation</h1>
          <p className="text-xl text-gray-300">
            Take the first step towards achieving your fitness goals. Our expert coaches will help
            you create a personalized plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-white">What to Expect</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">Schedule Your Session</h3>
                  <p className="text-gray-400">
                    Choose a convenient time for your free consultation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">30-Minute Session</h3>
                  <p className="text-gray-400">
                    Discuss your goals, current fitness level, and get expert advice.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">Personalized Plan</h3>
                  <p className="text-gray-400">
                    Receive a customized training program tailored to your needs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <BookingSlotForm
              serviceName="Free Consultation"
              serviceType="online"
              onClose={() => {}}
              onSuccess={handleBookingSuccess}
              inline={true}
            />
          </div>
        </div>
      </div>

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

