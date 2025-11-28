import { LogoutButton } from '@/components/auth/LogoutButton';

export function DashboardHeader({ user }: { user: any }) {
  return (
    <header className="bg-gray-900 border-b border-gray-800/50">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-2 lg:px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <h1 className="text-sm lg:text-xl font-bold bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent">
              <span className="hidden sm:inline">KR FITNESS DASHBOARD</span>
              <span className="sm:hidden">DASHBOARD</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 lg:gap-4">
          <span className="hidden sm:inline text-sm text-gray-400 truncate max-w-[150px] lg:max-w-none">{user.email}</span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
