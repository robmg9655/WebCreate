import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.log('Stripe keys missing, webhook noop')
    return NextResponse.json({ ok: true })
  }
  const sig = req.headers.get('stripe-signature') || ''
  const buf = await req.text()
  const Stripe = require('stripe')
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  let event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error('Webhook signature error', err.message)
    return new NextResponse('Invalid signature', { status: 400 })
  }
  // handle a few events
  switch (event.type) {
    case 'checkout.session.completed':
      console.log('checkout completed', event.data.object)
      break
    case 'customer.subscription.updated':
    case 'customer.subscription.created':
    case 'customer.subscription.deleted':
      console.log('subscription event', event.type, event.data.object)
      break
    default:
      console.log('Unhandled stripe event', event.type)
  }
  return NextResponse.json({ received: true })
}
