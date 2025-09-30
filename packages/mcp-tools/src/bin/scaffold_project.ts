#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';

async function main() {
  const raw = fs.readFileSync(0, 'utf8');
  const data = raw ? JSON.parse(raw) : {};
  const slug = data.slug || data.layout?.id || 'site-' + Date.now();
  const out = path.join(process.cwd(), '..', '..', 'generated', slug);
  await fs.ensureDir(out);
  const site = { id: slug, layout: data.layout || {}, copy: data.copy || {} };
  await fs.writeJson(path.join(out, 'site.json'), site, { spaces: 2 });
  console.log(JSON.stringify({ path: out, id: slug }));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

export {};
