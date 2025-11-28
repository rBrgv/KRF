import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions - KR Fitness Studio',
  description: 'Terms and Conditions for KR Fitness Studio. Read our terms of service and usage policies.',
};

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-950 py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="premium-card rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Terms & Conditions</h1>
          <p className="text-gray-400 mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using KR Fitness Studio's website and services, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Services</h2>
              <p>
                KR Fitness Studio provides personal fitness training, online coaching programs, health assessments, event registrations, and related fitness services. We reserve the right to modify, suspend, or discontinue any service at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Health and Safety</h2>
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.1 Medical Clearance</h3>
              <p>
                Before participating in any fitness program, you should consult with a healthcare provider. You acknowledge that you are physically capable of participating in fitness activities and have disclosed any medical conditions or limitations.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.2 Assumption of Risk</h3>
              <p>
                You understand that participation in fitness activities involves inherent risks, including but not limited to injury, illness, or death. You voluntarily assume all such risks.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.3 Release of Liability</h3>
              <p>
                To the fullest extent permitted by law, you release KR Fitness Studio, its trainers, employees, and affiliates from any liability for injuries, damages, or losses arising from your participation in our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Payments and Refunds</h2>
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.1 Payment Terms</h3>
              <p>
                All fees must be paid in advance unless otherwise agreed. Payment methods include online payment gateways (Razorpay), bank transfers, or cash as specified.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.2 Refund Policy</h3>
              <p>
                Refunds are subject to our Return & Refund Policy. Please refer to that document for detailed information about refund eligibility and procedures.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.3 Event Registrations</h3>
              <p>
                Event registrations are subject to availability. We reserve the right to cancel or reschedule events. In case of cancellation by us, a full refund will be provided.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. User Conduct</h2>
              <p>You agree to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Provide accurate and complete information</li>
                <li>Respect our trainers, staff, and other clients</li>
                <li>Follow safety guidelines and instructions</li>
                <li>Not misuse our services or website</li>
                <li>Not share your account credentials</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Intellectual Property</h2>
              <p>
                All content on our website, including text, graphics, logos, images, and software, is the property of KR Fitness Studio and is protected by copyright and trademark laws. You may not reproduce, distribute, or use our content without written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Health Assessment Data</h2>
              <p>
                By submitting a health assessment, you consent to the collection and use of your health data for creating personalized fitness programs. This information will be kept confidential and used only for fitness-related purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Cancellation and Rescheduling</h2>
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">8.1 Appointments</h3>
              <p>
                Appointments must be cancelled or rescheduled at least 24 hours in advance. Late cancellations or no-shows may be subject to fees.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">8.2 Programs</h3>
              <p>
                Program cancellations are subject to our refund policy. No refunds will be provided for partially completed programs unless otherwise specified.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, KR Fitness Studio shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless KR Fitness Studio, its trainers, employees, and affiliates from any claims, damages, losses, or expenses arising from your use of our services or violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">12. Governing Law</h2>
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with the laws of India, specifically the laws of Karnataka. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">13. Severability</h2>
              <p>
                If any provision of these Terms and Conditions is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">14. Contact Information</h2>
              <p>
                For questions about these Terms and Conditions, please contact us:
              </p>
              <div className="mt-4 space-y-2">
                <p>
                  <strong className="text-white">Email:</strong>{' '}
                  <a href="mailto:krpersonalfitnessstudio@gmail.com" className="text-red-400 hover:text-red-300">
                    krpersonalfitnessstudio@gmail.com
                  </a>
                </p>
                <p>
                  <strong className="text-white">Phone:</strong>{' '}
                  <a href="tel:+916361079633" className="text-red-400 hover:text-red-300">
                    +91 63610 79633
                  </a>
                </p>
                <p>
                  <strong className="text-white">Address:</strong> Shiv krupa complex No.133 4th cross, Uttarahalli Hobli, Bengaluru, Karnataka 560061
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <Link
              href="/"
              className="inline-flex items-center text-red-400 hover:text-red-300 font-semibold transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

