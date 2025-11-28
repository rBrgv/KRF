import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { NewLeadForm } from '@/components/dashboard/NewLeadForm';

export default async function NewLeadPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="p-4 lg:p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Add New Lead</h1>
      <NewLeadForm />
    </div>
  );
}
