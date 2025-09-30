import React from 'react';

export default function Map({ address }: { address?: string }) {
  const q = encodeURIComponent(address || 'Tokyo, Japan');
  const src = `https://www.google.com/maps?q=${q}&output=embed`;
  return (
    <section aria-label="map" className="py-8">
      <div style={{ height: 300 }} className="w-full">
        <iframe title="map" src={src} className="w-full h-full" />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        address: address
      }) }} />
    </section>
  );
}
