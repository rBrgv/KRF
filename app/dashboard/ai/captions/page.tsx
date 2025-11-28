import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { CaptionGenerator } from '@/components/dashboard/ai/CaptionGenerator';

export default async function CaptionPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="p-4 lg:p-8">
      <h1 className="text-3xl font-bold mb-8">AI Instagram Caption Helper</h1>
      <CaptionGenerator />
    </div>
  );
}

