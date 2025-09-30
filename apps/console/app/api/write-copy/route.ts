import { NextRequest, NextResponse } from 'next/server';
export async function POST(_req: NextRequest) {
  // mock copywriter — static copy for now
  const copy = {
    jp: { headline: 'ようこそ', cta: 'お問い合わせ' },
    en: { headline: 'Welcome', cta: 'Contact us' },
    es: { headline: 'Bienvenido', cta: 'Contactar' }
  };
  return NextResponse.json({ copy });
}
