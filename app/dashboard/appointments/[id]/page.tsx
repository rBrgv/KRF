import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { AppointmentForm } from '@/components/dashboard/AppointmentForm';

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const { id } = await params;

  // Fetch appointment directly from Supabase
  const supabase = await createClient();
  const { data: appointment, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !appointment) {
    console.error('Error fetching appointment:', error);
    redirect('/dashboard/appointments');
  }

  return (
    <div className="p-4 lg:p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Edit Appointment</h1>
      <AppointmentForm appointment={appointment} />
    </div>
  );
}

