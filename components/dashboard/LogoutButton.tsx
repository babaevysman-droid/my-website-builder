'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="rounded-xl border border-white/10 px-4 py-2 text-sm text-neutral-300 hover:bg-white/10"
    >
      Выйти
    </button>
  );
}