'use client';

import { PlanType } from '@/types';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Для теста и одного сайта.',
    features: ['1 сайт', 'Watermark', 'Базовые блоки'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19/mo',
    description: 'Для фрилансеров. Скоро подключим оплату.',
    features: ['10 сайтов', 'Без watermark', 'SEO', 'Leads'],
  },
  {
    id: 'business',
    name: 'Business',
    price: '$49/mo',
    description: 'Для студий. Скоро подключим оплату.',
    features: ['100 сайтов', 'Без watermark', 'Приоритетные фичи'],
  },
] as const;

export default function BillingPlans({
  currentPlan,
}: {
  currentPlan: PlanType;
}) {
  function checkout(plan: PlanType) {
    if (plan === 'free') {
      alert('Ты уже на Free тарифе.');
      return;
    }

    alert('Оплата пока отключена. ЮKassa подключим позже.');
  }

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      {plans.map((plan) => {
        const active = plan.id === currentPlan;

        return (
          <div
            key={plan.id}
            className={`rounded-3xl border p-6 ${
              active
                ? 'border-white bg-neutral-900'
                : 'border-neutral-800 bg-neutral-900'
            }`}
          >
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <div className="mt-4 text-4xl font-bold">{plan.price}</div>
            <p className="mt-3 text-sm text-neutral-400">{plan.description}</p>

            <ul className="mt-6 space-y-2 text-sm text-neutral-300">
              {plan.features.map((feature) => (
                <li key={feature}>✓ {feature}</li>
              ))}
            </ul>

            <button
              disabled={active}
              onClick={() => checkout(plan.id)}
              className="mt-6 w-full rounded-xl bg-white py-3 text-sm font-medium text-black disabled:opacity-40"
            >
              {active ? 'Текущий тариф' : 'Выбрать'}
            </button>
          </div>
        );
      })}
    </div>
  );
}