(async()=>{
  try{
    const { PrismaClient } = require('@prisma/client')
    const p = new PrismaClient()
    const sites = await p.site.findMany({ orderBy: { createdAt: 'asc' } })
    console.log(JSON.stringify(sites, null, 2))
    await p.$disconnect()
  }catch(e){ console.error(e); process.exit(1) }
})()
