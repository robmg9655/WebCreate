import { NextResponse } from 'next/server'
import { SiteStore } from '../../../../lib/services'

// simple subscription check placeholder
async function hasActiveSubscription(userId?: string) {
  if (!userId) return false
  // TODO: check DB for subscription; for now, allow if env FORCE_PRO=true
  if (process.env.FORCE_PRO === 'true') return true
  return false
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const userId = body.userId
  if (!await hasActiveSubscription(userId)) return NextResponse.json({ ok: false, error: 'No active subscription' }, { status: 403 })
  const layout = body.layout || { title: body.title || 'Untitled' }
  const copy = body.copy || {}
  const site = { id: body.slug || 'site-' + Date.now().toString(36), title: layout.title, watermark: false, createdAt: new Date().toISOString(), layout, copy }
  const saved = await SiteStore.saveSite(site)
  return NextResponse.json({ ok: true, id: saved.id, preview: '/preview/' + saved.id })
}
