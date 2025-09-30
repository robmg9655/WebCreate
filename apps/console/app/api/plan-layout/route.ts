import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const text = body.text || 'Demo business description';
  const layout = {
    id: 'demo-' + Date.now(),
    title: text.slice(0, 40),
    sections: ['hero', 'services', 'gallery', 'pricing', 'map', 'contact'],
    seo: { title: text.slice(0, 60), description: text.slice(0, 160) },
    theme: { colors: ['#0ea5a4', '#06b6d4', '#0f172a'], font: 'Inter' }
  };
  return NextResponse.json(layout);
}
