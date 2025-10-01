import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { SiteStore } from '../../../../lib/services'
import { getServerSession } from 'next-auth'
import authOptions from '../../../../lib/nextauth'
import { spawn } from 'child_process'

function deriveBaseUrl(req: Request) {
  let baseUrl = process.env.NEXTAUTH_URL
  if (!baseUrl) {
    try { baseUrl = (new URL(req.url)).origin } catch(e) { baseUrl = 'http://localhost:3000' }
  }
  return baseUrl.replace(/\/$/, '')
}

async function runScaffoldCli(payload: any) {
  const script = path.join(process.cwd(), 'packages', 'mcp-tools', 'src', 'bin', 'scaffold_project.js')
  if (!fs.existsSync(script)) return null
  return new Promise<{ id: string, path: string }>((resolve, reject) => {
    const proc = spawn('node', [script], { stdio: ['pipe', 'pipe', 'inherit'] })
    let out = ''
    proc.stdout.on('data', (d) => out += String(d))
    proc.on('error', (err) => reject(err))
    proc.on('close', (code) => {
      if (code !== 0) return reject(new Error('scaffold exit ' + code))
      try { const j = JSON.parse(out); resolve(j) } catch (e) { reject(e) }
    })
    proc.stdin.write(JSON.stringify(payload))
    proc.stdin.end()
  })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any, null as any, null as any).catch(()=>null)
  const userId = (session as any)?.user?.id || null
  const body = await req.json().catch(()=>({}))
  const desc = body.description || body.layout?.title || ''

  const baseUrl = deriveBaseUrl(req)
  // get a plan & copy using existing mocks
  const planRes = await fetch(baseUrl + '/api/plan-layout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: desc }) })
  const plan = await planRes.json().catch(()=>({ layout: { title: desc } }))
  const copyRes = await fetch(baseUrl + '/api/write-copy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ layout: plan.layout }) })
  const copy = await copyRes.json().catch(()=>({ copy: {} }))

  const slug = body.slug || ('site-' + Date.now().toString(36))
  const payload = { slug, layout: plan.layout || {}, copy: copy.copy || {} }

  // try scaffold CLI from packages/mcp-tools if available
  try {
    const cliResult = await runScaffoldCli(payload)
    if (cliResult && cliResult.id) {
      return NextResponse.json({ ok:true, id: cliResult.id, preview: '/api/preview/raw/' + cliResult.id })
    }
  } catch (e) {
    // fall through to file save
    console.error('scaffold failed', e)
  }

  // fallback: write site JSON via SiteStore
  const site = { id: slug, title: plan.layout?.title || desc, watermark: true, createdAt: new Date().toISOString(), layout: plan.layout, copy: copy.copy, meta: { userId } }
  const saved = await SiteStore.saveSite(site)
  return NextResponse.json({ ok:true, id: saved.id, preview: '/api/preview/raw/' + saved.id })
}
