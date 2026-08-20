import pw from 'file:///c:/Users/canal/Documentos/Antigravity%20Projetos/AIOS%20-%20Sparo%20Socials/scripts/baixar-aulas/node_modules/playwright/index.js';
import fs from 'fs';
const { chromium } = pw;

const DAYS = ['2026/09/12', '2026/09/13', '2026/09/14'];
const BASE = 'https://www.ibiza-spotlight.com/night/events/';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  locale: 'en-GB',
  viewport: { width: 1440, height: 1200 },
});
const page = await ctx.newPage();
const out = {};

for (const d of DAYS) {
  const url = BASE + d;
  process.stderr.write(`\n== ${url}\n`);
  const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  process.stderr.write(`status ${r && r.status()}\n`);
  await page.waitForTimeout(3500);

  const events = await page.evaluate((day) => {
    const txt = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
    const rows = [];
    document.querySelectorAll('.partyCal-row').forEach((row) => {
      const venue = txt(row.querySelector('.partyCal-venue > a > span'));
      row.querySelectorAll('.partyCal-day').forEach((cell) => {
        cell.querySelectorAll('.card-ticket').forEach((card) => {
          const dt = card.querySelector('.ticket-date');
          const dparts = dt ? [...dt.querySelectorAll('span')].map((s) => s.textContent.trim()) : [];
          const time = txt(card.querySelector('time'));
          const nameA = card.querySelector('h3 a, .h3 a');
          const djs = [...card.querySelectorAll('.partyDj a')].map((a) => a.textContent.trim());
          const rooms = [...card.querySelectorAll('.partyRoom')].map((a) => txt(a));
          const priceEl = card.querySelector('.ticket-price, .price, .partyCal-price, [class*="price"]');
          const linkEl = card.querySelector('a[href*="/night/"], a[href*="ticket"]');
          rows.push({
            day,
            venue,
            date: dparts.join(' '),
            time,
            name: txt(nameA),
            url: nameA ? nameA.getAttribute('href') : (linkEl ? linkEl.getAttribute('href') : ''),
            eventid: card.getAttribute('data-eventid') || '',
            djs,
            rooms,
            price: txt(priceEl),
            raw: txt(card).slice(0, 400),
          });
        });
      });
    });
    return rows;
  }, d);

  process.stderr.write(`eventos brutos: ${events.length}\n`);
  out[d] = events;
}

fs.writeFileSync('ibiza-eventos.json', JSON.stringify(out, null, 2));
process.stderr.write('\nsalvo ibiza-eventos.json\n');
await browser.close();
