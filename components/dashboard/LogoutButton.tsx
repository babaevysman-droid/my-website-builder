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
      className="rounded-xl border border-neutral-700 px-4 py-2 text-sm hover:bg-neutral-800"
    >
      Выйти
    </button>
  );
}