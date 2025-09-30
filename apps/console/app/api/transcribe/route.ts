import { NextRequest, NextResponse } from 'next/server';
export async function POST(_req: NextRequest) {
  // mock deterministic transcription
  const text = 'Transcripción de audio de ejemplo: Barbería en Tabata';
  return NextResponse.json({ text });
}
