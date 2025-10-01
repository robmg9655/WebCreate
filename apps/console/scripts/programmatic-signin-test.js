/*
Programmatic sign-in test:
1. Register a new user via /api/auth/register
2. Sign in via NextAuth credentials callback to obtain session cookie
3. Call /api/trial/generate without userId (server should derive user from session)

Run with:
  DATABASE_URL=file:./dev.db node scripts/programmatic-signin-test.js
*/

// minimal cookie jar to avoid external dependencies
const cookieJar = {}

function parseSetCookie(setCookieHeader) {
  if (!setCookieHeader) return []
  // handle single header or comma-joined
  const parts = Array.isArray(setCookieHeader) ? setCookieHeader : String(setCookieHeader).split(/,(?=[^;]+;)/)
  return parts.map(p => p.split(';')[0].trim()).filter(Boolean)
}

async function fetchWithCookie(url, opts = {}) {
  opts.headers = opts.headers || {}
  // attach cookies
  const cookieStr = Object.entries(cookieJar).map(([k, v]) => `${k}=${v}`).join('; ')
  if (cookieStr) opts.headers['cookie'] = cookieStr
  const res = await fetch(url, opts)
  const set = res.headers.get('set-cookie')
  if (set) {
    const cookies = parseSetCookie(set)
    for (const c of cookies) {
      const [k, v] = c.split('=')
      cookieJar[k] = v
    }
  }
  return res
}

const BASE = process.env.BASE_URL || 'http://localhost:3000'

async function register(email, password) {
  const res = await fetchWithCookie(BASE + '/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name: 'Prog Test' }) })
  return res.json()
}

async function signin(email, password) {
  // NextAuth credentials sign-in: POST to /api/auth/callback/credentials with form data
  const params = new URLSearchParams()
  params.append('callbackUrl', '/')
  params.append('csrfToken', '')
  params.append('email', email)
  params.append('password', password)

  const res = await fetchWithCookie(BASE + '/api/auth/callback/credentials', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: params.toString(), redirect: 'manual' })
  return { status: res.status, headers: Object.fromEntries(res.headers.entries()), cookie: cookieJar }
}

async function generateTrial() {
  // include a unique x-forwarded-for to avoid previous anonymous attempts blocking us
  const res = await fetchWithCookie(BASE + '/api/trial/generate', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': String(Date.now()) }, body: JSON.stringify({ title: 'Prog Test' }) })
  return res.json()
}

;(async () => {
  const email = 'prog-test+' + Date.now() + '@example.com'
  const password = 'password123'
  console.log('Registering', email)
  console.log(await register(email, password))
  console.log('Signing in')
  const s = await signin(email, password)
  console.log('Signin status', s.status)
  console.log('Cookie jar has cookies:', cookieJar)
  console.log('Calling trial generate')
  const gen = await generateTrial()
  console.log('Generate response:', gen)
})().catch(e=>{ console.error(e); process.exit(1) })
