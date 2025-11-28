import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default async function EventSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const registrationId = typeof params.registration_id === 'string' ? params.registration_id : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="premium-card rounded-2xl p-8 border border-green-500/30">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
            <p className="text-lg text-gray-300 mb-6">
              Your event registration has been confirmed. We'll send you a confirmation email shortly.
            </p>
            <div className="space-y-4">
              <Link
                href="/events"
                className="inline-block bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-colors"
              >
                Browse More Events
              </Link>
              <div>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
            {registrationId && (
              <p className="text-sm text-gray-500 mt-4">
                Registration ID: {registrationId}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

