import { NextResponse } from 'next/server'
import { SiteStore } from '../../../../lib/services'
import { prisma } from '../../../../lib/prisma'
import { getServerSession } from 'next-auth'
import authOptions from '../../../../lib/nextauth'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon'
  // prefer server session userId when available
  const session = await getServerSession(authOptions as any, null as any, null as any).catch(() => null)
  const userId = (session as any)?.user?.id || body.userId || null

  // enforce one trial per user or ip (persisted)
  const whereClauses: any[] = [{ ip }]
  if (userId) whereClauses.push({ userId })
  const existing = await prisma.demoAttempt.findFirst({ where: { OR: whereClauses } })
  if (existing) return NextResponse.json({ ok: false, error: 'Trial used' }, { status: 403 })
  // call existing internal planner/writer mocks
  const layout = body.layout || { title: body.title || 'Untitled' }
  const copy = body.copy || {}
  const site: any = { id: 'site-' + Date.now().toString(36), title: layout.title, watermark: true, createdAt: new Date().toISOString(), layout, copy, meta: { ip } }
  if (userId) (site.meta as any).userId = userId
  const saved = await SiteStore.saveSite(site)
  // persist site in DB if user present
  if (userId) {
    const previewPath = `/preview/${saved.id}`
    const slug = (site.title || saved.id).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || saved.id
    try {
      await prisma.site.create({ data: { id: saved.id, title: (site as any).title || '', createdAt: new Date((site as any).createdAt as string), userId, watermark: Boolean((site as any).watermark), previewPath, slug } })
    } catch (e) { /* ignore if exists */ }
  }
  const createData: any = { ip }
  if (userId) createData.userId = userId
  await prisma.demoAttempt.create({ data: createData })
  return NextResponse.json({ ok: true, id: saved.id, preview: '/preview/' + saved.id })
}
