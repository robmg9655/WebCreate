"use client"
import { useState } from 'react'

export default function Pricing() {
  const [loading, setLoading] = useState(false)
  async function subscribe() {
    setLoading(true)
    const res = await fetch('/api/billing/create-checkout-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: 'demo-user', priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY }) })
    const j = await res.json()
    setLoading(false)
    if (j.ok && j.url) window.location.href = j.url
    else alert('Error starting checkout')
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Planes</h1>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-4 border">
          <h3 className="font-semibold">Trial</h3>
          <p>1 vista previa gratis con watermark</p>
        </div>
        <div className="p-4 border">
          <h3 className="font-semibold">Pro — Mensual</h3>
          <p>Generaciones ilimitadas, sin watermark, despliegue</p>
          <button onClick={subscribe} className="mt-2 px-3 py-2 bg-green-600 text-white">Suscribirse</button>
        </div>
      </div>
    </div>
  )
}
