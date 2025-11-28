import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { WorkoutPlanGenerator } from '@/components/dashboard/ai/WorkoutPlanGenerator';

export default async function WorkoutPlanPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="p-4 lg:p-8">
      <h1 className="text-3xl font-bold mb-8">AI Workout Plan Generator</h1>
      <WorkoutPlanGenerator />
    </div>
  );
}

