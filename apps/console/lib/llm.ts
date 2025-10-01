import { setTimeout as wait } from 'timers/promises'

type Provider = 'local' | 'openai' | 'hf'

const state: Record<Provider, { online: boolean; lastCheck: number; checking: boolean }> = {
  local: { online: false, lastCheck: 0, checking: false },
  openai: { online: false, lastCheck: 0, checking: false },
  hf: { online: false, lastCheck: 0, checking: false },
}

const CHECK_TTL_MS = 10_000

function prefOrder(): Provider[] {
  const pref = (process.env.PREFERRED_LLM || '').toLowerCase()
  if (pref === 'paid' || pref === 'openai') return ['openai', 'local', 'hf']
  if (pref === 'local') return ['local', 'openai', 'hf']
  return ['openai', 'local', 'hf'] // auto: prefer paid if available
}

export async function health(): Promise<{ statuses: Record<Provider, boolean>; preferred: Provider[]; anyOnline: boolean }>{
  const preferred = prefOrder()
  const statuses: Record<Provider, boolean> = {
    local: await ensureChecked('local'),
    openai: await ensureChecked('openai'),
    hf: await ensureChecked('hf'),
  }
  const anyOnline = Object.values(statuses).some(Boolean)
  return { statuses, preferred, anyOnline }
}

async function ensureChecked(p: Provider): Promise<boolean> {
  const now = Date.now()
  const s = state[p]
  if (s.checking) return s.online
  if (now - s.lastCheck < CHECK_TTL_MS) return s.online
  s.checking = true
  try {
    s.online = await check(p)
  } finally {
    s.lastCheck = Date.now()
    s.checking = false
  }
  return s.online
}

async function check(p: Provider): Promise<boolean> {
  try {
    if (p === 'local') {
      const url = process.env.LOCAL_LLM_URL
      if (!url) return false
      const ac = new AbortController()
      const t = setTimeout(() => ac.abort(), 1200)
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: 'ping', prompt: 'pong', max_tokens: 1 }), signal: ac.signal })
      clearTimeout(t)
      return r.ok
    }
    if (p === 'openai') {
      if (!process.env.OPENAI_API_KEY) return false
      // tiny cheap check (still a request): prefer re-use cached status when possible
      const r = await fetch('https://api.openai.com/v1/models', { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } })
      return r.ok
    }
    if (p === 'hf') {
      if (!process.env.HUGGINGFACEHUB_API_TOKEN || !process.env.HUGGINGFACE_MODEL) return false
      // probe by a HEAD-like fake (HF API may not support HEAD; skip heavy checks)
      return true
    }
    return false
  } catch {
    return false
  }
}

export async function requestLLM(input: { system: string; prompt: string; max_tokens?: number; temperature?: number }): Promise<{ content: string; provider: Provider }>{
  const order = prefOrder()
  // ensure freshness of health
  await Promise.all(order.map(ensureChecked))

  // try in order; if provider down, skip; if request fails, mark offline briefly and continue
  for (const p of order) {
    if (!(await ensureChecked(p))) continue
    try {
      const content = await callProvider(p, input)
      return { content, provider: p }
    } catch {
      // temporary mark offline and retry next
      state[p].online = false
      state[p].lastCheck = Date.now()
      continue
    }
  }
  // as a last resort, try to re-check and give local one more chance
  await wait(200)
  await ensureChecked('local')
  if (state.local.online) {
    const content = await callProvider('local', input)
    return { content, provider: 'local' }
  }
  throw new Error('No LLM provider available')
}

async function callProvider(p: Provider, { system, prompt, max_tokens = 600, temperature = 0.7 }: { system: string; prompt: string; max_tokens?: number; temperature?: number }): Promise<string> {
  if (p === 'local') {
    const url = process.env.LOCAL_LLM_URL!
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system, prompt, max_tokens, temperature }) })
    if (!r.ok) throw new Error('local llm http ' + r.status)
    const j = await r.json()
    return String(j.content || '')
  }
  if (p === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo', messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }], temperature, max_tokens })
    })
    if (!res.ok) throw new Error('openai http ' + res.status)
    const j = await res.json()
    return String(j?.choices?.[0]?.message?.content || '')
  }
  if (p === 'hf') {
    const model = process.env.HUGGINGFACE_MODEL!
    const res = await fetch(`https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.HUGGINGFACEHUB_API_TOKEN}` }, body: JSON.stringify({ inputs: `${system}\n\n${prompt}` })
    })
    if (!res.ok) throw new Error('hf http ' + res.status)
    const j = await res.json()
    // HF response formats vary; try common shapes
    const text = Array.isArray(j) ? (j[0]?.generated_text ?? '') : (j?.generated_text ?? j?.content ?? '')
    return String(text || '')
  }
  throw new Error('unknown provider')
}

export function extractJson(text: string): any {
  const cleaned = String(text || '').replace(/^```(?:json)?\s*/, '').replace(/```$/, '').trim()
  return JSON.parse(cleaned)
}
