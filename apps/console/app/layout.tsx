import React from 'react';
import './globals.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

export const metadata = {
  title: 'WebCreate Console',
  description: 'Generate landing pages from descriptions (JP/EN)',
};

type RootLayoutProps = { children: React.ReactNode; params?: Record<string, string> };

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const locale = params?.locale || 'en';
  return (
    <html lang={locale}>
      <body>
        <Header />
        <div className="app-container">
          <Sidebar />
          <main style={{ minHeight: '80vh' }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
