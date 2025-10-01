import fs from 'fs'
import path from 'path'

const GENERATED = path.resolve(process.cwd(), 'generated')
if (!fs.existsSync(GENERATED)) fs.mkdirSync(GENERATED)

export const BillingService = {
  createCheckoutSession: async (userId: string, priceId?: string) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      // mock url
      return { url: '/mock-checkout?price=' + (priceId || 'pro') }
    }
  const StripeModule = await import('stripe')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Stripe = (StripeModule as any).default || StripeModule
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId || process.env.STRIPE_PRICE_PRO_MONTHLY, quantity: 1 }],
      success_url: process.env.NEXTAUTH_URL + '/dashboard',
      cancel_url: process.env.NEXTAUTH_URL + '/pricing',
      metadata: { userId },
    })
    return { url: session.url }
  },
  createPortalSession: async (customerId: string) => {
    if (!process.env.STRIPE_SECRET_KEY) return { url: '/mock-portal' }
  const StripeModule = await import('stripe')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Stripe = (StripeModule as any).default || StripeModule
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
    const session = await stripe.billingPortal.sessions.create({ customer: customerId, return_url: process.env.NEXTAUTH_URL + '/dashboard' })
    return { url: session.url }
  }
}

// simple file-based site store used as fallback
export const SiteStore = {
  saveSite: async (site: Record<string, unknown>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const maybeId = (site as any).id
    const id = typeof maybeId === 'string' && maybeId.length > 0 ? maybeId : 'site-' + Date.now().toString(36)
    const dir = path.join(GENERATED, id)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir)
    const file = path.join(dir, 'site.json')
    fs.writeFileSync(file, JSON.stringify(site, null, 2))
    return { id, path: file }
  },
  readSite: async (id: string) => {
    const file = path.join(GENERATED, id, 'site.json')
    if (!fs.existsSync(file)) throw new Error('Not found')
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  },
}

export const TrialService = {
  maxAttempts: Number(process.env.TRIAL_MAX_ATTEMPTS || 1),
  attemptsForUser: new Map<string, number>(),
  canUse: (userId?: string, ip?: string) => {
    if (userId) return (TrialService.attemptsForUser.get(userId) || 0) < TrialService.maxAttempts
    const key = 'ip:' + (ip || 'anon')
    return (TrialService.attemptsForUser.get(key) || 0) < TrialService.maxAttempts
  },
  consume: (userId?: string, ip?: string) => {
    if (userId) {
      const c = (TrialService.attemptsForUser.get(userId) || 0) + 1
      TrialService.attemptsForUser.set(userId, c)
      return c
    }
    const key = 'ip:' + (ip || 'anon')
    const c = (TrialService.attemptsForUser.get(key) || 0) + 1
    TrialService.attemptsForUser.set(key, c)
    return c
  }
}
