#!/usr/bin/env node
/**
 * Create a mock license entry in generated/payments.json for local testing.
 * Usage: node scripts/create-license.js [email]
 */
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const email = process.argv[2] || 'test@local';
const dbPath = path.join(process.cwd(), 'generated', 'payments.json');

function readDb() {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8') || '{}');
  } catch (e) {
    return {};
  }
}

function writeDb(db) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

const id = randomUUID();
const license = `LIC-${id.slice(0, 8)}`;
const db = readDb();
db[license] = { email, plan: 'single-site', amount: 49, createdAt: Date.now() };
writeDb(db);
console.log('Created license:', license);
console.log('Wrote to', dbPath);
