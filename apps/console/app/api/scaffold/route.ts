import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const PAYMENTS_DB = path.join(process.cwd(), 'generated', 'payments.json');

function validLicense(lic: string) {
  try {
    const raw = fs.readFileSync(PAYMENTS_DB, 'utf8');
    const db = JSON.parse(raw || '{}');
    return Boolean(db[lic]);
  } catch (_e) {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const license = body.license;
  if (!license || !validLicense(license)) {
    return NextResponse.json({ ok: false, error: 'Invalid or missing license. Please purchase a license first via /api/payments.' }, { status: 402 });
  }

  const payload = { layout: body.layout || {}, copy: body.copy || {}, slug: body.slug || `site-${Date.now()}` };
  const cli = path.join(process.cwd(), 'packages', 'mcp-tools', 'dist', 'scaffold_project.js');
  if (!fs.existsSync(cli)) {
    return NextResponse.json({ ok: false, error: 'Scaffold CLI not built; run workspace build.' }, { status: 500 });
  }

  // run the scaffold CLI synchronously and capture output
  const child = spawnSync(process.execPath, [cli], { input: JSON.stringify(payload), encoding: 'utf8' });
  if (child.status !== 0) {
    return NextResponse.json({ ok: false, error: 'Scaffold failed', details: child.stderr }, { status: 500 });
  }

  const genDir = path.join(process.cwd(), 'generated', payload.slug, 'site.json');
  return NextResponse.json({ ok: true, path: genDir });
}
