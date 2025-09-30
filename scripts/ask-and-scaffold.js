#!/usr/bin/env node
/**
 * Interactive questionnaire that collects structured input from the user
 * and invokes the scaffold CLI (packages/mcp-tools/dist/scaffold_project.js)
 * to generate a site scaffold. Also supports --from-file for non-interactive use.
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const args = process.argv.slice(2);
const argv = {};
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--from-file' && args[i + 1]) { argv.fromFile = args[i + 1]; i++; }
  else if (a === '--dry-run') { argv.dryRun = true; }
  else if (a === '--help') { argv.help = true; }
}

if (argv.help) {
  console.log('Usage: node scripts/ask-and-scaffold.js [--from-file <json>] [--dry-run]');
  process.exit(0);
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'site';
}

async function promptQuestions() {
  const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });
  const q = (str) => new Promise((res) => readline.question(str, res));

  const businessName = (await q('Business name (e.g. Sakura Bakery): ')) || 'Demo Business';
  const tagline = (await q('Short tagline (one sentence): ')) || '';
  const description = (await q('Describe the business in 1-3 sentences: ')) || '';
  const locale = (await q('Locale (en/ja) [en]: ')) || 'en';
  const primaryColor = (await q('Primary color (hex) [#0ea5a4]: ')) || '#0ea5a4';
  const contactEmail = (await q('Contact email: ')) || '';
  const servicesRaw = (await q('Comma-separated services offered: ')) || '';
  const services = servicesRaw.split(',').map((s) => s.trim()).filter(Boolean);

  readline.close();

  return {
    businessName,
    tagline,
    description,
    locale,
    primaryColor,
    contactEmail,
    services,
    slug: slugify(businessName),
  };
}

function makePayload(answers) {
  const layout = {
    title: answers.businessName,
    locale: answers.locale || 'en',
    theme: { primaryColor: answers.primaryColor || '#0ea5a4' },
    sections: [
      { type: 'hero', headline: answers.businessName, subheadline: answers.tagline || answers.description },
      ...(answers.services && answers.services.length ? [{ type: 'services', items: answers.services }] : []),
      { type: 'contact', email: answers.contactEmail }
    ]
  };

  const copy = {
    hero: { headline: layout.sections[0].headline, subheadline: layout.sections[0].subheadline },
    services: (answers.services || []).map((s, i) => ({ id: `svc-${i + 1}`, title: s, description: `We offer ${s}.` })),
    contact: { email: answers.contactEmail }
  };

  return { slug: answers.slug || 'site', layout, copy };
}

async function run() {
  let answers;
  if (argv.fromFile) {
    const f = path.resolve(process.cwd(), argv.fromFile);
    if (!fs.existsSync(f)) {
      console.error('File not found:', f);
      process.exit(2);
    }
    answers = JSON.parse(fs.readFileSync(f, 'utf8'));
  } else {
    answers = await promptQuestions();
  }

  const payload = makePayload(answers);

  if (argv.dryRun) {
    console.log('Payload (dry-run):\n', JSON.stringify(payload, null, 2));
    process.exit(0);
  }

  // Call scaffold CLI by piping JSON to its stdin
  const cli = path.resolve(process.cwd(), 'packages/mcp-tools/dist/scaffold_project.js');
  if (!fs.existsSync(cli)) {
    console.error('scaffold CLI not found at', cli, '\nPlease run pnpm -w -r run build to compile packages.');
    process.exit(3);
  }

  const child = spawn(process.execPath, [cli], { stdio: ['pipe', 'inherit', 'inherit'] });
  child.stdin.write(JSON.stringify(payload));
  child.stdin.end();
  child.on('exit', (code) => {
    if (code === 0) {
      console.log('\nScaffold CLI finished successfully. Generated under generated/' + payload.slug + '/site.json');
    } else {
      console.error('Scaffold CLI exited with code', code);
    }
  });
}

run().catch((err) => { console.error(err); process.exit(1); });
