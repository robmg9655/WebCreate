#!/usr/bin/env node
// No external commands required in the stub deploy; keep file lean.
async function main(){
  if(!process.env.VERCEL_TOKEN) {
    console.log('VERCEL_TOKEN not present. Skipping real deploy.');
    return console.log(JSON.stringify({ preview: 'http://localhost:3000' }));
  }
  // In a real implementation, call vercel cli
  console.log('Would deploy to Vercel (stub)');
}
main().catch(e=>{console.error(e); process.exit(1);});

export {};
