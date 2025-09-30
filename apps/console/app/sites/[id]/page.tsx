import React from 'react';
import fs from 'fs';
import path from 'path';

export default async function SitePage({ params }: { params: { id: string } }) {
  const id = params.id;
  const file = path.join(process.cwd(), '..', '..', '..', 'generated', id, 'site.json');
  let site = null;
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    site = JSON.parse(raw);
  } catch (e) {
    return <div className="p-6">Site not found: {id}</div>;
  }
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{site.title}</h1>
      <pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify(site, null, 2)}</pre>
    </div>
  );
}
