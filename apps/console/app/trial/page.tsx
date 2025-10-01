'use client';
import { useState } from 'react';

export default function TrialPage() {
  const [desc, setDesc] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/trial/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ layout: { title: desc } }),
    });
    const j = await res.json();
    if (!j.ok) setError(j.error || 'Error');
    else setPreview(j.preview);
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Probar gratis — Trial</h1>
      <p>1 intento gratuito. La vista previa tiene marca de agua.</p>
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Describe tu negocio..."
          className="w-full p-2 border"
        />
        <div className="mt-2">
          <button className="px-4 py-2 bg-blue-600 text-white">Generar vista previa</button>
        </div>
      </form>
      {error && <p className="text-red-600">{error}</p>}
      {preview && (
        <div className="mt-4">
          <a href={preview} target="_blank" rel="noreferrer" className="underline">
            Abrir vista previa
          </a>
        </div>
      )}
    </div>
  );
}
