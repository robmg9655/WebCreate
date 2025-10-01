import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { SiteStore } from '../../../../lib/services'
import { getServerSession } from 'next-auth'
import authOptions from '../../../../lib/nextauth'

function sanitize(input: string) {
  const s = (input || '').slice(0, 1000)
  // basic blacklist
  const banned = ['<script>', 'eval(', 'DROP TABLE']
  for (const b of banned) if (s.includes(b)) throw new Error('Invalid input')
  return s
}

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}))
  const desc = sanitize(body.description || body.layout?.title || '')
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon'
  // prefer server session userId when available
  const session = await getServerSession(authOptions as any, null as any, null as any).catch(()=>null)
  const userId = (session as any)?.user?.id || body.userId || null

  // check demo attempts — only include userId clause if we actually have a userId
  const whereClauses: any[] = [{ ip }]
  if (userId) whereClauses.push({ userId })
  const existing = await prisma.demoAttempt.findFirst({ where: { OR: whereClauses } })
  if (existing) return NextResponse.json({ ok:false, error:'Demo already used' }, { status:403 })

  // determine base URL for internal API calls. Prefer NEXTAUTH_URL, but fall back to request-origin
  let baseUrl = process.env.NEXTAUTH_URL
  if (!baseUrl) {
    try {
      baseUrl = (new URL(req.url)).origin
    } catch (e) {
      baseUrl = 'http://localhost:3000'
    }
  }

  // call mocks: plan-layout and write-copy endpoints (internal fetch to our own API routes)
  const planRes = await fetch(baseUrl.replace(/\/$/, '') + '/api/plan-layout', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ title: desc }) })
  const plan = await planRes.json().catch(()=>({ layout: { title: desc } }))
  const copyRes = await fetch(baseUrl.replace(/\/$/, '') + '/api/write-copy', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ layout: plan.layout }) })
  const copy = await copyRes.json().catch(()=>({ copy: {} }))

  const site: any = { id: 'site-' + Date.now().toString(36), title: plan.layout?.title || desc, watermark: true, createdAt: new Date().toISOString(), layout: plan.layout, copy: copy.copy, meta: { ip } }
  if (userId) site.meta.userId = userId
  const saved = await SiteStore.saveSite(site)
  // persist site in DB for user ownership
  if (userId) {
  const previewPath = `/api/preview/raw/${saved.id}`
    const slug = (site.title || saved.id).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || saved.id
    try {
      await prisma.site.create({ data: { id: saved.id, title: (site as any).title || '', createdAt: new Date((site as any).createdAt as string), userId, watermark: Boolean((site as any).watermark), previewPath, slug } })
    } catch (e) { /* ignore if exists */ }
  }

  const createData: any = { ip }
  if (userId) createData.userId = userId
  await prisma.demoAttempt.create({ data: createData })

  return NextResponse.json({ ok:true, id: saved.id, preview: '/api/preview/raw/' + saved.id })
}
