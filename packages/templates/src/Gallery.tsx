import React from 'react';

export default function Gallery({ images = [] }: { images?: string[] }) {
  return (
    <section aria-label="gallery" className="py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {images.map((src: string, i: number) => (
          <img key={i} src={src} alt={`gallery ${i + 1}`} loading="lazy" className="w-full h-40 object-cover rounded" />
        ))}
      </div>
    </section>
  );
}
