import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { AppointmentsList } from '@/components/dashboard/AppointmentsList';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const params = await searchParams;
  const date = typeof params.date === 'string' ? params.date : undefined;
  const clientId = typeof params.client_id === 'string' ? params.client_id : undefined;
  const type = typeof params.type === 'string' ? params.type : undefined;

  // Fetch appointments directly from Supabase
  const supabase = await createClient();
  let query = supabase
    .from('appointments')
    .select(`
      *,
      clients:client_id (name)
    `, { count: 'exact' })
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })
    .gte('date', new Date().toISOString().split('T')[0]); // Only show future appointments by default

  // Apply filters
  if (date === 'today') {
    const today = new Date().toISOString().split('T')[0];
    query = query.eq('date', today);
  } else if (date) {
    query = query.eq('date', date);
  }
  if (clientId) {
    query = query.eq('client_id', clientId);
  }
  if (type) {
    query = query.eq('type', type);
  }

  const { data: appointments, error, count } = await query;

  if (error) {
    console.error('Error fetching appointments:', error);
  }

  // Fetch attendance logs for these appointments
  const appointmentIds = (appointments || []).map(apt => apt.id);
  let attendanceData: Record<string, any> = {};
  
  if (appointmentIds.length > 0) {
    const { data: attendanceLogs } = await supabase
      .from('attendance_logs')
      .select('id, appointment_id, check_in_time, check_out_time')
      .in('appointment_id', appointmentIds);

    if (attendanceLogs) {
      attendanceLogs.forEach((log) => {
        if (log.appointment_id) {
          attendanceData[log.appointment_id] = log;
        }
      });
    }
  }

  const data = (appointments || []).map(apt => ({
    ...apt,
    attendance: attendanceData[apt.id] || null,
  }));

  return (
    <div className="p-4 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">Appointments</h1>
        <Link
          href="/dashboard/appointments/new"
          className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-sm font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 premium-glow flex items-center gap-2"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Appointment
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </Link>
      </div>
      <AppointmentsList
        initialAppointments={data || []}
        pagination={{
          page: 1,
          limit: 100,
          total: count || 0,
          totalPages: 1,
        }}
        initialFilters={{ date, clientId, type }}
      />
    </div>
  );
}
