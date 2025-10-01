(async()=>{
  try{
    const { PrismaClient } = require('@prisma/client')
    const p = new PrismaClient()
    const users = await p.user.findMany()
    console.log(JSON.stringify(users, null, 2))
    await p.$disconnect()
  }catch(e){ console.error(e); process.exit(1) }
})()
