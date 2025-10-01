(async () => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const p = new PrismaClient();
    await p.demoAttempt.deleteMany();
    console.log('cleared');
    await p.$disconnect();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
