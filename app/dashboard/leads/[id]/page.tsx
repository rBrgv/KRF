import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { LeadDetail } from '@/components/dashboard/LeadDetail';

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const { id } = await params;

  // Fetch lead directly from Supabase
  const supabase = await createClient();
  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !lead) {
    console.error('Error fetching lead:', error);
    redirect('/dashboard/leads');
  }

  return <LeadDetail lead={lead} />;
}
