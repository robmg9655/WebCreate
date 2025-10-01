import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') return NextResponse.json({ ok: false, error: 'Not allowed' }, { status: 403 })
  try {
    await prisma.demoAttempt.deleteMany()
    return NextResponse.json({ ok: true })
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: String(e.message||e) }, { status: 500 })
  }
}
