import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getServerSession } from 'next-auth'
import authOptions from '../../../../lib/nextauth'
import { prisma } from '../../../../lib/prisma'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  // require auth and ensure ownership
  const session = await getServerSession(authOptions as any)
  if (!session || !(session as any).user || !(session as any).user.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: (session as any).user.email } })
  if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

  // try DB first: if site exists in DB and belongs to the user, return it
  const siteDb = await prisma.site.findUnique({ where: { id } })
  if (siteDb) {
    if (siteDb.userId && siteDb.userId !== user.id) return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
    // if site stored in DB, return its json (if stored on disk as well)
  }

  const file = path.join(process.cwd(), 'generated', id, 'site.json')
  if (!fs.existsSync(file)) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
  const s = JSON.parse(fs.readFileSync(file, 'utf8'))
  // if site has a userId field, enforce it
  if (s.meta?.userId && s.meta.userId !== user.id) return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
  return NextResponse.json({ ok: true, site: s })
}
