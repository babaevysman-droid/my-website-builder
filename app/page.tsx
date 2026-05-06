import Link from "next/link";

const features = [
  {
    label: "01",
    title: "Редактор блоков",
    text: "Собирай страницу из готовых секций: hero, CTA, features, pricing, gallery и формы.",
    meta: "Drag & drop",
  },
  {
    label: "02",
    title: "Публикация сразу",
    text: "Сайт получает публичную ссылку вида corshun.ru/s/site-slug.",
    meta: "One click",
  },
  {
    label: "03",
    title: "SEO и заявки",
    text: "Настраивай превью страницы и собирай заявки с форм в личном кабинете.",
    meta: "Built-in",
  },
];

const steps = [
  {
    number: "01",
    title: "Выбери шаблон",
    text: "SaaS, портфолио или агентство — стартуй не с пустого экрана.",
  },
  {
    number: "02",
    title: "Настрой блоки",
    text: "Меняй тексты, порядок секций, CTA, цены, формы и визуал.",
  },
  {
    number: "03",
    title: "Проверь SEO",
    text: "Добавь title, description и подготовь страницу к публикации.",
  },
  {
    number: "04",
    title: "Опубликуй сайт",
    text: "Получай ссылку и отправляй клиентам, подписчикам или команде.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070707]/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            Corshun<span className="text-red-500">.</span>
          </Link>

          <nav className="hidden items-center gap-8 text-[13px] font-medium text-white/55 md:flex">
            <Link href="#features" className="transition hover:text-white">
              Возможности
            </Link>
            <Link href="#how" className="transition hover:text-white">
              Процесс
            </Link>
            <Link href="/login" className="transition hover:text-white">
              Войти
            </Link>
          </nav>

          <Link
            href="/dashboard"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
          >
            Создать сайт
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute right-0 top-0 h-full w-[52%] overflow-hidden">
          <img
            src="/hero.jpg"
            alt=""
            className="h-full w-full scale-105 object-cover opacity-45 blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#070707]/20 via-[#070707]/55 to-[#070707]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-[#070707]/30" />
        </div>

        <div className="relative z-10 mx-auto min-h-[620px] w-full max-w-7xl px-5 py-20 lg:flex lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-7 inline-flex rounded-full bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-200 ring-1 ring-red-500/25">
              No-code конструктор сайтов
            </p>

            <h1 className="text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[86px]">
              Сайт для проекта без кода.
            </h1>

            <p className="mt-7 max-w-2xl text-xl leading-8 text-white/58">
              Собирай страницы из готовых блоков, редактируй визуально и
              публикуй сайт по ссылке за несколько минут.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="rounded-xl bg-red-600 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-red-500 active:scale-[0.98]"
              >
                Создать сайт
              </Link>

              <Link
                href="/login"
                className="rounded-xl bg-white/10 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Войти в кабинет
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-7xl px-5 py-20">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-red-400">
              Возможности
            </p>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
              Не просто лендинг. Рабочий инструмент.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-white/45">
            Панели, редактор, публикация и заявки — всё собрано вокруг быстрого
            запуска сайта.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#111114] p-6 transition hover:-translate-y-1 hover:border-red-500/30 hover:bg-[#151518]"
            >
              <div className="absolute right-0 top-0 h-32 w-32 bg-red-600/10 blur-3xl transition group-hover:bg-red-600/20" />

              <div className="relative mb-10 flex items-center justify-between">
                <span className="text-sm font-black text-red-300">
                  {feature.label}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/45">
                  {feature.meta}
                </span>
              </div>

              <h3 className="relative text-2xl font-black">{feature.title}</h3>
              <p className="relative mt-4 text-base leading-7 text-white/50">
                {feature.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="how" className="border-y border-white/10 bg-[#0b0b0d]">
        <div className="mx-auto w-full max-w-7xl px-5 py-20">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-red-400">
                Процесс
              </p>

              <h2 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
                От шаблона до публичной ссылки.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-white/45">
              Понятный путь без технического шума: выбрал основу, настроил,
              проверил и опубликовал.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            {steps.map((step) => (
              <article
                key={step.number}
                className="relative min-h-[230px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#111114] p-6"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-red-600/10 blur-3xl" />

                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-red-300">
                      {step.number}
                    </p>

                    <div className="h-8 w-8 rounded-full border border-white/10 bg-white/[0.04]" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-black tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/45">
                      {step.text}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-5 py-20">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#111114] p-8 sm:p-10">
          <div className="absolute right-0 top-0 h-80 w-80 bg-red-600/12 blur-[100px]" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-red-400">
                Corshun
              </p>
              <h2 className="max-w-2xl text-4xl font-black tracking-tight">
                Создай сайт, который хочется показать клиенту.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-white/50">
                Начни с шаблона, собери блоки, настрой SEO и опубликуй результат.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="rounded-xl bg-red-600 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Перейти к созданию
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-7 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>Corshun.</p>
          <p>Создавай сайты с высоты.</p>
        </div>
      </footer>
    </main>
  );
}