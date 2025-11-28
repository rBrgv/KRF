import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { AttendanceDashboard } from '@/components/dashboard/AttendanceDashboard';

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const params = await searchParams;
  const startDate = typeof params.start_date === 'string' ? params.start_date : undefined;
  const endDate = typeof params.end_date === 'string' ? params.end_date : undefined;
  const clientId = typeof params.client_id === 'string' ? params.client_id : undefined;
  const programType = typeof params.program_type === 'string' ? params.program_type : undefined;

  return (
    <div className="p-4 lg:p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Attendance Reports</h1>
      <AttendanceDashboard
        initialStartDate={startDate}
        initialEndDate={endDate}
        initialClientId={clientId}
        initialProgramType={programType}
      />
    </div>
  );
}




