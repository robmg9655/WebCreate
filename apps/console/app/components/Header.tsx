import React from 'react';
import Link from 'next/link';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
        <Link href="/">WebCreate</Link>
        <nav className="space-x-4">
          <Link href="/generate">Generate</Link>
          <Link href="/sites/barberia-tabata">Demo</Link>
        </nav>
        <LanguageSelector />
      </div>
    </header>
  );
}
