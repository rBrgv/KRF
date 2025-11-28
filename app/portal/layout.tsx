import { redirect } from 'next/navigation';
import { getUserRole, getClientByUserId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { PortalNav } from '@/components/portal/PortalNav';

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Check user role
  const role = await getUserRole();
  if (!role || (role !== 'client')) {
    // If not a client, redirect to dashboard
    redirect('/dashboard');
  }

  // Get client data
  const client = await getClientByUserId(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-3xl"></div>
      </div>
      <PortalNav client={client} />
      <main className="relative z-10 container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

