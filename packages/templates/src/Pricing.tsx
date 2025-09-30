import React from 'react';

type Plan = { name?: string; price?: string; desc?: string };
export default function Pricing({ plans = [] }: { plans?: Plan[] }) {
  return (
    <section aria-label="pricing" className="py-8">
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((p: Plan, i: number) => (
          <div key={i} className="border rounded p-4">
            <h3 className="font-bold">{p.name}</h3>
            <div className="mt-2 text-2xl">{p.price}</div>
            <p className="mt-2">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
