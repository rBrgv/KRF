import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - KR Fitness Studio',
  description: 'Privacy Policy for KR Fitness Studio. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-950 py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="premium-card rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Privacy Policy</h1>
          <p className="text-gray-400 mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Introduction</h2>
              <p>
                KR Fitness Studio ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.1 Personal Information</h3>
              <p>We may collect the following personal information:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Name and contact information (email, phone number, address)</li>
                <li>Health and fitness assessment data</li>
                <li>Payment information (processed securely through third-party payment processors)</li>
                <li>Event registration information</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-6 mb-3">2.2 Automatically Collected Information</h3>
              <p>We may automatically collect certain information when you visit our website:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>IP address and browser type</li>
                <li>Device information</li>
                <li>Usage data and website interactions</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. How We Use Your Information</h2>
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>To provide and maintain our fitness training services</li>
                <li>To process payments and manage event registrations</li>
                <li>To communicate with you about services, appointments, and updates</li>
                <li>To personalize your fitness experience and create tailored programs</li>
                <li>To improve our website and services</li>
                <li>To comply with legal obligations</li>
                <li>To send marketing communications (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Data Storage and Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information. Your data is stored securely using industry-standard encryption and security practices. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Sharing Your Information</h2>
              <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>With service providers who assist us in operating our business (e.g., payment processors, email services)</li>
                <li>When required by law or to protect our rights</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at{' '}
                <a href="mailto:krpersonalfitnessstudio@gmail.com" className="text-red-400 hover:text-red-300">
                  krpersonalfitnessstudio@gmail.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Cookies</h2>
              <p>
                We use cookies to enhance your experience on our website. You can control cookie preferences through your browser settings. However, disabling cookies may affect website functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Third-Party Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">11. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us:
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

