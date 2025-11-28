import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { formatDateTime } from '@/lib/utils';
import { Calendar, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Upcoming Events - KR Fitness',
  description:
    'Join our fitness events, workshops, and special training sessions. Register now for upcoming events.',
  openGraph: {
    title: 'Upcoming Events - KR Fitness',
    description: 'Join our fitness events, workshops, and special training sessions.',
    type: 'website',
  },
};

// Force dynamic rendering to always show fresh event data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EventsPage() {
  const supabase = await createClient();
  
  // Get current date/time at start of today (to include events happening today)
  // Use UTC to avoid timezone issues
  const now = new Date();
  const todayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  
  console.log('[Events Page] Fetching events with filters:', {
    is_active: true,
    start_datetime_gte: todayStart.toISOString(),
    current_time: now.toISOString(),
    today_start_utc: todayStart.toISOString(),
  });
  
  // First, let's check all active events (for debugging)
  const { data: allActiveEvents, error: allError } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('start_datetime', { ascending: true });
  
  console.log('[Events Page] All active events (before date filter):', {
    count: allActiveEvents?.length || 0,
    events: allActiveEvents?.map(e => ({ 
      id: e.id, 
      title: e.title, 
      slug: e.slug, 
      start_datetime: e.start_datetime, 
      is_active: e.is_active,
      start_datetime_parsed: new Date(e.start_datetime).toISOString(),
      is_future: new Date(e.start_datetime) >= todayStart,
    })) || [],
  });
  
  // Now filter for future events
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .gte('start_datetime', todayStart.toISOString())
    .order('start_datetime', { ascending: true });

  if (error) {
    console.error('[Events Page] Error fetching events:', error);
  } else {
    console.log('[Events Page] Filtered events (future only):', {
      count: events?.length || 0,
      events: events?.map(e => ({ id: e.id, title: e.title, slug: e.slug, start_datetime: e.start_datetime })) || [],
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-red-400">
                UPCOMING EVENTS
              </p>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
              Join Our Fitness Events
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover workshops, special training sessions, and exclusive events designed to elevate your fitness journey.
            </p>
          </div>

          {!events || events.length === 0 ? (
            <div className="text-center py-20">
              <div className="premium-card rounded-2xl p-12 max-w-md mx-auto">
                <div className="text-6xl mb-6">📅</div>
                <h2 className="text-2xl font-bold text-white mb-3">No Upcoming Events</h2>
                <p className="text-gray-400 mb-8">
                  We're currently planning exciting new events. Check back soon or contact us to be
                  notified when new events are announced!
                </p>
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-700 px-8 py-4 text-base font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 premium-glow"
                >
                  <span className="relative z-10">Contact Us</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="premium-card rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300 group"
                >
                  {event.image_url && (
                    <div className="w-full h-64 overflow-hidden bg-gray-900/50 relative">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-gray-400 mb-4 line-clamp-2 text-sm leading-relaxed">
                        {event.description}
                      </p>
                    )}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-4 h-4 text-red-400" />
                        <span>{formatDateTime(event.start_datetime)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin className="w-4 h-4 text-red-400" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.price_in_inr > 0 && (
                        <div className="pt-2 border-t border-gray-800">
                          <div className="text-lg font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                            ₹{event.price_in_inr}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <span className="text-xs text-red-400 font-semibold group-hover:text-red-300 transition-colors">
                        Learn More →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
