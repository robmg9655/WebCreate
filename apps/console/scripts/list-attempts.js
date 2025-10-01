(async () => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const p = new PrismaClient();
    const attempts = await p.demoAttempt.findMany({ orderBy: { usedAt: 'asc' } });
    console.log(JSON.stringify(attempts, null, 2));
    await p.$disconnect();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
