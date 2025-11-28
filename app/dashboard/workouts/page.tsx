import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { WorkoutsPageContent } from '@/components/dashboard/WorkoutsPageContent';

export default async function WorkoutsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="p-4 lg:p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Workout Plans</h1>
      <WorkoutsPageContent />
    </div>
  );
}




