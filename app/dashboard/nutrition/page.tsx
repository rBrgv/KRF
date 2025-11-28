import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { NutritionPageContent } from '@/components/dashboard/NutritionPageContent';

export default async function NutritionPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="p-4 lg:p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">Nutrition</h1>
      <NutritionPageContent />
    </div>
  );
}




