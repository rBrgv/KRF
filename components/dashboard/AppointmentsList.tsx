'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { LogIn, LogOut, CheckCircle, Clock } from 'lucide-react';

interface AttendanceLog {
  id: string;
  appointment_id: string;
  check_in_time: string;
  check_out_time: string | null;
}

interface Appointment {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string | null;
  type: string | null;
  client_id: string | null;
  clients?: {
    name: string;
  };
  attendance?: AttendanceLog | null;
}

interface AppointmentsListProps {
  initialAppointments: Appointment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  initialFilters?: {
    date?: string;
    clientId?: string;
    type?: string;
  };
}

export function AppointmentsList({
  initialAppointments,
  pagination,
  initialFilters,
}: AppointmentsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dateFilter, setDateFilter] = useState(initialFilters?.date || '');
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [appointments, setAppointments] = useState(initialAppointments);

  const getAttendanceStatus = (apt: Appointment) => {
    if (!apt.attendance) {
      return { status: 'not_arrived', label: 'Not Arrived', color: 'bg-gray-500/10 text-gray-400 border-gray-500/30' };
    }
    if (apt.attendance.check_out_time) {
      return { status: 'completed', label: 'Completed', color: 'bg-green-500/10 text-green-400 border-green-500/30' };
    }
    return { status: 'in_session', label: 'In Session', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
  };

  const handleCheckIn = async (appointment: Appointment) => {
    if (!appointment.client_id) {
      alert('No client assigned to this appointment');
      return;
    }

    setProcessing({ ...processing, [appointment.id]: true });
    try {
      const response = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: appointment.client_id,
          appointment_id: appointment.id,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Update local state optimistically
        setAppointments(appointments.map(apt => 
          apt.id === appointment.id 
            ? { ...apt, attendance: result.data }
            : apt
        ));
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to check in');
      }
    } catch (error) {
      console.error('Error checking in:', error);
      alert('An error occurred');
    } finally {
      setProcessing({ ...processing, [appointment.id]: false });
    }
  };

  const handleCheckOut = async (appointment: Appointment) => {
    if (!appointment.attendance) {
      alert('No attendance log found');
      return;
    }

    setProcessing({ ...processing, [appointment.id]: true });
    try {
      const response = await fetch('/api/attendance/check-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendance_log_id: appointment.attendance.id,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Update local state optimistically
        setAppointments(appointments.map(apt => 
          apt.id === appointment.id 
            ? { ...apt, attendance: result.data }
            : apt
        ));
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to check out');
      }
    } catch (error) {
      console.error('Error checking out:', error);
      alert('An error occurred');
    } finally {
      setProcessing({ ...processing, [appointment.id]: false });
    }
  };

  const handleFilterChange = (value: string) => {
    setDateFilter(value);
    const params = new URLSearchParams();
    if (value === 'today') {
      params.set('date', 'today');
    } else if (value === 'this_week') {
      // Calculate week start (Sunday)
      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      params.set('date', weekStart.toISOString().split('T')[0]);
    } else if (value) {
      params.set('date', value);
    }
    if (initialFilters?.clientId) params.set('client_id', initialFilters.clientId);
    if (initialFilters?.type) params.set('type', initialFilters.type);
    router.push(`/dashboard/appointments?${params.toString()}`);
  };

  return (
    <div>
      <div className="premium-card rounded-2xl p-6 mb-6">
        <div className="flex gap-4">
          <select
            value={dateFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
          >
            <option value="">All Appointments</option>
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
          </select>
        </div>
      </div>

      <div className="premium-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Attendance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-900/30 divide-y divide-gray-800">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📅</div>
                    <h3 className="text-lg font-semibold mb-2 text-white">
                      {dateFilter ? 'No appointments for this period' : 'No appointments yet'}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {dateFilter
                        ? 'Try selecting a different time period.'
                        : 'Start scheduling appointments with your clients.'}
                    </p>
                    {!dateFilter && (
                      <Link
                        href="/dashboard/appointments/new"
                        className="inline-block bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300"
                      >
                        Schedule Appointment
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              appointments.map((apt) => {
                const attendanceStatus = getAttendanceStatus(apt);
                const canCheckIn = !apt.attendance && apt.client_id;
                const canCheckOut = apt.attendance && !apt.attendance.check_out_time;
                const isProcessing = processing[apt.id];

                return (
                  <tr key={apt.id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{apt.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {apt.clients?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {formatDate(apt.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {apt.start_time}
                      {apt.end_time && ` - ${apt.end_time}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {apt.type || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${attendanceStatus.color}`}>
                          {attendanceStatus.label}
                        </span>
                        {canCheckIn && (
                          <button
                            onClick={() => handleCheckIn(apt)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                            title="Check In"
                          >
                            <LogIn className="w-3 h-3" />
                            Check In
                          </button>
                        )}
                        {canCheckOut && (
                          <button
                            onClick={() => handleCheckOut(apt)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                            title="Check Out"
                          >
                            <LogOut className="w-3 h-3" />
                            Check Out
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/dashboard/appointments/${apt.id}`}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

