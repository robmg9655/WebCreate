'use client';
import React, { useState } from 'react';

export default function GeneratePage(): JSX.Element {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');
  const [license, setLicense] = useState<string | null>(null);

  async function onGenerate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('Generating...');
    // purchase/mock a license if we don't have one yet
    if (!license) {
      setStatus('Purchasing license...');
      const pay = await fetch('/api/payments', {
        method: 'POST',
        body: JSON.stringify({
          email: email || 'client@example.com',
          plan: 'single-site',
          amount: 49,
        }),
      });
      const pjson = await pay.json();
      if (!pjson.ok) {
        setStatus('Payment failed');
        return;
      }
      setLicense(pjson.license);
    }

    setStatus('Planning layout...');
    const res = await fetch('/api/plan-layout', { method: 'POST', body: JSON.stringify({ text }) });
    const layout = await res.json();
    const w = await fetch('/api/write-copy', { method: 'POST', body: JSON.stringify({ layout }) });
    const copy = await w.json();
    setStatus('Scaffolding site...');
    const s = await fetch('/api/scaffold', {
      method: 'POST',
      body: JSON.stringify({ layout, copy, slug: 'demo-site', license }),
    });
    const result = await s.json();
    setStatus('Done: ' + result.path);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Generate</h1>
      <form onSubmit={onGenerate} className="mt-4 space-y-3">
        <label className="block">
          <span className="text-sm">Description (JP/EN/ES)</span>
          <textarea
            className="w-full border rounded p-2 mt-1"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="text-sm">Audio upload</span>
          <input type="file" name="audio" accept="audio/*" />
        </label>
        <label className="block">
          <span className="text-sm">Your email (for receipt)</span>
          <input
            className="w-full border rounded p-2 mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <div>
          <button className="btn" type="submit">
            Generar
          </button>
        </div>
      </form>
      <p className="mt-4">{status}</p>
      {license ? <p className="mt-2 text-sm">License: {license}</p> : null}
    </div>
  );
}
