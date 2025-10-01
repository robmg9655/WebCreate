import { NextResponse } from 'next/server'
import { BillingService } from '../../../../lib/services'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { customerId } = body || {}
  try {
    const res = await BillingService.createPortalSession(customerId)
    return NextResponse.json({ ok: true, url: res.url })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e.message || e) }, { status: 500 })
  }
}
