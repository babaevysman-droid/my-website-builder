import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DomainsManager from "@/components/dashboard/DomainsManager";
import LogoutButton from "@/components/dashboard/LogoutButton";

export default async function DomainsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: sites } = await supabase
    .from("sites")
    .select("id, name, slug, status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const { data: domains } = await supabase
    .from("custom_domains")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#08080A] text-white">
      <header className="border-b border-white/10 bg-[#0b0b0d]">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-5">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            Corshun<span className="text-red-500">.</span>
          </Link>

          <nav className="ml-auto hidden items-center gap-8 text-[13px] font-medium text-white/55 md:flex">
            <Link href="/domains" className="text-white">
              Домены
            </Link>
            <Link href="/settings" className="transition hover:text-white">
              Настройки
            </Link>
            <Link href="/dashboard/leads" className="transition hover:text-white">
              Заявки
            </Link>
            <Link href="/billing" className="transition hover:text-white">
              Тарифы
            </Link>
          </nav>

          <div className="ml-6">
            <LogoutButton />
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute right-0 top-0 h-full w-[520px] bg-red-600/10 blur-[120px]" />
        <div className="absolute right-0 top-0 h-full w-[420px] opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:42px_42px]" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-red-400/80">
            Domains
          </p>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Домены</h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
                Подключай собственные домены клиентов к опубликованным сайтам.
              </p>
            </div>

            <p className="text-sm text-white/35">
              {domains?.length ?? 0} доменов
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-5 py-8">
        <DomainsManager sites={sites || []} domains={domains || []} />
      </div>
    </main>
  );
}