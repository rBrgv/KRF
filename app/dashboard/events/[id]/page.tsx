import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { EventForm } from '@/components/dashboard/EventForm';
import { EventRegistrations } from '@/components/dashboard/EventRegistrations';
import Image from 'next/image';
import { Calendar, MapPin, Coins, Users, Clock, Link as LinkIcon } from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';
import Link from 'next/link';

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const { id } = await params;
  const supabase = await createClient();

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !event) {
    redirect('/dashboard/events');
  }

  // Get registration count (include both confirmed and pending)
  const { count: registrationCount } = await supabase
    .from('event_registrations')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', event.id)
    .in('status', ['confirmed', 'pending']);

  return (
    <div className="p-4 lg:p-8 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <Link
          href="/dashboard/events"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors mb-4"
        >
          <span>←</span>
          <span>Back to Events</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{event.title}</h1>
            <p className="text-gray-400 text-lg">Edit event details and manage registrations</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
            <span className={`w-2 h-2 rounded-full ${event.is_active ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
              {event.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Event Image Preview */}
      {event.image_url && (
        <div className="mb-8 premium-card rounded-2xl overflow-hidden border border-gray-800/50">
          <div className="p-6 border-b border-gray-800/50 bg-gradient-to-r from-gray-900/50 to-transparent">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <LinkIcon className="w-4 h-4 text-red-400" />
                </div>
                Event Image
              </h2>
              <a
                href={event.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                View Full Size →
              </a>
            </div>
          </div>
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

      {/* Event Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="premium-card rounded-xl p-4 hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <Calendar className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Event Date</p>
              <p className="text-sm font-semibold text-white">{formatDate(event.start_datetime)}</p>
            </div>
          </div>
        </div>

        {event.location && (
          <div className="premium-card rounded-xl p-4 hover:border-red-500/30 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <MapPin className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Location</p>
                <p className="text-sm font-semibold text-white truncate">{event.location}</p>
              </div>
            </div>
          </div>
        )}

        <div className="premium-card rounded-xl p-4 hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <Coins className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Price</p>
              <p className="text-sm font-semibold text-white">₹{event.price_in_inr}</p>
            </div>
          </div>
        </div>

        <div className="premium-card rounded-xl p-4 hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <Users className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Registrations</p>
              <p className="text-sm font-semibold text-white">
                {registrationCount || 0}
                {event.max_capacity && ` / ${event.max_capacity}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Form - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="premium-card rounded-2xl p-8 border border-gray-800/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <Clock className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Event Details</h2>
            </div>
            <EventForm event={event} />
          </div>
        </div>

        {/* Registrations - Takes 1 column */}
        <div className="lg:col-span-1">
          <div className="premium-card rounded-2xl p-6 border border-gray-800/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <Users className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Registrations</h2>
            </div>
            <EventRegistrations eventId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

