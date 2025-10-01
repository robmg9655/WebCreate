import React from 'react';
import Link from 'next/link';

export default function Sidebar({ active }: { active?: string }) {
  return (
    <aside>
      <div className="card" style={{ padding: 12 }}>
        <nav>
          <Link
            href="/dashboard"
            className={'nav-link' + (active === 'dashboard' ? ' active' : '')}
          >
            Dashboard
          </Link>
          <Link href="/generate" className={'nav-link' + (active === 'generate' ? ' active' : '')}>
            Generate
          </Link>
          <Link href="/demo" className={'nav-link' + (active === 'demo' ? ' active' : '')}>
            Demo
          </Link>
          <Link href="/sites" className={'nav-link' + (active === 'sites' ? ' active' : '')}>
            Sites
          </Link>
          <Link href="/pricing" className={'nav-link' + (active === 'pricing' ? ' active' : '')}>
            Pricing
          </Link>
        </nav>
      </div>
    </aside>
  );
}
