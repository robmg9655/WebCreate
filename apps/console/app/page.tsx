import Link from 'next/link'

export default function Home() {
  return (
    <div className="card">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 28, margin: 0 }}>WebCreate</h1>
          <p className="muted">Landing generator — get a preview in seconds</p>
        </div>
        <nav style={{ display: 'flex', gap: 8 }}>
          <Link href="/trial" className="btn">Try free</Link>
          <Link href="/pricing" className="btn">Pricing</Link>
        </nav>
      </header>

      <section style={{ marginTop: 20 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Create a landing page from a description or audio</h2>
        <p className="muted" style={{ marginTop: 8 }}>Describe your business and receive a visual preview in seconds.</p>
      </section>

      <section style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div className="card">Example 1</div>
        <div className="card">Example 2</div>
        <div className="card">Example 3</div>
      </section>
    </div>
  )
}
