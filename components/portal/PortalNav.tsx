'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Calendar, Dumbbell, Apple, CreditCard, LogOut, TrendingUp, Target } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Client {
  id: string;
  name: string;
}

interface PortalNavProps {
  client: Client | null;
}

export function PortalNav({ client }: PortalNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  const navItems = [
    { href: '/portal', label: 'Home', icon: Home },
    { href: '/portal/schedule', label: 'Schedule', icon: Calendar },
    { href: '/portal/plans', label: 'Plans', icon: Dumbbell },
    { href: '/portal/nutrition', label: 'Nutrition', icon: Apple },
    { href: '/portal/progress', label: 'Progress', icon: TrendingUp },
    { href: '/portal/goals', label: 'Goals', icon: Target },
    { href: '/portal/payments', label: 'Payments', icon: CreditCard },
  ];

  return (
    <nav className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800/50 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/portal" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20 group-hover:shadow-red-600/40 transition-all">
                <span className="text-white font-bold text-sm">KR</span>
              </div>
              <span className="font-bold text-white hidden sm:inline text-lg">KR Fitness</span>
            </Link>
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/portal' && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30'
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {client && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300 font-medium">{client.name}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all border border-gray-800/50 hover:border-gray-700"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div className="md:hidden border-t border-gray-800/50 bg-gray-900/95">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/portal' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs transition-all ${
                  isActive
                    ? 'text-red-400 bg-red-500/10'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

