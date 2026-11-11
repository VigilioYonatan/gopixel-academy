import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';

const outDir = path.resolve('docs/assets/screenshots');
fs.mkdirSync(outDir, { recursive: true });

const execPath = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
const baseUrl = 'http://localhost:5173/gopixel-academy/';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: execPath,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Frameworks Academy V2
  await page.goto(`${baseUrl}#/frameworks`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, '05-frameworks-curriculum-v2.png'), fullPage: false });
  console.log('✓ Captured 05-frameworks-curriculum-v2.png');

  // 2. Senior Dashboard V2
  await page.goto(`${baseUrl}#/senior`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(outDir, '04-senior-dashboard-v2.png'), fullPage: false });
  console.log('✓ Captured 04-senior-dashboard-v2.png');

  // 3. Senior Dashboard filtered by Concurrency
  const catBtn = await page.$('.category-filter-btn:nth-child(2)');
  if (catBtn) {
    await catBtn.click();
    await new Promise(r => setTimeout(r, 300));
    await page.screenshot({ path: path.join(outDir, '04-senior-dashboard-filtered.png'), fullPage: false });
    console.log('✓ Captured 04-senior-dashboard-filtered.png');
  }

  await browser.close();
}

capture().catch(console.error);
