import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.LOCAL_LLM_URL
  if (!url) return NextResponse.json({ online: false, reason: 'LOCAL_LLM_URL not set' }, { status: 200 })
  try {
    const ac = new AbortController()
    const t = setTimeout(() => ac.abort(), 10000)
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: 'ping', prompt: 'pong', max_tokens: 1 }), signal: ac.signal })
    clearTimeout(t)
    if (!r.ok) {
      let reason = 'HTTP ' + r.status
      try { const j = await r.json(); if (j?.error) reason = String(j.error) }
      catch {}
      // if server still loading model, surface a loading flag
      return NextResponse.json({ online: false, loading: r.status === 503, reason })
    }
    const j = await r.json()
    return NextResponse.json({ online: Boolean(j && 'content' in j) })
  } catch (e:any) {
    // aborted likely means model still loading or slow startup
    if (String(e?.name || '').includes('AbortError')) {
      return NextResponse.json({ online: false, loading: true, reason: 'timeout' })
    }
    return NextResponse.json({ online: false, reason: String(e?.message || e) })
  }
}
