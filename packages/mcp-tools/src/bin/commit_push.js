#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
async function main() {
    const raw = fs.readFileSync(0, 'utf8');
    const data = raw ? JSON.parse(raw) : {};
    const slug = data.slug || 'site';
    const dir = path.join(process.cwd(), '..', '..', 'generated', slug);
    if (!fs.existsSync(dir)) {
        console.error('No site dir', dir);
        process.exit(1);
    }
    try {
        if (!fs.existsSync(path.join(dir, '.git')))
            execSync('git init', { cwd: dir });
        execSync('git add -A', { cwd: dir });
        execSync('git commit -m "chore: scaffold site" || true', { cwd: dir });
        if (process.env.GITHUB_USER)
            execSync('git push -u origin main || true', { cwd: dir });
        console.log(JSON.stringify({ ok: true }));
    }
    catch (e) {
        console.error(e);
        process.exit(1);
    }
}
main().catch(e => { console.error(e); process.exit(1); });
