const fs = require('fs');
const path = require('path');

async function run() {
  const payload = { slug: 'test-in-repo', layout: { id: 'test', sections: ['hero'] }, copy: { en: { headline: 'Test in repo' } } };
  const generatedDir = path.join(process.cwd(), 'generated', payload.slug);
  if (!fs.existsSync(generatedDir)) fs.mkdirSync(generatedDir, { recursive: true });
  const site = { id: payload.slug, layout: payload.layout, copy: payload.copy };
  fs.writeFileSync(path.join(generatedDir, 'site.json'), JSON.stringify(site, null, 2));
  console.log('Wrote', path.join(generatedDir, 'site.json'));
}

run().catch((err) => { console.error(err); process.exit(1); });
