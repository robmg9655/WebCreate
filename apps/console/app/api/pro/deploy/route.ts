import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getServerSession } from 'next-auth'
import authOptions from '../../../../lib/nextauth'
import { prisma } from '../../../../lib/prisma'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { id } = body || {}
  if (!id) return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 })
  // require auth
  const session = await getServerSession(authOptions as any)
  if (!session || !(session as any).user || !(session as any).user.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: (session as any).user.email } })
  if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

  // simulate deploy by setting deployed flag in site.json, but only if user owns the site
  const file = path.join(process.cwd(), 'generated', id, 'site.json')
  if (!fs.existsSync(file)) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
  const site = JSON.parse(fs.readFileSync(file, 'utf8'))
  // if site is associated with a user, enforce ownership
  if (site.meta?.userId && site.meta.userId !== user.id) return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
  site.deployed = true
  site.deployedUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/sites/${id}`
  fs.writeFileSync(file, JSON.stringify(site, null, 2))
  // update DB record if present
  try { await prisma.site.updateMany({ where: { id }, data: { deployed: true } }) } catch(e) {}
  return NextResponse.json({ ok: true, url: site.deployedUrl })
}
