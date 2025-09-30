import React from 'react';

export type Theme = { colors: string[]; font?: string };

export default function Layout({ children, theme }: { children: React.ReactNode; theme?: Theme }) {
  return (
    <div style={{ fontFamily: theme?.font || undefined }} className="min-h-screen bg-white text-slate-900">
      <div className="max-w-4xl mx-auto p-6">{children}</div>
    </div>
  );
}
