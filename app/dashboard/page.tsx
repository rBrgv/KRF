import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { formatDate, formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import { Calendar, Users, TrendingUp, UserPlus } from 'lucide-react';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Add a simple check to ensure we have a user
  console.log('Dashboard loading for user:', user.email);

  const supabase = await createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date(today);
  todayEnd.setHours(23, 59, 59, 999);

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
  weekStart.setHours(0, 0, 0, 0);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  // New leads today - with error handling
  let newLeadsToday = 0;
  try {
    const { count, error } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())
      .lt('created_at', todayEnd.toISOString());
    if (!error) newLeadsToday = count || 0;
  } catch (e) {
    console.error('Error fetching leads today:', e);
  }

  // Total leads this week - with error handling
  let leadsThisWeek = 0;
  try {
    const { count, error } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekStart.toISOString());
    if (!error) leadsThisWeek = count || 0;
  } catch (e) {
    console.error('Error fetching leads this week:', e);
  }

  // Conversions this month - with error handling
  let conversionsThisMonth = 0;
  try {
    const { count, error } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'converted')
      .gte('created_at', monthStart.toISOString());
    if (!error) conversionsThisMonth = count || 0;
  } catch (e) {
    console.error('Error fetching conversions:', e);
  }

  // Today's appointments - with error handling
  const todayDateStr = today.toISOString().split('T')[0];
  let todayAppointments: any[] = [];
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, clients:client_id(name)')
      .eq('date', todayDateStr)
      .order('start_time', { ascending: true })
      .limit(5);
    if (!error && data) todayAppointments = data;
  } catch (e) {
    console.error('Error fetching appointments:', e);
  }

  // Upcoming events with registration counts - with error handling
  let upcomingEvents: any[] = [];
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        registrations:event_registrations(count)
      `)
      .eq('is_active', true)
      .gte('start_datetime', today.toISOString())
      .order('start_datetime', { ascending: true })
      .limit(5);
    if (!error && data) upcomingEvents = data;
  } catch (e) {
    console.error('Error fetching events:', e);
  }

  return (
    <div className="p-4 lg:p-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-400">Welcome back, {user.email}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="premium-card rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">New Leads Today</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent">
                {newLeadsToday || 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <UserPlus className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>

        <div className="premium-card rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Leads This Week</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent">
                {leadsThisWeek || 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <Users className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>

        <div className="premium-card rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Conversions This Month</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent">
                {conversionsThisMonth || 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <TrendingUp className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>

        <div className="premium-card rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Today's Appointments</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent">
                {todayAppointments?.length || 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <Calendar className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Appointments */}
        <div className="premium-card rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Today's Appointments</h2>
            <Link
              href="/dashboard/appointments"
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              View all →
            </Link>
          </div>
          {todayAppointments && todayAppointments.length > 0 ? (
            <div className="space-y-3">
              {todayAppointments.map((apt: any) => (
                <div key={apt.id} className="border-b border-gray-800 pb-3 last:border-0">
                  <p className="font-semibold text-white">{apt.title}</p>
                  <p className="text-sm text-gray-400">
                    {apt.clients?.name || 'No client'} • {apt.start_time}
                    {apt.end_time && ` - ${apt.end_time}`}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No appointments scheduled for today</p>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="premium-card rounded-2xl p-6 hover:border-red-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Upcoming Events</h2>
            <Link
              href="/dashboard/events"
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              View all →
            </Link>
          </div>
          {upcomingEvents && upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event: any) => (
                <div key={event.id} className="border-b border-gray-800 pb-3 last:border-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-white">{event.title}</p>
                      <p className="text-sm text-gray-400">
                        {formatDate(event.start_datetime)}
                      </p>
                    </div>
                    <span className="text-sm text-gray-400">
                      {event.registrations?.[0]?.count || 0} registrations
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming events</p>
          )}
        </div>
      </div>
    </div>
  );
}
