import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Return & Refund Policy - KR Fitness Studio',
  description: 'Return and Refund Policy for KR Fitness Studio. Learn about our refund procedures and eligibility.',
};

export default function ReturnRefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-950 py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="premium-card rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Return & Refund Policy</h1>
          <p className="text-gray-400 mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Overview</h2>
              <p>
                At KR Fitness Studio, we strive to provide exceptional fitness services. This Return & Refund Policy outlines the terms and conditions for refunds, cancellations, and returns of our services and products.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Service Refunds</h2>
              
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.1 Personal Training Sessions</h3>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong className="text-white">Cancellation before session:</strong> Full refund if cancelled at least 24 hours in advance</li>
                <li><strong className="text-white">Late cancellation (less than 24 hours):</strong> 50% refund or rescheduling option</li>
                <li><strong className="text-white">No-show:</strong> No refund</li>
                <li><strong className="text-white">Trainer cancellation:</strong> Full refund or rescheduling</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.2 Online Coaching Programs</h3>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong className="text-white">7-Day Money-Back Guarantee:</strong> Full refund within 7 days of purchase if you're not satisfied (applies to select programs)</li>
                <li><strong className="text-white">After 7 days:</strong> No refunds for partially or fully completed programs</li>
                <li><strong className="text-white">Program cancellation:</strong> Refund prorated based on unused portion, subject to administrative fees</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.3 Event Registrations</h3>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong className="text-white">Cancellation 7+ days before event:</strong> Full refund minus processing fees (if applicable)</li>
                <li><strong className="text-white">Cancellation 3-7 days before event:</strong> 50% refund</li>
                <li><strong className="text-white">Cancellation less than 3 days:</strong> No refund, but transfer to another event may be possible</li>
                <li><strong className="text-white">Event cancellation by us:</strong> Full refund or transfer to rescheduled event</li>
                <li><strong className="text-white">Free events:</strong> No refund required, but please cancel to allow others to attend</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Digital Products</h2>
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">3.1 Online Programs and Courses</h3>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Due to the digital nature of these products, refunds are generally not available after access is granted</li>
                <li>Exceptions may be made within 7 days of purchase for technical issues or if the product is significantly different from what was described</li>
                <li>Refund requests must be submitted via email with a detailed explanation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Refund Processing</h2>
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.1 Processing Time</h3>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Refund requests will be processed within 5-7 business days</li>
                <li>Refunds will be issued to the original payment method</li>
                <li>Bank transfers may take 7-14 business days to reflect in your account</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.2 Processing Fees</h3>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Payment gateway processing fees (if applicable) may be deducted from refunds</li>
                <li>Administrative fees may apply for program cancellations after the guarantee period</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. How to Request a Refund</h2>
              <p>To request a refund, please:</p>
              <ol className="list-decimal pl-6 space-y-2 mt-4">
                <li>Email us at <a href="mailto:krpersonalfitnessstudio@gmail.com" className="text-red-400 hover:text-red-300">krpersonalfitnessstudio@gmail.com</a></li>
                <li>Include your name, contact information, and order/registration details</li>
                <li>Provide a reason for the refund request</li>
                <li>Include any relevant documentation (receipts, confirmation emails, etc.)</li>
              </ol>
              <p className="mt-4">
                We will review your request and respond within 2-3 business days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Non-Refundable Items</h2>
              <p>The following are generally non-refundable:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Completed training sessions</li>
                <li>Digital products after access has been granted (except within guarantee period)</li>
                <li>Health assessment fees (assessment is a one-time service)</li>
                <li>Gift cards or promotional vouchers (unless otherwise stated)</li>
                <li>Services used or partially used</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Special Circumstances</h2>
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">7.1 Medical Emergencies</h3>
              <p>
                If you are unable to continue services due to a medical emergency or injury, we may offer a prorated refund or credit for future services. Medical documentation may be required.
              </p>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">7.2 Relocation</h3>
              <p>
                If you relocate and can no longer use our services, we may offer a prorated refund for unused sessions or programs. Proof of relocation may be required.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Disputes and Chargebacks</h2>
              <p>
                We encourage you to contact us directly to resolve any issues before initiating a chargeback with your bank or credit card company. Chargebacks may result in additional fees and may affect your ability to use our services in the future.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Modifications to Policy</h2>
              <p>
                We reserve the right to modify this Return & Refund Policy at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services constitutes acceptance of the modified policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Contact Us</h2>
              <p>
                For questions about refunds or this policy, please contact us:
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

