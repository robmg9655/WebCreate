import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import fs from 'fs'
import path from 'path'
import { getServerSession } from 'next-auth'
import authOptions from '../../../../lib/nextauth'

export async function GET(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anon'
  const session = await getServerSession(authOptions as any, null as any, null as any).catch(()=>null)
  const userId = (session as any)?.user?.id || null

  const whereClauses: any[] = [{ ip }]
  if (userId) whereClauses.push({ userId })
  const existing = await prisma.demoAttempt.findFirst({ where: { OR: whereClauses } })
  if (!existing) return NextResponse.json({ used: false })

  // try to find a generated preview for this ip (site.json with meta.ip)
  const GENERATED = path.join(process.cwd(), 'generated')
  if (fs.existsSync(GENERATED)) {
    const ids = fs.readdirSync(GENERATED)
    for (const id of ids) {
      try {
        const file = path.join(GENERATED, id, 'site.json')
        if (!fs.existsSync(file)) continue
        const site = JSON.parse(fs.readFileSync(file, 'utf8'))
        if (site?.meta?.ip === ip || site?.meta?.userId === userId) {
          return NextResponse.json({ used: true, preview: '/api/preview/raw/' + id })
        }
      } catch (e) { continue }
    }
  }

  return NextResponse.json({ used: true })
}
