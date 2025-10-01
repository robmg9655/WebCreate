const { execSync } = require('child_process')
const paths = [
  './dev.db',
  '../../dev.db',
  '../../prisma/dev.db'
]
for (const p of paths) {
  try {
    const abs = require('path').resolve(__dirname, p)
    const tables = execSync(`sqlite3 ${abs} ".tables"`, { encoding: 'utf8' }).trim()
    console.log('DB:', abs)
    console.log('Tables:', tables || '(no tables)')
    if (tables && tables.split(/\s+/).includes('DemoAttempt')) {
      const rows = execSync(`sqlite3 ${abs} "select id, userId, ip, usedAt from DemoAttempt order by usedAt;"`, { encoding: 'utf8' }).trim()
      console.log('DemoAttempt rows:\n' + (rows || '(none)'))
    }
  } catch (e) {
    console.log('DB error for', p, e.message)
  }
  console.log('---')
}
