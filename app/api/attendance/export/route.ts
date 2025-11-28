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

    // Fetch attendance logs
    let query = supabase
      .from('attendance_logs')
      .select(`
        *,
        clients:client_id (name, program_type),
        appointments:appointment_id (title, date, start_time)
      `)
      .order('check_in_time', { ascending: false });

    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    if (startDate) {
      query = query.gte('check_in_time', startDate);
    }
    if (endDate) {
      query = query.lte('check_in_time', endDate);
    }

    const { data: logs, error } = await query;

    if (error) {
      console.error('Error fetching attendance logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch attendance data' },
        { status: 500 }
      );
    }

    // Filter by program type if specified
    let filteredLogs = logs || [];
    if (programType) {
      filteredLogs = filteredLogs.filter((log: any) => 
        log.clients?.program_type === programType
      );
    }

    // Generate CSV
    const headers = [
      'Date',
      'Client Name',
      'Session Title',
      'Check In Time',
      'Check Out Time',
      'Duration (minutes)',
      'Source',
      'Notes',
    ];

    const rows = filteredLogs.map((log: any) => {
      const checkIn = new Date(log.check_in_time);
      const checkOut = log.check_out_time ? new Date(log.check_out_time) : null;
      const duration = checkOut 
        ? Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60))
        : '';

      return [
        checkIn.toISOString().split('T')[0],
        log.clients?.name || '',
        log.appointments?.title || 'Standalone Session',
        checkIn.toLocaleString('en-IN'),
        checkOut ? checkOut.toLocaleString('en-IN') : '',
        duration.toString(),
        log.source || 'manual',
        log.notes || '',
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="attendance-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Error in GET /api/attendance/export:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}




