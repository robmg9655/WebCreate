const fs = require('fs');
const path = require('path');
const generated = path.join(process.cwd(), 'generated');
if (!fs.existsSync(generated)) fs.mkdirSync(generated);
const slug = 'barberia-tabata';
const siteDir = path.join(generated, slug);
if (!fs.existsSync(siteDir)) fs.mkdirSync(siteDir, { recursive: true });
const site = {
  id: slug,
  title: '理髪店 Tabata',
  layout: {
    sections: ['hero', 'services', 'gallery', 'pricing', 'map', 'contact']
  },
  copy: {
    jp: { headline: '田端の理髪店へようこそ', cta: '予約する' },
    en: { headline: 'Welcome to Tabata Barbers', cta: 'Book Now' }
  }
};
fs.writeFileSync(path.join(siteDir, 'site.json'), JSON.stringify(site, null, 2));
console.log('Generated example site at', siteDir);
