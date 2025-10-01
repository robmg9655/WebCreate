import { NextRequest, NextResponse } from 'next/server';
import { requestLLM, extractJson } from '../../../lib/llm'

async function callOpenAI(prompt: string) {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('no key')
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'You are a JSON generator that outputs only valid JSON following the schema requested.' }, { role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 700
    })
  })
  if (!res.ok) throw new Error('OpenAI error: ' + res.status)
  const j = await res.json()
  const text = j?.choices?.[0]?.message?.content
  return text
}

export async function POST(req: NextRequest) {
  // read layout from request to give the model context
  const body = await req.json().catch(() => ({}))
  const layout = body.layout || {}

  // Try LLM providers in preferred order
  try {
    const system = 'You generate ONLY valid JSON for website copywriting.'
    const prompt = `Devuelve SOLO JSON con el esquema: { "headline": string, "subhead": string, "cta": string, "services": string[], "features": string[], "images": string[] }. Layout/context: ${JSON.stringify(layout)}. Tono profesional, frases cortas.`
    const { content } = await requestLLM({ system, prompt, max_tokens: 700, temperature: 0.7 })
    const parsed = extractJson(content)
    const copy = { en: parsed }
    return NextResponse.json({ copy })
  } catch {}

  // OpenAI branch is now covered by the unified router; fall through if not available

  // fallback static copy
  const copy = {
    jp: { headline: 'ようこそ', cta: 'お問い合わせ' },
    en: { headline: 'Welcome', cta: 'Contact us' },
    es: { headline: 'Bienvenido', cta: 'Contactar' }
  };
  return NextResponse.json({ copy });
}

