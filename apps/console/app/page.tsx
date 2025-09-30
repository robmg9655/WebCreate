import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">WebCreate Console</h1>
      <p className="mt-4">Genera landings desde texto o voz. Demo preview a continuación.</p>
      <div className="mt-6 border p-4 rounded">
        <h2 className="text-xl font-semibold">Demo preview</h2>
        <p className="mt-2">Ejemplo mock: Barbería en Tabata</p>
        <Link href="/sites/barberia-tabata" className="mt-3 inline-block btn">Ver demo</Link>
      </div>
      <div className="mt-6">
        <Link href="/generate" className="btn">Ir a /generate</Link>
      </div>
    </div>
  );
}
