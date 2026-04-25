export default function GalleryBlock({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  return (
    <section className="px-8 py-20">
      <h2 className="mb-10 text-center text-3xl font-bold">{title}</h2>

      {images.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-neutral-500">
          Изображения пока не добавлены
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {images.map((url, index) => (
            <img
              key={`${url}-${index}`}
              src={url}
              alt={`Gallery image ${index + 1}`}
              className="h-64 w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      )}
    </section>
  );
}