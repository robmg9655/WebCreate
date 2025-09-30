import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'generated', 'payments.json');

function readDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (_e) {
    return {};
  }
}

function writeDb(db: any) {
  try {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch (e) {
    // ignore
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = body.email || 'unknown@example.com';
  const plan = body.plan || 'single-site';
  const amount = body.amount || 49; // USD mock

  const id = randomUUID();
  const license = `LIC-${id.slice(0, 8)}`;
  const db = readDb();
  db[license] = { email, plan, amount, createdAt: Date.now() };
  writeDb(db);

  return NextResponse.json({ ok: true, license, amount, plan });
}

export async function GET() {
  const db = readDb();
  return NextResponse.json({ count: Object.keys(db).length });
}
