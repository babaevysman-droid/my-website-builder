"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type SiteStatus = "draft" | "published";

type Site = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  status: SiteStatus;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

type Props = {
  sites: Site[];
};

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function SiteSettings({ sites }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [selectedSiteId, setSelectedSiteId] = useState(sites[0]?.id ?? "");
  const selectedSite = sites.find((site) => site.id === selectedSiteId) ?? null;

  const [name, setName] = useState(selectedSite?.name ?? "");
  const [slug, setSlug] = useState(selectedSite?.slug ?? "");
  const [seoTitle, setSeoTitle] = useState(selectedSite?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(
    selectedSite?.seo_description ?? ""
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function selectSite(site: Site) {
    setSelectedSiteId(site.id);
    setName(site.name ?? "");
    setSlug(site.slug ?? "");
    setSeoTitle(site.seo_title ?? "");
    setSeoDescription(site.seo_description ?? "");
  }

  async function saveSettings() {
    if (!selectedSite) return;

    const cleanSlug = normalizeSlug(slug);

    setIsSaving(true);

    const { error } = await supabase
      .from("sites")
      .update({
        name: name.trim(),
        slug: cleanSlug,
        seo_title: seoTitle.trim() || null,
        seo_description: seoDescription.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedSite.id);

    setIsSaving(false);

    if (error) {
      alert("Ошибка сохранения");
      return;
    }

    setSlug(cleanSlug);
    router.refresh();
  }

  async function togglePublish() {
    if (!selectedSite) return;

    const nextStatus =
      selectedSite.status === "published" ? "draft" : "published";

    setIsPublishing(true);

    await supabase
      .from("sites")
      .update({ status: nextStatus })
      .eq("id", selectedSite.id);

    setIsPublishing(false);
    router.refresh();
  }

  async function deleteSite() {
    if (!selectedSite) return;

    if (!confirm("Удалить сайт?")) return;

    setIsDeleting(true);

    await supabase.from("sites").delete().eq("id", selectedSite.id);

    setIsDeleting(false);
    router.refresh();
  }

  if (!sites.length) {
    return (
      <section className="rounded-2xl border border-white/10 bg-[#111114] p-8 text-center">
        Нет проектов
      </section>
    );
  }

  return (
    <section className="grid items-start gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      {/* LEFT */}
      <aside className="rounded-2xl border border-white/10 bg-[#111114] p-2">
        <div className="px-3 py-2 text-xs text-white/30">PROJECTS</div>

        <div className="space-y-1">
          {sites.map((site) => {
            const active = site.id === selectedSiteId;

            return (
              <button
                key={site.id}
                onClick={() => selectSite(site)}
                className={`w-full rounded-xl px-3 py-3 text-left ${
                  active ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm">{site.name}</div>
                    <div className="text-xs text-white/40">
                      /s/{site.slug}
                    </div>
                  </div>

                  <span className="text-xs text-white/40">
                    {site.status === "published" ? "Live" : "Draft"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* INFO */}
        {selectedSite && (
          <div className="mt-3 border-t border-white/10 p-3 text-xs">
            <div className="mb-2 text-white/30">CURRENT</div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Status</span>
                <span>{selectedSite.status}</span>
              </div>

              <div className="flex justify-between">
                <span>Updated</span>
                <span>{formatDate(selectedSite.updated_at)}</span>
              </div>

              <div className="flex justify-between">
                <span>Slug</span>
                <span>{selectedSite.slug}</span>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <Link
                href={`/builder/${selectedSite.id}`}
                className="block rounded-lg border border-white/10 px-3 py-2 text-center text-sm"
              >
                Редактор
              </Link>

              <Link
                href={`/s/${selectedSite.slug}`}
                target="_blank"
                className="block rounded-lg border border-white/10 px-3 py-2 text-center text-sm"
              >
                Открыть сайт
              </Link>
            </div>
          </div>
        )}
      </aside>

      {/* RIGHT */}
      {selectedSite && (
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111114]">
          {/* HEADER WITHOUT BUTTONS */}
          <div className="border-b border-white/10 px-5 py-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs text-white/40">
                Updated {formatDate(selectedSite.updated_at)}
              </span>
            </div>

            <h2 className="text-xl font-semibold">{selectedSite.name}</h2>

            <p className="mt-1 text-sm text-white/40">
              https://corshun.ru/s/{selectedSite.slug}
            </p>
          </div>

          {/* CONTENT */}
          <div className="divide-y divide-white/10">
            {/* MAIN */}
            <div className="grid gap-4 px-5 py-5 md:grid-cols-[220px_1fr]">
              <div>
                <h3 className="text-sm text-white">Основное</h3>
                <p className="text-xs text-white/40">
                  Название и ссылка
                </p>
              </div>

              <div className="space-y-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#08080A] px-3 py-2"
                />

                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#08080A] px-3 py-2"
                />
              </div>
            </div>

            {/* SEO */}
            <div className="grid gap-4 px-5 py-5 md:grid-cols-[220px_1fr]">
              <div>
                <h3 className="text-sm text-white">SEO</h3>
                <p className="text-xs text-white/40">
                  Поиск и превью
                </p>
              </div>

              <div className="space-y-3">
                <input
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#08080A] px-3 py-2"
                />

                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#08080A] px-3 py-2"
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between px-5 py-5">
              <button
                onClick={togglePublish}
                className="text-sm text-white/60"
              >
                {selectedSite.status === "published"
                  ? "Снять с публикации"
                  : "Опубликовать"}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={deleteSite}
                  className="text-sm text-red-400"
                >
                  Удалить
                </button>

                <button
                  onClick={saveSettings}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </section>
  );
}