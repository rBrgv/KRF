import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black" data-dashboard="true">
      <DashboardHeader user={user} />
      <div className="flex">
        <DashboardNav />
        <div className="flex-1 relative lg:ml-0">
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-600/3 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
