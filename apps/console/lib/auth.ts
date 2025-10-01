import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import authOptions from './nextauth'

export async function requireUser(req: NextRequest) {
  // use the 3-arg form and cast to any to accommodate varying signatures in different NextAuth versions
  const session = await getServerSession(authOptions as any, null as any, null as any).catch(() => null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s: any = session
  if (!s || !s.user) throw new Error('Unauthorized')
  return s.user
}
