import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { EventForm } from '@/components/dashboard/EventForm';
import Link from 'next/link';
import { Plus, Calendar, Sparkles } from 'lucide-react';

export default async function NewEventPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

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
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">Create New Event</h1>
            <p className="text-gray-400 text-lg">Add a new event to start accepting registrations and payments</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
            <Sparkles className="w-4 h-4 text-red-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
              New Event
            </span>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="premium-card rounded-xl p-4 hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <Calendar className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Quick Setup</p>
              <p className="text-sm font-semibold text-white">Fill in the details below</p>
            </div>
          </div>
        </div>

        <div className="premium-card rounded-xl p-4 hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <Plus className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Image Upload</p>
              <p className="text-sm font-semibold text-white">Add an event image</p>
            </div>
          </div>
        </div>

        <div className="premium-card rounded-xl p-4 hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <Sparkles className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Auto Slug</p>
              <p className="text-sm font-semibold text-white">Generated from title</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="premium-card rounded-2xl p-8 border border-gray-800/50">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-800/50">
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <Plus className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Event Details</h2>
            <p className="text-sm text-gray-400 mt-1">Fill in all the required information to create your event</p>
          </div>
        </div>
        <EventForm />
      </div>
    </div>
  );
}

