'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-400 hover:text-red-400 px-4 py-2 rounded-lg border border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:bg-red-500/5"
    >
      Logout
    </button>
  );
}

