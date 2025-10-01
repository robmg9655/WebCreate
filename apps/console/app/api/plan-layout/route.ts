import { NextRequest, NextResponse } from 'next/server';
import { requestLLM, extractJson } from '../../../lib/llm'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const text = body.text || 'Demo business description';
  // Try LLM providers in preferred order (paid then local, or local first if PREFERRED_LLM=local)
  try {
    const system = 'You generate ONLY valid JSON for website layout planning.'
    const prompt = `Devuelve SOLO JSON con este esquema: { "id": string, "title": string, "sections": string[], "seo": {"title": string, "description": string}, "theme": {"colors": string[], "font": string} }. Texto: ${text}`
    const { content } = await requestLLM({ system, prompt, max_tokens: 600, temperature: 0.6 })
    const layout = extractJson(content)
    layout.id = layout.id || ('demo-' + Date.now())
    layout.title = layout.title || text.slice(0, 40)
    return NextResponse.json(layout)
  } catch {}

  // fallback mock
  const layout = {
    id: 'demo-' + Date.now(),
    title: text.slice(0, 40),
    sections: ['hero', 'services', 'gallery', 'pricing', 'map', 'contact'],
    seo: { title: text.slice(0, 60), description: text.slice(0, 160) },
    theme: { colors: ['#0ea5a4', '#06b6d4', '#0f172a'], font: 'Inter' }
  };
  return NextResponse.json(layout);
}
