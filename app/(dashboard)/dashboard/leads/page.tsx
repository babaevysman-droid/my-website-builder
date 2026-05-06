import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/dashboard/LogoutButton";

type Site = {
  id: string;
  name: string;
  slug: string;
};

type Lead = {
  id: string;
  site_id: string;
  data: Record<string, unknown> | null;
  created_at: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function renderLeadValue(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

function getLeadTitle(data: Record<string, unknown> | null) {
  if (!data) return "Новая заявка";

  const name = data.name || data.Name || data.имя || data["Имя"];
  const email = data.email || data.Email || data.mail || data["Почта"];

  if (typeof name === "string" && name.trim()) return name;
  if (typeof email === "string" && email.trim()) return email;

  return "Новая заявка";
}

export default async function LeadsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: sites, error: sitesError } = await supabase
    .from("sites")
    .select("id, name, slug")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (sitesError) console.error("Leads sites error:", sitesError);

  const userSites = (sites ?? []) as Site[];
  const siteIds = userSites.map((site) => site.id);

  let leads: Lead[] = [];

  if (siteIds.length > 0) {
    const { data: leadsData, error: leadsError } = await supabase
      .from("leads")
      .select("id, site_id, data, created_at")
      .in("site_id", siteIds)
      .order("created_at", { ascending: false });

    if (leadsError) console.error("Leads fetch error:", leadsError);

    leads = (leadsData ?? []) as Lead[];
  }

  const siteById = new Map(userSites.map((site) => [site.id, site]));

  return (
    <main className="min-h-screen bg-[#08080A] text-white">
      <header className="border-b border-white/10 bg-[#0b0b0d]">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center px-5">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            Corshun<span className="text-red-500">.</span>
          </Link>

          <nav className="ml-auto hidden items-center gap-8 text-[13px] font-medium text-white/55 md:flex">
            <Link href="/domains" className="transition hover:text-white">
              Домены
            </Link>
            <Link href="/settings" className="transition hover:text-white">
              Настройки
            </Link>
            <Link href="/dashboard/leads" className="text-white">
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
            Leads
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Заявки с сайтов
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
                Все отправки форм из опубликованных проектов.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
            >
              К проектам
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-5 py-8">
        <section className="mb-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#111114] p-5">
            <p className="text-xs text-white/35">Всего заявок</p>
            <p className="mt-2 text-2xl font-semibold">{leads.length}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111114] p-5">
            <p className="text-xs text-white/35">Проектов</p>
            <p className="mt-2 text-2xl font-semibold">{userSites.length}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111114] p-5">
            <p className="text-xs text-white/35">Источник</p>
            <p className="mt-2 text-2xl font-semibold">Forms</p>
          </div>
        </section>

        {leads.length === 0 ? (
          <section className="rounded-2xl border border-white/10 bg-[#111114] p-8 text-center">
            <h2 className="text-lg font-semibold">Заявок пока нет</h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
              Когда посетители отправят форму на сайте, заявка появится здесь.
            </p>

            <Link
              href="/dashboard"
              className="mt-5 inline-flex rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/65 transition hover:bg-white/[0.07] hover:text-white"
            >
              Проверить сайты
            </Link>
          </section>
        ) : (
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111114]">
            <div className="grid grid-cols-[1.2fr_1fr_150px] gap-4 border-b border-white/10 px-5 py-3 text-xs text-white/35 max-md:hidden">
              <div>Заявка</div>
              <div>Проект</div>
              <div className="text-right">Дата</div>
            </div>

            <div className="divide-y divide-white/10">
              {leads.map((lead) => {
                const site = siteById.get(lead.site_id);
                const entries = Object.entries(lead.data ?? {});
                const title = getLeadTitle(lead.data);

                return (
                  <details key={lead.id} className="group">
                    <summary className="grid cursor-pointer list-none gap-4 px-5 py-4 transition hover:bg-white/[0.03] md:grid-cols-[1.2fr_1fr_150px] md:items-center">
                      <div>
                        <p className="text-sm font-medium text-white">{title}</p>
                        <p className="mt-1 line-clamp-1 text-xs text-white/35">
                          {entries
                            .slice(0, 2)
                            .map(([key, value]) => `${key}: ${renderLeadValue(value)}`)
                            .join(" · ") || "Пустые данные"}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-white/65">
                          {site?.name ?? "Сайт удалён"}
                        </p>
                        <p className="mt-1 text-xs text-white/30">
                          {site ? `/s/${site.slug}` : lead.site_id}
                        </p>
                      </div>

                      <div className="text-xs text-white/35 md:text-right">
                        {formatDate(lead.created_at)}
                      </div>
                    </summary>

                    <div className="border-t border-white/10 bg-[#08080A] px-5 py-5">
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {entries.length > 0 ? (
                          entries.map(([key, value]) => (
                            <div
                              key={key}
                              className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                            >
                              <p className="text-xs text-white/30">{key}</p>
                              <p className="mt-1.5 break-words text-sm leading-5 text-white/75">
                                {renderLeadValue(value)}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/45">
                            Данные заявки пустые
                          </div>
                        )}
                      </div>
                    </div>
                  </details>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}