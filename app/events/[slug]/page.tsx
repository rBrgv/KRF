import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatDateTime } from '@/lib/utils';
import { Calendar, MapPin, Users, Coins, Clock } from 'lucide-react';
import { EventRegistrationForm } from '@/components/forms/EventRegistrationForm';
import Image from 'next/image';
import Link from 'next/link';

// Force dynamic rendering to always show fresh availability data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !event) {
    notFound();
  }

  // Get registration count (include both confirmed and pending - pending are valid registrations waiting for payment)
  const { count: registrationCount } = await supabase
    .from('event_registrations')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', event.id)
    .in('status', ['confirmed', 'pending']);

  const remainingSeats =
    event.max_capacity && registrationCount
      ? Math.max(0, event.max_capacity - registrationCount)
      : null;

  const eventUrl = `https://krfitnessstudio.com/events/${slug}`;
  const eventImage = event.image_url || 'https://krfitnessstudio.com/KR%20FITNESS%20LOGO%20BLACK%20BACKGROUND.png';

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": event.title,
            "description": event.description || `${event.title} at KR Fitness Studio`,
            "image": eventImage,
            "url": eventUrl,
            "startDate": event.start_datetime,
            "endDate": event.end_datetime || event.start_datetime,
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {
              "@type": "Place",
              "name": event.location || "KR Fitness Studio",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Shiv krupa complex No.133 4th cross, Uttarahalli Hobli",
                "addressLocality": "Bengaluru",
                "addressRegion": "Karnataka",
                "postalCode": "560061",
                "addressCountry": "IN"
              }
            },
            "organizer": {
              "@type": "Organization",
              "name": "KR Fitness Studio",
              "url": "https://krfitnessstudio.com"
            },
            "offers": {
              "@type": "Offer",
              "url": eventUrl,
              "price": event.price_in_inr > 0 ? event.price_in_inr.toString() : "0",
              "priceCurrency": "INR",
              "availability": event.max_capacity && remainingSeats === 0 
                ? "https://schema.org/SoldOut" 
                : "https://schema.org/InStock",
              "validFrom": new Date().toISOString()
            },
            ...(event.max_capacity && {
              "maximumAttendeeCapacity": event.max_capacity
            })
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://krfitnessstudio.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Events",
                "item": "https://krfitnessstudio.com/events"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": event.title,
                "item": eventUrl
              }
            ]
          }),
        }}
      />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors mb-8"
          >
            <span>←</span>
            <span>Back to Events</span>
          </Link>

          {/* Event Image */}
          {event.image_url && (
            <div className="mb-8 premium-card rounded-2xl overflow-hidden border border-gray-800/50">
              <div className="w-full h-[500px] overflow-hidden bg-gray-900/50 relative">
                <Image
                  src={event.image_url}
                  alt={event.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          )}

          {/* Event Header */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">{event.title}</h1>
            
            {/* Event Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="premium-card rounded-xl p-4 hover:border-red-500/30 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <Calendar className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-1">Date & Time</p>
                    <p className="text-sm font-semibold text-white break-words">{formatDateTime(event.start_datetime)}</p>
                  </div>
                </div>
              </div>

              <div className="premium-card rounded-xl p-4 hover:border-red-500/30 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <MapPin className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-1">Location</p>
                    <p className="text-sm font-semibold text-white truncate">
                      {event.location || 'TBA'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="premium-card rounded-xl p-4 hover:border-red-500/30 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <Coins className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-1">Price</p>
                    {event.price_in_inr > 0 ? (
                      <p className="text-lg font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                        ₹{event.price_in_inr}
                      </p>
                    ) : (
                      <p className="text-sm font-semibold text-gray-500">Free</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="premium-card rounded-xl p-4 hover:border-red-500/30 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <Users className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-1">Availability</p>
                    {event.max_capacity ? (
                      <>
                        <p className="text-sm font-semibold text-white">
                          {registrationCount || 0} / {event.max_capacity}
                        </p>
                        {remainingSeats !== null && remainingSeats > 0 && (
                          <p className="text-xs text-green-400 mt-1">
                            {remainingSeats} seats left
                          </p>
                        )}
                        {remainingSeats === 0 && (
                          <p className="text-xs text-red-400 mt-1">Fully Booked</p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm font-semibold text-white">
                        {registrationCount || 0} registered
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Description */}
          {event.description && (
            <div className="premium-card rounded-2xl p-8 mb-8 border border-gray-800/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <Clock className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">About This Event</h2>
              </div>
              <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                {event.description}
              </div>
            </div>
          )}

          {/* Registration Form */}
          <div className="premium-card rounded-2xl p-8 border border-gray-800/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <Users className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Register for This Event</h2>
            </div>
            <Suspense fallback={
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                <p className="text-gray-400 mt-4">Loading registration form...</p>
              </div>
            }>
              <EventRegistrationForm eventId={event.id} eventPrice={event.price_in_inr} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
