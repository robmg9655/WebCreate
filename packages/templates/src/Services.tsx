import React from 'react';

type ServiceItem = { title?: string; desc?: string; price?: string };
export default function Services({ items = [] }: { items?: ServiceItem[] }) {
  return (
    <section aria-label="services" className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((it: ServiceItem, i: number) => (
          <div key={i} className="border rounded p-4">
            <h3 className="font-semibold">{it.title}</h3>
            <p className="mt-2">{it.desc}</p>
            <div className="mt-3 text-sm font-medium">{it.price}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
