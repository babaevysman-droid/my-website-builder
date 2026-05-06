'use client';

import { PlanType } from '@/types';

type Plan = {
  id: PlanType;
  name: string;
  label: string;
  price: string;
  features: {
    tokens: { val: string; boost: boolean };
    sites: { val: string; boost: boolean };
    domain: { val: string; boost: boolean };
    export: { val: string; boost: boolean };
  };
  image: string;
  highlight: boolean;
};

const plans: Plan[] = [
  {
    id: 'free',
    name: 'DEMO',
    label: 'Проба',
    price: '0 ₽',
    features: {
      tokens: { val: '3 шт. (разово)', boost: false },
      sites: { val: '9 блоков', boost: false },
      domain: { val: 'Нет', boost: false },
      export: { val: 'Нет', boost: false },
    },
    image: '/plans/demo.jpg',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'FLIGHT',
    label: 'Бизнес',
    price: '199 ₽ /мес',
    features: {
      tokens: { val: '150 шт. /мес', boost: true },
      sites: { val: 'Безлимит блоков', boost: true },
      domain: { val: 'Включено', boost: true },
      export: { val: 'Нет', boost: false },
    },
    image: '/plans/flight.jpg',
    highlight: true,
  },
  {
    id: 'business',
    name: 'HUNTER',
    label: 'Хищник',
    price: '399 ₽ /мес',
    features: {
      tokens: { val: 'БЕЗЛИМИТ', boost: true },
      sites: { val: 'Онлайн 24/7', boost: false },
      domain: { val: 'Включено', boost: false },
      export: { val: 'ZIP-архив', boost: true },
    },
    image: '/plans/hunter.jpg',
    highlight: false,
  },
];

export default function BillingPlans({ currentPlan }: { currentPlan: PlanType }) {
  return (
    <div className="grid gap-6 md:grid-cols-3 bg-gradient-to-b from-black via-[#050505] to-black p-6 md:p-10 max-w-6xl mx-auto">
      {plans.map((plan) => {
        const active = plan.id === currentPlan;

        return (
          <article
            key={plan.id}
            className={[
              'group relative flex flex-col min-h-[520px] rounded-[32px] transition-all duration-500',
              'overflow-hidden isolation-isolate transform-gpu',
              'bg-[#0a0a0a] border backdrop-blur-xl',
              'hover:scale-[1.02] hover:-translate-y-1',
              plan.highlight
                ? 'border-red-500/70 shadow-[0_0_80px_-20px_rgba(255,0,0,0.5)]'
                : 'border-white/10 hover:border-white/20',
            ].join(' ')}
          >
            {/* Glow эффект */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-emerald-400/10 blur-2xl" />
            </div>

            {/* Контейнер изображения */}
            <div className="relative h-44 w-full overflow-hidden">
              <img
                src={plan.image}
                className="h-full w-full object-cover opacity-40 group-hover:opacity-60 scale-100 group-hover:scale-110 transition-all duration-700"
                alt=""
              />
              
              {/* Основное затемнение */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

              {/* ЛИНИЯ-РАЗДЕЛИТЕЛЬ (Закрывает артефакт) */}
              <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white/10 z-50 shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
            </div>

            {/* Контент */}
            <div className="flex flex-1 flex-col px-6 pb-6 pt-6 relative z-30 text-center">
              {/* Бейджики */}
              <div className="absolute -top-36 left-4 right-4 flex justify-between items-start pointer-events-none">
                {plan.highlight ? (
                  <div className="bg-red-600/90 rounded-full px-3 py-1 shadow-lg border border-white/10">
                    <span className="text-[9px] font-black text-white uppercase tracking-wider">
                      🔥 ПОПУЛЯРНЫЙ
                    </span>
                  </div>
                ) : <div />}

                {active && (
                  <div className="bg-emerald-500/90 rounded-full px-3 py-1 shadow-lg border border-white/10">
                    <span className="text-[9px] font-black text-white uppercase tracking-wider">
                      ✓ АКТИВЕН
                    </span>
                  </div>
                )}
              </div>

              <h2 className="text-4xl font-black italic tracking-tight text-white uppercase drop-shadow-lg">
                {plan.name}
              </h2>

              <div className="mt-2 inline-block mx-auto bg-gradient-to-r from-yellow-400 to-yellow-200 px-4 py-1 text-[10px] font-black text-black uppercase skew-x-[-12deg] shadow-md">
                {plan.label}
              </div>

              <div className="mt-8 space-y-3 text-left">
                <FeatureRow
                  label="Токены ИИ"
                  value={plan.features.tokens.val}
                  isBoost={plan.features.tokens.boost}
                />
                <FeatureRow
                  label="Конструктор"
                  value={plan.features.sites.val}
                  isBoost={plan.features.sites.boost}
                />
                <FeatureRow
                  label="Домен"
                  value={plan.features.domain.val}
                  isBoost={plan.features.domain.boost}
                  isGray={plan.features.domain.val === 'Нет'}
                />
                <FeatureRow
                  label="Экспорт кода"
                  value={plan.features.export.val}
                  isBoost={plan.features.export.boost}
                  isGray={plan.features.export.val === 'Нет'}
                />
              </div>

              <div className="mt-auto pt-6">
                <p className="text-3xl font-extrabold text-white mb-5 tracking-tight">
                  {plan.price}
                </p>

                <button
                  disabled={active}
                  className={[
                    'group w-full rounded-2xl py-4 text-[11px] font-black uppercase tracking-widest transition-all duration-300 relative overflow-hidden',
                    active
                      ? 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                      : plan.highlight
                      ? 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-[0_0_30px_rgba(255,0,0,0.6)] hover:scale-[1.05]'
                      : 'bg-white text-black hover:bg-gray-200 hover:scale-[1.05]',
                  ].join(' ')}
                >
                  {active ? 'Текущий тариф' : 'Выбрать план'}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function FeatureRow({
  label,
  value,
  isBoost,
  isGray,
}: {
  label: string;
  value: string;
  isBoost: boolean;
  isGray?: boolean;
}) {
  return (
    <div className="flex justify-between items-center text-[11px] border-b border-white/[0.04] pb-2">
      <span className="text-white/30 uppercase font-bold tracking-tight">
        {label}
      </span>
      <span
        className={[
          'font-bold transition-all duration-300',
          isBoost
            ? 'text-emerald-400 group-hover:translate-x-1'
            : isGray
            ? 'text-white/10'
            : 'text-white/80 group-hover:text-white',
        ].join(' ')}
      >
        {isBoost && '↑ '}
        {value}
      </span>
    </div>
  );
}