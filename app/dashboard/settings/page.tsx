import { redirect } from 'next/navigation';
import { getCurrentUser, getUserRole } from '@/lib/auth';
import { SettingsPageContent } from '@/components/dashboard/SettingsPageContent';

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  const role = await getUserRole();
  if (role !== 'admin') {
    redirect('/dashboard');
  }

  return <SettingsPageContent />;
}



