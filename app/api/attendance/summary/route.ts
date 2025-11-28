import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const programType = searchParams.get('program_type');

    const supabase = await createClient();

    // Build base query for attendance logs
    let attendanceQuery = supabase
      .from('attendance_logs')
      .select(`
        id,
        client_id,
        check_in_time,
        check_out_time,
        clients:client_id (id, name, program_type)
      `);

    if (clientId) {
      attendanceQuery = attendanceQuery.eq('client_id', clientId);
    }
    if (startDate) {
      attendanceQuery = attendanceQuery.gte('check_in_time', startDate);
    }
    if (endDate) {
      attendanceQuery = attendanceQuery.lte('check_in_time', endDate);
    }

    const { data: logs, error: logsError } = await attendanceQuery;

    if (logsError) {
      console.error('Error fetching attendance logs:', logsError);
      return NextResponse.json(
        { error: 'Failed to fetch attendance data', details: logsError.message },
        { status: 500 }
      );
    }

    // Get total scheduled appointments in the same period
    let appointmentsQuery = supabase
      .from('appointments')
      .select('id, client_id, date, start_time, clients:client_id (program_type)');

    if (clientId) {
      appointmentsQuery = appointmentsQuery.eq('client_id', clientId);
    }
    if (startDate) {
      const startDateOnly = startDate.includes('T') ? startDate.split('T')[0] : startDate;
      appointmentsQuery = appointmentsQuery.gte('date', startDateOnly);
    }
    if (endDate) {
      const endDateOnly = endDate.includes('T') ? endDate.split('T')[0] : endDate;
      appointmentsQuery = appointmentsQuery.lte('date', endDateOnly);
    }

    const { data: appointments, error: appointmentsError } = await appointmentsQuery;

    if (appointmentsError) {
      console.error('Error fetching appointments:', appointmentsError);
    }

    // Filter by program type if specified
    let filteredLogs = logs || [];
    let filteredAppointments = appointments || [];

    if (programType) {
      filteredLogs = filteredLogs.filter((log: any) => 
        log.clients?.program_type === programType
      );
      filteredAppointments = filteredAppointments.filter((apt: any) =>
        apt.clients?.program_type === programType
      );
    }

    // Calculate summary statistics
    const totalSessions = filteredAppointments.length;
    const totalAttended = filteredLogs.length;
    const attendanceRate = totalSessions > 0 
      ? (totalAttended / totalSessions) * 100 
      : 0;

    // Calculate total hours (from completed sessions with check-out)
    const completedSessions = filteredLogs.filter((log: any) => log.check_out_time);
    const totalHours = completedSessions.reduce((sum: number, log: any) => {
      const checkIn = new Date(log.check_in_time);
      const checkOut = new Date(log.check_out_time);
      const durationMs = checkOut.getTime() - checkIn.getTime();
      return sum + (durationMs / (1000 * 60 * 60)); // Convert to hours
    }, 0);

    // Group by client for per-client stats
    const clientStats: Record<string, any> = {};
    
    filteredLogs.forEach((log: any) => {
      const clientId = log.client_id;
      if (!clientStats[clientId]) {
        clientStats[clientId] = {
          client_id: clientId,
          client_name: log.clients?.name || 'Unknown',
          total_sessions: 0,
          total_attended: 0,
          total_hours: 0,
        };
      }
      clientStats[clientId].total_attended++;
      if (log.check_out_time) {
        const checkIn = new Date(log.check_in_time);
        const checkOut = new Date(log.check_out_time);
        const durationMs = checkOut.getTime() - checkIn.getTime();
        clientStats[clientId].total_hours += durationMs / (1000 * 60 * 60);
      }
    });

    filteredAppointments.forEach((apt: any) => {
      const clientId = apt.client_id;
      if (!clientStats[clientId]) {
        clientStats[clientId] = {
          client_id: clientId,
          client_name: apt.clients?.name || 'Unknown',
          total_sessions: 0,
          total_attended: 0,
          total_hours: 0,
        };
      }
      clientStats[clientId].total_sessions++;
    });

    // Calculate attendance rate per client
    Object.values(clientStats).forEach((stats: any) => {
      stats.attendance_rate = stats.total_sessions > 0
        ? (stats.total_attended / stats.total_sessions) * 100
        : 0;
    });

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          total_sessions: totalSessions,
          total_attended: totalAttended,
          attendance_rate: Math.round(attendanceRate * 100) / 100,
          total_hours: Math.round(totalHours * 100) / 100,
        },
        by_client: Object.values(clientStats),
      },
    });
  } catch (error: any) {
    console.error('Error in GET /api/attendance/summary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

