import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

async function captureGames() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    headless: true,
    defaultViewport: { width: 1280, height: 800, deviceScaleFactor: 2 },
  });

  const page = await browser.newPage();
  const baseUrl = 'http://localhost:5173/gopixel-academy/#/games/quiz';
  
  await page.goto(baseUrl, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  const outDir = path.resolve('screenshots/games');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Quiz level 1
  await page.screenshot({ path: path.join(outDir, '01-quiz-level-1.png') });

  // 2. Select option and validate
  const firstChoice = await page.$('.choice:first-child');
  if (firstChoice) await page.evaluate(el => el.click(), firstChoice);
  const validateBtn = await page.$('.game-actions .btn-primary');
  if (validateBtn) await page.evaluate(el => el.click(), validateBtn);
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(outDir, '02-quiz-level-1-validated.png') });

  // 3. Click level 2 pill
  const levelPills = await page.$$('.level-pill');
  if (levelPills[1]) {
    await page.evaluate(el => el.click(), levelPills[1]);
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({ path: path.join(outDir, '03-quiz-level-2.png') });
  }

  // 4. Complete Code mode
  await page.goto('http://localhost:5173/gopixel-academy/#/games/complete', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(outDir, '04-complete-code-level-1.png') });

  // 5. Predict Output mode
  await page.goto('http://localhost:5173/gopixel-academy/#/games/predict', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(outDir, '05-predict-output-level-1.png') });

  // 6. Bug Hunter mode
  await page.goto('http://localhost:5173/gopixel-academy/#/games/bug', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(outDir, '06-bug-hunter-level-1.png') });

  await browser.close();
  console.log('All games screenshots captured successfully in', outDir);
}

captureGames().catch(err => {
  console.error(err);
  process.exit(1);
});
