import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LeadForm } from '@/components/forms/LeadForm';
import { Calendar, Clock, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Book Free Consultation - KR Fitness',
  description:
    'Book your free 30-minute consultation with KR Fitness. Get expert advice and a personalized training program tailored to your goals.',
};

export default function BookPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Book Your Free Consultation</h1>
          <p className="text-xl text-gray-600">
            Take the first step towards achieving your fitness goals. Our expert coaches will help
            you create a personalized plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">What to Expect</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Schedule Your Session</h3>
                  <p className="text-gray-600">
                    Choose a convenient time for your free consultation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">30-Minute Session</h3>
                  <p className="text-gray-600">
                    Discuss your goals, current fitness level, and get expert advice.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Personalized Plan</h3>
                  <p className="text-gray-600">
                    Receive a customized training program tailored to your needs.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Suspense fallback={<div>Loading form...</div>}>
              <LeadForm source="book_consultation" />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
