export default function FeaturesBlock({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <section className="px-8 py-20">
      <h2 className="mb-10 text-center text-3xl font-bold">{title}</h2>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-2xl border p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
              {index + 1}
            </div>
            <h3 className="font-semibold">{item}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}