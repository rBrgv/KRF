import { redirect } from 'next/navigation';
import { getClientByUserId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { GoalsPage } from '@/components/portal/GoalsPage';

export default async function PortalGoalsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const client = await getClientByUserId(user.id);

  if (!client) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 shadow-xl p-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Account Not Linked</h1>
          <p className="text-gray-400 text-lg">
            Your account is not linked to a client profile. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  return <GoalsPage clientId={client.id} />;
}



