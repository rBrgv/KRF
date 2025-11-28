import { redirect } from 'next/navigation';
import { getClientByUserId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { Calendar, Dumbbell, Apple, CreditCard, Clock } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default async function PortalHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const client = await getClientByUserId(user.id);

  if (!client) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30">
            <span className="text-4xl">👋</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Welcome!</h1>
          <p className="text-gray-400 text-lg">
            Your account is not linked to a client profile. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  // Fetch upcoming appointments
  const today = new Date().toISOString().split('T')[0];
  const { data: upcomingAppointments } = await supabase
    .from('appointments')
    .select('*')
    .eq('client_id', client.id)
    .gte('date', today)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })
    .limit(5);

  // Fetch active workout plan
  const { data: activeWorkoutPlan } = await supabase
    .from('client_workout_assignments')
    .select(`
      *,
      workout_plans:workout_plan_id (title, goal_type, level)
    `)
    .eq('client_id', client.id)
    .eq('is_active', true)
    .limit(1)
    .single();

  // Fetch active meal plan
  const { data: activeMealPlan } = await supabase
    .from('client_meal_plan_assignments')
    .select(`
      *,
      meal_plans:meal_plan_id (title, goal_type)
    `)
    .eq('client_id', client.id)
    .eq('is_active', true)
    .limit(1)
    .single();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/30">
            <span className="text-white font-bold text-lg">👋</span>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
              Welcome back, <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">{client.name}</span>!
            </h1>
            <p className="text-gray-400 text-lg">Here's your fitness overview</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link
          href="/portal/schedule"
          className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50 hover:border-red-500/50 transition-all hover:shadow-xl hover:shadow-red-500/10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Upcoming Sessions</p>
              <p className="text-3xl font-bold text-white">
                {upcomingAppointments?.length || 0}
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/portal/plans"
          className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50 hover:border-red-500/50 transition-all hover:shadow-xl hover:shadow-red-500/10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
              <Dumbbell className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Active Plans</p>
              <p className="text-3xl font-bold text-white">
                {(activeWorkoutPlan ? 1 : 0) + (activeMealPlan ? 1 : 0)}
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/portal/payments"
          className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50 hover:border-red-500/50 transition-all hover:shadow-xl hover:shadow-red-500/10 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Payments</p>
              <p className="text-3xl font-bold text-white">View</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl mb-8 overflow-hidden">
        <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Upcoming Appointments</h2>
            </div>
            <Link
              href="/portal/schedule"
              className="text-sm text-red-400 hover:text-red-300 font-medium flex items-center gap-1 transition-colors"
            >
              View All <span>→</span>
            </Link>
          </div>
        </div>
        <div className="p-6">
          {upcomingAppointments && upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-5 border border-gray-700/30 hover:border-red-500/50 transition-all hover:shadow-lg hover:shadow-red-500/10"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-2 text-lg">{apt.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(apt.date)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {apt.start_time}
                          {apt.end_time && ` - ${apt.end_time}`}
                        </span>
                      </div>
                      {apt.type && (
                        <span className="inline-block mt-3 px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                          {apt.type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400">No upcoming appointments</p>
            </div>
          )}
        </div>
      </div>

      {/* Active Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workout Plan */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Workout Plan</h2>
              </div>
              <Link
                href="/portal/plans"
                className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                View →
              </Link>
            </div>
          </div>
          <div className="p-6">
            {activeWorkoutPlan ? (
              <div>
                <h3 className="font-bold text-white mb-3 text-lg">
                  {activeWorkoutPlan.workout_plans?.title || 'Active Plan'}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1.5 text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                    {activeWorkoutPlan.workout_plans?.goal_type?.replace('_', ' ') || ''}
                  </span>
                  <span className="px-3 py-1.5 text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 rounded-full">
                    {activeWorkoutPlan.workout_plans?.level || ''}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  Started: <span className="text-gray-300">{formatDate(activeWorkoutPlan.start_date)}</span>
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Dumbbell className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-50" />
                <p className="text-gray-400">No active workout plan</p>
              </div>
            )}
          </div>
        </div>

        {/* Meal Plan */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Apple className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Meal Plan</h2>
              </div>
              <Link
                href="/portal/plans"
                className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                View →
              </Link>
            </div>
          </div>
          <div className="p-6">
            {activeMealPlan ? (
              <div>
                <h3 className="font-bold text-white mb-3 text-lg">
                  {activeMealPlan.meal_plans?.title || 'Active Plan'}
                </h3>
                <span className="inline-block px-3 py-1.5 text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full mb-4">
                  {activeMealPlan.meal_plans?.goal_type?.replace('_', ' ') || ''}
                </span>
                <p className="text-sm text-gray-400">
                  Started: <span className="text-gray-300">{formatDate(activeMealPlan.start_date)}</span>
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Apple className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-50" />
                <p className="text-gray-400">No active meal plan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

