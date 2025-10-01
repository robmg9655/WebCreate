import React from 'react'
import Link from 'next/link'
import LanguageSelector from './LanguageSelector'

export default function Header() {
  return (
    <header style={{ background: 'white' }} className="w-full border-b">
      <div className="app-container" style={{ alignItems: 'center', gridTemplateColumns: '1fr' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/" style={{ fontWeight: 700, color: 'var(--accent)', textDecoration: 'none' }}>WebCreate</Link>
            <nav style={{ display: 'flex', gap: 12 }}>
              <Link href="/generate" className="muted">Generate</Link>
              <Link href="/pricing" className="muted">Pricing</Link>
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  )
}
