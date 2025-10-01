import { getServerSession } from 'next-auth'
import authOptions from '../../lib/nextauth'
import { prisma } from '../../lib/prisma'
import { redirect } from 'next/navigation'

type Site = { id: string; title: string; createdAt: string; watermark?: boolean; deployed?: boolean }

export default async function Dashboard() {
  const session = await getServerSession(authOptions as any)
  if (!session || !(session as any).user || !(session as any).user.email) {
    redirect('/auth')
  }
  const user = await prisma.user.findUnique({ where: { email: (session as any).user.email } })
  if (!user) redirect('/auth')

  const sites = await prisma.site.findMany({ where: { userId: user.id }, select: { id: true, title: true, createdAt: true, watermark: true, deployed: true } })

  return (
    <div>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <p className="muted" style={{ margin: 0 }}>Manage your generated sites and subscription</p>
        </div>
        <form action="/api/billing/portal" method="post">
          <input type="hidden" name="customerId" value="demo-customer" />
          <button type="submit" className="btn">Manage subscription</button>
        </form>
      </div>

      <div style={{ marginTop: 16 }}>
        <h2 style={{ marginBottom: 8 }}>Your Sites</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {sites.map(s => (
            <div key={s.id} className="card">
              <h3 style={{ marginTop: 0 }}>{s.title}</h3>
              <p className="muted">{new Date(s.createdAt).toLocaleString()}</p>
              <p className="muted">Watermark: {String(s.watermark)}</p>
              <p className="muted">Deployed: {String(s.deployed)}</p>
              <a href={`/preview/${s.id}`} className="btn" style={{ marginTop: 8, display: 'inline-block' }}>View</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
