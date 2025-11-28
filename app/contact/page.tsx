import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LeadForm } from '@/components/forms/LeadForm';
import { Phone, Mail, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us - KR Fitness',
  description:
    "Get in touch with KR Fitness. Contact us via phone, email, or fill out our form. We're here to help you start your fitness journey.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Get in Touch</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-white">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">Phone</h3>
                  <a href="tel:+916361079633" className="text-gray-300 hover:text-red-400 transition-colors">63610 79633</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">Email</h3>
                  <a href="mailto:krpersonalfitnessstudio@gmail.com" className="text-gray-300 hover:text-red-400 transition-colors">krpersonalfitnessstudio@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-white">Address</h3>
                  <p className="text-gray-300">
                    Shiv krupa complex No.133 4th cross,<br />
                    Uttarahalli Hobli<br />
                    Bengaluru, Karnataka 560061
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-white">Send us a Message</h2>
            <Suspense fallback={<div>Loading form...</div>}>
              <LeadForm source="contact_page" />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
