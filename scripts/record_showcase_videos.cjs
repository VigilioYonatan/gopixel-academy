/**
 * GoPixel Academy — Native WebM Video Showcase Recorder
 * Uses Playwright to record crisp 60fps WebM videos of Senior Mode
 */
const path = require('path');
const fs = require('fs');

const PLAYWRIGHT_PATH = 'C:/Users/Admin/Desktop/VIGILIO/proyectos/vigilio-llmops-platform-codigo-v2/apps/vigilio-llmops-web/node_modules/playwright';
const { chromium } = require(PLAYWRIGHT_PATH);

const BASE_URL = 'http://localhost:5173/gopixel-academy/';
const VIDEOS_DIR = path.resolve(__dirname, '..', 'docs', 'assets', 'videos');
const TEMP_VIDEOS = path.resolve(__dirname, '..', 'test-results', 'raw-videos');

[VIDEOS_DIR, TEMP_VIDEOS].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function main() {
  console.log('[INFO] Launching Chromium with Playwright for video recording...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const clips = [
    {
      name: '01-interactive-go-editor',
      url: `${BASE_URL}#/lesson/B01`,
      action: async (page) => {
        await page.waitForSelector('textarea', { timeout: 8000 });
        await page.waitForTimeout(600);
        await page.click('textarea');
        await page.waitForTimeout(300);
        const code = 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hola, Go!")\n}';
        await page.fill('textarea', code);
        await page.waitForTimeout(800);
        const checkBtn = page.locator('button', { hasText: 'Comprobar solución' });
        await checkBtn.click();
        await page.waitForTimeout(1500);
      }
    },
    {
      name: '02-senior-worker-pool-simulation',
      url: `${BASE_URL}#/senior/S05`,
      action: async (page) => {
        await page.waitForSelector('input[type="range"]', { timeout: 8000 });
        await page.waitForTimeout(800);
        const ranges = page.locator('input[type="range"]');
        await ranges.nth(0).evaluate((el) => {
          el.value = '8';
          el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await page.waitForTimeout(700);
        await ranges.nth(1).evaluate((el) => {
          el.value = '24';
          el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await page.waitForTimeout(700);
        await ranges.nth(2).evaluate((el) => {
          el.value = '10';
          el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await page.waitForTimeout(1600);
      }
    },
    {
      name: '03-senior-mode-walkthrough',
      url: `${BASE_URL}#/senior`,
      action: async (page) => {
        await page.waitForSelector('.senior-dashboard, .content-page, #app', { timeout: 8000 });
        await page.waitForTimeout(1000);
        // Navigate to S01 review lab
        await page.goto(`${BASE_URL}#/senior/S01/review-lab`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1000);
        // Select an answer
        const radio = page.locator('input[type="radio"]').first();
        if (await radio.count() > 0) {
          await radio.click();
          await page.waitForTimeout(600);
        }
        // Theme toggle
        const themeBtn = page.locator('button.circle-action[title]').first();
        if (await themeBtn.count() > 0) {
          await themeBtn.click();
          await page.waitForTimeout(900);
          await themeBtn.click();
          await page.waitForTimeout(900);
        }
        // Navigate to Readiness
        await page.goto(`${BASE_URL}#/senior/readiness`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(1200);
      }
    }
  ];

  for (const clip of clips) {
    console.log(`\n[REC] Grabando clip: ${clip.name}.webm`);
    const context = await browser.newContext({
      viewport: { width: 1280, height: 750 },
      deviceScaleFactor: 1,
      recordVideo: {
        dir: TEMP_VIDEOS,
        size: { width: 1280, height: 750 }
      }
    });

    const page = await context.newPage();
    await page.goto(clip.url, { waitUntil: 'networkidle' });
    await clip.action(page);

    const video = page.video();
    await page.close();
    await context.close();

    if (video) {
      const tempPath = await video.path();
      const destPath = path.join(VIDEOS_DIR, `${clip.name}.webm`);
      fs.copyFileSync(tempPath, destPath);
      const stat = fs.statSync(destPath);
      console.log(`  ✓ Guardado: docs/assets/videos/${clip.name}.webm (${(stat.size / 1024).toFixed(1)} KB)`);
    }
  }

  await browser.close();
  console.log('\n✅ Todos los videos WebM han sido grabados con éxito!');
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
