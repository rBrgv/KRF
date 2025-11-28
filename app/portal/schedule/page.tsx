import { redirect } from 'next/navigation';
import { getClientByUserId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default async function PortalSchedulePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const client = await getClientByUserId(user.id);

  if (!client) {
    redirect('/portal');
  }

  // Fetch all upcoming appointments
  const today = new Date().toISOString().split('T')[0];
  const { data: upcomingAppointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('client_id', client.id)
    .gte('date', today)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true });

  // Fetch past appointments (last 10)
  const { data: pastAppointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('client_id', client.id)
    .lt('date', today)
    .order('date', { ascending: false })
    .order('start_time', { ascending: false })
    .limit(10);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">My Schedule</h1>
            <p className="text-gray-400 text-lg">View your upcoming and past appointments</p>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl mb-8 overflow-hidden">
        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-transparent">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Upcoming
          </h2>
        </div>
        <div className="p-6">
          {upcomingAppointments && upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-gray-700/30 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-4">{apt.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(apt.date)}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {apt.start_time}
                          {apt.end_time && ` - ${apt.end_time}`}
                        </span>
                      </div>
                      {apt.type && (
                        <span className="inline-block px-3 py-1.5 text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                          {apt.type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar className="w-20 h-20 text-gray-600 mx-auto mb-6 opacity-50" />
              <p className="text-gray-400 text-lg">No upcoming appointments</p>
              <p className="text-gray-500 text-sm mt-2">Your next session will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Past Appointments */}
      {pastAppointments && pastAppointments.length > 0 && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-transparent">
            <h2 className="text-xl font-bold text-white">Recent History</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {pastAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all"
                >
                  <div>
                    <p className="font-semibold text-white mb-1">{apt.title}</p>
                    <p className="text-sm text-gray-400">
                      {formatDate(apt.date)} • {apt.start_time}
                      {apt.end_time && ` - ${apt.end_time}`}
                    </p>
                  </div>
                  {apt.type && (
                    <span className="px-3 py-1 text-xs font-medium bg-gray-700/50 text-gray-300 border border-gray-600/50 rounded-full">
                      {apt.type}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

