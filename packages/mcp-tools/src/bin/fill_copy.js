#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
async function main() {
    const raw = fs.readFileSync(0, 'utf8');
    const data = raw ? JSON.parse(raw) : {};
    const slug = data.slug || 'site';
    const siteFile = path.join(process.cwd(), '..', '..', 'generated', slug, 'site.json');
    const site = fs.existsSync(siteFile) ? fs.readJsonSync(siteFile) : {};
    site.copy = data.copy || site.copy || {};
    await fs.ensureDir(path.dirname(siteFile));
    await fs.writeJson(siteFile, site, { spaces: 2 });
    console.log(JSON.stringify({ path: siteFile }));
}
main().catch((e) => { console.error(e); process.exit(1); });
