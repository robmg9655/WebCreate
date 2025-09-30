const fs = require('fs');
try {
  const dot = '.env.local';
  if (!fs.existsSync(dot) && fs.existsSync('.env.example')) {
    fs.copyFileSync('.env.example', dot);
    console.log('Copied .env.example to .env.local');
  }
} catch (e) {
  // ignore
}
