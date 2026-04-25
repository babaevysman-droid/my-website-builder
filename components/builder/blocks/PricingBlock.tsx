export default function PricingBlock({
  title,
  price,
  description,
}: {
  title: string;
  price: string;
  description: string;
}) {
  return (
    <section className="px-8 py-20 text-center">
      <h2 className="text-3xl font-bold">{title}</h2>

      <div className="mx-auto mt-8 max-w-sm rounded-3xl border p-8 shadow-sm">
        <div className="text-4xl font-bold">{price}</div>
        <p className="mt-4 text-neutral-600">{description}</p>
        <button className="mt-8 w-full rounded-xl bg-black py-3 text-white">
          Выбрать тариф
        </button>
      </div>
    </section>
  );
}