import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { prisma } from '../../../lib/prisma'
import { getServerSession } from 'next-auth'
import authOptions from '../../../lib/nextauth'

export async function GET(req: Request) {
  // require session for user-specific site listing
  const session = await getServerSession(authOptions as any)
  const s: any = session
  if (s && s.user && s.user.email) {
    const user = await prisma.user.findUnique({ where: { email: s.user.email } })
    if (user) {
      const sites = await prisma.site.findMany({ where: { userId: user.id }, select: { id: true, title: true, createdAt: true, watermark: true, deployed: true } })
      return NextResponse.json({ ok: true, sites })
    }
    return NextResponse.json({ ok: true, sites: [] })
  }
  const dir = path.join(process.cwd(), 'generated')
  if (!fs.existsSync(dir)) return NextResponse.json({ ok: true, sites: [] })
  const ids = fs.readdirSync(dir).filter(d => fs.existsSync(path.join(dir, d, 'site.json')))
  const sites = ids.map(id => {
    const file = path.join(dir, id, 'site.json')
    const s = JSON.parse(fs.readFileSync(file, 'utf8'))
    return { id, title: s.title, createdAt: s.createdAt, watermark: s.watermark, deployed: s.deployed || false }
  })
  return NextResponse.json({ ok: true, sites })
}
