export default function CtaBlock({
  title,
  buttonText,
}: {
  title: string;
  buttonText: string;
}) {
  return (
    <section className="px-8 py-20 text-center">
      <div className="rounded-3xl bg-black px-8 py-16 text-white">
        <h2 className="text-4xl font-bold">{title}</h2>
        <button className="mt-8 rounded-xl bg-white px-6 py-3 font-medium text-black">
          {buttonText}
        </button>
      </div>
    </section>
  );
}