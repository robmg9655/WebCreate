import React from 'react';

type HeroProps = { title?: string; subtitle?: string; cta?: string };

export default function Hero({ title, subtitle, cta }: HeroProps) {
  return (
    <section aria-label="hero" className="py-12 text-center">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="mt-2 text-lg">{subtitle}</p>
      <button className="mt-4 px-4 py-2 bg-teal-500 text-white rounded">{cta}</button>
    </section>
  );
}
