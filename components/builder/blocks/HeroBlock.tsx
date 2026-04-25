export default function HeroBlock({
  title,
  subtitle,
  buttonText,
  secondaryButtonText,
  imageUrl,
  backgroundImageUrl,
}: {
  title: string;
  subtitle: string;
  buttonText: string;
  secondaryButtonText?: string;
  imageUrl?: string;
  backgroundImageUrl?: string;
}) {
  const hasBackground = Boolean(backgroundImageUrl);

  return (
    <section
      className="relative overflow-hidden px-8 py-28"
      style={
        hasBackground
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${backgroundImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: '#ffffff',
            }
          : undefined
      }
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className={imageUrl ? 'text-left' : 'text-center md:col-span-2'}>
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            {title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg opacity-80">
            {subtitle}
          </p>

          <div className={`mt-8 flex gap-3 ${imageUrl ? '' : 'justify-center'}`}>
            <button className="rounded-xl bg-black px-6 py-3 font-medium text-white">
              {buttonText}
            </button>

            {secondaryButtonText && (
              <button className="rounded-xl border border-current px-6 py-3 font-medium">
                {secondaryButtonText}
              </button>
            )}
          </div>
        </div>

        {imageUrl && (
          <div className="relative">
            <img
              src={imageUrl}
              alt=""
              className="h-[420px] w-full rounded-3xl object-cover shadow-2xl"
            />
          </div>
        )}
      </div>
    </section>
  );
}