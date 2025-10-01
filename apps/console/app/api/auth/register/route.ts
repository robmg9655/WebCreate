import { NextResponse } from 'next/server'
import { createUser } from '../../../../lib/auth-utils'

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}))
  const { email, password, name } = body || {}
  if (!email || !password) return NextResponse.json({ ok:false, error:'Missing fields' }, { status:400 })
  try {
    const user = await createUser(email, password, name)
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } })
  } catch (e:any) {
    return NextResponse.json({ ok:false, error: String(e.message||e) }, { status:500 })
  }
}
