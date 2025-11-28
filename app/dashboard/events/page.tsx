import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function EventsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from('events')
    .select(`
      *,
      registrations:event_registrations(count)
    `)
    .order('start_datetime', { ascending: false });

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">Events</h1>
        <Link
          href="/dashboard/events/new"
          className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 premium-glow flex items-center gap-2"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            New Event
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </Link>
      </div>

      {!events || events.length === 0 ? (
        <div className="premium-card rounded-2xl p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-semibold mb-2 text-white">No Events Yet</h2>
            <p className="text-gray-400 mb-6">
              Create your first event to start accepting registrations and payments.
            </p>
            <Link
              href="/dashboard/events/new"
              className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-700 px-8 py-4 text-base font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 premium-glow"
            >
              <span className="relative z-10">Create Your First Event</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: any) => (
          <div key={event.id} className="premium-card rounded-2xl overflow-hidden hover:border-red-500/30 transition-all duration-300">
            {event.image_url && (
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-white">{event.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{event.description?.substring(0, 100)}...</p>
            <div className="space-y-2 text-sm mb-4 text-gray-300">
              <p><strong className="text-white">Date:</strong> {formatDate(event.start_datetime)}</p>
              {event.location && <p><strong className="text-white">Location:</strong> {event.location}</p>}
              <p><strong className="text-white">Price:</strong> ₹{event.price_in_inr}</p>
              <p><strong className="text-white">Registrations:</strong> {event.registrations?.[0]?.count || 0}</p>
              <p>
                <strong className="text-white">Status:</strong>{' '}
                <span className={event.is_active ? 'text-red-400' : 'text-gray-500'}>
                  {event.is_active ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/dashboard/events/${event.id}`}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg text-center text-sm font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300"
              >
                Manage
              </Link>
              <Link
                href={`/events/${event.slug}`}
                className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg text-center text-sm font-semibold hover:bg-gray-700 hover:text-white transition-all duration-300 border border-gray-700"
              >
                View
              </Link>
            </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
